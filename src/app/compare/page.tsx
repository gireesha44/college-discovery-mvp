import { ComparePicker } from "@/components/ComparePicker";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ slugs?: string }>;
}) {
  const params = await searchParams;
  const initialSlugs = params.slugs
    ? params.slugs.split(",").filter(Boolean).slice(0, 3)
    : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Compare colleges</h1>
      <p className="mt-2 text-slate">
        Pick 2 or 3 colleges to see fees, placements and ratings side by side.
      </p>
      <ComparePicker initialSlugs={initialSlugs} />
    </div>
  );
}
