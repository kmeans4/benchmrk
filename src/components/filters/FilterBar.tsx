'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  selectActiveFilterCount,
  selectFilteredModels,
  selectVisibleBenchmarks,
  useBenchmarkStore,
} from '@/store/benchmarkStore'
import { cn, exportGrid } from '@/lib/utils'

interface ActiveChip {
  id: string
  label: string
  tone: 'cyan' | 'violet' | 'emerald'
  onRemove: () => void
}

const DISPLAY_MODES = ['value', 'heatmap', 'bars', 'sparkline'] as const

function formatHostingType(type: string) {
  if (type === 'CloudOnly') return 'Cloud'
  if (type === 'LocalOnly') return 'Local'
  if (type === 'Both') return 'Hybrid'
  return type
}

function formatLicenseType(type: string) {
  if (type === 'OpenWeights') return 'Open weights'
  if (type === 'CommercialAllowed') return 'Commercial'
  return type.replace(/([A-Z])/g, ' $1').trim()
}

function FilterChip({ label, tone, onRemove }: Omit<ActiveChip, 'id'>) {
  const toneClasses = {
    cyan: 'border-cyan-500/30 bg-cyan-500/12 text-cyan-200 hover:border-cyan-400/50',
    violet: 'border-violet-500/30 bg-violet-500/12 text-violet-200 hover:border-violet-400/50',
    emerald: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-200 hover:border-emerald-400/50',
  }

  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      onClick={onRemove}
      className={cn(
        'inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors',
        toneClasses[tone]
      )}
    >
      <span className="max-w-[180px] truncate">{label}</span>
      <span className="text-sm leading-none text-white/60">×</span>
    </motion.button>
  )
}

export function FilterBar() {
  const {
    models,
    benchmarks,
    scores,
    filters,
    setFilter,
    clearFilters,
    removeFilterValue,
    toggleFilterPanel,
    isFilterPanelOpen,
    scoreDisplay,
    setScoreDisplay,
  } = useBenchmarkStore()

  const [searchValue, setSearchValue] = useState(filters.modelSearch)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchValue !== filters.modelSearch) {
        setFilter('modelSearch', searchValue)
      }
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [filters.modelSearch, searchValue, setFilter])

  const filteredModels = useMemo(
    () => selectFilteredModels(models, filters, scores),
    [models, filters, scores]
  )

  const visibleBenchmarks = useMemo(
    () => selectVisibleBenchmarks(benchmarks, filters, scores, filteredModels),
    [benchmarks, filters, scores, filteredModels]
  )

  const activeFilterCount = selectActiveFilterCount(filters)

  const benchmarkLabels = useMemo(
    () => new Map(benchmarks.map((benchmark) => [benchmark.id, benchmark.name])),
    [benchmarks]
  )

  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = []

    if (filters.modelSearch) {
      chips.push({
        id: 'search',
        label: `Search: ${filters.modelSearch}`,
        tone: 'cyan',
        onRemove: () => {
          setSearchValue('')
          setFilter('modelSearch', '')
        },
      })
    }

    filters.benchmarkIds.forEach((benchmarkId) => {
      chips.push({
        id: `benchmark-${benchmarkId}`,
        label: benchmarkLabels.get(benchmarkId) ?? benchmarkId,
        tone: 'violet',
        onRemove: () => removeFilterValue('benchmarkIds', benchmarkId),
      })
    })

    filters.categories.forEach((category) => {
      chips.push({
        id: `category-${category}`,
        label: category,
        tone: 'violet',
        onRemove: () => removeFilterValue('categories', category),
      })
    })

    filters.skillAreas.forEach((skillArea) => {
      chips.push({
        id: `skill-${skillArea}`,
        label: skillArea,
        tone: 'cyan',
        onRemove: () => removeFilterValue('skillAreas', skillArea),
      })
    })

    filters.providers.forEach((provider) => {
      chips.push({
        id: `provider-${provider}`,
        label: provider,
        tone: 'emerald',
        onRemove: () => removeFilterValue('providers', provider),
      })
    })

    filters.hostingTypes.forEach((hostingType) => {
      chips.push({
        id: `hosting-${hostingType}`,
        label: formatHostingType(hostingType),
        tone: 'cyan',
        onRemove: () => removeFilterValue('hostingTypes', hostingType),
      })
    })

    filters.modalities.forEach((modality) => {
      chips.push({
        id: `modality-${modality}`,
        label: modality,
        tone: 'violet',
        onRemove: () => removeFilterValue('modalities', modality),
      })
    })

    filters.licenseTypes.forEach((licenseType) => {
      chips.push({
        id: `license-${licenseType}`,
        label: formatLicenseType(licenseType),
        tone: 'emerald',
        onRemove: () => removeFilterValue('licenseTypes', licenseType),
      })
    })

    if (filters.paramRange[0] !== 0 || filters.paramRange[1] !== 1000) {
      chips.push({
        id: 'params',
        label: `${filters.paramRange[0]}B–${filters.paramRange[1]}B params`,
        tone: 'cyan',
        onRemove: () => setFilter('paramRange', [0, 1000]),
      })
    }

    return chips
  }, [benchmarkLabels, filters, removeFilterValue, setFilter])

  const handleExport = () => {
    exportGrid(filteredModels, visibleBenchmarks, scores, 'csv')
  }

  const handleClearAll = () => {
    clearFilters()
    setSearchValue('')
  }

  return (
    <div className="sticky top-14 z-40">
      <div className="grid h-14 grid-cols-[280px_minmax(0,1fr)_auto] items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.05] px-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search models or providers"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder:text-white/35 transition-colors focus:border-cyan-500/50 focus:bg-white/[0.08]"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex min-w-0 items-center justify-center overflow-hidden">
          <div className="flex max-w-full items-center justify-center gap-2 overflow-x-auto px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <AnimatePresence initial={false}>
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.id}
                  label={chip.label}
                  tone={chip.tone}
                  onRemove={chip.onRemove}
                />
              ))}
            </AnimatePresence>
            {activeChips.length === 0 && (
              <span className="truncate text-xs tracking-[0.18em] text-white/30 uppercase">
                No active filters
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={() => toggleFilterPanel()}
            className={cn(
              'inline-flex h-9 items-center rounded-xl border px-4 text-sm font-medium transition-all',
              isFilterPanelOpen
                ? 'border-violet-500/50 bg-violet-500/20 text-violet-200'
                : 'border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:text-white'
            )}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[11px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex h-9 items-center rounded-xl border border-white/10 bg-white/[0.04] p-1">
            {DISPLAY_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setScoreDisplay(mode)}
                className={cn(
                  'rounded-lg px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors',
                  scoreDisplay === mode
                    ? 'bg-cyan-500/20 text-cyan-200'
                    : 'text-white/45 hover:text-white/80'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex h-9 items-center rounded-xl px-3 text-sm text-white/55 transition-colors hover:text-white"
            >
              Clear all
            </button>
          )}

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-9 items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/75 transition-all hover:border-white/20 hover:text-white"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
