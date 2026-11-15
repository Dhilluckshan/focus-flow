# FocusFlow audit

Baseline: `9b0ce47`. The apps live in `backend/` and `frontend/`.

| Area | Keep | Gap or risk |
| --- | --- | --- |
| API | Five task routes, Prisma migrations, DTO validation | List endpoint only returns an array. Add metadata without breaking that shape. No conflict protection, consistent error envelope, or health endpoint. |
| Web | App Router, accessible dialog primitives, table and board views | One large client component holds the entire workflow. Filtering and pagination download every task. No restore or cross-tab updates. |
| Data | SQLite and existing project and priority fields | Preserve tasks during migrations. SQLite deployments need a persistent volume and a single writer deployment model. |
| Tests | Live CRUD regression script | No isolated test database, contract check, browser suite, coverage, or benchmark baseline. |
| Delivery | Lockfiles, Compose, setup notes | No pinned workspace toolchain, CI, or clean-clone verification. Docker and k6 are unavailable on this host. |

The existing AI-directed source comments and empty-state label should be removed. Use measured results only. The audit is a working document and can be removed after the submission review.
