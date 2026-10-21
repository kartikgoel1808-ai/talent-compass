// Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json / skill_levels)
// so Phase 2 can pass database rows in unchanged.

export type CompanyCategory = "Super Dream" | "Dream" | "Standard" | "Regular";
export const CATEGORIES: CompanyCategory[] = ["Super Dream", "Dream", "Standard", "Regular"];

export interface CompanySummary {
  companyId: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: CompanyCategory;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string[];
  officeLocations: string[];
  yoyGrowthRate: string;
  websiteUrl: string;
}

export interface CompanyProfile extends CompanySummary {
  /** Every raw full_json field as a string (all ~163 fields). */
  fields: Record<string, string>;
  linkedinUrl: string;
  industry: string;
}

export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export interface DashboardSkill {
  skillSetId: number;
  name: string;
  requiredLevel: number;
  proficiency: string;
  difficulty: Difficulty;
}

export function asString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(asString).filter(Boolean).join("; ");
  return JSON.stringify(v);
}

export function asRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  if (typeof v === "string") {
    try {
      const p = JSON.parse(v);
      return p && typeof p === "object" && !Array.isArray(p) ? p : {};
    } catch {
      return {};
    }
  }
  return {};
}

export function splitItems(v: unknown): string[] {
  return asString(v)
    .split(/\r?\n|;|•|\u2022|\.\s+(?=[A-Z])/)
    .map((s) => s.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean);
}

export function titleCaseFromCode(code: string): string {
  return code
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

export function scoreToDifficulty(score: number): Difficulty {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

const NULLISH = new Set(["na", "n/a", "none", "-", "null", "undefined", ""]);
export function isNullish(v: unknown): boolean {
  return NULLISH.has(asString(v).toLowerCase());
}

function toCategory(v: unknown): CompanyCategory {
  const s = asString(v).toLowerCase().replace(/[\s_-]+/g, " ");
  if (s.includes("super")) return "Super Dream";
  if (s.includes("dream")) return "Dream";
  if (s.includes("standard")) return "Standard";
  return "Regular";
}

export function normalizeCompanySummary(shortJson: unknown, companyId = 0): CompanySummary {
  const r = asRecord(shortJson);
  return {
    companyId,
    name: asString(r["name"]),
    shortName: asString(r["short_name"]) || asString(r["name"]),
    logoUrl: asString(r["logo_url"]),
    category: asString(r["category"]),
    companyType: toCategory(r["company_type"]),
    incorporationYear: asString(r["incorporation_year"]),
    employeeSize: asString(r["employee_size"]),
    headquarters: asString(r["headquarters_address"]),
    operatingCountries: splitItems(r["operating_countries"]),
    officeLocations: splitItems(r["office_locations"]),
    yoyGrowthRate: asString(r["yoy_growth_rate"]),
    websiteUrl: asString(r["website_url"]),
  };
}

// Fields that must never be shown anywhere in the portal.
const BLOCKED = /(ctc|stipend|selection_ratio)/i;

export function normalizeCompanyProfile(fullJson: unknown, shortJson: unknown, companyId = 0): CompanyProfile {
  const full = asRecord(fullJson);
  const short = asRecord(shortJson);
  const merged: Record<string, unknown> = { ...short, ...full };
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(merged)) {
    if (BLOCKED.test(k)) continue;
    fields[k] = asString(v);
  }
  const summary = normalizeCompanySummary(merged, companyId);
  return {
    ...summary,
    fields,
    linkedinUrl: fields["linkedin_url"] ?? "",
    industry: fields["category"] || splitItems(fields["focus_sectors"])[0] || "",
  };
}

export function normalizeDashboardSkills(skillLevels: unknown): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];
  return skillLevels
    .map((raw) => {
      const r = asRecord(raw);
      const lvl = Math.min(10, Math.max(1, Number(r["required_level"]) || 1));
      return {
        skillSetId: Number(r["skill_set_id"]) || 0,
        name: asString(r["skill_set_name"]),
        requiredLevel: lvl,
        proficiency: asString(r["required_proficiency"]),
        difficulty: scoreToDifficulty(lvl),
      };
    })
    .sort((a, b) => b.requiredLevel - a.requiredLevel);
}

export type Bloom = "CU" | "AP" | "AS" | "EV" | "CR";
export function proficiencyToBloom(level: number): Bloom {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export type Criticality = "Critical" | "Important" | "Baseline";
export function scoreToCriticality(score: number): Criticality {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}
