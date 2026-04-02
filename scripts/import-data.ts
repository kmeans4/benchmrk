import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

// Configure Neon for WebSocket connections
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

interface HuggingFaceModel {
  name: string
  provider: string
  releaseDate: string | null
  contextWindow: number | null
  parameterCount: string | null
  licenseType: string
  hostingType: string
  modalities: string[]
  architecture: string | null
  license?: string
  tags?: string[]
  downloads?: number
  likes?: number
  url?: string
}

interface LMSysModel {
  name: string
  elo: number
  elo_lower?: number
  elo_upper?: number
  votes?: number
  rank?: number
  category?: string
  hostingType: string
  licenseType: string
}

interface PapersWithCodeScore {
  model_name: string
  score: number
  rank: number
  submission_date?: string
  method_name?: string
}

async function importHuggingFaceModels(dataPath: string) {
  console.log('📥 Importing Hugging Face models...')
  
  const filePath = path.resolve(dataPath)
  const data: HuggingFaceModel[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  let imported = 0
  let skipped = 0
  
  for (const model of data) {
    try {
      // Map license type
      const licenseTypeMap: Record<string, any> = {
        'OpenWeights': 'OpenWeights',
        'Proprietary': 'Proprietary',
        'ResearchOnly': 'ResearchOnly',
        'CommercialAllowed': 'CommercialAllowed',
        'Unknown': 'Unknown',
      }
      
      // Map hosting type
      const hostingTypeMap: Record<string, any> = {
        'Both': 'Both',
        'CloudOnly': 'CloudOnly',
        'LocalOnly': 'LocalOnly',
        'Unknown': 'Unknown',
      }
      
      await prisma.model.upsert({
        where: { name: model.name },
        update: {
          provider: model.provider,
          contextWindow: model.contextWindow,
          licenseType: licenseTypeMap[model.licenseType] || 'Unknown',
          hostingType: hostingTypeMap[model.hostingType] || 'Unknown',
        },
        create: {
          name: model.name,
          provider: model.provider,
          releaseDate: model.releaseDate ? new Date(model.releaseDate) : null,
          contextWindow: model.contextWindow,
          parameterCount: model.parameterCount ? BigInt(model.parameterCount) : null,
          licenseType: licenseTypeMap[model.licenseType] || 'Unknown',
          hostingType: hostingTypeMap[model.hostingType] || 'Unknown',
          modalities: model.modalities as any,
          architecture: model.architecture,
          trainingDataSource: model.url,
        },
      })
      
      imported++
    } catch (error: any) {
      console.log(`⚠️  Error importing ${model.name}: ${error.message}`)
      skipped++
    }
  }
  
  console.log(`✅ Imported ${imported} models, skipped ${skipped}`)
}

async function importLMSysScores(dataPath: string, sourceId: string) {
  console.log('📥 Importing LMSys Arena Elo scores...')
  
  const filePath = path.resolve(dataPath)
  const data: LMSysModel[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  // Find or create the LMSys benchmark
  let benchmark = await prisma.benchmark.findFirst({
    where: { name: 'LMSys Chatbot Arena' },
  })
  
  if (!benchmark) {
    const skillArea = await prisma.skillArea.findFirst({
      where: { name: 'Language Understanding' },
    })
    
    benchmark = await prisma.benchmark.create({
      data: {
        name: 'LMSys Chatbot Arena',
        category: 'Overall',
        skillAreaId: skillArea?.id || '',
        description: 'Crowdsourced Elo ratings from chat battles',
        evaluationMethod: 'HumanJudged',
        scoreType: 'Elo',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://chat.lmsys.org/leaderboard',
        leaderboardUrl: 'https://chat.lmsys.org/leaderboard',
        modelCount: data.length,
      },
    })
    
    console.log(`✅ Created LMSys benchmark`)
  }
  
  let imported = 0
  let skipped = 0
  
  for (const modelData of data) {
    try {
      // Find the model
      const model = await prisma.model.findFirst({
        where: { name: modelData.name },
      })
      
      if (!model) {
        // Create the model if it doesn't exist
        const created = await prisma.model.create({
          data: {
            name: modelData.name,
            provider: 'Unknown',
            licenseType: modelData.licenseType as any,
            hostingType: modelData.hostingType as any,
            modalities: ['Text'],
          },
        })
        
        console.log(`🆕 Created model: ${modelData.name}`)
        
        // Create score
        await prisma.score.create({
          data: {
            modelId: created.id,
            benchmarkId: benchmark.id,
            value: modelData.elo,
            sourceId: sourceId,
            isVerified: true,
            notes: `Rank: ${modelData.rank}, Votes: ${modelData.votes}`,
          },
        })
        
        imported++
      } else {
        // Update or create score
        await prisma.score.upsert({
          where: {
            modelId_benchmarkId_sourceId: {
              modelId: model.id,
              benchmarkId: benchmark.id,
              sourceId: sourceId,
            },
          },
          update: {
            value: modelData.elo,
            notes: `Rank: ${modelData.rank}, Votes: ${modelData.votes}`,
          },
          create: {
            modelId: model.id,
            benchmarkId: benchmark.id,
            value: modelData.elo,
            sourceId: sourceId,
            isVerified: true,
            notes: `Rank: ${modelData.rank}, Votes: ${modelData.votes}`,
          },
        })
        
        imported++
      }
    } catch (error: any) {
      console.log(`⚠️  Error importing ${modelData.name}: ${error.message}`)
      skipped++
    }
  }
  
  console.log(`✅ Imported ${imported} LMSys scores, skipped ${skipped}`)
}

async function importPapersWithCodeScores(dataPath: string, sourceId: string) {
  console.log('📥 Importing PapersWithCode scores...')
  
  const filePath = path.resolve(dataPath)
  const data: Record<string, PapersWithCodeScore[]> = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  let imported = 0
  let skipped = 0
  
  for (const [benchmarkId, scores] of Object.entries(data)) {
    // Find the benchmark by paperswithcode_id or name
    let benchmark = await prisma.benchmark.findFirst({
      where: { OR: [{ sourceUrl: { contains: benchmarkId } }, { name: benchmarkId }] },
    })
    
    if (!benchmark) {
      console.log(`⚠️  Benchmark not found: ${benchmarkId}, skipping...`)
      continue
    }
    
    for (const scoreData of scores) {
      try {
        // Find the model
        const model = await prisma.model.findFirst({
          where: { name: scoreData.model_name },
        })
        
        if (!model) {
          skipped++
          continue
        }
        
        // Create or update score
        await prisma.score.upsert({
          where: {
            modelId_benchmarkId_sourceId: {
              modelId: model.id,
              benchmarkId: benchmark.id,
              sourceId: sourceId,
            },
          },
          update: {
            value: scoreData.score,
          },
          create: {
            modelId: model.id,
            benchmarkId: benchmark.id,
            value: scoreData.score,
            sourceId: sourceId,
            isVerified: false,
            notes: `Rank: ${scoreData.rank}`,
          },
        })
        
        imported++
      } catch (error: any) {
        console.log(`⚠️  Error importing score for ${scoreData.model_name}: ${error.message}`)
        skipped++
      }
    }
  }
  
  console.log(`✅ Imported ${imported} PapersWithCode scores, skipped ${skipped}`)
}

async function main() {
  console.log('🗄️  Importing scraped data into Neon database...\n')
  
  // Get or create sources
  const hfSource = await prisma.source.upsert({
    where: { name: 'Hugging Face Open LLM Leaderboard' },
    update: {},
    create: { name: 'Hugging Face Open LLM Leaderboard', url: 'https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard', reliability: 'High', isOfficial: false },
  })
  
  const lmsysSource = await prisma.source.upsert({
    where: { name: 'LMSys Chatbot Arena' },
    update: {},
    create: { name: 'LMSys Chatbot Arena', url: 'https://chat.lmsys.org/leaderboard', reliability: 'High', isOfficial: false },
  })
  
  const pwcSource = await prisma.source.upsert({
    where: { name: 'PapersWithCode' },
    update: {},
    create: { name: 'PapersWithCode', url: 'https://paperswithcode.com/', reliability: 'High', isOfficial: false },
  })
  
  console.log(`✅ Sources ready\n`)
  
  // Import data from scraped files
  const dataDir = path.join(process.cwd(), 'scripts')
  
  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    console.log('❌ Data directory not found. Run scrapers first.')
    console.log('   Usage: python scripts/scrape_huggingface.py')
    return
  }
  
  // Import Hugging Face models
  const hfFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('huggingface_') && f.endsWith('.json'))
  if (hfFiles.length > 0) {
    const latestHf = path.join(dataDir, hfFiles.sort().reverse()[0])
    await importHuggingFaceModels(latestHf)
  } else {
    console.log('⚠️  No Hugging Face data found')
  }
  
  // Import LMSys scores
  const lmsysFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('lmsys_leaderboard') && f.endsWith('.json'))
  if (lmsysFiles.length > 0) {
    const latestLmsys = path.join(dataDir, lmsysFiles.sort().reverse()[0])
    await importLMSysScores(latestLmsys, lmsysSource.id)
  } else {
    console.log('⚠️  No LMSys data found')
  }
  
  // Import PapersWithCode scores
  const pwcFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('paperswithcode_scores') && f.endsWith('.json'))
  if (pwcFiles.length > 0) {
    const latestPwc = path.join(dataDir, pwcFiles.sort().reverse()[0])
    await importPapersWithCodeScores(latestPwc, pwcSource.id)
  } else {
    console.log('⚠️  No PapersWithCode data found')
  }
  
  console.log('\n🎉 Import complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
