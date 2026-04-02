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
  const baseStyles = 'backdrop-blur-xl border transition-all duration-200'

  const variants = {
    default: 'bg-white/5 border-white/12 shadow-lg',
    elevated: 'bg-white/10 border-white/12 shadow-xl',
    modal: 'bg-white/10 border-white/20 shadow-2xl',
  }

  const hoverStyles = hover
    ? 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-500/30'
    : ''

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className={cn(
          'relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-xl max-w-4xl w-full mx-4',
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  )
}
