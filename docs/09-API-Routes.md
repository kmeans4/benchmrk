# API Routes

## Base Path

All routes under `/api/`

---

## Endpoints

### GET /api/grid

**Purpose:** Fetch initial grid data (models + benchmarks + scores)

**Query Params:**
- `page` (optional, default 1)
- `pageSize` (optional, default 50)
- `filters` (optional, JSON string)

**Response:**
```typescript
{
  models: Model[],
  benchmarks: Benchmark[],
  scoreMap: { [modelId]: { [benchmarkId]: number } },
  hasMore: boolean,
  total: number
}
```

**Caching:** SWR, 5min stale time, revalidate on focus

---

### GET /api/models/[slug]

**Purpose:** Fetch single model detail

**Response:**
```typescript
{
  model: Model,
  scores: Score[],
  skillAreaAverages: { [skillArea]: number },
  relatedModels: Model[]
}
```

---

### GET /api/compare

**Query Params:**
- `models` (comma-separated model IDs)

**Response:**
```typescript
{
  models: Model[],
  scores: { [modelId]: { [benchmarkId]: number } },
  skillAreaRadar: { [modelId]: { [skillArea]: number } },
  bestPerModel: { [benchmarkId]: { modelId, value } }
}
```

---

### POST /api/export

**Purpose:** Generate CSV/JSON export

**Body:**
```typescript
{
  format: 'csv' | 'json',
  modelIds: string[],
  benchmarkIds: string[],
  includeSpecs: boolean
}
```

**Response:** File download (attachment)

---

## Prisma Query Patterns

### Grid Data (Denormalized)

```typescript
// Fetch models with aggregates
const models = await prisma.model.findMany({
  where: { ...filters },
  include: {
    scores: {
      select: {
        benchmarkId: true,
        value: true,
      },
    },
  },
  orderBy: {
    scores: {
      _avg: 'desc',
    },
  },
  take: pageSize,
  skip: (page - 1) * pageSize,
})

// Normalize to ScoreMap
const scoreMap = models.reduce((acc, model) => {
  acc[model.id] = {}
  model.scores.forEach(score => {
    acc[model.id][score.benchmarkId] = score.value
  })
  return acc
}, {})
```

### Benchmark Coverage

```typescript
const benchmarks = await prisma.benchmark.findMany({
  include: {
    scores: {
      select: {
        modelId: true,
      },
    },
  },
})

// Sort by coverage (modelCount)
benchmarks.sort((a, b) => b.scores.length - a.scores.length)
```

### Score Aggregates

```typescript
const aggregates = await prisma.score.groupBy({
  by: ['modelId'],
  _avg: { value: true },
  _sum: { value: true },
  _count: { value: true },
  where: {
    benchmarkId: { in: visibleBenchmarkIds },
  },
})
```

---

## Rate Limiting

**Default:** 100 requests / minute per IP

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696234567
```

**429 Response:**
```typescript
{
  error: 'Rate limit exceeded',
  retryAfter: 45
}
```

---

## Error Handling

### Standard Error Response

```typescript
{
  error: {
    code: 'NOT_FOUND',
    message: 'Model not found',
    details?: any
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_INPUT` | 400 | Validation error |
| `RATE_LIMITED` | 429 | Too many requests |
| `DATABASE_ERROR` | 500 | Prisma/Neon error |
| `INTERNAL_ERROR` | 500 | Unexpected error |

---

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Related Docs

- [[05-Data-Model]]
- [[08-Performance]]
- [[09-API-Routes]]
