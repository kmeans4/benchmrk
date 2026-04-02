'use client'

import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  selectFilteredModels,
  selectScoreRange,
  selectVisibleBenchmarks,
  useBenchmarkStore,
} from '@/store/benchmarkStore'
import { GridHeader } from './GridHeader'
import { GridRow } from './GridRow'

const MODEL_COLUMN_WIDTH = 220
const BENCHMARK_COLUMN_WIDTH = 120
const ROW_HEIGHT = 76

export function BenchmarkGrid() {
  const parentRef = useRef<HTMLDivElement>(null)

  const {
    models,
    benchmarks,
    scores,
    filters,
    sort,
    scoreDisplay,
    activeModel,
    clearFilters,
    setSortModel,
    setActiveModel,
  } = useBenchmarkStore()

  const filteredModels = useMemo(
    () => selectFilteredModels(models, filters, scores),
    [models, filters, scores]
  )

  const visibleBenchmarks = useMemo(
    () => selectVisibleBenchmarks(benchmarks, filters, scores, filteredModels),
    [benchmarks, filters, scores, filteredModels]
  )

  const scoreRanges = useMemo(
    () => selectScoreRange(scores, visibleBenchmarks),
    [scores, visibleBenchmarks]
  )

  const sortedGrid = useMemo(() => {
    const sorted = [...filteredModels]

    if (sort.modelSortBy === 'avgScore') {
      sorted.sort((a, b) => {
        const aScores = Object.values(scores[a.id] || {})
        const bScores = Object.values(scores[b.id] || {})
        const aAvg = aScores.length > 0 ? aScores.reduce((sum, value) => sum + value, 0) / aScores.length : 0
        const bAvg = bScores.length > 0 ? bScores.reduce((sum, value) => sum + value, 0) / bScores.length : 0
        return sort.modelSortDir === 'desc' ? bAvg - aAvg : aAvg - bAvg
      })
    } else if (sort.modelSortBy === 'totalScore') {
      sorted.sort((a, b) => {
        const aTotal = Object.values(scores[a.id] || {}).reduce((sum, value) => sum + value, 0)
        const bTotal = Object.values(scores[b.id] || {}).reduce((sum, value) => sum + value, 0)
        return sort.modelSortDir === 'desc' ? bTotal - aTotal : aTotal - bTotal
      })
    } else if (sort.modelSortBy === 'releaseDate') {
      sorted.sort((a, b) => {
        const aTime = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const bTime = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
        return sort.modelSortDir === 'desc' ? bTime - aTime : aTime - bTime
      })
    } else if (sort.modelSortBy === 'params') {
      sorted.sort((a, b) => {
        const aParams = a.parameterCount ? Number(a.parameterCount) : 0
        const bParams = b.parameterCount ? Number(b.parameterCount) : 0
        return sort.modelSortDir === 'desc' ? bParams - aParams : aParams - bParams
      })
    } else if (sort.modelSortBy) {
      sorted.sort((a, b) => {
        const aScore = scores[a.id]?.[sort.modelSortBy] || 0
        const bScore = scores[b.id]?.[sort.modelSortBy] || 0
        return sort.modelSortDir === 'desc' ? bScore - aScore : aScore - bScore
      })
    }

    return sorted
  }, [filteredModels, scores, sort])

  const currentBenchmarkSort = visibleBenchmarks.some((benchmark) => benchmark.id === sort.modelSortBy)
    ? sort.modelSortBy
    : undefined

  const contentWidth = MODEL_COLUMN_WIDTH + visibleBenchmarks.length * BENCHMARK_COLUMN_WIDTH

  const virtualizer = useVirtualizer({
    count: sortedGrid.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  if (sortedGrid.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_12px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">No models match the current filters</p>
          <p className="mt-2 text-sm text-white/50">
            Clear the active filters to restore the full leaderboard and benchmark coverage.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex h-10 items-center rounded-xl border border-cyan-500/40 bg-cyan-500/18 px-4 text-sm font-medium text-cyan-100 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/25"
          >
            Clear filters
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
        <div className="min-w-full" style={{ width: contentWidth }}>
          <GridHeader
            benchmarks={visibleBenchmarks}
            onSort={setSortModel}
            currentSort={currentBenchmarkSort}
            sortDir={sort.modelSortDir}
            modelColumnWidth={MODEL_COLUMN_WIDTH}
            benchmarkColumnWidth={BENCHMARK_COLUMN_WIDTH}
          />

          <div
            className="relative"
            style={{
              height: virtualizer.getTotalSize(),
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const model = sortedGrid[virtualRow.index]

              return (
                <motion.div
                  key={model.id}
                  layoutId={`model-row-${model.id}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                    delay: Math.min(index, 6) * 0.02,
                  }}
                  className="absolute left-0 top-0 w-full"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <GridRow
                    model={model}
                    benchmarks={visibleBenchmarks}
                    scores={scores}
                    displayMode={scoreDisplay}
                    scoreRanges={scoreRanges}
                    onClick={() => setActiveModel(activeModel === model.id ? null : model.id)}
                    isSelected={activeModel === model.id}
                    modelColumnWidth={MODEL_COLUMN_WIDTH}
                    benchmarkColumnWidth={BENCHMARK_COLUMN_WIDTH}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
