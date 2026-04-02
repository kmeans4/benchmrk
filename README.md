# Benchmrk - AI Benchmark Tracker

A comprehensive platform for tracking, comparing, and filtering AI model benchmarks across multiple evaluation datasets.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Neon (PostgreSQL)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Deploy:** Vercel
- **Scraping:** Python scripts (GitHub Actions)

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

### 3. Seed Initial Data

```bash
npx tsx scripts/seed.ts
```

This creates:
- 8 skill areas (Coding, Reasoning, Knowledge, Math, etc.)
- 14 categories (Code Generation, Math Word Problems, etc.)
- 8 sources (Hugging Face, LMSys, PapersWithCode, providers)
- 14 models (GPT-4.5, Claude 3.7, Llama 3.3, Gemini, etc.)
- 10 benchmarks (HumanEval, GSM8K, MMLU, etc.)
- 12 sample scores

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Data Scraping

### Install Python Dependencies

```bash
pip install -r scripts/requirements.txt
```

### Run Scrapers Manually

```bash
# Hugging Face models
python scripts/scrape_huggingface.py

# PapersWithCode leaderboards
python scripts/scrape_paperswithcode.py

# LMSys Chatbot Arena
python scripts/scrape_lmsys.py
```

### Import Scraped Data

```bash
npx tsx scripts/import-data.ts
```

### Automated Weekly Scraping

GitHub Actions workflow runs every Monday at 2 AM UTC:
- `.github/workflows/weekly-scrape.yml`

To trigger manually: Go to Actions → "Weekly Benchmark Scrape" → "Run workflow"

## Project Structure

```
benchmrk/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # SQL migrations
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── scripts/
│   ├── seed.ts                # Initial data seeding
│   ├── scrape_huggingface.py  # HF model scraper
│   ├── scrape_paperswithcode.py # PwC leaderboard scraper
│   ├── scrape_lmsys.py        # LMSys Arena scraper
│   └── import-data.ts         # Import scraped data to DB
├── data/                      # Scraped JSON data (gitignored)
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

## Data Sources

| Source | Type | Coverage | Update Frequency |
|--------|------|----------|------------------|
| Hugging Face | Model metadata | Thousands of models | Real-time |
| LMSys Arena | Elo ratings | Top ~100 models | Weekly |
| PapersWithCode | Benchmark scores | Academic benchmarks | Weekly |
| Provider cards | Official specs | Major providers | Manual |

## Development Tasks

### Phase 1 - Core Infrastructure ✅
- [x] Database schema
- [x] Migration files
- [x] Seed script with initial data
- [x] Python scrapers (HF, PwC, LMSys)
- [x] Import script for scraped data
- [x] GitHub Actions workflow

### Phase 2 - Connect to Neon ⏳
- [ ] Create Neon database
- [ ] Apply migrations
- [ ] Run seed script
- [ ] Test scrapers

### Phase 3 - UI/UX ⏳
- [ ] Main benchmark grid
- [ ] Filtering system
- [ ] Model detail pages
- [ ] Benchmark detail pages
- [ ] Export to CSV/JSON

### Phase 4 - Polish ⏳
- [ ] Shareable filter URLs
- [ ] Model comparison mode
- [ ] Bookmark/filter presets
- [ ] Latency tracking (backlog)

## Commands

```bash
# Database
npx prisma migrate deploy      # Apply migrations
npx prisma studio              # Open database GUI
npx tsx scripts/seed.ts        # Seed initial data

# Scraping
pip install -r scripts/requirements.txt
python scripts/scrape_huggingface.py
python scripts/scrape_paperswithcode.py
python scripts/scrape_lmsys.py
npx tsx scripts/import-data.ts

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run ESLint
```

## License

MIT
