'use client'

import { FilterBar } from '@/components/filters/FilterBar'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { BenchmarkGrid } from '@/components/grid/BenchmarkGrid'
import { GlassCard } from '@/components/ui/GlassCard'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.16),transparent_30%),linear-gradient(180deg,#0a0a0f_0%,#0f0f1a_100%)]" />
        <div className="absolute inset-0 animated-mesh opacity-30" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b10]/82 text-center shadow-[0_12px_36px_rgba(0,0,0,0.3)] backdrop-blur-xl md:text-left">
          <div className="mx-auto grid min-h-[var(--layout-nav-height)] w-full max-w-[var(--layout-shell-max)] grid-cols-1 items-center gap-3 px-[var(--layout-page-gutter)] pb-6 pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-4 md:py-3.5">
            <div className="min-w-0">
              <div className="logo-wrapper flex flex-col items-center gap-2 sm:flex-row sm:justify-center md:justify-start md:gap-2.5">
                <h1 className="text-[2rem] font-semibold tracking-[-0.02em] text-white md:text-[1.2rem] md:tracking-normal">Benchmrk</h1>
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Live grid
                </span>
              </div>
              <p className="mx-auto mt-2 max-w-[90%] text-[0.95rem] leading-[1.4] text-white/48 md:mx-0 md:mt-1.5 md:max-w-[46rem] md:pr-1 md:text-[13px] md:leading-6">
                Compare model quality, benchmark coverage, and deployment fit in one coherent view.
              </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                Glass leaderboard
              </span>
            </div>
          </div>
        </header>

        <div className="main-wrapper mx-auto flex min-h-0 w-full max-w-[var(--layout-shell-max)] flex-1 flex-col gap-[var(--layout-section-gap)] px-[var(--layout-page-gutter)] pb-8 pt-6 md:pb-10 md:pt-8 lg:pt-10">
          <FilterBar />
          <FilterPanel />

          <main className="flex min-w-0">
            <GlassCard
              variant="default"
              className="w-full overflow-hidden rounded-[32px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.035)_100%)] p-[var(--layout-shell-padding)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] md:rounded-[36px]"
            >
              <BenchmarkGrid />
            </GlassCard>
          </main>
        </div>
      </div>
    </div>
  )
}
