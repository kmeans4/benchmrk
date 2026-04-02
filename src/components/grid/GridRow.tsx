'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn, formatParams, getHostingBadgeColor, getLicenseBadgeColor } from '@/lib/utils'
import { Model, Benchmark, ScoreMap, ScoreDisplayMode } from '@/types/benchmark'
import { ScoreCell, EmptyScoreCell } from './ScoreCell'

interface GridRowProps {
  model: Model
  benchmarks: Benchmark[]
  scores: ScoreMap
  displayMode: ScoreDisplayMode
  scoreRanges: { [benchmarkId: string]: { min: number; max: number } }
  onClick?: () => void
  isSelected?: boolean
}

export const GridRow = memo(function GridRow({
  model,
  benchmarks,
  scores,
  displayMode,
  scoreRanges,
  onClick,
  isSelected,
}: GridRowProps) {
  const modelScores = useMemo(() => scores[model.id] || {}, [scores, model.id])

  return (
    <motion.div
      layoutId={`model-row-${model.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group flex border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer',
        isSelected && 'bg-cyan-500/10'
      )}
      style={{ height: '52px' }}
      onClick={onClick}
    >
      {/* Model Column (sticky, 220px) */}
      <div className="sticky left-0 z-10 w-[220px] min-w-[220px] flex items-center px-3 bg-[#0a0a0f] group-hover:bg-[#0a0a0f]/90 backdrop-blur-sm border-r border-white/10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{model.name}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {/* Provider badge */}
            <span className="text-xs text-white/60 truncate">{model.provider}</span>
            {/* Hosting badge */}
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded border',
                getHostingBadgeColor(model.hostingType)
              )}
            >
              {model.hostingType === 'CloudOnly' ? 'Cloud' : model.hostingType === 'LocalOnly' ? 'Local' : 'Both'}
            </span>
            {/* License badge */}
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded border',
                getLicenseBadgeColor(model.licenseType)
              )}
            >
              {model.licenseType === 'OpenWeights' ? 'Open' : model.licenseType === 'Proprietary' ? 'Prop' : model.licenseType}
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            {formatParams(model.parameterCount)}
          </div>
        </div>
      </div>

      {/* Benchmark Columns (scrollable) */}
      <div className="flex-1 flex overflow-x-auto">
        {benchmarks.map((benchmark) => {
          const scoreValue = modelScores[benchmark.id]
          const range = scoreRanges[benchmark.id]

          return (
            <div
              key={benchmark.id}
              className="flex-shrink-0 w-[120px] min-w-[120px] flex items-center justify-center border-r border-white/5"
            >
              {scoreValue !== undefined && range ? (
                <ScoreCell
                  value={scoreValue}
                  benchmarkId={benchmark.id}
                  modelId={model.id}
                  displayMode={displayMode}
                  scoreInterpretation={benchmark.scoreInterpretation}
                  minScore={range.min}
                  maxScore={range.max}
                />
              ) : (
                <EmptyScoreCell />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
})
