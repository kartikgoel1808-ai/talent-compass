import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Lock, CheckCircle2, Target } from "lucide-react";
import { useSelectedCompanyData } from "@/hooks/use-selected-company";
import { CompanyLogo } from "@/components/CompanyLogo";
import { Skeleton } from "@/components/ui/skeleton";
import { SKILL_TOPICS } from "@/data/skillTopics";
import { proficiencyToBloom, scoreToCriticality, type Bloom, type Criticality, type DashboardSkill } from "@/lib/companyData";
import { COLLEGE_SHORT } from "@/lib/college";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: `Skill Intelligence — ${COLLEGE_SHORT} Placement Hub` },
      { name: "description", content: "Skills a recruiting company expects, with 10-level learning roadmaps." },
      { property: "og:title", content: `Skill Intelligence — ${COLLEGE_SHORT} Placement Hub` },
      { property: "og:description", content: "Required skill levels and roadmaps for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillIntelligence,
});

const BLOOM: Record<Bloom, { label: string; text: string; bg: string; bar: string; range: string }> = {
  CU: { label: "Conceptual Understanding", text: "text-bloom-cu", bg: "bg-bloom-cu/10", bar: "bg-bloom-cu", range: "L1–2" },
  AP: { label: "Application", text: "text-bloom-ap", bg: "bg-bloom-ap/10", bar: "bg-bloom-ap", range: "L3–4" },
  AS: { label: "Analysis & Synthesis", text: "text-bloom-as", bg: "bg-bloom-as/10", bar: "bg-bloom-as", range: "L5–6" },
  EV: { label: "Evaluation", text: "text-bloom-ev", bg: "bg-bloom-ev/10", bar: "bg-bloom-ev", range: "L7–8" },
  CR: { label: "Creation", text: "text-bloom-cr", bg: "bg-bloom-cr/10", bar: "bg-bloom-cr", range: "L9–10" },
};

const CRIT: Record<Criticality, { desc: string; text: string }> = {
  Critical: { desc: "Score 7+ — must be strong", text: "text-expert" },
  Important: { desc: "Score 5–6 — expected", text: "text-regular" },
  Baseline: { desc: "Below 5 — nice to have", text: "text-standard" },
};

function SkillCard({ skill }: { skill: DashboardSkill }) {
  const [open, setOpen] = useState(false);
  const bloom = proficiencyToBloom(skill.requiredLevel);
  const b = BLOOM[bloom];
  const crit = scoreToCriticality(skill.requiredLevel);
  const topics = SKILL_TOPICS[skill.skillSetId] ?? [];

  return (
    <div className="rounded-xl border bg-card">
      <button onClick={() => setOpen((o) => !o)} className="w-full p-4 text-left" aria-expanded={open}>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading font-semibold">{skill.name}</h3>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", b.text, b.bg)}>{bloom}</span>
            </div>
            <p className={cn("mt-1 text-xs font-medium", CRIT[crit].text)}>{crit}</p>
          </div>
          <span className="font-heading text-lg font-semibold">{skill.requiredLevel}<span className="text-sm text-muted-foreground">/10</span></span>
          <ChevronDown className={cn("mt-1 size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full", b.bar)} style={{ width: `${skill.requiredLevel * 10}%` }} />
        </div>
      </button>
      {open && (
        <ol className="space-y-1 border-t p-3">
          {Array.from({ length: 10 }).map((_, i) => {
            const lvl = i + 1;
            const locked = lvl > skill.requiredLevel;
            const lb = BLOOM[proficiencyToBloom(lvl)];
            return (
              <li key={lvl} className={cn("flex items-start gap-3 rounded-lg px-2 py-2 text-sm", locked ? "opacity-50" : lvl === skill.requiredLevel && "bg-accent")}>
                <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold", lb.bg, lb.text)}>{lvl}</span>
                <span className="flex-1">{topics[i] ?? "Topic to be added"}</span>
                {locked ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Lock className="size-3.5" />Beyond scope</span>
                ) : lvl === skill.requiredLevel ? (
                  <Target className="size-4 shrink-0 text-dream" />
                ) : (
                  <CheckCircle2 className="size-4 shrink-0 text-standard" />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function SkillIntelligence() {
  const { profile, skills } = useSelectedCompanyData();
  if (!profile) return <div className="space-y-4 p-4"><Skeleton className="h-16" /><Skeleton className="h-96" /></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <CompanyLogo name={profile.name} logoUrl={profile.logoUrl} websiteUrl={profile.websiteUrl} />
        <div>
          <h1 className="font-heading text-xl font-semibold">{profile.shortName} Skill Intelligence</h1>
          <p className="text-sm text-muted-foreground">{skills.length} skills · sorted by required level</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(Object.keys(BLOOM) as Bloom[]).map((k) => (
          <div key={k} className={cn("rounded-lg p-3", BLOOM[k].bg)}>
            <p className={cn("font-heading text-sm font-bold", BLOOM[k].text)}>{k} <span className="font-normal opacity-70">{BLOOM[k].range}</span></p>
            <p className="text-xs text-muted-foreground">{BLOOM[k].label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(Object.keys(CRIT) as Criticality[]).map((k) => (
          <div key={k} className="rounded-lg border bg-card p-3">
            <p className={cn("font-heading text-sm font-semibold", CRIT[k].text)}>{k}</p>
            <p className="text-xs text-muted-foreground">{CRIT[k].desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {skills.map((s) => <SkillCard key={s.skillSetId} skill={s} />)}
      </div>
    </div>
  );
}
