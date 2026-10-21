<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Company data flows through pure normalizers in src/lib/companyData.ts that take raw short_json/full_json/skill_levels shapes, so swapping the seed file for database rows is a one-file change.
- The selected company persists in localStorage key "selected-company" via CompanyContext; company pages redirect to / when it is missing, never to 404.
- Routing uses TanStack Router file routes (/company layout with intelligence and skills children), not React Router, because the stack fixes the router.
