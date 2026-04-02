'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBenchmarkStore, selectActiveFilterCount } from '@/store/benchmarkStore'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'

interface FilterChipProps {
  label: string
  onRemove: () => void
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-sm"
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-violet-500/30 transition-colors"
      >
        ×
      </button>
    </motion.div>
  )
}

export function FilterBar() {
  const {
    filters,
    setFilter,
    clearFilters,
    removeFilterValue,
    toggleFilterPanel,
    isFilterPanelOpen,
    scoreDisplay,
    setScoreDisplay,
  } = useBenchmarkStore()

  const activeFilterCount = selectActiveFilterCount(filters)

  const [searchValue, setSearchValue] = useState(filters.modelSearch)

  // Debounced search update
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    const timeoutId = setTimeout(() => {
      setFilter('modelSearch', value)
    }, 300)
    return () => clearTimeout(timeoutId)
  }

  const handleClearAll = () => {
    clearFilters()
    setSearchValue('')
  }

  // Generate active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = []

  if (filters.benchmarkIds.length > 0) {
    activeChips.push({
      label: `${filters.benchmarkIds.length} benchmarks`,
      onRemove: () => setFilter('benchmarkIds', []),
    })
  }

  if (filters.categories.length > 0) {
    activeChips.push({
      label: `${filters.categories.length} categories`,
      onRemove: () => setFilter('categories', []),
    })
  }

  if (filters.skillAreas.length > 0) {
    activeChips.push({
      label: `${filters.skillAreas.length} domains`,
      onRemove: () => setFilter('skillAreas', []),
    })
  }

  if (filters.providers.length > 0) {
    activeChips.push({
      label: `${filters.providers.length} providers`,
      onRemove: () => setFilter('providers', []),
    })
  }

  if (filters.hostingTypes.length > 0) {
    filters.hostingTypes.forEach((type) => {
      activeChips.push({
        label: type,
        onRemove: () => removeFilterValue('hostingTypes', type),
      })
    })
  }

  if (filters.paramRange[0] !== 0 || filters.paramRange[1] !== 1000) {
    activeChips.push({
      label: `${filters.paramRange[0]}B-${filters.paramRange[1]}B params`,
      onRemove: () => setFilter('paramRange', [0, 1000]),
    })
  }

  if (filters.modalities.length > 0) {
    activeChips.push({
      label: `${filters.modalities.length} modalities`,
      onRemove: () => setFilter('modalities', []),
    })
  }

  if (filters.licenseTypes.length > 0) {
    filters.licenseTypes.forEach((type) => {
      activeChips.push({
        label: type,
        onRemove: () => removeFilterValue('licenseTypes', type),
      })
    })
  }

  return (
    <GlassCard variant="elevated" className="sticky top-0 z-30 h-14 flex items-center px-4 gap-4">
      {/* Search */}
      <div className="relative w-[280px]">
        <input
          type="text"
          placeholder="Search models..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Active filter chips (scrollable) */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto">
        <AnimatePresence>
          {activeChips.map((chip, i) => (
            <FilterChip key={i} label={chip.label} onRemove={chip.onRemove} />
          ))}
        </AnimatePresence>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Score display toggle */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
          {(['value', 'heatmap', 'bars'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setScoreDisplay(mode)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                scoreDisplay === mode
                  ? 'bg-cyan-500/30 text-cyan-300'
                  : 'text-white/60 hover:text-white'
              )}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Filters button with badge */}
        <button
          onClick={() => toggleFilterPanel()}
          className={cn(
            'relative px-4 py-2 rounded-lg border transition-colors',
            isFilterPanelOpen
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
              : 'bg-white/5 border-white/10 text-white/80 hover:border-white/20'
          )}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-violet-500 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Clear All
          </button>
        )}

        {/* Export */}
        <button
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:border-white/20 transition-colors"
        >
          Export
        </button>
      </div>
    </GlassCard>
  )
}
