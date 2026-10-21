import { cn } from "@/lib/utils";
import type { CompanyCategory } from "@/lib/companyData";

export const CATEGORY_STYLES: Record<CompanyCategory, { text: string; bg: string; border: string; solid: string }> = {
  "Super Dream": { text: "text-super-dream", bg: "bg-super-dream/10", border: "border-super-dream/30", solid: "bg-super-dream" },
  Dream: { text: "text-dream", bg: "bg-dream/10", border: "border-dream/30", solid: "bg-dream" },
  Standard: { text: "text-standard", bg: "bg-standard/10", border: "border-standard/30", solid: "bg-standard" },
  Regular: { text: "text-regular", bg: "bg-regular/10", border: "border-regular/30", solid: "bg-regular" },
};

export function CategoryBadge({ category, className }: { category: CompanyCategory; className?: string }) {
  const s = CATEGORY_STYLES[category];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", s.text, s.bg, s.border, className)}>
      {category}
    </span>
  );
}
