'use client'

import { BenchmarkGrid } from '@/components/grid/BenchmarkGrid'
import { FilterBar } from '@/components/filters/FilterBar'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { GlassCard } from '@/components/ui/GlassCard'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Animated mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] to-[#0f0f1a]" />
        <div className="absolute inset-0 opacity-30 animated-mesh" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col h-screen">
        {/* Navbar placeholder */}
        <header className="h-14 border-b border-white/10 backdrop-blur-xl bg-white/5 flex items-center px-6">
          <h1 className="text-lg font-semibold text-white">Benchmrk</h1>
          <span className="ml-2 text-xs text-white/40">AI Model Benchmark Comparison</span>
        </header>

        {/* Filter Bar */}
        <FilterBar />

        {/* Filter Panel (slide-down drawer) */}
        <FilterPanel />

        {/* Main Grid */}
        <main className="flex-1 overflow-hidden">
          <BenchmarkGrid />
        </main>
      </div>
    </div>
  )
}
