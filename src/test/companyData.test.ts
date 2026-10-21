import { describe, expect, it } from "vitest";
import { proficiencyToBloom, scoreToCriticality, scoreToDifficulty, normalizeCompanyProfile } from "@/lib/companyData";
import { buildIntelligenceSections } from "@/data/intelligenceData";
import { SEED_COMPANIES } from "@/data/seedCompanies";

describe("skill rules", () => {
  it("maps levels to Bloom codes", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(proficiencyToBloom)).toEqual(["CU", "CU", "AP", "AP", "AS", "AS", "EV", "EV", "CR", "CR"]);
  });
  it("maps scores to criticality", () => {
    expect(scoreToCriticality(7)).toBe("Critical");
    expect(scoreToCriticality(5)).toBe("Important");
    expect(scoreToCriticality(4)).toBe("Baseline");
  });
  it("maps scores to difficulty", () => {
    expect([8, 6, 4, 3].map(scoreToDifficulty)).toEqual(["EXPERT", "ADVANCED", "PRO", "BEGINNER"]);
  });
});

describe("intelligence", () => {
  it("has 22 sections", () => {
    expect(buildIntelligenceSections()).toHaveLength(22);
  });
  it("never exposes CTC, stipend or selection ratio", () => {
    const c = SEED_COMPANIES[0]!;
    const p = normalizeCompanyProfile({ ...c.full_json, ctc: "10", stipend: "1", selection_ratio: "2" }, c.short_json);
    expect(Object.keys(p.fields).some((k) => /ctc|stipend|selection_ratio/.test(k))).toBe(false);
  });
});
