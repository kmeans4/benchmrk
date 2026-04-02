'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn, normalizeScore, getScoreColor, formatScore } from '@/lib/utils'
import { ScoreDisplayMode } from '@/types/benchmark'

interface ScoreCellProps {
  value: number
  benchmarkId: string
  modelId: string
  displayMode: ScoreDisplayMode
  scoreInterpretation?: string
  minScore?: number
  maxScore?: number
  className?: string
}

export const ScoreCell = memo(function ScoreCell({
  value,
  displayMode,
  scoreInterpretation = 'higher=better',
  minScore = 0,
  maxScore = 100,
  className,
}: ScoreCellProps) {
  const normalized = useMemo(
    () => normalizeScore(value, minScore, maxScore, scoreInterpretation === 'higher=better'),
    [value, minScore, maxScore, scoreInterpretation]
  )

  const color = getScoreColor(normalized)

  // Value display mode
  if (displayMode === 'value') {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-full px-2 py-1 rounded-md font-mono text-sm',
          'bg-white/5 border border-white/10',
          className
        )}
        style={{ color }}
      >
        <motion.span
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {formatScore(value)}
        </motion.span>
      </div>
    )
  }

  // Heatmap mode
  if (displayMode === 'heatmap') {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-full px-2 py-1 rounded-md font-mono text-sm',
          className
        )}
        style={{
          backgroundColor: `${color}20`,
          border: `1px solid ${color}40`,
        }}
      >
        {formatScore(value)}
      </div>
    )
  }

  // Bars mode
  if (displayMode === 'bars') {
    return (
      <div
        className={cn(
          'relative flex items-center h-full px-2 py-1 rounded-md',
          className
        )}
      >
        {/* Background bar */}
        <div className="absolute inset-0 bg-white/5 rounded-md overflow-hidden">
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            animate={{ width: `${normalized * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: color }}
          />
        </div>
        {/* Value on top */}
        <span className="relative z-10 font-mono text-sm" style={{ color }}>
          {formatScore(value)}
        </span>
      </div>
    )
  }

  // Sparkline mode (simplified - would need trend data)
  if (displayMode === 'sparkline') {
    return (
      <div className={cn('flex items-center justify-center h-full px-2', className)}>
        <svg width="60" height="20" viewBox="0 0 60 20">
          <motion.path
            d="M0,15 Q15,10 30,12 T60,8"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <span className="ml-1 font-mono text-sm" style={{ color }}>
          {formatScore(value)}
        </span>
      </div>
    )
  }

  return null
})

export function EmptyScoreCell({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-full px-2 py-1',
        'text-white/20 font-mono text-sm',
        className
      )}
    >
      --
    </div>
  )
}
