import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Model, Benchmark, ScoreMap, FilterState, SortState, ViewMode, ScoreDisplayMode, PaginationState } from '@/types/benchmark'

type ArrayFilterKey = {
  [K in keyof FilterState]: FilterState[K] extends readonly unknown[] ? K : never
}[keyof FilterState]

type ArrayFilterValue<K extends ArrayFilterKey> = FilterState[K] extends readonly (infer U)[]
  ? U
  : never

interface BenchmarkStore {
  // Data
  models: Model[]
  benchmarks: Benchmark[]
  scores: ScoreMap

  // Filters
  filters: FilterState

  // Sort
  sort: SortState

  // UI
  viewMode: ViewMode
  activeModel: string | null
  compareList: string[] // max 4
  isFilterPanelOpen: boolean
  scoreDisplay: ScoreDisplayMode
  pagination: PaginationState

  // Actions - Data
  setData: (models: Model[], benchmarks: Benchmark[], scores: ScoreMap) => void

  // Actions - Filters
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  clearFilters: () => void
  removeFilterValue: <K extends ArrayFilterKey>(key: K, value: ArrayFilterValue<K>) => void

  // Actions - Sort
  setSortModel: (by: string, dir?: 'asc' | 'desc') => void
  setSortBenchmark: (by: SortState['benchmarkSortBy']) => void

  // Actions - UI
  setViewMode: (mode: ViewMode) => void
  setActiveModel: (modelId: string | null) => void
  toggleCompare: (modelId: string) => void
  clearCompare: () => void
  toggleFilterPanel: (open?: boolean) => void
  setScoreDisplay: (mode: ScoreDisplayMode) => void
  setPagination: (page: number, hasMore?: boolean) => void

  // Derived selectors (computed in components via useMemo)
  // These are documented here but implemented as selectors
  // filteredModels: Model[]
  // visibleBenchmarks: Benchmark[]
  // sortedGrid: Model[]
  // activeFilterCount: number
  // scoreRange: { [benchmarkId: string]: { min: number; max: number } }
}

const defaultFilters: FilterState = {
  benchmarkIds: [],
  modelSearch: '',
  categories: [],
  skillAreas: [],
  hostingTypes: [],
  paramRange: [0, 1000], // 0 to 1000B parameters
  providers: [],
  modalities: [],
  vramMax: null,
  licenseTypes: [],
  releaseDateRange: null,
  scoreRecencyMonths: null,
  evalTypes: [],
  costTiers: [],
  specialCaps: [],
}

const defaultSort: SortState = {
  modelSortBy: 'avgScore',
  modelSortDir: 'desc',
  benchmarkSortBy: 'coverage',
}

const initialState: Omit<BenchmarkStore, 'setData' | 'setFilter' | 'clearFilters' | 'removeFilterValue' | 'setSortModel' | 'setSortBenchmark' | 'setViewMode' | 'setActiveModel' | 'toggleCompare' | 'clearCompare' | 'toggleFilterPanel' | 'setScoreDisplay' | 'setPagination'> = {
  models: [],
  benchmarks: [],
  scores: {},
  filters: defaultFilters,
  sort: defaultSort,
  viewMode: 'grid',
  activeModel: null,
  compareList: [],
  isFilterPanelOpen: false,
  scoreDisplay: 'value',
  pagination: { page: 1, pageSize: 50, hasMore: true },
}

export const useBenchmarkStore = create<BenchmarkStore>()(
  immer((set) => ({
    ...initialState,

    // Data actions
    setData: (models, benchmarks, scores) => {
      set((state) => {
        state.models = models
        state.benchmarks = benchmarks
        state.scores = scores
      })
    },

    // Filter actions
    setFilter: (key, value) => {
      set((state) => {
        state.filters[key] = value
      })
    },

    clearFilters: () => {
      set((state) => {
        state.filters = { ...defaultFilters }
      })
    },

    removeFilterValue: (key, valueToRemove) => {
      set((state) => {
        const current = state.filters[key]
        state.filters[key] = current.filter((value) => value !== valueToRemove) as FilterState[typeof key]
      })
    },

    // Sort actions
    setSortModel: (by, dir) => {
      set((state) => {
        // Cycle through: DESC → ASC → back to avgScore
        if (by === state.sort.modelSortBy) {
          if (state.sort.modelSortDir === 'desc') {
            state.sort.modelSortDir = 'asc'
          } else if (state.sort.modelSortDir === 'asc' && by !== 'avgScore') {
            // Go back to default
            state.sort.modelSortBy = 'avgScore'
            state.sort.modelSortDir = 'desc'
          }
        } else {
          state.sort.modelSortBy = by
          state.sort.modelSortDir = dir || 'desc'
        }
      })
    },

    setSortBenchmark: (by) => {
      set((state) => {
        state.sort.benchmarkSortBy = by
      })
    },

    // UI actions
    setViewMode: (mode) => {
      set((state) => {
        state.viewMode = mode
      })
    },

    setActiveModel: (modelId) => {
      set((state) => {
        state.activeModel = modelId
      })
    },

    toggleCompare: (modelId) => {
      set((state) => {
        const index = state.compareList.indexOf(modelId)
        if (index > -1) {
          state.compareList.splice(index, 1)
        } else {
          if (state.compareList.length < 4) {
            state.compareList.push(modelId)
          }
        }
      })
    },

    clearCompare: () => {
      set((state) => {
        state.compareList = []
      })
    },

    toggleFilterPanel: (open) => {
      set((state) => {
        state.isFilterPanelOpen = open !== undefined ? open : !state.isFilterPanelOpen
      })
    },

    setScoreDisplay: (mode) => {
      set((state) => {
        state.scoreDisplay = mode
      })
    },

    setPagination: (page, hasMore) => {
      set((state) => {
        state.pagination.page = page
        if (hasMore !== undefined) {
          state.pagination.hasMore = hasMore
        }
      })
    },
  }))
)

// Selector helpers (to be used with useMemo in components)
export const selectFilteredModels = (
  models: Model[],
  filters: FilterState,
  scores: ScoreMap
): Model[] => {
  return models.filter((model) => {
    // Model search (fuzzy match on name + provider)
    if (filters.modelSearch) {
      const search = filters.modelSearch.toLowerCase()
      const matchesName = model.name.toLowerCase().includes(search)
      const matchesProvider = model.provider.toLowerCase().includes(search)
      if (!matchesName && !matchesProvider) return false
    }

    // Benchmark filter
    if (filters.benchmarkIds.length > 0) {
      const modelScores = scores[model.id] || {}
      const hasAnySelectedBenchmark = filters.benchmarkIds.some(
        (bid) => modelScores[bid] !== undefined
      )
      if (!hasAnySelectedBenchmark) return false
    }

    // Hosting type
    if (filters.hostingTypes.length > 0) {
      if (!filters.hostingTypes.includes(model.hostingType)) return false
    }

    // Parameter range
    const paramCountB = model.parameterCount
      ? Number(model.parameterCount) / 1e9
      : null
    if (paramCountB !== null) {
      const [min, max] = filters.paramRange
      if (paramCountB < min || paramCountB > max) return false
    }

    // Providers
    if (filters.providers.length > 0) {
      if (!filters.providers.includes(model.provider)) return false
    }

    // Modalities
    if (filters.modalities.length > 0) {
      const hasModality = filters.modalities.some((m) =>
        model.modalities.includes(m)
      )
      if (!hasModality) return false
    }

    // License types
    if (filters.licenseTypes.length > 0) {
      if (!filters.licenseTypes.includes(model.licenseType)) return false
    }

    return true
  })
}

export const selectVisibleBenchmarks = (
  benchmarks: Benchmark[],
  filters: FilterState,
  scores: ScoreMap,
  models: Model[]
): Benchmark[] => {
  let visible = benchmarks

  // Filter by selected benchmark IDs (if any)
  if (filters.benchmarkIds.length > 0) {
    visible = visible.filter((b) => filters.benchmarkIds.includes(b.id))
  }

  // Filter by category
  if (filters.categories.length > 0) {
    visible = visible.filter((b) => filters.categories.includes(b.category))
  }

  // Filter by skill area
  if (filters.skillAreas.length > 0) {
    visible = visible.filter((b) =>
      filters.skillAreas.includes(b.skillAreaName)
    )
  }

  // Sort by coverage (default)
  if (filters.benchmarkIds.length === 0) {
    visible = [...visible].sort((a, b) => {
      const countA = models.filter((m) => scores[m.id]?.[a.id] !== undefined)
        .length
      const countB = models.filter((m) => scores[m.id]?.[b.id] !== undefined)
        .length
      return countB - countA
    })
  }

  return visible
}

export const selectScoreRange = (
  scores: ScoreMap,
  visibleBenchmarks: Benchmark[],
  models?: Model[]
): { [benchmarkId: string]: { min: number; max: number } } => {
  const range: { [benchmarkId: string]: { min: number; max: number } } = {}
  const modelIds = models?.map((model) => model.id) ?? Object.keys(scores)

  visibleBenchmarks.forEach((benchmark) => {
    const values = modelIds
      .map((modelId) => scores[modelId]?.[benchmark.id])
      .filter((v): v is number => v !== undefined)

    if (values.length > 0) {
      range[benchmark.id] = {
        min: Math.min(...values),
        max: Math.max(...values),
      }
    }
  })

  return range
}

export const selectActiveFilterCount = (filters: FilterState): number => {
  let count = 0

  if (filters.benchmarkIds.length > 0) count++
  if (filters.modelSearch) count++
  if (filters.categories.length > 0) count++
  if (filters.skillAreas.length > 0) count++
  if (filters.hostingTypes.length > 0) count++
  if (filters.paramRange[0] !== 0 || filters.paramRange[1] !== 1000) count++
  if (filters.providers.length > 0) count++
  if (filters.modalities.length > 0) count++
  if (filters.vramMax !== null) count++
  if (filters.licenseTypes.length > 0) count++
  if (filters.releaseDateRange !== null) count++
  if (filters.scoreRecencyMonths !== null) count++
  if (filters.evalTypes.length > 0) count++
  if (filters.costTiers.length > 0) count++
  if (filters.specialCaps.length > 0) count++

  return count
}
