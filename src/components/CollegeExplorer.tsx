"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { CollegeSummary } from "@/lib/format";
import { CollegeCard } from "@/components/CollegeCard";

const STATES = [
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Telangana",
  "Rajasthan",
  "Karnataka",
];

const TYPES = ["Government", "Private", "Deemed"] as const;

const SORTS: { value: string; label: string }[] = [
  { value: "rating_desc", label: "Highest rated" },
  { value: "fees_asc", label: "Fees: low to high" },
  { value: "fees_desc", label: "Fees: high to low" },
  { value: "name_asc", label: "Name A-Z" },
];

type ApiResponse = {
  data: CollegeSummary[];
  pagination: { page: number; totalPages: number; hasMore: boolean; total: number };
};

export function CollegeExplorer() {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [maxFees, setMaxFees] = useState(250000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);

  const [colleges, setColleges] = useState<CollegeSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (state) params.set("state", state);
    if (type) params.set("type", type);
    params.set("maxFees", String(maxFees));
    if (minRating > 0) params.set("minRating", String(minRating));
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("pageSize", "9");
    return params.toString();
  }, [q, state, type, maxFees, minRating, sort, page]);

  const fetchColleges = useCallback(
    async (append: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/colleges?${queryString}`);
        if (!res.ok) throw new Error("Search failed");
        const json: ApiResponse = await res.json();
        setColleges((prev) => {
          if (!append) return json.data;
          const existingIds = new Set(prev.map((c) => c.id));
          return [...prev, ...json.data.filter((c) => !existingIds.has(c.id))];
        });
        setTotal(json.pagination.total);
        setHasMore(json.pagination.hasMore);
      } catch {
        setError("Couldn't load colleges. Try adjusting your filters.");
      } finally {
        setLoading(false);
      }
    },
    [queryString]
  );

  // reset to page 1 whenever a filter changes (debounced for text search)
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
     
  }, [q, state, type, maxFees, minRating, sort]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchColleges(page > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit space-y-6 rounded-lg border border-line bg-paper-raised p-5">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="College or city"
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink" htmlFor="state">
            State
          </label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
          >
            <option value="">All states</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-sm font-medium text-ink">Type</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(type === t ? "" : t)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  type === t
                    ? "border-ink bg-ink text-paper-raised"
                    : "border-line text-slate hover:border-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink" htmlFor="fees">
            Max fees: ₹{(maxFees / 100000).toFixed(1)}L / yr
          </label>
          <input
            id="fees"
            type="range"
            min={50000}
            max={250000}
            step={10000}
            value={maxFees}
            onChange={(e) => setMaxFees(Number(e.target.value))}
            className="mt-2 w-full accent-amber-deep"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink" htmlFor="rating">
            Min rating: {minRating > 0 ? minRating.toFixed(1) : "Any"}
          </label>
          <input
            id="rating"
            type="range"
            min={0}
            max={4.5}
            step={0.5}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="mt-2 w-full accent-amber-deep"
          />
        </div>
      </aside>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate">
            {loading && colleges.length === 0 ? "Searching..." : `${total} colleges found`}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border border-line bg-paper-raised px-3 py-1.5 text-sm outline-none focus:border-ink"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-line bg-paper-raised p-4 text-sm text-slate">
            {error}
          </p>
        )}

        {!error && colleges.length === 0 && !loading && (
          <p className="mt-6 rounded-md border border-line bg-paper-raised p-4 text-sm text-slate">
            No colleges match these filters. Try widening your fees range or clearing the state filter.
          </p>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="rounded-md border border-line px-6 py-2.5 text-sm font-medium text-ink hover:border-ink disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more colleges"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}