# FocusFlow

NestJS, Prisma and SQLite in `backend/`. Next.js App Router, React and Tailwind in `frontend/`.

| Task | Command |
| --- | --- |
| Install | `npm run install:all` |
| Develop | `npm run dev --prefix backend` and `npm run dev --prefix frontend` |
| Test | `npm test` with the API running |
| Build and type-check | `npm run build` |
| Lint, bench, docs | Pending tool setup. See the upgrade plan. |

Write tests before implementation, use Conventional Commits, and keep diffs small. Keep task rules independent of HTTP, validate inputs at boundaries, and use explicit names. Update commands here as tooling changes.

Done means the requested behavior works through its normal entry points, regressions pass, setup works from a clean clone, and documentation distinguishes measured results from pending verification.
