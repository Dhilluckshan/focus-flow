# FocusFlow

NestJS, Prisma and SQLite in `api/`. Next.js App Router, React and Tailwind in `web/`.

| Task | Command |
| --- | --- |
| Install | `npm ci --prefix api` and `npm ci --prefix web` |
| Develop | `npm run dev --prefix api` and `npm run dev --prefix web` |
| Test | `npm run test:isolated` after generating Prisma Client and building the API |
| Build and type-check | `npm run build` |
| Docs | Keep project documentation in `README.md`. Store UI screenshots in `docs/assets/`. |
| Lint and bench | Tooling pending |

Write tests before implementation, use Conventional Commits, and keep diffs small. Keep task rules independent of HTTP, validate inputs at boundaries, and use explicit names. Update commands here as tooling changes.

Done means the requested behavior works through its normal entry points, regressions pass, setup works from a clean clone, and documentation distinguishes measured results from pending verification.
