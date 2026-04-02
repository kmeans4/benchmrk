'use client'

import { useEffect } from 'react'
import { useBenchmarkStore } from '@/store/benchmarkStore'
import { getSeedData } from '@/lib/seedData'

export function BenchmrkProvider({ children }: { children: React.ReactNode }) {
  const setData = useBenchmarkStore((state) => state.setData)

  useEffect(() => {
    // Load seed data on mount
    const { models, benchmarks, scores } = getSeedData()
    setData(models, benchmarks, scores)
  }, [setData])

  return <>{children}</>
}
