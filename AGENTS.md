# AGENTS.md — Network Monitoring Dashboard

Responsive dashboard for reviewing network-node health and latency. The React frontend connects to an ASP.NET Core API in production; monitoring records are fixture data, not live or persisted telemetry.

## Stack y estructura

- Frontend: React 19, TypeScript 6, Vite 8, React Router, Recharts; Node.js 22.23.2 (`.nvmrc`). Backend: ASP.NET Core minimal API and xUnit on .NET 10.
- `src/app`: routing; `src/domain`: shared contracts; `src/features/network-monitoring`: pages, hooks, components, tests, and stories.
- `src/services`: service contract and mock/HTTP implementations; `src/services/index.ts` selects one. `src/mocks`: fixtures.
- `backend/NetworkMonitoring.Api/Program.cs`: endpoints and in-memory fixtures; `appsettings*.json`: CORS. `e2e`: Playwright; `.github/workflows/ci.yml`: CI; `graphify-out`: generated architecture references.

## Comandos

Run from the repository root:

```sh
npm ci
npm run dev
npm run build
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run test:e2e:full-stack
npm run storybook
npm run build-storybook
dotnet test backend/NetworkMonitoring.Api.Tests/NetworkMonitoring.Api.Tests.csproj
docker build --tag network-monitoring-api:ci ./backend/NetworkMonitoring.Api
```

Default E2E tests use the mock service; the full-stack command starts the local API and frontend. API and container commands require .NET 10 and Docker.
If port 5173 is occupied, set `PLAYWRIGHT_PORT` before `npm run test:e2e` (for example, `$env:PLAYWRIGHT_PORT='4173'` in PowerShell); the default remains 5173.

## Convenciones

- Follow Prettier: two spaces, no semicolons, single quotes, trailing commas, 100-character width. Run `npm run format:check`.
- Use kebab-case filenames, PascalCase components/types, `*.test.ts(x)` tests, and `*.stories.tsx` stories beside feature code. Keep identifiers, comments, and UI copy in English.
- Use `src/domain/network.ts` for frontend contracts and `src/services/network-monitoring-service.ts` as the data boundary. Inject that service in tests; follow existing hook async/error patterns.
- Follow the commit style in recent history (`feat(ui): ...`, `fix(ui): ...`, `docs(readme): ...`). Do not add authorship or agent attribution trailers.

## Reglas de dominio / trampas conocidas

- Without `VITE_API_BASE_URL`, the frontend uses mock fixtures. In development, `?demo=empty`, `?demo=error`, and `?demo=slow` select mock states only.
- The API has three in-memory fixture nodes and supports metrics ranges `1h`, `24h`, and `7d`; an omitted range defaults to `1h`. All measurements are simulated fixtures, not live telemetry.
- No database, real-time polling, uptime calculation, alerting, or authentication exists. Do not imply otherwise in UI or docs.
- Keep CORS origins explicit and test both allowed and rejected origins; never use `*` to fix browser tests.

## Forma de trabajar

- Plan cross-layer, API-contract, or multi-screen work before editing. Keep changes focused and preserve unrelated working-tree edits.
- For small UI, copy, or accessibility changes recorded in `feature.md`, document and present the plan, then proceed without a separate approval step when the user has asked to make the change. Stop only for an unresolved material decision or a boundary listed under "Pregunta antes".
- Extend existing service and test/story patterns. At handoff, report changed files, checks actually run, and remaining limitations.

## Memoria

- At the start, read MEMORY.md to learn the project status and decisions made.
- Upon finishing a task, update it: current status, important decisions (with their rationale), and pitfalls to avoid.
- Keep it brief (~50 lines maximum): summarize or remove what is no longer useful.
- If something becomes a permanent rule, propose moving it to AGENTS.md instead of keeping it in memory.
- Never store sensitive data (keys, tokens, personal data).

## Reglas

- Lee `docs/constitution.md` y la spec activa (`specs/NNN-*/`) antes de tocar código.

## Límites

- ✅ **Siempre:** check `git status`, preserve the service boundary, test behavior changes, and keep credentials untracked.
- ✅ **Siempre:** update `MEMORY.md` upon finishing each task.
- ✅ **Siempre:** create a local commit after completing requested changes. Use an English subject in the form `<type>(<scope>): <subject>` (under 50 characters) and a body with a `<description>` (under 100 characters, using a simple present or imperative verb to explain why and how). Allowed types: `fix`, `feat`, `test`, `refactor`, `revert`, `build`, and `chore`.

- ⚠️ **Pregunta antes:** dependencies, new source/config files, API/data-contract changes, or scope expansion such as persistence, authentication, or polling.
- 🚫 **Nunca:** add `Co-authored-by` or other authorship/agent attribution to commits; expose API keys, tokens, or credentials in files, logs, commands, screenshots, or responses; commit secrets; hand-edit generated output; or use wildcard CORS.
- 🚫 **Push or deploy only when the user explicitly requests it.**

## Verificación

- Frontend: run `npm run format:check`, `npm run lint`, `npm run test`, and `npm run build`; add `npm run test:e2e` for navigation/responsive changes.
- API/contracts: run the xUnit test command and `npm run test:e2e:full-stack`; build Docker when container files change. CI also builds Storybook and the API.
- Documentation-only changes need a formatting check; report only checks that actually passed.
