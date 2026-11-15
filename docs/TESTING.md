# Testing

Run `npm run build` after installing both apps and generating Prisma Client. Run `npm run test:isolated` to migrate a fresh temporary database and exercise the API through HTTP. Set `TEST_API_PORT` if port 3191 is occupied. To use a dedicated API that is already running, set `API_URL` to its `/tasks` endpoint and run `npm test`.

The baseline suite covers CRUD, default status, trimming, validation and missing rows. The additional contract cases cover legacy and paginated lists, cursor traversal, error shape, conditional edits, and restoration. Browser automation, coverage, mutation testing and OpenAPI conformance are pending.
