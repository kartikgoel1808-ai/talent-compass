import { useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCompany } from "@/context/CompanyContext";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { normalizeCompanyProfile, normalizeDashboardSkills } from "@/lib/companyData";

/** Loads the selected company from context/localStorage + seed; sends the visitor home if none. */
export function useSelectedCompanyData() {
  const { selected, ready } = useCompany();
  const navigate = useNavigate();

  const record = useMemo(
    () => (selected ? SEED_COMPANIES.find((c) => c.company_id === selected.companyId) : undefined),
    [selected],
  );

  useEffect(() => {
    if (ready && !record) navigate({ to: "/", replace: true });
  }, [ready, record, navigate]);

  const profile = useMemo(
    () => (record ? normalizeCompanyProfile(record.full_json, record.short_json, record.company_id) : null),
    [record],
  );
  const skills = useMemo(() => (record ? normalizeDashboardSkills(record.skill_levels) : []), [record]);

  return { ready, profile, skills };
}
