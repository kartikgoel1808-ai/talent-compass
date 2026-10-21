import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

function AppLayout() {
  const { selected } = useCompany();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const page = path.endsWith("/skills") ? "Skill Intelligence" : "Company Intelligence";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 items-center gap-2 border-b bg-background px-3">
            <SidebarTrigger />
            <nav className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Companies</Link>
              <ChevronRight className="size-3.5 shrink-0" />
              <span className="truncate">{selected?.companyName ?? "…"}</span>
              <ChevronRight className="size-3.5 shrink-0" />
              <span className="truncate font-medium text-foreground">{page}</span>
            </nav>
          </header>
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
