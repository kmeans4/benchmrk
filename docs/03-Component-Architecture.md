# Component Architecture

## File Structure

```
src/
├── app/
│   ├── page.tsx                  # Main grid view
│   ├── compare/page.tsx          # Side-by-side comparison
│   ├── model/[slug]/page.tsx     # Model detail view
│   └── layout.tsx                # Root layout, providers
├── components/
│   ├── grid/
│   │   ├── BenchmarkGrid.tsx     # Main virtualized grid
│   │   ├── GridHeader.tsx        # Sticky column headers
│   │   ├── GridRow.tsx           # Single model row
│   │   ├── ScoreCell.tsx         # Score + visual indicator
│   │   ├── HeatmapOverlay.tsx    # Color scale layer
│   │   └── SparklineCell.tsx     # Mini score trend graph
│   ├── filters/
│   │   ├── FilterBar.tsx         # Top sticky filter container
│   │   ├── FilterChip.tsx        # Active filter tag
│   │   ├── FilterPanel.tsx       # Expanded filter drawer
│   │   ├── BenchmarkFilter.tsx
│   │   ├── ModelSearchFilter.tsx
│   │   ├── ProviderFilter.tsx
│   │   ├── SizeSlider.tsx
│   │   ├── LicenseFilter.tsx
│   │   └── DateRangeFilter.tsx
│   ├── charts/
│   │   ├── RadarChart.tsx        # Model capability radar
│   │   ├── ScoreHistogram.tsx    # Score distribution
│   │   ├── BarRaceChart.tsx      # Animated benchmark bars
│   │   └── TrendLine.tsx         # Score over time
│   ├── detail/
│   │   ├── ModelDetailPanel.tsx
│   │   ├── SpecsTable.tsx
│   │   └── CompareSelector.tsx
│   └── ui/
│       ├── GlassCard.tsx         # Reusable glass container
│       ├── GlassModal.tsx
│       ├── AnimatedNumber.tsx
│       ├── Tooltip.tsx
│       └── ExportButton.tsx
├── hooks/
│   ├── useFilterState.ts
│   ├── useGridData.ts
│   ├── useSortState.ts
│   └── useVirtualGrid.ts
├── store/
│   └── benchmarkStore.ts         # Zustand store
├── lib/
│   ├── prisma.ts
│   ├── queries.ts
│   └── scoreUtils.ts
└── types/
    └── benchmark.ts
```

---

## Component Categories

### Grid Components
- **BenchmarkGrid** — Main virtualized grid container
- **GridHeader** — Sticky column headers with sort indicators
- **GridRow** — Single model row (memoized)
- **ScoreCell** — Score value + visual indicator (memoized)
- **HeatmapOverlay** — Color scale layer
- **SparklineCell** — Mini trend graph

### Filter Components
- **FilterBar** — Top sticky container with search + active chips
- **FilterChip** — Dismissible active filter tag
- **FilterPanel** — Expandable drawer with all filter controls
- **Specialized filters** — Benchmark, ModelSearch, Provider, SizeSlider, License, DateRange

### Chart Components
- **RadarChart** — Skill area radar (Recharts)
- **ScoreHistogram** — Benchmark distribution (Recharts)
- **BarRaceChart** — Animated bar reorder (Framer Motion)
- **TrendLine** — SVG sparkline

### Detail Components
- **ModelDetailPanel** — Slide-over or full page
- **SpecsTable** — Model specifications
- **CompareSelector** — Add/remove from comparison

### UI Primitives
- **GlassCard** — Reusable frosted glass container
- **GlassModal** — Modal with glass styling
- **AnimatedNumber** — Counter animation for score changes
- **Tooltip** — Glassmorphism popup
- **ExportButton** — CSV/JSON export dropdown

---

## State Management

See [[04-State-Management]] for Zustand store structure.

---

## Related Docs

- [[04-State-Management]]
- [[08-Performance]]
- [[09-API-Routes]]
