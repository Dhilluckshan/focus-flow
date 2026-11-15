# FocusFlow

NestJS, Prisma and SQLite in `backend/`. Next.js App Router, React and Tailwind in `frontend/`.

| Task | Command |
| --- | --- |
| Install | `npm ci --prefix backend` and `npm ci --prefix frontend` |
| Develop | `npm run dev --prefix backend` and `npm run dev --prefix frontend` |
| Test | `npm run test:isolated` after generating Prisma Client and building the API |
| Build and type-check | `npm run build` |
| Docs | See `docs/ARCHITECTURE.md` and `docs/TESTING.md` |
| Lint and bench | Tooling pending |

Write tests before implementation, use Conventional Commits, and keep diffs small. Keep task rules independent of HTTP, validate inputs at boundaries, and use explicit names. Update commands here as tooling changes.

Done means the requested behavior works through its normal entry points, regressions pass, setup works from a clean clone, and documentation distinguishes measured results from pending verification.
