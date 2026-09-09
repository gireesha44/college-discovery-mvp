# Vantage College — College Discovery Platform

Full-stack MVP for the AI Software Engineer internship assignment.
**Track A · Full Stack Engineer** — features implemented: **College Listing + Search, College Detail Page, Compare Colleges.**

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · PostgreSQL · Prisma · Zod

## Local setup

1. **Get a free Postgres DB** at [neon.tech](https://neon.tech) (or use Railway/Render/local Postgres). Copy the connection string.
2. `cp .env.example .env` and paste the connection string into `DATABASE_URL`.
3. Install deps (this also runs `prisma generate` via `postinstall`):
   ```bash
   npm install
   ```
4. Create the schema and seed sample data:
   ```bash
   npm run db:migrate   # creates tables from prisma/schema.prisma
   npm run db:seed       # inserts 10 colleges with courses, placements, reviews
   ```
5. Run it:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

> Note: this repo was built in a sandboxed environment without outbound access to Prisma's binary CDN, so `prisma generate`/`migrate` couldn't be executed there. The schema, seed data, API routes and pages are all hand-written and were type-checked with `tsc --noEmit`; the only errors surfaced were the expected "Prisma types not generated yet" errors, which resolve as soon as `npm install` runs somewhere with normal network access.

## Architecture

```
src/
  app/
    page.tsx                 → home (server component, top-rated colleges)
    colleges/page.tsx         → listing page shell
    colleges/[slug]/page.tsx  → detail page (server component, direct Prisma query)
    compare/page.tsx          → compare page shell
    api/colleges/route.ts             → GET search+filter+sort+paginate
    api/colleges/[slug]/route.ts      → GET single college with courses/placements/reviews
    api/colleges/compare/route.ts     → GET 2-3 colleges by slug for comparison
  components/
    CollegeExplorer.tsx   → client: search/filter/sort/pagination, hits /api/colleges
    ComparePicker.tsx     → client: search-to-add picker + comparison table
    CollegeCard.tsx       → shared summary card
  lib/
    prisma.ts       → Prisma client singleton
    validation.ts   → Zod schemas for query params
    format.ts       → currency/rating formatting helpers, shared types
prisma/
  schema.prisma   → College, Course, PlacementYear, Review models
  seed.ts         → 10 realistic Indian colleges with nested data
```

### Decisions & tradeoffs
- **Server components for read-heavy pages** (home, detail) query Prisma directly — no reason to round-trip through an API route the browser will call once and never again. **Client components for interactive pages** (listing filters, compare picker) hit the REST API, since they need to refetch on every keystroke/filter change without a full page reload.
- **Debounced search** (300ms) on both the listing search box and the compare picker's autocomplete, to avoid hammering the DB on every keystroke.
- **"Load more" pagination** instead of infinite scroll — simpler to reason about, keeps URL/page state predictable, and avoids scroll-jank edge cases for an MVP.
- **Compare via slugs in the URL** (`/compare?slugs=iit-bombay,iit-delhi`) so a comparison is shareable/bookmarkable, not just client state.
- **Validation with Zod** on every API route — rejects malformed query params (e.g. `minRating=abc`) with a 400 instead of letting bad input hit Prisma.
- **No auth** — deliberately dropped per the assignment's "pick 3-4 features, execute well" guidance, in favor of polishing search/detail/compare.
- **Skipped for time**: server-side caching/ISR (fine for an MVP with data this small), image assets (colleges use color-coded initials instead of stock photos — avoids sourcing/licensing fake images), test suite.

### Data
Seed data (10 colleges) is realistic but illustrative — fees, packages and ratings are representative estimates, not scraped live figures, per the assignment's "mock or generated datasets" allowance.

## Deployment
Designed for **Vercel** (frontend + API routes) + **Neon** (Postgres). Set `DATABASE_URL` as a Vercel environment variable, then trigger a deploy — `postinstall` runs `prisma generate` automatically on Vercel's build.
