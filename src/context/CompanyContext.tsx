import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_COMPANIES } from "@/data/seedCompanies";

export const STORAGE_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface Ctx {
  selected: SelectedCompany | null;
  /** True once localStorage has been read on the client. */
  ready: boolean;
  selectCompany: (c: SelectedCompany) => void;
  clear: () => void;
}

const CompanyContext = createContext<Ctx | null>(null);

export function readStoredCompany(): SelectedCompany | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SelectedCompany;
    const exists = SEED_COMPANIES.some((c) => c.company_id === parsed.companyId);
    return exists ? parsed : null;
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelected(readStoredCompany());
    setReady(true);
  }, []);

  const selectCompany = useCallback((c: SelectedCompany) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    setSelected(c);
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSelected(null);
  }, []);

  const value = useMemo(() => ({ selected, ready, selectCompany, clear }), [selected, ready, selectCompany, clear]);
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used inside CompanyProvider");
  return ctx;
}
