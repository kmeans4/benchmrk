'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { cn, formatParams, formatScore, getScoreColor, normalizeScore } from '@/lib/utils'
import { Benchmark, Model, ScoreMap } from '@/types/benchmark'

interface MobileBenchmarkCardsProps {
  models: Model[]
  benchmarks: Benchmark[]
  scores: ScoreMap
  scoreRanges: { [benchmarkId: string]: { min: number; max: number } }
  activeModel: string | null
  onToggleModel: (modelId: string) => void
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

function MobileScoreTile({
  benchmark,
  value,
  range,
}: {
  benchmark: Benchmark
  value: number | undefined
  range?: { min: number; max: number }
}) {
  if (value === undefined || !range) {
    return (
      <div className="rounded-[18px] border border-dashed border-white/8 bg-white/[0.025] px-3 py-3">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
          {benchmark.name}
        </p>
        <p className="mt-2 font-mono text-sm text-white/22">--</p>
      </div>
    )
  }

  const normalized = normalizeScore(
    value,
    range.min,
    range.max,
    benchmark.scoreInterpretation === 'higher=better'
  )
  const color = getScoreColor(normalized)

  return (
    <div
      className="rounded-[18px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      style={{ borderColor: `${color}24` }}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {benchmark.name}
      </p>
      <p className="mt-2 font-mono text-sm font-medium" style={{ color }}>
        {formatScore(value, benchmark.scoreType)}
      </p>
      <p className="mt-1 truncate text-[11px] text-white/35">{benchmark.skillAreaName}</p>
    </div>
  )
}

export function MobileBenchmarkCards({
  models,
  benchmarks,
  scores,
  scoreRanges,
  activeModel,
  onToggleModel,
}: MobileBenchmarkCardsProps) {
  const featuredBenchmarks = benchmarks.slice(0, 3)

  return (
    <div className="space-y-3 md:hidden">
      {models.map((model, index) => {
        const modelScores = scores[model.id] || {}
        const isExpanded = activeModel === model.id
        const scoredBenchmarkCount = benchmarks.filter((benchmark) => modelScores[benchmark.id] !== undefined).length

        return (
          <motion.article
            key={model.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut', delay: Math.min(index, 5) * 0.03 }}
            className={cn(
              'rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065)_0%,rgba(255,255,255,0.035)_100%)] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.28)] backdrop-blur-xl',
              isExpanded && 'border-cyan-500/20 shadow-[0_18px_54px_rgba(6,182,212,0.12)]'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-white">{model.name}</p>
                <p className="mt-1 truncate text-sm text-white/45">{model.provider}</p>
              </div>

              <button
                type="button"
                onClick={() => onToggleModel(model.id)}
                className={cn(
                  'inline-flex h-9 shrink-0 items-center rounded-[14px] border px-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/65 active:scale-[0.98]',
                  isExpanded
                    ? 'border-cyan-500/35 bg-cyan-500/14 text-cyan-100'
                    : 'border-white/10 bg-white/[0.04]'
                )}
              >
                {isExpanded ? 'Hide' : 'Expand'}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200">
                {formatHostingType(model.hostingType)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/60">
                {formatLicenseType(model.licenseType)}
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/38">
                {formatParams(model.parameterCount)} params
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {featuredBenchmarks.map((benchmark) => (
                <MobileScoreTile
                  key={benchmark.id}
                  benchmark={benchmark}
                  value={modelScores[benchmark.id]}
                  range={scoreRanges[benchmark.id]}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/42">
              <span>
                {scoredBenchmarkCount}/{benchmarks.length} visible benchmarks scored
              </span>
              <button
                type="button"
                onClick={() => onToggleModel(model.id)}
                className="font-medium text-cyan-200 active:scale-[0.98]"
              >
                {isExpanded ? 'Collapse' : 'Show all'}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: 8 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-white/8 pt-4">
                    {benchmarks.map((benchmark) => (
                      <MobileScoreTile
                        key={benchmark.id}
                        benchmark={benchmark}
                        value={modelScores[benchmark.id]}
                        range={scoreRanges[benchmark.id]}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        )
      })}
    </div>
  )
}
