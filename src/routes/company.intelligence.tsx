import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Linkedin } from "lucide-react";
import { buildIntelligenceSections, type IntelligenceSection } from "@/data/intelligenceData";
import { useSelectedCompanyData } from "@/hooks/use-selected-company";
import { CompanyLogo } from "@/components/CompanyLogo";
import { CategoryBadge } from "@/components/CategoryBadge";
import { FieldValue } from "@/components/FieldValue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isNullish } from "@/lib/companyData";
import { COLLEGE_SHORT } from "@/lib/college";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: `Company Intelligence — ${COLLEGE_SHORT} Placement Hub` },
      { name: "description", content: "22-section research profile of a recruiting company." },
      { property: "og:title", content: `Company Intelligence — ${COLLEGE_SHORT} Placement Hub` },
      { property: "og:description", content: "Leadership, finances, culture, tech stack and more for recruiting companies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyIntelligence,
});

const SectionCard = memo(function SectionCard({ section }: { section: IntelligenceSection }) {
  const Icon = section.icon;
  const filled = section.fields.filter((f) => !isNullish(f.value)).length;
  return (
    <section id={section.id} data-section className="scroll-mt-32 rounded-xl border bg-card">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground"><Icon className="size-4" /></span>
        <h2 className="flex-1 font-heading text-base font-semibold">{section.title}</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{filled}/{section.fields.length}</span>
      </header>
      <dl className="divide-y">
        {section.fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:gap-4">
            <dt className="text-muted-foreground sm:w-1/3">{f.label}</dt>
            <dd className="min-w-0 sm:w-2/3"><FieldValue value={f.value} /></dd>
          </div>
        ))}
      </dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { profile } = useSelectedCompanyData();
  const sections = useMemo(() => buildIntelligenceSections(profile?.fields), [profile]);
  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!profile) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(els.indexOf(vis.target as HTMLElement));
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [profile]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const scrollToSection = useCallback((idx: number) => {
    isScrollingRef.current = true;
    setActive(idx);
    document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => (isScrollingRef.current = false), 800);
  }, []);

  if (!profile) {
    return <div className="space-y-4 p-4"><Skeleton className="h-16" /><Skeleton className="h-10" /><Skeleton className="h-96" /></div>;
  }

  return (
    <div>
      <div className="sticky top-0 z-20 border-b bg-background">
        <div className="flex items-center gap-3 px-4 py-3">
          <CompanyLogo name={profile.name} logoUrl={profile.logoUrl} websiteUrl={profile.websiteUrl} className="size-10" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-lg font-semibold">{profile.name}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {profile.industry && <span className="rounded-full border bg-secondary px-2 py-0.5 text-xs">{profile.industry}</span>}
              <CategoryBadge category={profile.companyType} />
            </div>
          </div>
          <div className="flex gap-2">
            {profile.websiteUrl && (
              <Button asChild variant="outline" size="sm"><a href={profile.websiteUrl} target="_blank" rel="noreferrer"><ExternalLink /><span className="hidden sm:inline">Website</span></a></Button>
            )}
            {profile.linkedinUrl && (
              <Button asChild variant="outline" size="sm"><a href={profile.linkedinUrl} target="_blank" rel="noreferrer"><Linkedin /><span className="hidden sm:inline">LinkedIn</span></a></Button>
            )}
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none">
          {sections.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => scrollToSection(i)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                active === i ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        {sections.map((s) => <SectionCard key={s.id} section={s} />)}
      </div>
    </div>
  );
}
