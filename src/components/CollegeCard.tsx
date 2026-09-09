import Link from "next/link";
import { CollegeSummary, formatFees, initials } from "@/lib/format";

export function CollegeCard({ college }: { college: CollegeSummary }) {
  return (
    <Link
      href={`/colleges/${college.slug}`}
      className="group block rounded-lg border border-line bg-paper-raised p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-paper-raised"
          style={{ backgroundColor: college.logoColor }}
        >
          {initials(college.name)}
        </div>
        <div className="min-w-0">
          <h3 className="font-display truncate text-base text-ink group-hover:text-amber-deep transition-colors">
            {college.name}
          </h3>
          <p className="text-sm text-slate">
            {college.city}, {college.state}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-slate">
          {college.type}
        </span>
        <div className="flex items-center gap-1 text-ink">
          <StarIcon />
          <span className="font-medium">{college.rating.toFixed(1)}</span>
        </div>
        <span className="font-medium text-ink">{formatFees(college.fees)}</span>
      </div>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-amber"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.363 1.118l1.287 3.958c.299.921-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.958a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
    </svg>
  );
}
