# Contributing

Thanks for your interest in contributing!

- Dev server (containerized):
  - `podman run --rm -it -v $(pwd):/workspace -w /workspace -p 5173:5173 docker.io/library/node:20-bookworm bash -lc "npm install && npm run dev -- --host 0.0.0.0"`
  - In another terminal: `kubectl proxy --port=8001`
- Code style: TypeScript strict mode; React with functional components/hooks; prefer small, pure helpers.
- UI: PatternFly 5 components; minimal custom CSS.
- Commit style: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`).
- Testing: TBD; start with unit tests for YAML generation when added.

Pull requests welcome. 
