'use client'

import { motion } from 'framer-motion'
import { cn, truncate } from '@/lib/utils'
import { Benchmark } from '@/types/benchmark'

interface GridHeaderProps {
  benchmarks: Benchmark[]
  onSort?: (benchmarkId: string) => void
  currentSort?: string
  sortDir?: 'asc' | 'desc'
  modelColumnWidth?: number
  benchmarkColumnWidth?: number
}

export function GridHeader({
  benchmarks,
  onSort,
  currentSort,
  sortDir,
  modelColumnWidth = 220,
  benchmarkColumnWidth = 120,
}: GridHeaderProps) {
  return (
    <div className="sticky top-0 z-30 flex overflow-hidden rounded-[24px] border border-white/8 bg-[#0b0b10]/92 shadow-[0_16px_34px_rgba(5,7,12,0.34)] backdrop-blur-xl">
      <div
        className="relative sticky left-0 z-40 flex min-h-[104px] items-center border-r border-white/10 bg-[#0b0c12]/96 px-5 py-5 shadow-[12px_0_28px_rgba(5,7,12,0.34)] backdrop-blur-xl"
        style={{ width: modelColumnWidth, minWidth: modelColumnWidth }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Model</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white">Name · provider · footprint</p>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent opacity-80" />
      </div>

      {benchmarks.map((benchmark, index) => {
        const isSorted = currentSort === benchmark.id

        return (
          <motion.button
            key={benchmark.id}
            layout
            type="button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.2, ease: 'easeOut' }}
            onClick={() => onSort?.(benchmark.id)}
            className={cn(
              'group relative flex min-h-[104px] shrink-0 flex-col justify-between gap-3.5 border-r border-white/5 px-4 py-[18px] text-left transition-[background-color,box-shadow,transform] duration-200 hover:bg-white/[0.045] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_24px_rgba(6,182,212,0.05)] active:scale-[0.99]',
              isSorted && 'bg-cyan-500/[0.09]'
            )}
            style={{ width: benchmarkColumnWidth, minWidth: benchmarkColumnWidth, maxWidth: benchmarkColumnWidth }}
          >
            <div className="space-y-3.5">
              <p className="text-[13px] font-semibold leading-[1.45] text-white/92">
                {truncate(benchmark.name, 24)}
              </p>
              <span className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                <span className="truncate">{benchmark.category}</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-white/32">
              <span className="truncate">{benchmark.skillAreaName}</span>
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tracking-normal transition-colors',
                  isSorted
                    ? 'border-cyan-400/35 bg-cyan-400/15 text-cyan-200'
                    : 'border-white/8 bg-white/[0.03] text-white/30 group-hover:border-white/15 group-hover:text-white/55'
                )}
              >
                {isSorted ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
              </span>
            </div>

            <span
              className={cn(
                'absolute left-4 right-4 top-0 h-[2px] rounded-full bg-cyan-500/0 transition-colors duration-200',
                isSorted ? 'bg-cyan-500/90' : 'group-hover:bg-cyan-500/55'
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
