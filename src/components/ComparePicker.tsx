"use client";

import { useEffect, useState, useCallback } from "react";
import { CollegeSummary, formatFees, formatPackage } from "@/lib/format";

type FullCollege = CollegeSummary & {
  overview: string;
  courses: { id: string; name: string; fees: number }[];
  placements: {
    id: string;
    avgPackage: number;
    highestPackage: number;
    placementRate: number;
  }[];
};

export function ComparePicker({ initialSlugs }: { initialSlugs: string[] }) {
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<CollegeSummary[]>([]);
  const [colleges, setColleges] = useState<FullCollege[]>([]);
  const [error, setError] = useState<string | null>(null);

  // search-to-add
  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/colleges?q=${encodeURIComponent(search)}&pageSize=5`);
      if (res.ok) {
        const json = await res.json();
        setSuggestions(json.data.filter((c: CollegeSummary) => !slugs.includes(c.slug)));
      }
    }, 250);
    return () => clearTimeout(t);
  }, [search, slugs]);

  const loadComparison = useCallback(async (currentSlugs: string[]) => {
    if (currentSlugs.length < 2) {
      setColleges([]);
      return;
    }
    setError(null);
    const res = await fetch(`/api/colleges/compare?slugs=${currentSlugs.join(",")}`);
    if (!res.ok) {
      setError("Couldn't load that comparison.");
      setColleges([]);
      return;
    }
    const json = await res.json();
    setColleges(json.data);
  }, []);

  useEffect(() => {
    loadComparison(slugs);
  }, [slugs, loadComparison]);

  function addCollege(slug: string) {
    if (slugs.includes(slug) || slugs.length >= 3) return;
    setSlugs((prev) => [...prev, slug]);
    setSearch("");
    setSuggestions([]);
  }

  function removeCollege(slug: string) {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <div className="mt-8">
      <div className="relative max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={slugs.length >= 3}
          placeholder={
            slugs.length >= 3 ? "Maximum of 3 colleges" : "Search a college to add"
          }
          className="w-full rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm outline-none focus:border-ink disabled:opacity-50"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border border-line bg-paper-raised shadow-md">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => addCollege(s.slug)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-paper"
                >
                  {s.name}{" "}
                  <span className="text-slate">
                    — {s.city}, {s.state}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {slugs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {slugs.map((s) => {
            const c = colleges.find((x) => x.slug === s);
            return (
              <span
                key={s}
                className="flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1.5 text-sm"
              >
                {c?.name ?? s}
                <button
                  onClick={() => removeCollege(s)}
                  aria-label={`Remove ${c?.name ?? s}`}
                  className="text-slate hover:text-ink"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {error && <p className="mt-6 text-sm text-slate">{error}</p>}

      {slugs.length === 1 && (
        <p className="mt-6 text-sm text-slate">Add one more college to see a comparison.</p>
      )}

      {colleges.length >= 2 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="bg-paper text-left text-slate">
                <th className="px-4 py-3 font-medium">Metric</th>
                {colleges.map((c) => (
                  <th key={c.id} className="px-4 py-3 font-medium text-ink">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Location" values={colleges.map((c) => `${c.city}, ${c.state}`)} />
              <Row label="Type" values={colleges.map((c) => c.type)} />
              <Row label="Annual fees" values={colleges.map((c) => formatFees(c.fees))} highlight="min" raw={colleges.map((c) => c.fees)} />
              <Row label="Rating" values={colleges.map((c) => c.rating.toFixed(1))} highlight="max" raw={colleges.map((c) => c.rating)} />
              <Row
                label="Avg. package"
                values={colleges.map((c) => (c.placements[0] ? formatPackage(c.placements[0].avgPackage) : "—"))}
                highlight="max"
                raw={colleges.map((c) => c.placements[0]?.avgPackage ?? 0)}
              />
              <Row
                label="Placement rate"
                values={colleges.map((c) => (c.placements[0] ? `${c.placements[0].placementRate}%` : "—"))}
                highlight="max"
                raw={colleges.map((c) => c.placements[0]?.placementRate ?? 0)}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  values,
  highlight,
  raw,
}: {
  label: string;
  values: string[];
  highlight?: "min" | "max";
  raw?: number[];
}) {
  const bestIndex =
    highlight && raw
      ? raw.reduce(
          (bestIdx, val, idx) =>
            highlight === "max"
              ? val > raw[bestIdx]
                ? idx
                : bestIdx
              : val < raw[bestIdx]
              ? idx
              : bestIdx,
          0
        )
      : -1;

  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3 text-slate">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`px-4 py-3 ${i === bestIndex ? "font-semibold text-success" : "text-ink"}`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
