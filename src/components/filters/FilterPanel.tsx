'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { selectActiveFilterCount, useBenchmarkStore } from '@/store/benchmarkStore'
import { HostingType, LicenseType, Modality } from '@/types/benchmark'

const HOSTING_OPTIONS: HostingType[] = ['CloudOnly', 'LocalOnly', 'Both']
const LICENSE_OPTIONS: LicenseType[] = [
  'OpenWeights',
  'Proprietary',
  'ResearchOnly',
  'CommercialAllowed',
]
const MODALITY_OPTIONS: Modality[] = ['Text', 'Code', 'Image', 'Audio', 'Video']

function formatHostingType(type: HostingType) {
  if (type === 'CloudOnly') return 'Cloud'
  if (type === 'LocalOnly') return 'Local'
  return 'Hybrid'
}

function formatLicenseType(type: LicenseType) {
  if (type === 'OpenWeights') return 'Open weights'
  if (type === 'CommercialAllowed') return 'Commercial'
  return type.replace(/([A-Z])/g, ' $1').trim()
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4 space-y-1.5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs leading-5 text-white/45">{description}</p>
    </div>
  )
}

export function FilterPanel() {
  const {
    models,
    benchmarks,
    filters,
    setFilter,
    clearFilters,
    toggleFilterPanel,
    isFilterPanelOpen,
  } = useBenchmarkStore()

  const [benchmarkSearch, setBenchmarkSearch] = useState('')

  const providers = useMemo(
    () => Array.from(new Set(models.map((model) => model.provider))).sort((a, b) => a.localeCompare(b)),
    [models]
  )

  const categories = useMemo(
    () => Array.from(new Set(benchmarks.map((benchmark) => benchmark.category))).sort((a, b) => a.localeCompare(b)),
    [benchmarks]
  )

  const skillAreas = useMemo(
    () =>
      Array.from(new Set(benchmarks.map((benchmark) => benchmark.skillAreaName))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [benchmarks]
  )

  const filteredBenchmarks = useMemo(() => {
    const normalizedSearch = benchmarkSearch.trim().toLowerCase()

    if (!normalizedSearch) {
      return benchmarks
    }

    return benchmarks.filter((benchmark) => {
      return (
        benchmark.name.toLowerCase().includes(normalizedSearch) ||
        benchmark.category.toLowerCase().includes(normalizedSearch) ||
        benchmark.skillAreaName.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [benchmarkSearch, benchmarks])

  const activeFilterCount = selectActiveFilterCount(filters)

  const updateParamMin = (nextMin: number) => {
    setFilter('paramRange', [Math.min(nextMin, filters.paramRange[1]), filters.paramRange[1]])
  }

  const updateParamMax = (nextMax: number) => {
    setFilter('paramRange', [filters.paramRange[0], Math.max(nextMax, filters.paramRange[0])])
  }

  const handleClearAll = () => {
    clearFilters()
    setBenchmarkSearch('')
  }

  return (
    <AnimatePresence initial={false}>
      {isFilterPanelOpen && (
        <motion.section
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative z-30 mt-3 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.04)_100%)] shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="max-h-[68vh] overflow-y-auto px-3 py-3 md:px-5 md:py-5"
          >
            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              <GlassCard className="rounded-[24px] border-white/10 bg-white/[0.04] p-4 md:p-5" hover>
                <SectionTitle
                  title="Benchmarks"
                  description="Filter visible benchmark columns by benchmark, category, or skill area."
                />

                <input
                  type="text"
                  value={benchmarkSearch}
                  onChange={(event) => setBenchmarkSearch(event.target.value)}
                  placeholder="Search benchmarks"
                  className="mb-3 h-10 w-full rounded-[14px] border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:border-cyan-500/45"
                />

                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {filteredBenchmarks.map((benchmark) => {
                    const isActive = filters.benchmarkIds.includes(benchmark.id)

                    return (
                      <button
                        key={benchmark.id}
                        type="button"
                        onClick={() =>
                          setFilter(
                            'benchmarkIds',
                            isActive
                              ? filters.benchmarkIds.filter((id) => id !== benchmark.id)
                              : [...filters.benchmarkIds, benchmark.id]
                          )
                        }
                        className={cn(
                          'flex w-full items-center justify-between rounded-[16px] border px-3 py-2.5 text-left active:scale-[0.99]',
                          isActive
                            ? 'border-cyan-500/40 bg-cyan-500/12 text-cyan-100 shadow-[0_10px_22px_rgba(6,182,212,0.08)]'
                            : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                        )}
                      >
                        <span className="min-w-0 pr-3 text-sm">
                          <span className="block truncate font-medium">{benchmark.name}</span>
                          <span className="block truncate text-xs text-white/40">
                            {benchmark.category} · {benchmark.skillAreaName}
                          </span>
                        </span>
                        <span className="text-xs text-white/40">{isActive ? '✓' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              </GlassCard>

              <GlassCard className="rounded-[24px] border-white/10 bg-white/[0.04] p-4 md:p-5" hover>
                <SectionTitle
                  title="Categories & domains"
                  description="Keep filters grouped by benchmark taxonomy so the grid remains predictable."
                />

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const isActive = filters.categories.includes(category)

                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() =>
                              setFilter(
                                'categories',
                                isActive
                                  ? filters.categories.filter((value) => value !== category)
                                  : [...filters.categories, category]
                              )
                            }
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs font-medium active:scale-[0.98]',
                              isActive
                                ? 'border-violet-500/40 bg-violet-500/15 text-violet-100 shadow-[0_8px_18px_rgba(124,58,237,0.14)]'
                                : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                            )}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Domains
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skillAreas.map((skillArea) => {
                        const isActive = filters.skillAreas.includes(skillArea)

                        return (
                          <button
                            key={skillArea}
                            type="button"
                            onClick={() =>
                              setFilter(
                                'skillAreas',
                                isActive
                                  ? filters.skillAreas.filter((value) => value !== skillArea)
                                  : [...filters.skillAreas, skillArea]
                              )
                            }
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs font-medium active:scale-[0.98]',
                              isActive
                                ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-100 shadow-[0_8px_18px_rgba(6,182,212,0.14)]'
                                : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                            )}
                          >
                            {skillArea}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="rounded-[24px] border-white/10 bg-white/[0.04] p-4 md:p-5" hover>
                <SectionTitle
                  title="Providers & hosting"
                  description="Compare cloud, local, and hybrid models without losing provider context."
                />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {providers.map((provider) => {
                      const isActive = filters.providers.includes(provider)

                      return (
                        <button
                          key={provider}
                          type="button"
                          onClick={() =>
                            setFilter(
                              'providers',
                              isActive
                                ? filters.providers.filter((value) => value !== provider)
                                : [...filters.providers, provider]
                            )
                          }
                          className={cn(
                            'rounded-[16px] border px-3 py-2.5 text-left text-sm active:scale-[0.99]',
                            isActive
                              ? 'border-emerald-500/40 bg-emerald-500/12 text-emerald-100 shadow-[0_10px_22px_rgba(16,185,129,0.08)]'
                              : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                          )}
                        >
                          {provider}
                        </button>
                      )
                    })}
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Hosting type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {HOSTING_OPTIONS.map((hostingType) => {
                        const isActive = filters.hostingTypes.includes(hostingType)

                        return (
                          <button
                            key={hostingType}
                            type="button"
                            onClick={() =>
                              setFilter(
                                'hostingTypes',
                                isActive
                                  ? filters.hostingTypes.filter((value) => value !== hostingType)
                                  : [...filters.hostingTypes, hostingType]
                              )
                            }
                            className={cn(
                              'rounded-[14px] border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] active:scale-[0.98]',
                              isActive
                                ? 'border-cyan-500/40 bg-cyan-500/12 text-cyan-100 shadow-[0_8px_18px_rgba(6,182,212,0.14)]'
                                : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                            )}
                          >
                            {formatHostingType(hostingType)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="rounded-[24px] border-white/10 bg-white/[0.04] p-4 md:p-5" hover>
                <SectionTitle
                  title="Capabilities"
                  description="Use parameter, modality, and license filters to narrow the model set."
                />

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Modalities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MODALITY_OPTIONS.map((modality) => {
                        const isActive = filters.modalities.includes(modality)

                        return (
                          <button
                            key={modality}
                            type="button"
                            onClick={() =>
                              setFilter(
                                'modalities',
                                isActive
                                  ? filters.modalities.filter((value) => value !== modality)
                                  : [...filters.modalities, modality]
                              )
                            }
                            className={cn(
                              'rounded-[14px] border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] active:scale-[0.98]',
                              isActive
                                ? 'border-violet-500/40 bg-violet-500/15 text-violet-100 shadow-[0_8px_18px_rgba(124,58,237,0.14)]'
                                : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                            )}
                          >
                            {modality}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      License
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {LICENSE_OPTIONS.map((licenseType) => {
                        const isActive = filters.licenseTypes.includes(licenseType)

                        return (
                          <button
                            key={licenseType}
                            type="button"
                            onClick={() =>
                              setFilter(
                                'licenseTypes',
                                isActive
                                  ? filters.licenseTypes.filter((value) => value !== licenseType)
                                  : [...filters.licenseTypes, licenseType]
                              )
                            }
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs font-medium active:scale-[0.98]',
                              isActive
                                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100 shadow-[0_8px_18px_rgba(16,185,129,0.14)]'
                                : 'border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                            )}
                          >
                            {formatLicenseType(licenseType)}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Parameter count
                    </p>
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <div className="mb-3 flex items-center justify-between text-sm text-white/75">
                        <span>{filters.paramRange[0]}B min</span>
                        <span>{filters.paramRange[1]}B max</span>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={filters.paramRange[0]}
                          onChange={(event) => updateParamMin(Number(event.target.value))}
                          className="w-full accent-cyan-500"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={filters.paramRange[1]}
                          onChange={(event) => updateParamMax(Number(event.target.value))}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          <div className="sticky bottom-0 flex items-center justify-between border-t border-white/10 bg-[#0b0b10]/90 px-4 py-4 shadow-[0_-12px_28px_rgba(5,7,12,0.26)] backdrop-blur-xl md:px-6">
            <p className="text-sm text-white/45">
              {activeFilterCount === 0
                ? 'No filters applied'
                : `${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}`}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex h-10 items-center rounded-[14px] px-4 text-sm text-white/60 active:scale-[0.98] hover:text-white"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => toggleFilterPanel(false)}
                className="inline-flex h-10 items-center rounded-[14px] border border-cyan-500/40 bg-cyan-500/18 px-5 text-sm font-medium text-cyan-100 shadow-[0_10px_24px_rgba(6,182,212,0.16)] active:scale-[0.98] hover:border-cyan-400/60 hover:bg-cyan-500/25"
              >
                Apply{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
