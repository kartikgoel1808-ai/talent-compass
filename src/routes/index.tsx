import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { CATEGORIES, normalizeCompanySummary, type CompanyCategory, type CompanySummary } from "@/lib/companyData";
import { CompanyCard } from "@/components/CompanyCard";
import { CATEGORY_STYLES } from "@/components/CategoryBadge";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { COLLEGE_NAME, COLLEGE_SHORT, PORTAL_TITLE } from "@/lib/college";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${COLLEGE_SHORT} Placement Intelligence Hub — Companies` },
      { name: "description", content: `${COLLEGE_NAME} portal to research recruiting companies and the skills they need.` },
      { property: "og:title", content: `${COLLEGE_SHORT} Placement Intelligence Hub` },
      { property: "og:description", content: `Research recruiting companies and placement skills at ${COLLEGE_NAME}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Filter = "All" | CompanyCategory;

function Index() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);
  useEffect(() => setLoading(false), []);

  const companies = useMemo(() => SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id)), []);
  const searched = useMemo(
    () =>
      companies.filter((c) =>
        !debounced ? true : [c.name, c.shortName, c.headquarters, c.category].some((s) => s.toLowerCase().includes(debounced)),
      ),
    [companies, debounced],
  );
  const counts = useMemo(() => {
    const m: Record<Filter, number> = { All: searched.length, "Super Dream": 0, Dream: 0, Standard: 0, Regular: 0 };
    searched.forEach((c) => m[c.companyType]++);
    return m;
  }, [searched]);
  const visible = filter === "All" ? searched : searched.filter((c) => c.companyType === filter);

  const onSelect = useCallback(
    (c: CompanySummary) => {
      selectCompany({ companyId: c.companyId, companyName: c.name, logoUrl: c.logoUrl });
      navigate({ to: "/company/intelligence" });
    },
    [navigate, selectCompany],
  );

  const reset = () => {
    setQuery("");
    setFilter("All");
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <span className="inline-flex rounded-full border bg-secondary px-3 py-1 text-[11px] font-semibold tracking-widest text-muted-foreground">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{PORTAL_TITLE}</h1>
          <p className="mt-2 text-muted-foreground">Your strategic edge for campus placements</p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, locations…"
              aria-label="Search companies"
              className="h-11 w-full rounded-lg border bg-card pl-9 pr-9 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-none">
          {(["All", ...CATEGORIES] as Filter[]).map((f) => {
            const active = filter === f;
            const s = f === "All" ? null : CATEGORY_STYLES[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active ? (s ? cn(s.bg, s.text, s.border) : "border-primary bg-primary text-primary-foreground") : "bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {s && <span className={cn("size-2 rounded-full", s.solid)} />}
                {f}
                <span className="text-xs opacity-70">{counts[f]}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed py-16 text-center">
            <p className="font-heading text-lg font-medium">No companies match</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
            <Button variant="outline" className="mt-4" onClick={reset}>Reset filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((c) => <CompanyCard key={c.companyId} company={c} onSelect={onSelect} />)}
          </div>
        )}
      </section>
    </div>
  );
}
