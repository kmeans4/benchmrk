'use client'

import { memo } from 'react'
import { cn, formatParams } from '@/lib/utils'
import { Benchmark, Model, ScoreDisplayMode, ScoreMap } from '@/types/benchmark'
import { EmptyScoreCell, ScoreCell } from './ScoreCell'

interface GridRowProps {
  model: Model
  benchmarks: Benchmark[]
  scores: ScoreMap
  displayMode: ScoreDisplayMode
  scoreRanges: { [benchmarkId: string]: { min: number; max: number } }
  onClick?: () => void
  isSelected?: boolean
  modelColumnWidth?: number
  benchmarkColumnWidth?: number
}

function formatHostingType(type: Model['hostingType']) {
  if (type === 'CloudOnly') return 'Cloud'
  if (type === 'LocalOnly') return 'Local'
  if (type === 'Both') return 'Hybrid'
  return type
}

function formatLicenseType(type: Model['licenseType']) {
  if (type === 'OpenWeights') return 'Open'
  if (type === 'Proprietary') return 'Closed'
  if (type === 'CommercialAllowed') return 'Commercial'
  if (type === 'ResearchOnly') return 'Research'
  return type
}

export const GridRow = memo(function GridRow({
  model,
  benchmarks,
  scores,
  displayMode,
  scoreRanges,
  onClick,
  isSelected = false,
  modelColumnWidth = 220,
  benchmarkColumnWidth = 120,
}: GridRowProps) {
  const modelScores = scores[model.id] || {}

  return (
    <div
      className={cn(
        'group flex min-w-fit border-b border-white/5 transition-all duration-200',
        'hover:bg-white/[0.035] hover:shadow-[0_0_28px_rgba(6,182,212,0.08)]',
        onClick && 'cursor-pointer',
        isSelected && 'bg-cyan-500/[0.08] shadow-[0_0_28px_rgba(6,182,212,0.12)]'
      )}
      style={{ minHeight: 76 }}
      onClick={onClick}
    >
      <div
        className={cn(
          'sticky left-0 z-20 border-r border-white/10 px-4 py-3 backdrop-blur-xl transition-colors',
          isSelected ? 'bg-[#101420]/95' : 'bg-[#0b0b10]/92 group-hover:bg-[#10131c]/95'
        )}
        style={{ width: modelColumnWidth, minWidth: modelColumnWidth }}
      >
        <div className="flex h-full flex-col justify-center gap-2">
          <div className="space-y-1">
            <p className="truncate text-sm font-semibold text-white">{model.name}</p>
            <p className="truncate text-xs text-white/45">{model.provider}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200">
              {formatHostingType(model.hostingType)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
              {formatLicenseType(model.licenseType)}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
              {formatParams(model.parameterCount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        {benchmarks.map((benchmark) => {
          const scoreValue = modelScores[benchmark.id]
          const range = scoreRanges[benchmark.id]

          return (
            <div
              key={benchmark.id}
              className="flex shrink-0 items-center justify-center border-r border-white/5 px-2 py-2"
              style={{ width: benchmarkColumnWidth, minWidth: benchmarkColumnWidth, maxWidth: benchmarkColumnWidth }}
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
                  className="w-full"
                />
              ) : (
                <EmptyScoreCell className="w-full" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
