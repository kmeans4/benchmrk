'use client'

import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { AnimatePresence } from 'framer-motion'
import { useBenchmarkStore, selectFilteredModels, selectVisibleBenchmarks, selectScoreRange } from '@/store/benchmarkStore'
import { GridHeader } from './GridHeader'
import { GridRow } from './GridRow'
import { cn } from '@/lib/utils'

interface BenchmarkGridProps {
  className?: string
}

export function BenchmarkGrid({ className }: BenchmarkGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Get state from store
  const {
    models,
    benchmarks,
    scores,
    filters,
    sort,
    scoreDisplay,
    setSortModel,
    setActiveModel,
    activeModel,
  } = useBenchmarkStore()

  // Derived data (memoized)
  const filteredModels = useMemo(
    () => selectFilteredModels(models, filters, scores),
    [models, filters, scores]
  )

  const visibleBenchmarks = useMemo(
    () => selectVisibleBenchmarks(benchmarks, filters, scores, models),
    [benchmarks, filters, scores, models]
  )

  const scoreRanges = useMemo(
    () => selectScoreRange(scores, visibleBenchmarks),
    [scores, visibleBenchmarks]
  )

  // Sort models
  const sortedGrid = useMemo(() => {
    const sorted = [...filteredModels]

    if (sort.modelSortBy === 'avgScore') {
      sorted.sort((a, b) => {
        const aScores = Object.values(scores[a.id] || {})
        const bScores = Object.values(scores[b.id] || {})
        const aAvg = aScores.length ? aScores.reduce((s, v) => s + v, 0) / aScores.length : 0
        const bAvg = bScores.length ? bScores.reduce((s, v) => s + v, 0) / bScores.length : 0
        return sort.modelSortDir === 'desc' ? bAvg - aAvg : aAvg - bAvg
      })
    } else if (sort.modelSortBy === 'totalScore') {
      sorted.sort((a, b) => {
        const aTotal = Object.values(scores[a.id] || {}).reduce((s, v) => s + v, 0)
        const bTotal = Object.values(scores[b.id] || {}).reduce((s, v) => s + v, 0)
        return sort.modelSortDir === 'desc' ? bTotal - aTotal : aTotal - bTotal
      })
    } else if (sort.modelSortBy === 'releaseDate') {
      sorted.sort((a, b) => {
        const aDate = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const bDate = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
        return sort.modelSortDir === 'desc' ? bDate - aDate : aDate - bDate
      })
    } else if (sort.modelSortBy === 'params') {
      sorted.sort((a, b) => {
        const aParams = a.parameterCount ? Number(a.parameterCount) : 0
        const bParams = b.parameterCount ? Number(b.parameterCount) : 0
        return sort.modelSortDir === 'desc' ? bParams - aParams : aParams - bParams
      })
    } else {
      // Sort by specific benchmark
      sorted.sort((a, b) => {
        const aScore = scores[a.id]?.[sort.modelSortBy] || 0
        const bScore = scores[b.id]?.[sort.modelSortBy] || 0
        return sort.modelSortDir === 'desc' ? bScore - aScore : aScore - bScore
      })
    }

    return sorted
  }, [filteredModels, scores, sort])

  // Virtualization
  const virtualizer = useVirtualizer({
    count: sortedGrid.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  })

  const handleSort = (benchmarkId: string) => {
    setSortModel(benchmarkId)
  }

  const handleRowClick = (modelId: string) => {
    setActiveModel(modelId === activeModel ? null : modelId)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <GridHeader
        benchmarks={visibleBenchmarks}
        onSort={handleSort}
        currentSort={sort.modelSortBy !== 'avgScore' && sort.modelSortBy !== 'totalScore' && sort.modelSortBy !== 'releaseDate' && sort.modelSortBy !== 'params' ? sort.modelSortBy : undefined}
        sortDir={sort.modelSortDir}
      />

      {/* Grid Body */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto relative"
        style={{ contain: 'strict' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const model = sortedGrid[virtualRow.index]
            return (
              <div
                key={model.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <GridRow
                  model={model}
                  benchmarks={visibleBenchmarks}
                  scores={scores}
                  displayMode={scoreDisplay}
                  scoreRanges={scoreRanges}
                  onClick={() => handleRowClick(model.id)}
                  isSelected={activeModel === model.id}
                />
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {sortedGrid.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/60 text-lg mb-2">No models match your filters</p>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
