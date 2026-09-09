import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CollegeCard } from "@/components/CollegeCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.college.findMany({
    orderBy: { rating: "desc" },
    take: 3,
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      type: true,
      fees: true,
      rating: true,
      logoColor: true,
    },
  });

  return (
    <div>
      <section className="border-b border-line bg-paper-raised">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm tracking-wide text-amber-deep font-medium">
            2,400+ programs indexed across 180 institutions
          </p>
          <h1 className="font-display mt-4 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
            Pick your college on numbers, not brochures.
          </h1>
          <p className="mt-5 max-w-xl text-slate leading-relaxed">
            Search by fees and rating, read verified placement data, and put
            two or three shortlisted colleges side by side before you commit
            four years and a few lakhs.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/colleges"
              className="rounded-md bg-ink px-6 py-3 text-sm font-medium text-paper-raised hover:bg-ink-soft transition-colors"
            >
              Search colleges
            </Link>
            <Link
              href="/compare"
              className="rounded-md border border-line px-6 py-3 text-sm font-medium text-ink hover:border-ink transition-colors"
            >
              Compare colleges
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink">Top rated right now</h2>
          <Link href="/colleges" className="text-sm text-amber-deep hover:text-amber-deep/80">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </section>
    </div>
  );
}
