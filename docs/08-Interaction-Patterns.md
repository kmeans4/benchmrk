# Interaction Patterns

## Filter → Grid Update Flow

```
1. User interacts with any filter control
2. setFilter(key, value) dispatches to Zustand store (immer mutation, <1ms)
3. filteredModels selector recomputes (useMemo, deps: [models, filters])
4. sortedGrid selector recomputes (useMemo, deps: [filteredModels, sort])
5. BenchmarkGrid receives new data prop
6. Virtualized list re-renders only visible rows
7. Framer Motion AnimatePresence handles row exit/enter animations
```

---

## Filter Logic

| Filter Type | Logic | Notes |
|-------------|-------|-------|
| Across types | **AND** | Model must pass all active filters |
| Within multi-select | **OR** | Any matching value passes |
| Model search | Fuzzy | fuse.js on name + provider |
| Param range | Inclusive | Both ends, "Any" = full range |
| Score recency | Date filter | Filter benchmarks by `lastUpdated`, hide columns outside range |
| Empty state | CTA | Show when no models pass + "Clear Filters" button |

---

## Benchmark Column Visibility

| Action | Animation |
|--------|-----------|
| Hide benchmark | Width → 0 over 200ms |
| Show benchmark | Width 0 → natural (spring) |
| Reorder on sort | Framer Motion `layout` prop |

---

## Active Filter Chips (FilterBar)

**Render:** Each active filter → chip with label + × button

**Interactions:**
- **Dismiss (×):** Removes that filter value, triggers recompute
- **Clear All:** Resets entire filter state
- **Entrance animation:** Scale + fade 150ms, staggered per chip

---

## URL Sync

- **Hook:** `useSearchParams` syncs filter state to URL query string
- **Purpose:** Enables shareable filtered views
- **Debounce:** 300ms to avoid history spam

**Example URL:**
```
/?benchmark=humaneval,gsm8k&provider=openai,anthropic&params=70-100&sort=avgScore
```

---

## Sorting Behavior

### Model Sort (Rows)

| Click | Behavior |
|-------|----------|
| Default | avgScore DESC (top performers first) |
| Click benchmark column | Sort by that benchmark DESC |
| Click again | ASC |
| Click again | Back to avgScore |

**Sort indicator:** Animated arrow icon in column header, cyan color  
**Reorder animation:** Framer Motion `layoutId` on each row, 400ms spring

### Benchmark Sort (Columns)

| Option | Default |
|--------|---------|
| Coverage | DESC (most scores shown first) |
| Name | A-Z |
| Category | Alphabetical |
| Last Updated | DESC |

**Column reorder:** Animates with Framer Motion `layout`

---

## Model Detail View

**Trigger:** Click model name in grid  
**Animation:** Glass panel slides in from right (translate-x), 300ms spring

**Contents:**
1. Header: model name, provider logo, release date, license badge
2. Quick stats: param count, context window, cost tier chips
3. Radar chart: all skill areas
4. Full scores table: all benchmarks with source links
5. Specs accordion: architecture, modalities, VRAM, quantization
6. Provider links + leaderboard URLs
7. "Add to Compare" button (adds to compareList, max 4)

---

## Comparison Page (/compare)

**Access:** "Compare (N)" button in navbar when compareList has items

**Layout:**
- Fixed left column labels
- Model columns side by side
- Sticky model header row with remove button
- Radar chart overlay (all models same chart, different colors)
- Diff highlighting: best value per row highlighted green
- Share button: encodes model IDs in URL

---

## Export (ExportButton.tsx)

**Dropdown options:** [CSV] [JSON]

**Behavior:**
- Exports currently filtered + sorted grid data
- Filename: `benchmrk-export-{timestamp}.csv`

---

## Related Docs

- [[04-State-Management]]
- [[06-UI-Layouts]]
- [[08-Performance]]
- [[10-Animations-Interactions]]
