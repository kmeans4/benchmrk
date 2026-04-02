// Seed data for development/testing
import { Model, Benchmark, ScoreMap, SkillArea, Category, Source } from '@/types/benchmark'

export const seedSkillAreas: SkillArea[] = [
  { id: 'sa-coding', name: 'Coding', description: 'Code generation and understanding', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-reasoning', name: 'Reasoning', description: 'Logical and mathematical reasoning', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-knowledge', name: 'Knowledge', description: 'General knowledge and QA', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-math', name: 'Math', description: 'Mathematical problem solving', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-language', name: 'Language', description: 'Natural language understanding', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-creative', name: 'Creative', description: 'Creative writing and generation', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-vision', name: 'Vision', description: 'Image and video understanding', createdAt: new Date(), updatedAt: new Date() },
  { id: 'sa-agentic', name: 'Agentic', description: 'Tool use and autonomous agents', createdAt: new Date(), updatedAt: new Date() },
]

export const seedBenchmarks: Benchmark[] = [
  { id: 'bm-humaneval', name: 'HumanEval', category: 'Code Generation', skillAreaId: 'sa-coding', skillAreaName: 'Coding', description: 'Code synthesis', license: 'MIT', evaluationMethod: 'Automatic', scoreType: 'PassAtK', scoreInterpretation: 'higher=better', sourceUrl: 'https://github.com/openai/human-eval', leaderboardUrl: null, lastUpdated: new Date(), modelCount: 50, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bm-gsm8k', name: 'GSM8K', category: 'Math Word Problems', skillAreaId: 'sa-math', skillAreaName: 'Math', description: 'Grade school math', license: 'MIT', evaluationMethod: 'Automatic', scoreType: 'Accuracy', scoreInterpretation: 'higher=better', sourceUrl: null, leaderboardUrl: null, lastUpdated: new Date(), modelCount: 60, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bm-mmlu', name: 'MMLU', category: 'Multi-Task Knowledge', skillAreaId: 'sa-knowledge', skillAreaName: 'Knowledge', description: 'Massive multitask language understanding', license: 'MIT', evaluationMethod: 'Automatic', scoreType: 'Accuracy', scoreInterpretation: 'higher=better', sourceUrl: null, leaderboardUrl: null, lastUpdated: new Date(), modelCount: 80, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bm-math', name: 'MATH', category: 'Math', skillAreaId: 'sa-math', skillAreaName: 'Math', description: 'High school competition math', license: 'MIT', evaluationMethod: 'Automatic', scoreType: 'Accuracy', scoreInterpretation: 'higher=better', sourceUrl: null, leaderboardUrl: null, lastUpdated: new Date(), modelCount: 40, createdAt: new Date(), updatedAt: new Date() },
  { id: 'bm-bbh', name: 'BBH', category: 'Reasoning', skillAreaId: 'sa-reasoning', skillAreaName: 'Reasoning', description: 'Big-Bench Hard', license: 'Apache-2.0', evaluationMethod: 'Automatic', scoreType: 'Accuracy', scoreInterpretation: 'higher=better', sourceUrl: null, leaderboardUrl: null, lastUpdated: new Date(), modelCount: 45, createdAt: new Date(), updatedAt: new Date() },
]

export const seedModels: Model[] = [
  { id: 'm-gpt4o', name: 'GPT-4o', provider: 'OpenAI', releaseDate: new Date('2024-05-13'), contextWindow: 128000, parameterCount: BigInt(200000000000), licenseType: 'Proprietary', hostingType: 'CloudOnly', modalities: ['Text', 'Image', 'Audio'], hardwareRequirements: null, knowledgeCutoff: new Date('2024-04-01'), architecture: 'Dense', trainingDataSource: 'Proprietary', inferenceCostPer1M: '$2.50/1M input, $10/1M output', quantizationOptions: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'm-claude37', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', releaseDate: new Date('2025-02-24'), contextWindow: 200000, parameterCount: BigInt(137000000000), licenseType: 'Proprietary', hostingType: 'CloudOnly', modalities: ['Text', 'Image'], hardwareRequirements: null, knowledgeCutoff: new Date('2025-01-01'), architecture: 'MoE', trainingDataSource: 'Proprietary', inferenceCostPer1M: '$3/1M input, $15/1M output', quantizationOptions: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'm-llama33', name: 'Llama 3.3 70B', provider: 'Meta', releaseDate: new Date('2024-12-06'), contextWindow: 128000, parameterCount: BigInt(70000000000), licenseType: 'CommercialAllowed', hostingType: 'Both', modalities: ['Text'], hardwareRequirements: '140GB VRAM for FP16', knowledgeCutoff: new Date('2024-06-01'), architecture: 'Dense', trainingDataSource: 'Public', inferenceCostPer1M: null, quantizationOptions: 'FP16, INT8, INT4', createdAt: new Date(), updatedAt: new Date() },
  { id: 'm-gemini2', name: 'Gemini 2.0 Flash', provider: 'Google', releaseDate: new Date('2025-02-05'), contextWindow: 1048576, parameterCount: BigInt(500000000000), licenseType: 'Proprietary', hostingType: 'CloudOnly', modalities: ['Text', 'Image', 'Audio', 'Video'], hardwareRequirements: null, knowledgeCutoff: new Date('2025-01-01'), architecture: 'MoE', trainingDataSource: 'Proprietary', inferenceCostPer1M: '$0.10/1M input, $0.40/1M output', quantizationOptions: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'm-deepseek', name: 'DeepSeek V3', provider: 'DeepSeek', releaseDate: new Date('2024-12-26'), contextWindow: 64000, parameterCount: BigInt(671000000000), licenseType: 'OpenWeights', hostingType: 'Both', modalities: ['Text', 'Code'], hardwareRequirements: '1.3TB VRAM for FP16', knowledgeCutoff: new Date('2024-10-01'), architecture: 'MoE', trainingDataSource: 'Public', inferenceCostPer1M: null, quantizationOptions: 'FP16, INT8, INT4', createdAt: new Date(), updatedAt: new Date() },
  { id: 'm-mistral', name: 'Mistral Large 2', provider: 'Mistral AI', releaseDate: new Date('2024-07-24'), contextWindow: 128000, parameterCount: BigInt(123000000000), licenseType: 'Proprietary', hostingType: 'CloudOnly', modalities: ['Text', 'Code'], hardwareRequirements: null, knowledgeCutoff: new Date('2024-06-01'), architecture: 'Dense', trainingDataSource: 'Proprietary', inferenceCostPer1M: '$2/1M input, $6/1M output', quantizationOptions: null, createdAt: new Date(), updatedAt: new Date() },
]

export const seedScores: ScoreMap = {
  'm-gpt4o': {
    'bm-humaneval': 90.2,
    'bm-gsm8k': 94.1,
    'bm-mmlu': 88.0,
    'bm-math': 76.3,
    'bm-bbh': 82.5,
  },
  'm-claude37': {
    'bm-humaneval': 92.5,
    'bm-gsm8k': 95.8,
    'bm-mmlu': 90.2,
    'bm-math': 79.1,
    'bm-bbh': 85.3,
  },
  'm-llama33': {
    'bm-humaneval': 82.1,
    'bm-gsm8k': 88.5,
    'bm-mmlu': 82.0,
    'bm-math': 68.2,
    'bm-bbh': 75.4,
  },
  'm-gemini2': {
    'bm-humaneval': 88.7,
    'bm-gsm8k': 93.2,
    'bm-mmlu': 87.5,
    'bm-math': 74.8,
    'bm-bbh': 80.1,
  },
  'm-deepseek': {
    'bm-humaneval': 87.3,
    'bm-gsm8k': 91.5,
    'bm-mmlu': 85.8,
    'bm-math': 72.6,
    'bm-bbh': 78.9,
  },
  'm-mistral': {
    'bm-humaneval': 85.4,
    'bm-gsm8k': 89.7,
    'bm-mmlu': 84.2,
    'bm-math': 70.5,
    'bm-bbh': 77.2,
  },
}

export function getSeedData() {
  return {
    models: seedModels,
    benchmarks: seedBenchmarks,
    skillAreas: seedSkillAreas,
    scores: seedScores,
  }
}
