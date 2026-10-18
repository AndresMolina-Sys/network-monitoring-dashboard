---
type: "query"
date: "2026-10-18T06:25:35.938480+00:00"
question: "Perfecto, como compruebo que todo este correcto?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["CI quality checks", "Full-stack Playwright smoke test", "Vercel frontend deployment"]
---

# Q: Perfecto, como compruebo que todo este correcto?

## Answer

Expanded from original query via graph vocabulary: [check, quality, tests, chart, metrics, range, playwright, build, deployment, production, storybook]. The graph links CI quality checks to .github/workflows/ci.yml (L14), the full-stack Playwright smoke test to e2e/full-stack.spec.ts, and Vercel frontend deployment to README.md (L221). The graph snapshot is stale for Packet Loss and should not be used to verify the new chart; rely on the current CI run and production UI. Current local evidence: 97 Vitest tests and 10 E2E tests passed, along with formatting, lint, app build, and Storybook build. Storybook has a non-failing large-chunk warning.

## Outcome

- Signal: useful

## Source Nodes

- CI quality checks
- Full-stack Playwright smoke test
- Vercel frontend deployment