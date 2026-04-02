'use client'

import { motion } from 'framer-motion'
import { useBenchmarkStore } from '@/store/benchmarkStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { HostingType, LicenseType, Modality } from '@/types/benchmark'

const HOSTING_OPTIONS: HostingType[] = ['CloudOnly', 'LocalOnly', 'Both']
const LICENSE_OPTIONS: LicenseType[] = ['OpenWeights', 'Proprietary', 'ResearchOnly', 'CommercialAllowed']
const MODALITY_OPTIONS: Modality[] = ['Text', 'Image', 'Audio', 'Video', 'Code']

const SKILL_AREAS = ['Coding', 'Reasoning', 'Knowledge', 'Math', 'Language', 'Creative', 'Vision', 'Agentic']

export function FilterPanel() {
  const { filters, setFilter, isFilterPanelOpen, toggleFilterPanel } = useBenchmarkStore()

  if (!isFilterPanelOpen) return null

  const handleHostingToggle = (type: HostingType) => {
    const current = filters.hostingTypes
    const exists = current.includes(type)
    setFilter('hostingTypes', exists ? current.filter((t) => t !== type) : [...current, type])
  }

  const handleLicenseToggle = (type: LicenseType) => {
    const current = filters.licenseTypes
    const exists = current.includes(type)
    setFilter('licenseTypes', exists ? current.filter((t) => t !== type) : [...current, type])
  }

  const handleModalityToggle = (modality: Modality) => {
    const current = filters.modalities
    const exists = current.includes(modality)
    setFilter('modalities', exists ? current.filter((m) => m !== modality) : [...current, modality])
  }

  const handleParamRangeChange = (min: number, max: number) => {
    setFilter('paramRange', [min, max])
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.03 }}
        >
          {/* Hosting Type */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <h3 className="text-sm font-medium text-white/80 mb-3">Hosting Type</h3>
            <div className="flex gap-2">
              {HOSTING_OPTIONS.map((type) => (
                <button
                  key={type}
                  onClick={() => handleHostingToggle(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                    filters.hostingTypes.includes(type)
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  )}
                >
                  {type === 'CloudOnly' ? 'Cloud' : type === 'LocalOnly' ? 'Local' : 'Both'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* License Type */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
            <h3 className="text-sm font-medium text-white/80 mb-3">License</h3>
            <div className="flex flex-wrap gap-2">
              {LICENSE_OPTIONS.map((type) => (
                <button
                  key={type}
                  onClick={() => handleLicenseToggle(type)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs border transition-colors',
                    filters.licenseTypes.includes(type)
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  )}
                >
                  {type === 'OpenWeights' ? 'Open Weights' : type === 'Proprietary' ? 'Proprietary' : type.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Modalities */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <h3 className="text-sm font-medium text-white/80 mb-3">Modalities</h3>
            <div className="flex flex-wrap gap-2">
              {MODALITY_OPTIONS.map((modality) => (
                <button
                  key={modality}
                  onClick={() => handleModalityToggle(modality)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm border transition-colors',
                    filters.modalities.includes(modality)
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  )}
                >
                  {modality}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Parameter Range */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
            <h3 className="text-sm font-medium text-white/80 mb-3">
              Parameters: {filters.paramRange[0]}B - {filters.paramRange[1]}B
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.paramRange[0]}
                onChange={(e) => handleParamRangeChange(Number(e.target.value), filters.paramRange[1])}
                className="w-full accent-cyan-500"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.paramRange[1]}
                onChange={(e) => handleParamRangeChange(filters.paramRange[0], Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </motion.div>

          {/* Skill Areas */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <h3 className="text-sm font-medium text-white/80 mb-3">Domains</h3>
            <div className="flex flex-wrap gap-2">
              {SKILL_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setFilter('skillAreas', filters.skillAreas.includes(area) ? filters.skillAreas.filter((a) => a !== area) : [...filters.skillAreas, area])}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs border transition-colors',
                    filters.skillAreas.includes(area)
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  )}
                >
                  {area}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setFilter('hostingTypes', [])}
            className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={() => toggleFilterPanel(false)}
            className="px-6 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/50 hover:bg-cyan-500/30 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  )
}
