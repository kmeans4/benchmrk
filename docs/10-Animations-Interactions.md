# Animations & Interactions

## Framer Motion Configuration

### Global Transition Defaults

```typescript
// framer-motion.config.ts
export const defaultTransition = {
  duration: 0.3,
  ease: 'easeOut',
}

export const springConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
}
```

---

## Animation Catalog

### Page Transitions

**Duration:** 300ms  
**Easing:** ease-out  
**Effect:** Fade + slide

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

---

### Filter Panel Open/Close

**Animation:** Height spring  
**Children:** Staggered 30ms

```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{
    type: 'spring',
    stiffness: 400,
    damping: 30,
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ staggerChildren: 0.03 }}
  >
    {filterSections}
  </motion.div>
</motion.div>
```

---

### Grid Row Entrance

**Animation:** Staggered fade-up  
**Delay:** 20ms per row

```tsx
<AnimatePresence>
  {sortedGrid.map((model, index) => (
    <motion.div
      key={model.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        delay: index * 0.02,
        duration: 0.2,
      }}
    >
      <GridRow model={model} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

### Cell Value Changes

**Animation:** Number counter  
**Duration:** 400ms

```tsx
<AnimatedNumber
  value={score.value}
  duration={0.4}
  format={(n) => n.toFixed(1)}
/>
```

---

### Tooltip Appear

**Animation:** Scale + fade  
**Duration:** 150ms

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.15 }}
>
  {tooltipContent}
</motion.div>
```

---

### Graph Draw (SVG)

**Animation:** Stroke-dashoffset  
**Duration:** 600ms

```tsx
<motion.path
  d={pathData}
  fill="none"
  stroke={color}
  strokeWidth="2"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
/>
```

---

### Modal

**Animation:** Scale + backdrop blur-in  
**Duration:** 250ms

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.96 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.96 }}
  transition={{ duration: 0.25 }}
>
  {modalContent}
</motion.div>
```

---

### Hover States

**Animation:** Glow pulse  
**Duration:** 200ms

```tsx
<motion.div
  whileHover={{
    boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
    transition: { duration: 0.2 },
  }}
>
  {cardContent}
</motion.div>
```

---

### Column Reorder (Benchmark Sort)

**Animation:** Framer Motion `layout` prop  
**Duration:** 400ms spring

```tsx
<motion.div
  layout
  layoutId={`benchmark-${benchmark.id}`}
  transition={{
    type: 'spring',
    stiffness: 400,
    damping: 30,
  }}
>
  <GridHeader benchmark={benchmark} />
</motion.div>
```

---

### Row Reorder (Model Sort)

**Animation:** `layoutId` on each row  
**Duration:** 400ms spring

```tsx
<AnimatePresence>
  {sortedGrid.map((model) => (
    <motion.div
      key={model.id}
      layoutId={`model-row-${model.id}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        duration: 0.4,
      }}
    >
      <GridRow model={model} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

### Filter Chip Entrance

**Animation:** Scale + fade  
**Duration:** 150ms staggered

```tsx
<AnimatePresence>
  {activeFilters.map((filter, index) => (
    <motion.div
      key={filter.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        delay: index * 0.05,
        duration: 0.15,
      }}
    >
      <FilterChip filter={filter} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

### Benchmark Column Hide/Show

**Hide:** Width → 0 over 200ms  
**Show:** Width 0 → natural (spring)

```tsx
<motion.div
  layout
  style={{ width }}
  initial={{ width: 0, opacity: 0 }}
  animate={{ width: 'auto', opacity: 1 }}
  exit={{ width: 0, opacity: 0 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 25,
    duration: 0.2,
  }}
>
  <ScoreCell {...props} />
</motion.div>
```

---

## CSS Keyframes

### Animated Mesh Background

```css
@keyframes mesh-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-mesh {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(6, 182, 212, 0.15),
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 20%,
    rgba(124, 58, 237, 0.15),
    transparent 50%
  ),
  radial-gradient(
    circle at 20% 80%,
    rgba(16, 185, 129, 0.15),
    transparent 50%
  );
  background-size: 150% 150%;
  animation: mesh-shift 15s ease infinite;
  opacity: 0.3;
}
```

### Score Value Pulse (on update)

```css
@keyframes score-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.score-updated {
  animation: score-pulse 0.4s ease-out;
}
```

---

## Interaction Guidelines

### Hover States
- **Cards:** Subtle glow pulse (cyan accent)
- **Rows:** Glass highlight + glow on entire row
- **Columns:** Top accent line in cyan
- **Buttons:** Scale 1.05 + brightness increase

### Click/Press States
- **Buttons:** Scale 0.98 on press
- **Chips:** Scale 0.95 + opacity 0.8 on dismiss
- **Toggle buttons:** Spring bounce on toggle

### Loading States
- **Skeleton:** Pulsing glass panels (opacity 0.5 → 0.7)
- **Spinner:** Rotating cyan ring with blur trail
- **Progress:** Gradient bar with shimmer effect

---

## Related Docs

- [[02-Design-Language]]
- [[03-Component-Architecture]]
- [[07-Charts-Visualization]]
