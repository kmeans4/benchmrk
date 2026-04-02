# Benchmrk Documentation Index

## 📚 Documentation Overview

Complete design and architecture specification for the Benchmrk AI model benchmark comparison UI.

**Last updated:** 2026-04-02  
**Status:** Ready for implementation

---

## 📖 Document Map

### Foundation
- [[01-Project-Overview]] — Goals, stack, priorities, open questions
- [[05-Data-Model]] — Prisma schema, tables, indexes, current data state

### Design
- [[02-Design-Language]] — Glassmorphism specs, colors, typography, animation system
- [[06-UI-Layouts]] — Grid layout, filter bar, responsive breakpoints, detail views

### Architecture
- [[03-Component-Architecture]] — File structure, component categories, state management
- [[04-State-Management]] — Zustand store shape, actions, selectors, filter logic
- [[09-API-Routes]] — Endpoints, Prisma queries, rate limiting, error handling

### Features
- [[07-Charts-Visualization]] — Score display modes, chart components, heatmap colors
- [[08-Interaction-Patterns]] — Filter→grid flow, sorting, URL sync, export

### Performance
- [[08-Performance]] — Virtualization, memoization, data fetching, query optimization
- [[10-Animations-Interactions]] — Framer Motion catalog, CSS keyframes, interaction guidelines

---

## 🚀 Quick Start

### For Designers
Start here:
1. [[02-Design-Language]] — Visual style guide
2. [[06-UI-Layouts]] — Screen layouts and responsive behavior
3. [[10-Animations-Interactions]] — Motion specs

### For Developers
Start here:
1. [[03-Component-Architecture]] — File structure
2. [[04-State-Management]] — State shape and actions
3. [[05-Data-Model]] — Database schema
4. [[09-API-Routes]] — API endpoints

### For Full-Stack Implementation
Recommended order:
1. [[01-Project-Overview]]
2. [[05-Data-Model]]
3. [[03-Component-Architecture]]
4. [[04-State-Management]]
5. [[06-UI-Layouts]]
6. [[07-Charts-Visualization]]
7. [[08-Interaction-Patterns]]
8. [[08-Performance]]
9. [[10-Animations-Interactions]]
10. [[09-API-Routes]]

---

## 🏗️ Implementation Phases

### Phase 1: Setup
- [ ] Initialize Next.js 16 + TypeScript + Tailwind 4
- [ ] Configure Prisma 7 with Neon adapter
- [ ] Set up Zustand store
- [ ] Create base layout + glassmorphism theme

### Phase 2: Core Grid
- [ ] Build BenchmarkGrid with virtualization
- [ ] Implement GridRow + ScoreCell components
- [ ] Add sticky header + horizontal scroll
- [ ] Wire up data fetching

### Phase 3: Filters
- [ ] Build FilterBar with active chips
- [ ] Implement FilterPanel drawer
- [ ] Add all filter controls (15 types)
- [ ] Connect to Zustand store
- [ ] Add URL sync

### Phase 4: Charts & Visualization
- [ ] Implement score display modes (value/heatmap/bars/sparkline)
- [ ] Build RadarChart + ScoreHistogram
- [ ] Add TrendLine sparklines
- [ ] Configure heatmap color scales

### Phase 5: Detail Views
- [ ] Build ModelDetailPanel (slide-over)
- [ ] Create /compare page
- [ ] Add radar chart overlay
- [ ] Implement diff highlighting

### Phase 6: Polish
- [ ] Add all Framer Motion animations
- [ ] Implement responsive card view (mobile)
- [ ] Add export functionality
- [ ] Performance optimization pass

---

## 📊 Current Data State

| Entity | Count | Source |
|--------|-------|--------|
| Models | 112 | 14 seeded + 100 from Hugging Face |
| Benchmarks | 10 | Seeded |
| Scores | 12 | Seeded |
| Skill Areas | 8 | Seeded |
| Categories | 14 | Seeded |
| Sources | 8 | Seeded |

---

## 🔗 External Resources

- **Neon Console:** https://console.neon.tech
- **Prisma Docs:** https://www.prisma.io/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Recharts:** https://recharts.org
- **TanStack Virtual:** https://tanstack.com/virtual

---

## 📝 Notes

- All filter state syncs to URL for shareable views
- Client-side filtering for ≤500 models (no refetch on filter change)
- Virtualization essential for performance (100+ models × 50+ benchmarks)
- Glassmorphism theme requires backdrop-filter support (modern browsers only)

---

## Related

- [[01-Project-Overview]]
- [[README]](../README.md)
- [[AGENTS.md]](../AGENTS.md)
