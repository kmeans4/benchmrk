// Type definitions for Benchmrk

export type LicenseType = 'OpenWeights' | 'Proprietary' | 'ResearchOnly' | 'CommercialAllowed' | 'Unknown'
export type HostingType = 'CloudOnly' | 'LocalOnly' | 'Both' | 'Unknown'
export type Modality = 'Text' | 'Image' | 'Audio' | 'Video' | 'Code'
export type EvaluationMethod = 'Automatic' | 'HumanJudged' | 'Mixed' | 'Unknown'
export type ScoreType = 'Accuracy' | 'PassAtK' | 'Elo' | 'Percentage' | 'Raw' | 'Normalized' | 'Unknown'
export type Reliability = 'High' | 'Medium' | 'Low' | 'Unknown'

export interface Model {
  id: string
  name: string
  provider: string
  releaseDate: Date | null
  contextWindow: number | null
  parameterCount: bigint | null
  licenseType: LicenseType
  hostingType: HostingType
  modalities: Modality[]
  hardwareRequirements: string | null
  knowledgeCutoff: Date | null
  architecture: string | null
  trainingDataSource: string | null
  inferenceCostPer1M: string | null
  quantizationOptions: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Benchmark {
  id: string
  name: string
  category: string
  skillAreaId: string
  skillAreaName: string
  description: string | null
  license: string | null
  evaluationMethod: EvaluationMethod
  scoreType: ScoreType
  scoreInterpretation: string
  sourceUrl: string | null
  leaderboardUrl: string | null
  lastUpdated: Date | null
  modelCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Score {
  id: string
  modelId: string
  benchmarkId: string
  value: number
  scoreDate: Date | null
  sourceId: string | null
  isVerified: boolean
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SkillArea {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  skillAreaId: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Source {
  id: string
  name: string
  url: string | null
  reliability: Reliability
  isOfficial: boolean
  createdAt: Date
  updatedAt: Date
}

// Normalized score map for quick lookup
export type ScoreMap = {
  [modelId: string]: {
    [benchmarkId: string]: number
  }
}

// Filter state
export interface FilterState {
  benchmarkIds: string[]
  modelSearch: string
  categories: string[]
  skillAreas: string[]
  hostingTypes: HostingType[]
  paramRange: [number, number] // billions
  providers: string[]
  modalities: Modality[]
  vramMax: number | null
  licenseTypes: LicenseType[]
  releaseDateRange: [Date, Date] | null
  scoreRecencyMonths: number | null
  evalTypes: string[]
  costTiers: string[]
  specialCaps: string[]
}

// Sort state
export interface SortState {
  modelSortBy: 'totalScore' | 'avgScore' | 'releaseDate' | 'params' | string
  modelSortDir: 'asc' | 'desc'
  benchmarkSortBy: 'coverage' | 'name' | 'category' | 'lastUpdated'
}

// UI state
export type ViewMode = 'grid' | 'cards'
export type ScoreDisplayMode = 'value' | 'heatmap' | 'bars' | 'sparkline'

export interface PaginationState {
  page: number
  pageSize: number
  hasMore: boolean
}

// Grid data shape
export interface GridData {
  models: Model[]
  benchmarks: Benchmark[]
  scoreMap: ScoreMap
  hasMore: boolean
  total: number
}

// API response types
export interface GridApiResponse {
  models: Model[]
  benchmarks: Benchmark[]
  scoreMap: ScoreMap
  hasMore: boolean
  total: number
}

export interface ModelDetailResponse {
  model: Model
  scores: Score[]
  skillAreaAverages: { [skillArea: string]: number }
  relatedModels: Model[]
}

export interface CompareResponse {
  models: Model[]
  scores: { [modelId: string]: { [benchmarkId: string]: number } }
  skillAreaRadar: { [modelId: string]: { [skillArea: string]: number } }
  bestPerModel: { [benchmarkId: string]: { modelId: string; value: number } }
}
