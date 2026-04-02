import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize a score to 0-1 range based on min/max
 */
export function normalizeScore(
  value: number,
  min: number,
  max: number,
  higherIsBetter: boolean = true
): number {
  if (max === min) return 0.5
  const normalized = (value - min) / (max - min)
  return higherIsBetter ? normalized : 1 - normalized
}

/**
 * Get color for a score based on normalized value
 * Returns hex color string
 */
export function getScoreColor(normalizedValue: number): string {
  if (normalizedValue < 0.4) return '#ef4444' // red
  if (normalizedValue < 0.7) return '#f59e0b' // amber
  return '#10b981' // green
}

/**
 * Get Tailwind color class for a score
 */
export function getScoreColorClass(normalizedValue: number): string {
  if (normalizedValue < 0.4) return 'text-red-500 bg-red-500/10'
  if (normalizedValue < 0.7) return 'text-amber-500 bg-amber-500/10'
  return 'text-emerald-500 bg-emerald-500/10'
}

/**
 * Format parameter count for display
 */
export function formatParams(paramCount: bigint | number | null): string {
  if (paramCount === null) return 'Unknown'
  const num = typeof paramCount === 'bigint' ? Number(paramCount) : paramCount
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  return num.toString()
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return 'Unknown'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

/**
 * Format score value for display
 */
export function formatScore(value: number, scoreType?: string): string {
  if (scoreType === 'PassAtK' || scoreType === 'Percentage') {
    return value.toFixed(1)
  }
  if (scoreType === 'Elo') {
    return Math.round(value).toString()
  }
  return value.toFixed(1)
}

/**
 * Get tier badge color based on hosting type
 */
export function getHostingBadgeColor(hostingType: string): string {
  switch (hostingType) {
    case 'CloudOnly':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    case 'LocalOnly':
      return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    case 'Both':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

/**
 * Get license badge color
 */
export function getLicenseBadgeColor(licenseType: string): string {
  switch (licenseType) {
    case 'OpenWeights':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'Proprietary':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'ResearchOnly':
      return 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    case 'CommercialAllowed':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Generate CSV from grid data
 */
export function generateCSV(
  models: any[],
  benchmarks: any[],
  scores: { [modelId: string]: { [benchmarkId: string]: number } }
): string {
  const headers = ['Model', 'Provider', 'Parameters', ...benchmarks.map((b) => b.name)]
  const rows = models.map((model) => {
    const row = [
      model.name,
      model.provider,
      formatParams(model.parameterCount),
      ...benchmarks.map((b) => {
        const score = scores[model.id]?.[b.id]
        return score !== undefined ? score.toFixed(2) : ''
      }),
    ]
    return row.join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, type: string = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export grid data
 */
export function exportGrid(
  models: any[],
  benchmarks: any[],
  scores: { [modelId: string]: { [benchmarkId: string]: number } },
  format: 'csv' | 'json'
) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  const filename = `benchmrk-export-${timestamp}`

  if (format === 'csv') {
    const csv = generateCSV(models, benchmarks, scores)
    downloadFile(csv, `${filename}.csv`, 'text/csv')
  } else {
    const json = JSON.stringify({ models, benchmarks, scores }, null, 2)
    downloadFile(json, `${filename}.json`, 'application/json')
  }
}
