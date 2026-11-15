# Security review

- The Nest validation pipe rejects unknown fields. The task DTOs bound title, description and project lengths and validate enums and dates.
- Prisma constructs task queries. The SQLite WAL pragma is a constant statement.
- CORS uses the configured frontend origin. CORS does not provide authentication or authorization.
- The local environment file and database are ignored. The example environment file documents local defaults.
- Problem responses disclose a request ID and generic details for unexpected server failures.
- Soft deletion is reversible and retains task data. A public deployment needs authentication, task authorization, retention rules, rate limiting, deployment hardening, and monitoring.

CI configuration includes npm audit. Container scanning, SBOM and secret scanning are pending.
