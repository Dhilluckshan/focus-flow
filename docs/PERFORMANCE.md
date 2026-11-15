# Performance

No load-test baseline or Lighthouse results have been recorded. The current verification concerns functionality and successful compilation.

The query path uses compound indexes on deletion status and the supported sort fields, with variants for filtered status. Cursor pagination caps response size for callers that opt in. Exact totals and substring search can still require scanning qualifying rows. The dashboard currently loads the legacy array, so browser memory and payload size grow with task count.

Measure the existing revision and upgraded revision using identical synthetic data and an isolated test database. Record CPU, memory, Node version, concurrency, request mix, percentiles, throughput and errors. Measure before moving the web list to server paging or changing the search implementation.
