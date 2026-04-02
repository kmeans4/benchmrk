'use client'

import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'modal'
  hover?: boolean
  children: React.ReactNode
  className?: string
}

export function GlassCard({
  variant = 'default',
  hover = false,
  children,
  className,
  ...props
}: GlassCardProps) {
  const baseStyles =
    'border backdrop-blur-xl transition-[border-color,box-shadow,background-color,transform] duration-200'

  const variants = {
    default:
      'bg-white/[0.05] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]',
    elevated:
      'bg-white/[0.09] border-white/12 shadow-[0_12px_42px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)]',
    modal:
      'bg-white/[0.1] border-white/20 shadow-[0_18px_56px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.1)]',
  }

  const hoverStyles = hover
    ? 'hover:border-cyan-400/30 hover:shadow-[0_14px_40px_rgba(0,0,0,0.42),0_0_26px_rgba(6,182,212,0.14),inset_0_1px_0_rgba(255,255,255,0.08)]'
    : ''

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      whileHover={hover ? { y: -1.5, scale: 1.005 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function GlassModal({
  children,
  isOpen,
  onClose,
  className,
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className={cn(
          'relative z-10 mx-4 w-full max-w-4xl rounded-xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}
