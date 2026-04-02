# Benchmrk - AI Benchmark Tracker

A comprehensive platform for tracking, comparing, and filtering AI model benchmarks across multiple evaluation datasets.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Neon (PostgreSQL)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Deploy:** Vercel

## Database Schema

### Core Tables

- **Model** - AI models (Llama, GPT, Claude, etc.)
- **Benchmark** - Evaluation datasets (MMLU, GSM8K, HumanEval, etc.)
- **Score** - Model scores on benchmarks
- **SkillArea** - Broad categories (Coding, Reasoning, Creative, etc.)
- **Category** - Specific benchmark categories
- **Source** - Data sources (LMSys, Hugging Face, official papers)

### Key Features

- Track model metadata (params, context window, license, hosting type)
- Store benchmark details (evaluation method, score type, license)
- Support multiple score sources per model/benchmark pair
- Filter by skill area, category, hosting type, modality, and more

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Create a Neon database at https://console.neon.tech
2. Copy your connection string to `.env`:

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
```

3. Push the schema to your database:

```bash
npx prisma migrate deploy
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
benchmrk/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # SQL migrations
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── app/
│   ├── page.tsx               # Main benchmark grid
│   ├── models/
│   │   └── [id]/page.tsx      # Model detail page
│   └── benchmarks/
│       └── [id]/page.tsx      # Benchmark detail page
└── components/
    ├── BenchmarkGrid.tsx      # Main sortable grid
    ├── Filters.tsx            # Filter sidebar
    └── ModelDetail.tsx        # Model detail view
```

## Development Tasks

### Phase 1 - Core Infrastructure
- [x] Database schema
- [x] Migration files
- [ ] Connect to Neon database
- [ ] Seed script for initial data

### Phase 2 - Data Ingestion
- [ ] Scrape LMSys Arena
- [ ] Scrape Hugging Face Open LLM Leaderboard
- [ ] Manual entry form
- [ ] Import from CSV

### Phase 3 - UI/UX
- [ ] Main benchmark grid
- [ ] Filtering system
- [ ] Model detail pages
- [ ] Benchmark detail pages
- [ ] Export to CSV/JSON

### Phase 4 - Polish
- [ ] Shareable filter URLs
- [ ] Model comparison mode
- [ ] Bookmark/filter presets
- [ ] Latency tracking (backlog)

## License

MIT
