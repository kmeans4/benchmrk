# Data Model

## Database

**Provider:** Neon PostgreSQL (serverless)  
**ORM:** Prisma 7 with Neon adapter  
**Connection:** WebSocket via `@prisma/adapter-neon` + `ws`

---

## Core Tables

### Model

```prisma
model Model {
  id                String   @id @default(cuid())
  name              String   @unique
  provider          String
  releaseDate       DateTime?
  contextWindow     Int?
  parameterCount    BigInt?
  licenseType       LicenseType
  hostingType       HostingType
  modalities        Modality[]
  hardwareRequirements String?
  knowledgeCutoff   DateTime?
  architecture      String?
  trainingDataSource String?
  inferenceCostPer1M String?
  quantizationOptions String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  scores            Score[]
  categories        Category[]
  skillAreas        SkillArea[]

  @@index([name])
  @@index([provider])
  @@index([licenseType])
  @@index([hostingType])
}
```

### Benchmark

```prisma
model Benchmark {
  id                String   @id @default(cuid())
  name              String   @unique
  category          String
  skillArea         SkillArea @relation(fields: [skillAreaId], references: [id])
  skillAreaId       String
  description       String?
  license           String?
  evaluationMethod  EvaluationMethod
  scoreType         ScoreType
  scoreInterpretation String
  sourceUrl         String?
  leaderboardUrl    String?
  lastUpdated       DateTime?
  modelCount        Int
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  scores            Score[]
  sources           Source[]

  @@index([name])
  @@index([category])
  @@index([skillAreaId])
}
```

### Score

```prisma
model Score {
  id                String   @id @default(cuid())
  modelId           String
  benchmarkId       String
  value             Float
  scoreDate         DateTime?
  sourceId          String?
  isVerified        Boolean  @default(false)
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  model             Model    @relation(fields: [modelId], references: [id], onDelete: Cascade)
  benchmark         Benchmark @relation(fields: [benchmarkId], references: [id], onDelete: Cascade)
  source            Source?  @relation(fields: [sourceId], references: [id])

  @@unique([modelId, benchmarkId, sourceId])
  @@index([modelId])
  @@index([benchmarkId])
  @@index([value])
}
```

---

## Classification Tables

### SkillArea

Broad domains (8 total):
- Coding, Reasoning, Knowledge, Math, Language, Creative, Vision, Agentic

```prisma
model SkillArea {
  id                String   @id @default(cuid())
  name              String   @unique
  description       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  benchmarks        Benchmark[]
  models            Model[]
  categories        Category[]

  @@index([name])
}
```

### Category

Specific capabilities (14 total):
- Code Generation, Math Word Problems, Commonsense Reasoning, etc.

```prisma
model Category {
  id                String   @id @default(cuid())
  name              String   @unique
  skillAreaId       String
  description       String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  skillArea         SkillArea @relation(fields: [skillAreaId], references: [id])
  models            Model[]

  @@index([name])
  @@index([skillAreaId])
}
```

---

## Supporting Tables

### Source

Data sources: Hugging Face, LMSys, PapersWithCode, provider leaderboards

```prisma
model Source {
  id                String   @id @default(cuid())
  name              String   @unique
  url               String?
  reliability       Reliability @default(Unknown)
  isOfficial        Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  scores            Score[]
  benchmarks        Benchmark[]

  @@index([name])
}
```

---

## Enum Types

```prisma
enum LicenseType {
  OpenWeights
  Proprietary
  ResearchOnly
  CommercialAllowed
  Unknown
}

enum HostingType {
  CloudOnly
  LocalOnly
  Both
  Unknown
}

enum Modality {
  Text
  Image
  Audio
  Video
  Code
}

enum EvaluationMethod {
  Automatic
  HumanJudged
  Mixed
  Unknown
}

enum ScoreType {
  Accuracy
  PassAtK
  Elo
  Percentage
  Raw
  Normalized
  Unknown
}

enum Reliability {
  High
  Medium
  Low
  Unknown
}
```

---

## Database Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| Score | `[modelId, benchmarkId]` | Compound lookup |
| Score | `[benchmarkId, scoreDate]` | Recency filter |
| Model | `[name]`, `[provider]`, `[licenseType]`, `[hostingType]` | Filter queries |
| Benchmark | `[name]`, `[category]`, `[skillAreaId]` | Filter + sort |
| Source | `[name]` | Lookup by name |

---

## Current Data State

- **112 models** — 14 seeded + 100 from Hugging Face API
- **10 benchmarks** — HumanEval, GSM8K, MMLU, MATH, BBH, etc.
- **12 sample scores** — Seed data for testing

---

## Related Docs

- [[05-Data-Model]] (this file)
- [[09-API-Routes]]
- [[08-Performance]]
