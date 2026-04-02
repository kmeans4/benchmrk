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
    'relative flex h-[56px] w-full items-center justify-center overflow-hidden rounded-[18px] border px-3 font-mono text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-[border-color,background-color,box-shadow,transform] duration-200',
    className
  )

  if (displayMode === 'value') {
    return (
      <div
        className={cn(
          sharedClasses,
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.035)_100%)]'
        )}
        style={{ borderColor: `${color}2c` }}
      >
        <span
          className="pointer-events-none absolute inset-x-3 bottom-1.5 h-px rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }}
        />
        <motion.span
          initial={{ scale: 1.06, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 font-medium tracking-[-0.01em]"
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
          background: `linear-gradient(180deg, ${color}36 0%, ${color}1a 100%)`,
          borderColor: `${color}4d`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px ${color}12`,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ background: `radial-gradient(circle at top, ${color}24, transparent 68%)` }}
        />
        <span className="relative z-10 font-medium tracking-[-0.01em]">{formatScore(value)}</span>
      </div>
    )
  }

  if (displayMode === 'bars') {
    return (
      <div
        className={cn(
          sharedClasses,
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.025)_100%)]'
        )}
        style={{ borderColor: `${color}26` }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[18px]">
          <div className="absolute inset-[1px] rounded-[17px] bg-white/[0.025]" />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-[18px]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(normalized, 0.06) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ background: `linear-gradient(90deg, ${color}66 0%, ${color}24 72%, transparent 100%)` }}
          />
        </div>
        <span className="relative z-10 font-medium tracking-[-0.01em]" style={{ color }}>
          {formatScore(value)}
        </span>
      </div>
    )
  }

  if (displayMode === 'sparkline') {
    return (
      <div
        className={cn(
          sharedClasses,
          'justify-between gap-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.03)_100%)]'
        )}
        style={{ borderColor: `${color}28` }}
      >
        <div className="flex h-7 flex-1 items-center rounded-full bg-white/[0.03] px-2">
          <svg width="54" height="18" viewBox="0 0 60 20" className="w-full max-w-[54px] shrink-0">
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
        </div>
        <span className="shrink-0 text-[12px] font-medium tracking-[-0.01em]" style={{ color }}>
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
        'flex h-[56px] w-full items-center justify-center rounded-[18px] border border-dashed border-white/6 bg-white/[0.02] px-2 font-mono text-sm text-white/20',
        className
      )}
    >
      --
    </div>
  )
}
