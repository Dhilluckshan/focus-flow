# Upgrade plan

| Phase | Acceptance |
| --- | --- |
| Audit | Record baseline, risks and compatibility decisions. |
| Tests | Commit failing regression tests for each changed contract before implementing it. |
| API | Preserve CRUD clients. Validate query options, document request and response types, and cover concurrency and restore behavior. |
| Web | Verify task workflows, keyboard use, retry, conflict resolution and live updates in a browser. |
| Performance | Record real baseline and revised results with reproduction commands. |
| Docs and visuals | Check diagrams against code and clearly distinguish concepts from screenshots. |
| CI and delivery | Confirm CI gates and reproducible Docker and clean-clone setup. |
| Submission | Trim working material, prepare interview notes and email, and tag the verified revision. |

After each phase, run the available gates and commit the logical change. Record tools or checks that cannot run. Keep dependencies and decisions explainable.
