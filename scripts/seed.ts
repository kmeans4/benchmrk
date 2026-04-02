import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // Skill Areas (Broad categories)
  // ============================================
  const skillAreas = await Promise.all([
    prisma.skillArea.upsert({
      where: { name: 'Coding' },
      update: {},
      create: { name: 'Coding', description: 'Programming and code generation tasks' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Reasoning' },
      update: {},
      create: { name: 'Reasoning', description: 'Logical reasoning and problem-solving' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Knowledge' },
      update: {},
      create: { name: 'Knowledge', description: 'General knowledge and factual recall' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Mathematics' },
      update: {},
      create: { name: 'Mathematics', description: 'Mathematical problem solving' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Language Understanding' },
      update: {},
      create: { name: 'Language Understanding', description: 'Natural language understanding and comprehension' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Creative' },
      update: {},
      create: { name: 'Creative', description: 'Creative writing and generation' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Vision' },
      update: {},
      create: { name: 'Vision', description: 'Image understanding and visual reasoning' },
    }),
    prisma.skillArea.upsert({
      where: { name: 'Agentic' },
      update: {},
      create: { name: 'Agentic', description: 'Tool use, planning, and autonomous tasks' },
    }),
  ])

  console.log(`✅ Created ${skillAreas.length} skill areas`)

  // ============================================
  // Categories (Specific benchmark categories)
  // ============================================
  const codingSkillArea = skillAreas.find(s => s.name === 'Coding')!
  const reasoningSkillArea = skillAreas.find(s => s.name === 'Reasoning')!
  const knowledgeSkillArea = skillAreas.find(s => s.name === 'Knowledge')!
  const mathSkillArea = skillAreas.find(s => s.name === 'Mathematics')!
  const languageSkillArea = skillAreas.find(s => s.name === 'Language Understanding')!
  const agenticSkillArea = skillAreas.find(s => s.name === 'Agentic')!

  const categories = await Promise.all([
    // Coding
    prisma.category.upsert({
      where: { name: 'Code Generation' },
      update: {},
      create: { name: 'Code Generation', skillAreaId: codingSkillArea.id, description: 'Generating code from natural language' },
    }),
    prisma.category.upsert({
      where: { name: 'Code Completion' },
      update: {},
      create: { name: 'Code Completion', skillAreaId: codingSkillArea.id, description: 'Completing partial code' },
    }),
    prisma.category.upsert({
      where: { name: 'Agentic Terminal Coding' },
      update: {},
      create: { name: 'Agentic Terminal Coding', skillAreaId: codingSkillArea.id, description: 'Terminal-based coding agents' },
    }),
    prisma.category.upsert({
      where: { name: 'Code Review' },
      update: {},
      create: { name: 'Code Review', skillAreaId: codingSkillArea.id, description: 'Reviewing and debugging code' },
    }),
    // Reasoning
    prisma.category.upsert({
      where: { name: 'Logical Reasoning' },
      update: {},
      create: { name: 'Logical Reasoning', skillAreaId: reasoningSkillArea.id, description: 'Deductive and inductive reasoning' },
    }),
    prisma.category.upsert({
      where: { name: 'Commonsense Reasoning' },
      update: {},
      create: { name: 'Commonsense Reasoning', skillAreaId: reasoningSkillArea.id, description: 'Everyday reasoning tasks' },
    }),
    // Knowledge
    prisma.category.upsert({
      where: { name: 'General Knowledge' },
      update: {},
      create: { name: 'General Knowledge', skillAreaId: knowledgeSkillArea.id, description: 'Factual knowledge across domains' },
    }),
    prisma.category.upsert({
      where: { name: 'Scientific Knowledge' },
      update: {},
      create: { name: 'Scientific Knowledge', skillAreaId: knowledgeSkillArea.id, description: 'Science domain knowledge' },
    }),
    // Math
    prisma.category.upsert({
      where: { name: 'Math Word Problems' },
      update: {},
      create: { name: 'Math Word Problems', skillAreaId: mathSkillArea.id, description: 'Solving math problems from text' },
    }),
    prisma.category.upsert({
      where: { name: 'Mathematical Reasoning' },
      update: {},
      create: { name: 'Mathematical Reasoning', skillAreaId: mathSkillArea.id, description: 'Advanced mathematical reasoning' },
    }),
    // Language
    prisma.category.upsert({
      where: { name: 'Reading Comprehension' },
      update: {},
      create: { name: 'Reading Comprehension', skillAreaId: languageSkillArea.id, description: 'Understanding and answering from text' },
    }),
    prisma.category.upsert({
      where: { name: 'Natural Language Inference' },
      update: {},
      create: { name: 'Natural Language Inference', skillAreaId: languageSkillArea.id, description: 'Determining logical relationships between sentences' },
    }),
    // Agentic
    prisma.category.upsert({
      where: { name: 'Tool Use' },
      update: {},
      create: { name: 'Tool Use', skillAreaId: agenticSkillArea.id, description: 'Using external tools and APIs' },
    }),
    prisma.category.upsert({
      where: { name: 'Planning' },
      update: {},
      create: { name: 'Planning', skillAreaId: agenticSkillArea.id, description: 'Multi-step planning and execution' },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // ============================================
  // Sources
  // ============================================
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { name: 'Hugging Face Open LLM Leaderboard' },
      update: {},
      create: { name: 'Hugging Face Open LLM Leaderboard', url: 'https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard', reliability: 'High', isOfficial: false },
    }),
    prisma.source.upsert({
      where: { name: 'LMSys Chatbot Arena' },
      update: {},
      create: { name: 'LMSys Chatbot Arena', url: 'https://chat.lmsys.org/leaderboard', reliability: 'High', isOfficial: false },
    }),
    prisma.source.upsert({
      where: { name: 'PapersWithCode' },
      update: {},
      create: { name: 'PapersWithCode', url: 'https://paperswithcode.com/', reliability: 'High', isOfficial: false },
    }),
    prisma.source.upsert({
      where: { name: 'OpenAI' },
      update: {},
      create: { name: 'OpenAI', url: 'https://openai.com/', reliability: 'Medium', isOfficial: true },
    }),
    prisma.source.upsert({
      where: { name: 'Anthropic' },
      update: {},
      create: { name: 'Anthropic', url: 'https://anthropic.com/', reliability: 'Medium', isOfficial: true },
    }),
    prisma.source.upsert({
      where: { name: 'Google' },
      update: {},
      create: { name: 'Google', url: 'https://google.ai/', reliability: 'Medium', isOfficial: true },
    }),
    prisma.source.upsert({
      where: { name: 'Meta' },
      update: {},
      create: { name: 'Meta', url: 'https://ai.meta.com/', reliability: 'Medium', isOfficial: true },
    }),
    prisma.source.upsert({
      where: { name: 'Mistral AI' },
      update: {},
      create: { name: 'Mistral AI', url: 'https://mistral.ai/', reliability: 'Medium', isOfficial: true },
    }),
  ])

  console.log(`✅ Created ${sources.length} sources`)

  // ============================================
  // Models (Top models as of early 2026)
  // ============================================
  const models = await Promise.all([
    // OpenAI
    prisma.model.upsert({
      where: { name: 'GPT-4.5' },
      update: {},
      create: {
        name: 'GPT-4.5',
        provider: 'OpenAI',
        releaseDate: new Date('2025-02-01'),
        contextWindow: 128000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Image', 'Code'],
        architecture: 'Dense',
        inferenceCostPer1M: '$75/1M input, $150/1M output',
      },
    }),
    prisma.model.upsert({
      where: { name: 'GPT-4o' },
      update: {},
      create: {
        name: 'GPT-4o',
        provider: 'OpenAI',
        releaseDate: new Date('2024-05-01'),
        contextWindow: 128000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Image', 'Audio', 'Code'],
        architecture: 'MoE',
        inferenceCostPer1M: '$5/1M input, $15/1M output',
      },
    }),
    prisma.model.upsert({
      where: { name: 'o3-mini' },
      update: {},
      create: {
        name: 'o3-mini',
        provider: 'OpenAI',
        releaseDate: new Date('2025-01-01'),
        contextWindow: 200000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Code'],
        architecture: 'Dense',
      },
    }),
    // Anthropic
    prisma.model.upsert({
      where: { name: 'Claude 3.7 Sonnet' },
      update: {},
      create: {
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        releaseDate: new Date('2025-02-01'),
        contextWindow: 200000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Image', 'Code'],
        architecture: 'MoE',
        inferenceCostPer1M: '$3/1M input, $15/1M output',
      },
    }),
    prisma.model.upsert({
      where: { name: 'Claude 3.5 Sonnet' },
      update: {},
      create: {
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        releaseDate: new Date('2024-10-01'),
        contextWindow: 200000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Image', 'Code'],
        architecture: 'MoE',
        inferenceCostPer1M: '$3/1M input, $15/1M output',
      },
    }),
    // Google
    prisma.model.upsert({
      where: { name: 'Gemini 2.0 Pro' },
      update: {},
      create: {
        name: 'Gemini 2.0 Pro',
        provider: 'Google',
        releaseDate: new Date('2025-01-01'),
        contextWindow: 2000000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Image', 'Audio', 'Video', 'Code'],
        architecture: 'MoE',
      },
    }),
    prisma.model.upsert({
      where: { name: 'Gemini 1.5 Pro' },
      update: {},
      create: {
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        releaseDate: new Date('2024-05-01'),
        contextWindow: 2000000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Image', 'Audio', 'Video', 'Code'],
        architecture: 'MoE',
      },
    }),
    // Meta
    prisma.model.upsert({
      where: { name: 'Llama 3.3 70B' },
      update: {},
      create: {
        name: 'Llama 3.3 70B',
        provider: 'Meta',
        releaseDate: new Date('2024-12-01'),
        contextWindow: 128000,
        parameterCount: BigInt(70000000000),
        licenseType: 'OpenWeights',
        hostingType: 'Both',
        modalities: ['Text', 'Code'],
        architecture: 'Dense',
        hardwareRequirements: '~140GB VRAM for FP16, ~40GB for INT4',
        quantizationOptions: 'FP16, INT8, INT4',
      },
    }),
    prisma.model.upsert({
      where: { name: 'Llama 3.1 405B' },
      update: {},
      create: {
        name: 'Llama 3.1 405B',
        provider: 'Meta',
        releaseDate: new Date('2024-07-01'),
        contextWindow: 128000,
        parameterCount: BigInt(405000000000),
        licenseType: 'OpenWeights',
        hostingType: 'Both',
        modalities: ['Text', 'Code'],
        architecture: 'Dense',
        hardwareRequirements: '~800GB VRAM for FP16',
      },
    }),
    prisma.model.upsert({
      where: { name: 'Llama 3.1 8B' },
      update: {},
      create: {
        name: 'Llama 3.1 8B',
        provider: 'Meta',
        releaseDate: new Date('2024-07-01'),
        contextWindow: 128000,
        parameterCount: BigInt(8000000000),
        licenseType: 'OpenWeights',
        hostingType: 'Both',
        modalities: ['Text', 'Code'],
        architecture: 'Dense',
        hardwareRequirements: '~16GB VRAM for FP16, ~6GB for INT4',
        quantizationOptions: 'FP16, INT8, INT4',
      },
    }),
    // Mistral
    prisma.model.upsert({
      where: { name: 'Mistral Large 2' },
      update: {},
      create: {
        name: 'Mistral Large 2',
        provider: 'Mistral AI',
        releaseDate: new Date('2024-07-01'),
        contextWindow: 128000,
        licenseType: 'Proprietary',
        hostingType: 'CloudOnly',
        modalities: ['Text', 'Code'],
        architecture: 'MoE',
      },
    }),
    prisma.model.upsert({
      where: { name: 'Mistral Nemo' },
      update: {},
      create: {
        name: 'Mistral Nemo',
        provider: 'Mistral AI',
        releaseDate: new Date('2024-07-01'),
        contextWindow: 128000,
        parameterCount: BigInt(12000000000),
        licenseType: 'OpenWeights',
        hostingType: 'Both',
        modalities: ['Text', 'Code'],
        architecture: 'MoE',
      },
    }),
    // DeepSeek
    prisma.model.upsert({
      where: { name: 'DeepSeek V3' },
      update: {},
      create: {
        name: 'DeepSeek V3',
        provider: 'DeepSeek',
        releaseDate: new Date('2024-12-01'),
        contextWindow: 128000,
        parameterCount: BigInt(671000000000),
        licenseType: 'OpenWeights',
        hostingType: 'Both',
        modalities: ['Text', 'Code'],
        architecture: 'MoE',
        inferenceCostPer1M: '$0.27/1M input, $1.10/1M output',
      },
    }),
    prisma.model.upsert({
      where: { name: 'DeepSeek R1' },
      update: {},
      create: {
        name: 'DeepSeek R1',
        provider: 'DeepSeek',
        releaseDate: new Date('2025-01-01'),
        contextWindow: 128000,
        parameterCount: BigInt(671000000000),
        licenseType: 'OpenWeights',
        hostingType: 'Both',
        modalities: ['Text', 'Code'],
        architecture: 'MoE',
      },
    }),
  ])

  console.log(`✅ Created ${models.length} models`)

  // ============================================
  // Benchmarks (Key benchmarks)
  // ============================================
  const benchmarks = await Promise.all([
    // Coding benchmarks
    prisma.benchmark.upsert({
      where: { name: 'HumanEval' },
      update: {},
      create: {
        name: 'HumanEval',
        category: 'Code Generation',
        skillAreaId: codingSkillArea.id,
        description: '164 hand-written programming problems',
        evaluationMethod: 'Automatic',
        scoreType: 'PassAtK',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://github.com/openai/human-eval',
        modelCount: 100,
      },
    }),
    prisma.benchmark.upsert({
      where: { name: 'HumanEval+' },
      update: {},
      create: {
        name: 'HumanEval+',
        category: 'Code Generation',
        skillAreaId: codingSkillArea.id,
        description: 'Extended HumanEval with more test cases',
        evaluationMethod: 'Automatic',
        scoreType: 'PassAtK',
        scoreInterpretation: 'higher=better',
        modelCount: 80,
      },
    }),
    prisma.benchmark.upsert({
      where: { name: 'MBPP' },
      update: {},
      create: {
        name: 'MBPP',
        category: 'Code Generation',
        skillAreaId: codingSkillArea.id,
        description: 'Mostly Basic Python Problems',
        evaluationMethod: 'Automatic',
        scoreType: 'PassAtK',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://github.com/google-research/google-research/tree/master/mbpp',
        modelCount: 90,
      },
    }),
    prisma.benchmark.upsert({
      where: { name: 'Terminal-Bench 2.0' },
      update: {},
      create: {
        name: 'Terminal-Bench 2.0',
        category: 'Agentic Terminal Coding',
        skillAreaId: codingSkillArea.id,
        description: 'Terminal-based coding agent tasks',
        evaluationMethod: 'Automatic',
        scoreType: 'Percentage',
        scoreInterpretation: 'higher=better',
        modelCount: 30,
      },
    }),
    // Math benchmarks
    prisma.benchmark.upsert({
      where: { name: 'GSM8K' },
      update: {},
      create: {
        name: 'GSM8K',
        category: 'Math Word Problems',
        skillAreaId: mathSkillArea.id,
        description: 'Grade school math word problems',
        evaluationMethod: 'Automatic',
        scoreType: 'Accuracy',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://github.com/openai/grade-school-math',
        modelCount: 150,
      },
    }),
    prisma.benchmark.upsert({
      where: { name: 'MATH' },
      update: {},
      create: {
        name: 'MATH',
        category: 'Mathematical Reasoning',
        skillAreaId: mathSkillArea.id,
        description: 'High school and college math problems',
        evaluationMethod: 'Automatic',
        scoreType: 'Accuracy',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://github.com/hendrycks/math',
        modelCount: 120,
      },
    }),
    // Knowledge benchmarks
    prisma.benchmark.upsert({
      where: { name: 'MMLU' },
      update: {},
      create: {
        name: 'MMLU',
        category: 'General Knowledge',
        skillAreaId: knowledgeSkillArea.id,
        description: 'Massive Multitask Language Understanding - 57 subjects',
        evaluationMethod: 'Automatic',
        scoreType: 'Accuracy',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://github.com/hendrycks/test',
        modelCount: 200,
      },
    }),
    prisma.benchmark.upsert({
      where: { name: 'MMLU-Pro' },
      update: {},
      create: {
        name: 'MMLU-Pro',
        category: 'General Knowledge',
        skillAreaId: knowledgeSkillArea.id,
        description: 'Harder version of MMLU with more reasoning',
        evaluationMethod: 'Automatic',
        scoreType: 'Accuracy',
        scoreInterpretation: 'higher=better',
        modelCount: 100,
      },
    }),
    // Reasoning benchmarks
    prisma.benchmark.upsert({
      where: { name: 'BBH' },
      update: {},
      create: {
        name: 'BBH',
        category: 'Logical Reasoning',
        skillAreaId: reasoningSkillArea.id,
        description: 'Big Bench Hard - 23 challenging tasks',
        evaluationMethod: 'Automatic',
        scoreType: 'Accuracy',
        scoreInterpretation: 'higher=better',
        sourceUrl: 'https://github.com/suzgunmirac/BIG-Bench-Hard',
        modelCount: 100,
      },
    }),
    // Language benchmarks
    prisma.benchmark.upsert({
      where: { name: 'BoolQ' },
      update: {},
      create: {
        name: 'BoolQ',
        category: 'Reading Comprehension',
        skillAreaId: languageSkillArea.id,
        description: 'Boolean question answering',
        evaluationMethod: 'Automatic',
        scoreType: 'Accuracy',
        scoreInterpretation: 'higher=better',
        modelCount: 80,
      },
    }),
  ])

  console.log(`✅ Created ${benchmarks.length} benchmarks`)

  // ============================================
  // Sample Scores (Illustrative - real data would come from scrapers)
  // ============================================
  const humanEval = benchmarks.find(b => b.name === 'HumanEval')!
  const gsm8k = benchmarks.find(b => b.name === 'GSM8K')!
  const mmlu = benchmarks.find(b => b.name === 'MMLU')!
  const hfSource = sources.find(s => s.name === 'Hugging Face Open LLM Leaderboard')!

  const sampleScores = [
    // GPT-4.5 scores
    { modelId: models.find(m => m.name === 'GPT-4.5')!.id, benchmarkId: humanEval.id, value: 92.5, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'GPT-4.5')!.id, benchmarkId: gsm8k.id, value: 96.2, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'GPT-4.5')!.id, benchmarkId: mmlu.id, value: 89.8, sourceId: hfSource.id },
    // Claude 3.7 Sonnet scores
    { modelId: models.find(m => m.name === 'Claude 3.7 Sonnet')!.id, benchmarkId: humanEval.id, value: 90.2, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'Claude 3.7 Sonnet')!.id, benchmarkId: gsm8k.id, value: 94.5, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'Claude 3.7 Sonnet')!.id, benchmarkId: mmlu.id, value: 88.5, sourceId: hfSource.id },
    // Llama 3.3 70B scores
    { modelId: models.find(m => m.name === 'Llama 3.3 70B')!.id, benchmarkId: humanEval.id, value: 85.3, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'Llama 3.3 70B')!.id, benchmarkId: gsm8k.id, value: 89.1, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'Llama 3.3 70B')!.id, benchmarkId: mmlu.id, value: 82.4, sourceId: hfSource.id },
    // DeepSeek V3 scores
    { modelId: models.find(m => m.name === 'DeepSeek V3')!.id, benchmarkId: humanEval.id, value: 87.8, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'DeepSeek V3')!.id, benchmarkId: gsm8k.id, value: 91.3, sourceId: hfSource.id },
    { modelId: models.find(m => m.name === 'DeepSeek V3')!.id, benchmarkId: mmlu.id, value: 85.2, sourceId: hfSource.id },
  ]

  for (const score of sampleScores) {
    await prisma.score.upsert({
      where: {
        modelId_benchmarkId_sourceId: {
          modelId: score.modelId,
          benchmarkId: score.benchmarkId,
          sourceId: score.sourceId!,
        },
      },
      update: { value: score.value },
      create: score,
    })
  }

  console.log(`✅ Created ${sampleScores.length} sample scores`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
