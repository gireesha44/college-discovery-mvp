# Vantage College — College Discovery Platform

Full-stack MVP built for the AI Software Engineer internship assignment.

**Track A · College Discovery Platform**
**Role · Full Stack Engineer**
**Features · College Listing + Search · College Detail Page · Compare Colleges**

---

## Stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Framework  | Next.js 15 (App Router)          |
| Language   | TypeScript                       |
| Styling    | Tailwind CSS v4                  |
| Database   | PostgreSQL (Neon)                |
| ORM        | Prisma                           |
| Validation | Zod                              |

---

## Setup

```bash
# 1. Get a free Postgres DB at neon.tech (or Railway/Render/local Postgres)
cp .env.example .env
# → paste your Neon connection strings into DATABASE_URL and DIRECT_URL

# 2. Install (also runs `prisma generate` via postinstall)
npm install

# 3. Create schema + seed sample data
npm run db:migrate   # creates tables from prisma/schema.prisma
npm run db:seed       # inserts 10 colleges with courses, placements, reviews

# 4. Run it
npm run dev
```

Visit `http://localhost:3000`.

> **Note:** this repo was built in a sandboxed environment without outbound access to Prisma's binary CDN, so `prisma generate` / `migrate` couldn't be run there. Everything was hand-written and type-checked with `tsc --noEmit`; the only errors surfaced were the expected "Prisma types not generated yet" ones, which resolve as soon as `npm install` runs with normal network access.

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                     home — server component, top-rated colleges
│   ├── colleges/
│   │   ├── page.tsx                 listing page shell
│   │   └── [slug]/page.tsx          detail page — server component, direct Prisma query
│   ├── compare/page.tsx             compare page shell
│   └── api/colleges/
│       ├── route.ts                 GET — search + filter + sort + paginate
│       ├── [slug]/route.ts          GET — single college, full detail
│       └── compare/route.ts         GET — 2–3 colleges by slug, for comparison
├── components/
│   ├── CollegeExplorer.tsx          client — search/filter/sort/pagination
│   ├── ComparePicker.tsx            client — search-to-add + comparison table
│   └── CollegeCard.tsx              shared summary card
└── lib/
    ├── prisma.ts                    Prisma client singleton
    ├── validation.ts                Zod schemas for query params
    └── format.ts                    currency/rating helpers, shared types

prisma/
├── schema.prisma                    College, Course, PlacementYear, Review models
└── seed.ts                          10 realistic Indian colleges, nested data
```

---

## Decisions & tradeoffs

- **Server components for read-heavy pages** (home, detail) query Prisma directly — no reason to round-trip through an API route the browser calls once and never again.
- **Client components for interactive pages** (listing filters, compare picker) hit the REST API, since they refetch on every keystroke or filter change without a full reload.
- **Debounced search** (300ms) on the listing search box and the compare picker's autocomplete, to avoid hammering the DB on every keystroke.
- **"Load more" pagination** instead of infinite scroll — simpler to reason about, predictable URL/page state, no scroll-jank edge cases to chase for an MVP.
- **Compare via slugs in the URL** (`/compare?slugs=iit-bombay,iit-delhi`) — shareable and bookmarkable, not just client state.
- **Zod validation on every API route** — malformed query params (e.g. `minRating=abc`) get a 400, never reach Prisma.
- **No auth** — deliberately dropped per the assignment's "pick 3–4 features, execute well" guidance, in favor of polishing search, detail and compare.

**Skipped for time:** server-side caching/ISR (fine for an MVP this small), stock imagery (color-coded initials instead — avoids sourcing/licensing issues), test suite.

---

## Data

Seed data (10 colleges) is realistic but illustrative — fees, packages and ratings are representative estimates, not scraped live figures, per the assignment's "mock or generated datasets" allowance.

---

## Deployment

Built for **Vercel** (frontend + API routes) + **Neon** (Postgres).

Set `DATABASE_URL` and `DIRECT_URL` as Vercel environment variables, then deploy — `postinstall` runs `prisma generate` automatically as part of Vercel's build.