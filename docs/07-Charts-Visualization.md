# Charts & Score Visualization

## Score Display Modes

Toggle in toolbar — user selects how scores appear in grid cells.

| Mode | Description |
|------|-------------|
| **VALUE** | Raw number, monospace font, color-coded tier |
| **HEATMAP** | Cell background gradient (per-benchmark normalization) |
| **BARS** | Inline progress bar behind value, fills cell width |
| **SPARKLINE** | Mini SVG line chart showing score trend over time |

---

## Chart Components

### RadarChart.tsx

**Location:** Model Detail + Compare page  
**Library:** Recharts `ResponsiveContainer` + `RadarChart`

**Specs:**
- Axes: SkillAreas (Coding, Reasoning, Math, Knowledge, Vision, Agentic)
- Glass card container
- Animated polygon draw on mount
- Multi-model overlay with per-model color + 30% fill opacity
- Tooltip: glassmorphism popup on hover

---

### ScoreHistogram.tsx

**Location:** Benchmark column header popover  
**Library:** Recharts `BarChart`

**Specs:**
- Shows score distribution for that benchmark
- Animated bar grow on appear
- Cyan accent bars
- Vertical line showing selected model's position

---

### BarRaceChart.tsx

**Location:** Optional animated view mode  
**Library:** Framer Motion `layout` animations

**Specs:**
- Models sorted by selected benchmark
- Animated reorder on sort change
- 600ms ease transition between positions

---

### TrendLine.tsx

**Location:** ScoreCell sparkline mode  
**Library:** Custom SVG

**Specs:**
- Size: 60×20px, no axes
- Stroke-dashoffset draw animation on mount
- Color: green if improving, orange if declining

---

## Heatmap Color Scale

### Higher = Better (default)

| Range | Color | Hex |
|-------|-------|-----|
| 0–40% | Red | `#ef4444` |
| 40–70% | Amber | `#f59e0b` |
| 70–100% | Green | `#10b981` |

### Lower = Better

Inverted scale (green for low values, red for high)

### Normalization

- **Per-benchmark** min/max across visible models
- Ensures color distribution adapts to current filter state

### Null Scores

- Background: `#ffffff08` (transparent)
- No color applied
- Display: "--" at 20% opacity

---

## Implementation Notes

### Radar Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <RadarChart data={skillAreaScores}>
    <PolarGrid stroke="rgba(255,255,255,0.1)" />
    <PolarAngleArrow dataKey="name" />
    <Radar
      name={model.name}
      dataKey="score"
      stroke={model.color}
      fill={model.color}
      fillOpacity={0.3}
    />
    <Tooltip content={<GlassTooltip />} />
  </RadarChart>
</ResponsiveContainer>
```

### Sparkline (TrendLine)
```tsx
<svg width="60" height="20" viewBox="0 0 60 20">
  <path
    d={pathData}
    fill="none"
    stroke={trendColor}
    strokeWidth="1.5"
    style={{
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      animation: `draw 600ms ease-out forwards`
    }}
  />
</svg>
```

---

## Related Docs

- [[02-Design-Language]]
- [[06-UI-Layouts]]
- [[10-Animations-Interactions]]
