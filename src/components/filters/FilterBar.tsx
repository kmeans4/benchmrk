'use client'

import { useMemo } from 'react'
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
    cyan:
      'border-cyan-500/30 bg-cyan-500/12 text-cyan-200 hover:border-cyan-400/55 hover:bg-cyan-500/16',
    violet:
      'border-violet-500/30 bg-violet-500/12 text-violet-200 hover:border-violet-400/55 hover:bg-violet-500/16',
    emerald:
      'border-emerald-500/30 bg-emerald-500/12 text-emerald-200 hover:border-emerald-400/55 hover:bg-emerald-500/16',
  }

  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, scale: 0.86, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.86, y: -4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.96 }}
      onClick={onRemove}
      aria-label={`Remove filter ${label}`}
      className={cn(
        'inline-flex h-7 items-center gap-2 rounded-full border px-2.5 pl-3 text-[11px] font-medium whitespace-nowrap shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-[border-color,background-color,transform,color] duration-200',
        toneClasses[tone]
      )}
    >
      <span className="max-w-[180px] truncate">{label}</span>
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[11px] leading-none text-white/65">
        ×
      </span>
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
  }

  return (
    <div className="sticky top-14 z-40 pt-3">
      <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.04)_100%)] shadow-[0_14px_44px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 px-3 py-3 md:px-4 lg:grid lg:min-h-14 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)_auto] lg:items-center lg:gap-4 lg:py-0">
          <div className="relative min-w-0 lg:pr-1">
            <input
              type="text"
              placeholder="Search models or providers"
              value={filters.modelSearch}
              onChange={(event) => setFilter('modelSearch', event.target.value)}
              className="h-10 w-full rounded-[14px] border border-white/10 bg-white/[0.05] pl-10 pr-3 text-sm text-white placeholder:text-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-cyan-500/45 focus:bg-white/[0.08] lg:h-9"
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

          <div className="min-w-0 lg:px-2">
            <div className="flex min-h-10 items-center justify-center overflow-hidden rounded-[18px] border border-white/8 bg-white/[0.03] px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:min-h-[38px]">
              <div className="flex max-w-full items-center justify-center gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <AnimatePresence initial={false} mode="popLayout">
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
                  <span className="truncate px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
                    No active filters
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 lg:justify-self-end">
            <button
              type="button"
              onClick={() => toggleFilterPanel()}
              className={cn(
                'inline-flex h-10 items-center rounded-[14px] border px-4 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:scale-[0.98] lg:h-9',
                isFilterPanelOpen
                  ? 'border-violet-500/50 bg-violet-500/20 text-violet-200'
                  : 'border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
              )}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[11px] font-semibold text-white shadow-[0_6px_14px_rgba(124,58,237,0.35)]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex h-10 items-center rounded-[14px] border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:h-9">
              {DISPLAY_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setScoreDisplay(mode)}
                  className={cn(
                    'rounded-[10px] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase active:scale-[0.98]',
                    scoreDisplay === mode
                      ? 'bg-cyan-500/18 text-cyan-200 shadow-[0_8px_18px_rgba(6,182,212,0.18)]'
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
                className="inline-flex h-10 items-center rounded-[14px] px-3 text-sm text-white/55 active:scale-[0.98] hover:text-white lg:h-9"
              >
                Clear all
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-10 items-center rounded-[14px] border border-white/10 bg-white/[0.04] px-4 text-sm text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:scale-[0.98] hover:border-white/20 hover:bg-white/[0.06] hover:text-white lg:h-9"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
