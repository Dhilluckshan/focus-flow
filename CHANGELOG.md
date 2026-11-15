# Changelog

## Unreleased

- Preserve legacy CRUD while adding query validation, optional cursor pagination and consistent API errors.
- Reject stale edits using task versions. Restore deleted tasks through the API and dashboard Undo.
- Run the regression suite against an isolated SQLite database and add CI build and dependency checks.
