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
import { MobileBenchmarkCards } from './MobileBenchmarkCards'

const MODEL_COLUMN_WIDTH = 220
const BENCHMARK_COLUMN_WIDTH = 128
const ROW_HEIGHT = 96

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
    () => selectScoreRange(scores, visibleBenchmarks, filteredModels),
    [scores, visibleBenchmarks, filteredModels]
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
  const desktopViewportHeight = Math.min(Math.max(sortedGrid.length * ROW_HEIGHT + 112, 300), 760)

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: sortedGrid.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  if (sortedGrid.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[28px] border border-white/8 bg-[#090a10]/55 px-6 py-16">
        <div className="max-w-md rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)] p-8 text-center shadow-[0_18px_56px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">No models match the current filters</p>
          <p className="mt-2 text-sm text-white/50">
            Clear the active filters to restore the full leaderboard and benchmark coverage.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex h-10 items-center rounded-[14px] border border-cyan-500/40 bg-cyan-500/18 px-4 text-sm font-medium text-cyan-100 shadow-[0_10px_24px_rgba(6,182,212,0.16)] active:scale-[0.98] hover:border-cyan-400/60 hover:bg-cyan-500/25"
          >
            Clear filters
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 w-full flex-col rounded-[28px] border border-white/8 bg-[#090a10]/50 p-2.5 md:rounded-[30px] md:p-3.5">
      <MobileBenchmarkCards
        models={sortedGrid}
        benchmarks={visibleBenchmarks}
        scores={scores}
        scoreRanges={scoreRanges}
        activeModel={activeModel}
        onToggleModel={(modelId) => setActiveModel(activeModel === modelId ? null : modelId)}
      />

      <div
        ref={parentRef}
        className="hidden overflow-auto rounded-[24px] border border-white/7 bg-[#0a0b11]/60 p-2 overscroll-contain shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [scrollbar-gutter:stable_both-edges] md:block md:p-3"
        style={{ height: desktopViewportHeight }}
      >
        <div className="relative min-w-full pb-3" style={{ width: contentWidth }}>
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
