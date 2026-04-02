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
    <div className="sticky top-0 z-30 flex border-b border-white/10 bg-[#0b0b10]/92 backdrop-blur-xl">
      <div
        className="sticky left-0 z-40 flex items-center border-r border-white/10 bg-[#0b0b10]/95 px-4 py-3 backdrop-blur-xl"
        style={{ width: modelColumnWidth, minWidth: modelColumnWidth }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Model
          </p>
          <p className="mt-1 text-sm font-semibold text-white">Name · provider · footprint</p>
        </div>
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
              'group relative flex shrink-0 flex-col justify-between gap-2 border-r border-white/5 px-3 py-3 text-left transition-colors hover:bg-white/[0.04]',
              isSorted && 'bg-cyan-500/[0.08]'
            )}
            style={{ width: benchmarkColumnWidth, minWidth: benchmarkColumnWidth, maxWidth: benchmarkColumnWidth }}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold leading-4 text-white/90">
                {truncate(benchmark.name, 28)}
              </p>
              <span className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">
                <span className="truncate">{benchmark.category}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/35">
              <span>{benchmark.skillAreaName}</span>
              <span className={cn('transition-colors', isSorted ? 'text-cyan-300' : 'text-white/25 group-hover:text-white/50')}>
                {isSorted ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
              </span>
            </div>

            <span
              className={cn(
                'absolute inset-x-0 top-0 h-px bg-cyan-500/0 transition-colors',
                isSorted ? 'bg-cyan-500/90' : 'group-hover:bg-cyan-500/50'
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
