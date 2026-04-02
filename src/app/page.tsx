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
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b10]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between px-4 md:px-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-white">Benchmrk</h1>
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Live grid
                </span>
              </div>
              <p className="mt-0.5 text-xs text-white/45">
                Compare model quality, benchmark coverage, and deployment fit in one view.
              </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
                Glass leaderboard
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[1600px] flex-1 min-h-0 flex-col px-4 pb-4 pt-3 md:px-6">
          <FilterBar />
          <FilterPanel />

          <main className="flex-1 min-h-0 pt-4">
            <GlassCard
              variant="default"
              className="flex h-full min-h-0 overflow-hidden rounded-[30px] border-white/10 bg-white/[0.04]"
            >
              <BenchmarkGrid />
            </GlassCard>
          </main>
        </div>
      </div>
    </div>
  )
}
