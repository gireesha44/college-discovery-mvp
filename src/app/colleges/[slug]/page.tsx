import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatFees, formatPackage, initials } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!college) notFound();

  const latestPlacement = college.placements[0];
  const avgReviewRating =
    college.reviews.length > 0
      ? college.reviews.reduce((sum, r) => sum + r.rating, 0) / college.reviews.length
      : college.rating;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-lg font-semibold text-paper-raised"
          style={{ backgroundColor: college.logoColor }}
        >
          {initials(college.name)}
        </div>
        <div>
          <h1 className="font-display text-3xl text-ink">{college.name}</h1>
          <p className="mt-1 text-slate">
            {college.city}, {college.state} · {college.type}
            {college.established ? ` · Est. ${college.established}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBlock label="Rating" value={college.rating.toFixed(1)} />
        <StatBlock label="Annual fees" value={formatFees(college.fees)} />
        {latestPlacement && (
          <>
            <StatBlock label="Avg. package" value={formatPackage(latestPlacement.avgPackage)} />
            <StatBlock label="Placement rate" value={`${latestPlacement.placementRate}%`} />
          </>
        )}
      </div>

      <div className="mt-4">
        <Link
          href={`/compare?slugs=${college.slug}`}
          className="inline-block rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink"
        >
          Add to comparison
        </Link>
      </div>

      <Section title="Overview">
        <p className="leading-relaxed text-slate">{college.overview}</p>
      </Section>

      <Section title="Courses offered">
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-slate">
              <tr>
                <th className="px-4 py-3 font-medium">Program</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Annual fees</th>
                <th className="px-4 py-3 font-medium">Seats</th>
              </tr>
            </thead>
            <tbody>
              {college.courses.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-slate">{c.duration}</td>
                  <td className="px-4 py-3 text-slate">{formatFees(c.fees)}</td>
                  <td className="px-4 py-3 text-slate">{c.seats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Placements">
        <div className="space-y-4">
          {college.placements.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-line bg-paper-raised p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-ink">{p.year}</span>
                <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-success">
                  {p.placementRate}% placed
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate">Average package</p>
                  <p className="font-medium text-ink">{formatPackage(p.avgPackage)}</p>
                </div>
                <div>
                  <p className="text-slate">Highest package</p>
                  <p className="font-medium text-ink">{formatPackage(p.highestPackage)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate">Top recruiters: {p.topRecruiters}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={`Reviews (${college.reviews.length}) · Avg ${avgReviewRating.toFixed(1)}`}>
        <div className="space-y-4">
          {college.reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-line bg-paper-raised p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">{r.authorName}</p>
                <span className="text-sm text-amber-deep">{r.rating.toFixed(1)} ★</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate">{r.comment}</p>
            </div>
          ))}
          {college.reviews.length === 0 && (
            <p className="text-sm text-slate">No reviews yet.</p>
          )}
        </div>
      </Section>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper-raised p-4">
      <p className="text-xs text-slate">{label}</p>
      <p className="font-display mt-1 text-xl text-ink">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
