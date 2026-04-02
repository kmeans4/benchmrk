# UI Layouts

## Main Grid (BenchmarkGrid.tsx)

```
┌─────────────────────────────────────────────────┐
│  FILTER BAR (sticky top, glass panel, h-14)      │
│  [🔍 Search] [Filters ▾ (3)] [Sort ▾] [Export]  │
│  Active chips: [Coding ×] [OpenAI ×] [>70B ×]   │
└─────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────┐
│ MODEL    │  BENCHMARK COLUMNS (horizontally      │
│ (fixed   │  scrollable, sticky model col)        │
│ 220px)   │  [HumanEval][GSM8K][MMLU][MATH][BBH]  │
├──────────┼──────┬──────┬──────┬──────┬──────────┤
│ GPT-4o   │ 90.2 │ 94.1 │ 88.0 │ 76.3 │  82.5   │
│ [badge]  │ 🟢   │ 🟢   │ 🟡   │ 🟡   │  🟢     │
├──────────┼──────┴──────┴──────┴──────┴──────────┤
│ Claude.. │  ... (virtualized rows)               │
└──────────┴──────────────────────────────────────┘
```

### Grid Specs

| Element | Spec |
|---------|------|
| Left column | Sticky, 220px, model name + provider badge + param count |
| Benchmark columns | Min 90px, max 140px, resizable via drag |
| Column header | Benchmark name (truncated) + category chip + sort arrow |
| Score cell | Value (mono font) + color tier indicator + optional bar |
| Heatmap mode | Cell bg = lerp(red→yellow→green) based on normalized score |
| Empty cells | "--" with 20% opacity, no color |
| Infinite scroll | Loads 50 rows at a time, IntersectionObserver at 80% scroll |
| Sticky header | Benchmark names stay visible on vertical scroll |
| Row hover | Glass highlight + subtle glow on entire row |
| Column hover | Column highlight with top accent line in cyan |

---

## Filter Bar (Top, Sticky)

**Height:** 56px glass strip below navbar

**Layout:**
- **Left:** Search input (glass inset, icon left, 280px)
- **Center:** Filter chips for active filters (scrollable row, dismiss X)
- **Right:** [Filters button + count badge] [Sort dropdown] [View toggle] [Export]
- **Filter count badge:** Pill with active filter count, violet accent

---

## Filter Panel (Slide-Down Drawer)

**Trigger:** "Filters" button click  
**Animation:** Height 0→auto with spring, children stagger 30ms  
**Width:** Full viewport, max 1400px centered  
**Layout:** 4-column grid (desktop) → 2-col (tablet) → 1-col (mobile)

### Filter Sections (Collapsible)

| Section | Control Type |
|---------|--------------|
| Benchmarks | Checkbox list with search |
| Models | Multi-select searchable combobox |
| Category / Skill Area | Tag cloud with toggle |
| Provider | Logo grid checkboxes |
| Hosting Type | Segmented control (Cloud/Local/Both) |
| Parameter Count | Dual-handle range slider |
| Modalities | Icon toggle buttons |
| License Type | Pill toggles |
| VRAM | Single slider + "Any" toggle |
| Release Date | Quarter picker grid |
| Cost Tier | 3-option toggle |
| Score Recency | Slider 1–24 months |

**Footer:** [Clear All] [Apply (count)] sticky inside drawer

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| **≥1280px** | Full grid, side-by-side filter drawer |
| **768–1279px** | Grid with horizontal scroll, filter drawer full-width |
| **<768px** | Card view (model cards stacked), filter drawer bottom sheet |

### Mobile Card View
- Model name, provider, top 3 scores, expand button
- Optional horizontal scroll grid with frozen first column

---

## Model Detail View

**Trigger:** Click model name in grid  
**Animation:** Glass panel slides in from right (translate-x), 300ms spring

**Contents:**
- Header: model name, provider logo, release date, license badge
- Quick stats: param count, context window, cost tier chips
- Radar chart: all skill areas
- Full scores table: all benchmarks with source links
- Specs accordion: architecture, modalities, VRAM, quantization
- Provider links + leaderboard URLs
- "Add to Compare" button (adds to compareList, max 4)

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

## Related Docs

- [[02-Design-Language]]
- [[03-Component-Architecture]]
- [[07-Interaction-Patterns]]
- [[10-Animations-Interactions]]
