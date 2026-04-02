'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn, formatScore, getScoreColor, normalizeScore } from '@/lib/utils'
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
  const sharedClasses = cn(
    'relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl border border-white/8 px-2 font-mono text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm',
    className
  )

  if (displayMode === 'value') {
    return (
      <div className={cn(sharedClasses, 'bg-white/[0.04]')} style={{ borderColor: `${color}22` }}>
        <motion.span
          initial={{ scale: 1.06, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ color }}
        >
          {formatScore(value)}
        </motion.span>
      </div>
    )
  }

  if (displayMode === 'heatmap') {
    return (
      <div
        className={sharedClasses}
        style={{
          color,
          background: `linear-gradient(180deg, ${color}26 0%, ${color}18 100%)`,
          borderColor: `${color}44`,
        }}
      >
        {formatScore(value)}
      </div>
    )
  }

  if (displayMode === 'bars') {
    return (
      <div className={cn(sharedClasses, 'justify-start bg-white/[0.04]')}>
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-white/[0.03]" />
          <motion.div
            className="absolute inset-y-0 left-0"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(normalized, 0.06) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ background: `linear-gradient(90deg, ${color}55 0%, ${color}20 100%)` }}
          />
        </div>
        <span className="relative z-10 mx-auto" style={{ color }}>
          {formatScore(value)}
        </span>
      </div>
    )
  }

  if (displayMode === 'sparkline') {
    return (
      <div className={cn(sharedClasses, 'justify-between bg-white/[0.04] px-2')}>
        <svg width="60" height="20" viewBox="0 0 60 20" className="shrink-0">
          <motion.path
            d="M2,15 C10,11 18,6 28,8 C38,10 45,4 58,6"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <span className="text-xs" style={{ color }}>
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
        'flex h-11 w-full items-center justify-center rounded-xl border border-dashed border-white/6 bg-white/[0.02] px-2 font-mono text-sm text-white/20',
        className
      )}
    >
      --
    </div>
  )
}
