# Design Language — Detailed Glassmorphism

## Visual Style

### Frosted Glass Panels
- **Backdrop blur:** `backdrop-blur-xl`
- **Background:** `bg-white/5` to `bg-white/10`
- **Border:** `1px solid rgba(255,255,255,0.12)`
- **Shadow:** `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`

### Layered Depth (3 Z-Levels)
1. **Background** — Base gradient layer
2. **Panel** — Glass cards and UI surfaces
3. **Modal** — Overlays and popups

### Background
- **Gradient:** `#0a0a0f` → `#0f0f1a`
- **Animated mesh:** CSS `@keyframes` shifting radial gradients at 0.3 opacity

### Accent Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#06b6d4` | Primary accents, sort indicators |
| Violet | `#7c3aed` | Filter badges, secondary actions |
| Emerald | `#10b981` | High scores, success states |

### Typography
- **UI:** Inter (system font stack)
- **Scores/Numbers:** JetBrains Mono

---

## Animation System (Framer Motion)

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
| Page transitions | 300ms | ease-out | Fade + slide |
| Filter panel open/close | auto | spring | Height animation, staggered children |
| Grid row entrance | 20ms delay/row | ease-out | Staggered fade-up |
| Cell value changes | 400ms | ease-out | Number counter animation |
| Tooltip appear | 150ms | ease-out | Scale(0.95→1) + fade |
| Graph draw | 600ms | ease-out | SVG stroke-dashoffset |
| Modal | 250ms | ease-out | Scale(0.96→1) + backdrop blur-in |
| Hover states | 200ms | ease | Glow pulse on glass cards |

---

## Score Tier Colors (Heatmap)

**Higher = Better:**
- 0–40%: `#ef4444` (red)
- 40–70%: `#f59e0b` (amber)
- 70–100%: `#10b981` (green)

**Lower = Better:** Inverted scale

**Null scores:** `#ffffff08` background, no color

---

## Related Docs

- [[06-UI-Layouts]]
- [[07-Charts-Visualization]]
- [[10-Animations-Interactions]]
