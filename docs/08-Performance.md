# Performance Optimizations

## Virtualization (useVirtualGrid.ts)

**Library:** `@tanstack/react-virtual` (row + column virtualization)

| Setting | Value |
|---------|-------|
| Row overscan | 10 rows above/below viewport |
| Column overscan | 3 columns each side |
| Estimated row height | 52px (fixed for perf) |
| Scroll container | CSS `overflow-auto` on grid wrapper |
| Infinite scroll | IntersectionObserver at 80% scroll depth → fetch next 50 models |
| Pagination state | `{ page, pageSize: 50, hasMore }` |

---

## Memoization Strategy

| Component | Strategy | Re-render Trigger |
|-----------|----------|-------------------|
| `BenchmarkGrid` | `React.memo` | When `sortedGrid` changes |
| `GridRow` | `React.memo` + custom comparator | `modelId` + visible scores change |
| `ScoreCell` | `React.memo` | `modelId` + `benchmarkId` + `value` + `displayMode` |
| Filter selectors | `useMemo` | Precise dependency arrays |
| `scoreRange` map | `useMemo` | When `scores` or `visibleBenchmarks` change |
| Fuzzy search | `useDeferredValue` | On `modelSearch` input |

---

## Data Fetching

### Initial Load
- **Method:** SSR via Next.js
- **Data:** First 50 models + all benchmarks + scores

### Subsequent Pages
- **Method:** SWR infinite
- **Endpoint:** `/api/models?page=N&filters=...`

### Filter Changes
- **Method:** Client-side only
- **Assumption:** No extra fetches for ≤500 models (all data preloaded)

### Score Data
- **Fetch:** Once on initial load
- **Storage:** Zustand store, normalized to `ScoreMap`
- **Strategy:** Stale-while-revalidate (SWR revalidates on focus)

### Prisma Query Strategy
- Include only visible benchmark score columns in SELECT
- Never `SELECT *` on Score table

---

## Query Optimization (Prisma/Neon)

### Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| Score | `[modelId, benchmarkId]` | Compound lookup |
| Score | `[benchmarkId, scoreDate]` | Recency filter |

### Query Patterns

```prisma
// Lean select - only needed fields
const scores = await prisma.score.findMany({
  select: {
    modelId: true,
    benchmarkId: true,
    value: true,
  },
  where: {
    benchmarkId: { in: visibleBenchmarkIds },
  },
})

// Server-side aggregates
const aggregates = await prisma.score.groupBy({
  by: ['modelId'],
  _avg: { value: true },
  _sum: { value: true },
  where: { ... },
})
```

### Connection Pooling
- Neon serverless adapter with PgBouncer
- Prevents connection exhaustion under load

### API Route: `/api/grid`

**Returns:** Denormalized `{ models[], scoreMap{} }` in one query

**Benefits:**
- Single round-trip
- Reduced payload size
- Client-side filtering/sorting (no server calls on filter change)

### Caching Strategy
- **Benchmark metadata:** Cached in-memory (rarely changes)
- **Score aggregates:** Computed server-side via Prisma `groupBy`
- **Model list:** SWR with 5min stale time

---

## Component Performance Checklist

- [ ] All grid components use `React.memo`
- [ ] Custom comparators for memoized components
- [ ] `useMemo` for derived state (filteredModels, sortedGrid, scoreRange)
- [ ] `useDeferredValue` for search input
- [ ] Virtualized grid with fixed row height
- [ ] IntersectionObserver for infinite scroll
- [ ] Debounced URL sync (300ms)
- [ ] SWR for data fetching with stale-while-revalidate
- [ ] Lean Prisma selects (no `SELECT *`)
- [ ] Compound indexes on Score table

---

## Related Docs

- [[03-Component-Architecture]]
- [[04-State-Management]]
- [[09-API-Routes]]
