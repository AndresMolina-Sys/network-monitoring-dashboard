# AGENTS.md — Network Monitoring Dashboard

Responsive React dashboard backed by ASP.NET Core API; monitoring records are fixtures, not live telemetry.

## Stack & structure

- React 19, TypeScript 6, Vite 8; Node.js 22.23.2. Backend: ASP.NET Core minimal API, xUnit, .NET 10.
- `src/app`: routes; `src/domain`: contracts; `src/features/network-monitoring`: UI/tests; `src/services`: mock/HTTP boundary; `src/mocks`: fixtures.
- `backend/NetworkMonitoring.Api` and `.Tests`: API and tests; `e2e`: Playwright. CI is in `.github/workflows/ci.yml`; `graphify-out` is generated.

## Commands

Root commands:

```sh
npm ci
npm run dev
npm run build
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run test:e2e:full-stack
dotnet test backend/NetworkMonitoring.Api.Tests/NetworkMonitoring.Api.Tests.csproj
docker build --tag network-monitoring-api:ci ./backend/NetworkMonitoring.Api
```

E2E defaults to mocks; full-stack starts API and frontend.

## Conventions

- Prettier: two spaces, no semicolons, single quotes, trailing commas, 100 columns. Use kebab-case files, PascalCase components/types, `*.test.ts(x)`, colocated `*.stories.tsx`.
- Code/comments/tests/API/UI text are English; SDD docs and `MEMORY.md` are Spanish. Preserve `NetworkMonitoringService` and inject it in tests.
- Use scoped commit subjects such as `feat(ui): ...` or `docs(readme): ...`.

## Domain rules

- Without `VITE_API_BASE_URL`, use mocks; `?demo=empty|error|slow` is development-only. API fixtures are three in-memory nodes; only `1h` is supported (`24h`/`7d` are rejected).
- No database, live telemetry, polling, uptime, alerts, or auth exists; do not claim otherwise. CORS must be explicit, never `*`.

## Spec-Driven Development

- Use `$sdd <phase> <context>` with `docs/constitution.md`: `constitution`, `spec`, `clarify`, `plan`, `tasks`, `implement`, `validate`, `change`, `status`.
- Specs use `specs/NNN-name/{spec.md,plan.md,tasks.md}`; create one only for a concrete feature request. `.agents/skills/sdd` is local and gitignored.
- Artifacts start pending approval. Only explicit confirmation approves; requesting another phase alone does not. Implement only approved artifacts, one requested task, tests first, then stop. Never auto-advance.
- The primary Codex agent is the coordinator: it alone asks the user questions, records approvals, chooses the next phase, and reviews subagent results. Project profiles live in `.codex/agents/`: `sdd_planner` prepares or updates SDD artifacts, `sdd_implementer` implements one approved task, and `sdd_reviewer` performs read-only checks. Delegate these roles automatically for applicable SDD phases; if a profile is unavailable, the coordinator follows the same gates directly.
- Give each handoff the phase, original request and confirmed decisions, authorized scope, exact artifact paths, and prior-phase result. Planner returns unresolved questions to the coordinator and never edits product code. Implementer receives one approved `T-xxx` only. Reviewer reports evidence and findings without editing or approving artifacts.
- Permit parallel delegation only for independent read-only investigations/reviews. Serialize all writes; the coordinator inspects the actual diff and verification results before reporting. Agent instructions are not permission isolation: subagents inherit the coordinator's permissions and sandbox.
- After artifact changes, refresh `MEMORY.md` with current state/decisions (<50 lines). `status` is read-only.

## Boundaries & verification

- Check `git status`, preserve user edits/service boundaries, and keep credentials untracked. Ask before dependencies, source/config additions, API/contracts, or scope changes.
- Never add authorship attribution, expose/commit secrets, hand-edit generated files, use wildcard CORS, or commit/push/deploy without request.
- Verify frontend format/lint/tests/build; Playwright for responsive flows (390 × 844); xUnit/full-stack for API changes. Docs need `npm run format:check`; validate Skills with `quick_validate.py`. Report actual results.
