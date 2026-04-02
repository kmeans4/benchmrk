# Project Overview — Benchmrk

## Project Goal

Build a **sortable, filterable benchmark comparison site for AI models**. Users can explore model performance across multiple benchmarks, filter by capabilities/deployment type/size, and compare models side-by-side.

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Database:** Neon PostgreSQL (serverless)
- **ORM:** Prisma 7 (with Neon adapter)
- **State:** Zustand + immer middleware
- **Charts:** Recharts + custom SVG
- **Animations:** Framer Motion
- **Virtualization:** @tanstack/react-virtual
- **Deployment:** Vercel (TBD)

---

## Design Priorities

1. **Performance** — Handle 100+ models × 50+ benchmarks without lag
2. **Clarity** — Dense data should still be scannable
3. **Flexibility** — Users build custom views via filters
4. **Mobile-friendly** — Responsive grid or card view on small screens
5. **Export** — Allow CSV/JSON export of filtered results

---

## Open Questions for Design

1. **Grid vs Cards** — Should mobile use a card layout, or horizontal-scroll grid?
2. **Score visualization** — Heatmap colors? Progress bars? Sparklines?
3. **Filter UI** — Left sidebar vs top bar vs modal drawers?
4. **Default view** — Show all models/benchmarks or start with curated subset?
5. **Comparison mode** — Sticky sidebar, modal, or separate page?
6. **Pagination vs infinite scroll** — Best for this data density?

---

## Related Docs

- [[02-Design-Language]]
- [[03-Component-Architecture]]
- [[04-State-Management]]
- [[05-Data-Model]]
