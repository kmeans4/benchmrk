# State Management — Zustand

## Store Configuration

**File:** `store/benchmarkStore.ts`  
**Middleware:** Zustand + immer (for mutable-style updates)

---

## State Shape

```typescript
interface BenchmarkStore {
  // Data
  models: Model[]
  benchmarks: Benchmark[]
  scores: ScoreMap  // { [modelId]: { [benchmarkId]: number } }
  
  // Filters
  filters: {
    benchmarkIds: string[]
    modelSearch: string
    categories: string[]
    skillAreas: string[]
    hostingTypes: HostingType[]
    paramRange: [number, number]   // billions
    providers: string[]
    modalities: Modality[]
    vramMax: number | null
    licenseTypes: LicenseType[]
    releaseDateRange: [Date, Date] | null
    scoreRecencyMonths: number | null
    evalTypes: string[]
    costTiers: string[]
    specialCaps: string[]
  }
  
  // Sort
  sort: {
    modelSortBy: 'totalScore' | 'avgScore' | 'releaseDate' | 'params' | benchmarkId
    modelSortDir: 'asc' | 'desc'
    benchmarkSortBy: 'coverage' | 'name' | 'category' | 'lastUpdated'
  }
  
  // UI
  viewMode: 'grid' | 'cards'
  activeModel: string | null
  compareList: string[]           // max 4
  isFilterPanelOpen: boolean
  scoreDisplay: 'value' | 'heatmap' | 'bars' | 'sparkline'
  pagination: { page: number; pageSize: 50 }
  
  // Actions
  setFilter: (key, value) => void
  clearFilters: () => void
  toggleCompare: (modelId) => void
  setSortModel: (by, dir) => void
  setSortBenchmark: (by) => void
}
```

---

## Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `setFilter` | `(key, value)` | Update any filter value |
| `clearFilters` | `()` | Reset entire filter state |
| `toggleCompare` | `(modelId)` | Add/remove from compare list (max 4) |
| `setSortModel` | `(by, dir)` | Set model sort field + direction |
| `setSortBenchmark` | `(by)` | Set benchmark sort field |

---

## Derived Selectors (useMemo)

| Selector | Output | Dependencies |
|----------|--------|--------------|
| `filteredModels` | `Model[]` | `[models, filters]` |
| `visibleBenchmarks` | `Benchmark[]` | `[benchmarks, filters]` |
| `sortedGrid` | `Model[]` | `[filteredModels, sort]` |
| `activeFilterCount` | `number` | `[filters]` |
| `scoreRange` | `{ [benchmarkId]: { min, max } }` | `[scores, visibleBenchmarks]` |

---

## Filter Logic

- **AND** across filter types (model must pass all active filters)
- **OR** within multi-select filters (any matching value passes)
- **Model search:** Fuzzy match on name + provider (fuse.js)
- **Param range:** Inclusive both ends, "Any" = full range
- **Score recency:** Filter benchmarks by `lastUpdated`, hide columns if outside range
- **Empty state:** Show when no models pass filters + "Clear Filters" CTA

---

## URL Sync

- `useSearchParams` syncs filter state to URL query string
- Enables shareable filtered views
- Debounce URL writes 300ms to avoid history spam

---

## Related Docs

- [[03-Component-Architecture]]
- [[07-Interaction-Patterns]]
- [[08-Performance]]
