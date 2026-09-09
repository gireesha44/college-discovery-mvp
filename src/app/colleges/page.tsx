import { CollegeExplorer } from "@/components/CollegeExplorer";

export default function CollegesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Explore colleges</h1>
      <p className="mt-2 text-slate">
        Filter by state, type, fees and rating. Results update as you type.
      </p>
      <CollegeExplorer />
    </div>
  );
}
