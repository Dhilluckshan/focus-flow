# Scaling

The current design runs one API against a persistent local SQLite file. WAL permits concurrent readers, while write contention grows as writes increase. Avoid mounting one SQLite file across multiple machines.

Measure response sizes and query times first. Move the dashboard to the paginated API and move persistence behind a repository interface before migrating to Postgres. Once Postgres handles shared data, stateless API replicas can sit behind a load balancer. Add shared rate limits with Redis if multiple replicas need one quota. Consider read replicas for measured read pressure and a queue for background work. If realtime is added, fan out events across replicas using pub/sub.
