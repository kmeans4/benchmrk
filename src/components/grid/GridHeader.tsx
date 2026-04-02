'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Benchmark } from '@/types/benchmark'

interface GridHeaderProps {
  benchmarks: Benchmark[]
  onSort?: (benchmarkId: string) => void
  currentSort?: string
  sortDir?: 'asc' | 'desc'
}

export function GridHeader({ benchmarks, onSort, currentSort, sortDir }: GridHeaderProps) {
  return (
    <div className="flex border-b border-white/10 sticky top-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-xl">
      {/* Model Column Header (sticky, 220px) */}
      <div className="sticky left-0 z-10 w-[220px] min-w-[220px] px-3 py-2 border-r border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">Model</span>
        </div>
      </div>

      {/* Benchmark Column Headers (scrollable) */}
      <div className="flex-1 flex overflow-x-auto">
        {benchmarks.map((benchmark, index) => {
          const isSorted = currentSort === benchmark.id
          
          return (
            <motion.div
              key={benchmark.id}
              layoutId={`benchmark-${benchmark.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              className={cn(
                'flex-shrink-0 w-[120px] min-w-[120px] px-2 py-2 border-r border-white/5',
                'flex flex-col items-center justify-center gap-1 cursor-pointer',
                'hover:bg-white/5 transition-colors group'
              )}
              onClick={() => onSort?.(benchmark.id)}
            >
              {/* Benchmark name (truncated) */}
              <span className="text-xs font-medium text-white/90 truncate w-full text-center">
                {benchmark.name.length > 15 ? benchmark.name.slice(0, 15) + '...' : benchmark.name}
              </span>
              
              {/* Category chip */}
              <span className="text-[10px] text-white/50 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                {benchmark.category}
              </span>
              
              {/* Sort indicator */}
              {isSorted && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-cyan-400"
                >
                  {sortDir === 'desc' ? '↓' : '↑'}
                </motion.span>
              )}
              
              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/0 group-hover:bg-cyan-500/50 transition-colors" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
