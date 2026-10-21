import { memo } from "react";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import type { CompanySummary } from "@/lib/companyData";
import { isNullish } from "@/lib/companyData";
import { CompanyLogo } from "./CompanyLogo";
import { CategoryBadge } from "./CategoryBadge";

function Val({ v }: { v: string }) {
  return isNullish(v) ? <span className="italic text-muted-foreground">not publicly available</span> : <span>{v}</span>;
}

export const CompanyCard = memo(function CompanyCard({
  company,
  onSelect,
}: {
  company: CompanySummary;
  onSelect: (c: CompanySummary) => void;
}) {
  const negative = company.yoyGrowthRate.trim().startsWith("-");
  const Trend = negative ? TrendingDown : TrendingUp;
  return (
    <button
      type="button"
      onClick={() => onSelect(company)}
      className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-dream/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} websiteUrl={company.websiteUrl} />
        <CategoryBadge category={company.companyType} />
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold leading-tight">{company.name}</h3>
        <p className="text-xs text-muted-foreground">{company.shortName}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2"><MapPin className="size-3.5 shrink-0" /><Val v={company.headquarters} /></li>
        <li className="flex items-center gap-2"><Users className="size-3.5 shrink-0" /><Val v={company.employeeSize} /></li>
        <li className={`flex items-center gap-2 ${negative ? "text-destructive" : "text-standard"}`}>
          <Trend className="size-3.5 shrink-0" />
          {isNullish(company.yoyGrowthRate) ? <Val v="" /> : <span>{company.yoyGrowthRate} YoY</span>}
        </li>
      </ul>
      <ArrowRight className="absolute bottom-4 right-4 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-dream" />
    </button>
  );
});
