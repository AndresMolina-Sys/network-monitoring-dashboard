# Graph Report - Dashboard  (2026-10-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 651 nodes · 869 edges · 104 communities (38 shown, 66 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b4e11f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- network-fixtures.ts
- NetworkMonitoringApiTests
- network-node-details-page.test.tsx
- SDD Router Skill
- network-node-details-page.tsx
- use-node-metrics.ts
- scripts
- compilerOptions
- DESIGN.md
- compilerOptions
- Graphify Query: Remaining Work Status
- network-node-card.tsx
- AGENTS.md — Network Monitoring Dashboard
- NetworkMonitoring.Api.Tests.csproj
- Spec 001 — Rangos de métricas simuladas
- Spec 002 — Gráfica de pérdida de paquetes
- http
- Plan 001 — Rangos de métricas simuladas
- network-nodes-error-state.stories.tsx
- Plan 002 — Gráfica de pérdida de paquetes
- devDependencies
- network-nodes-skeleton.stories.tsx
- MockNetworkMonitoringService
- Coordinación SDD
- MEMORY.md — Dashboard
- network-nodes-empty-state.stories.tsx
- Cambios pequeños
- Q: Perfecto, como compruebo que todo este correcto?
- Q: Que otros cambios me recomiendas añadir al proyecto?
- Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?
- Q: Perfecto, que mas me recomiendas hacerle al dashboard?
- vite.config.ts
- SDD Coordinator — Network Monitoring Dashboard
- SDD entry point classifies requests and routes localized changes to feature work and broader or cross-layer changes to the SDD coordinator
- Spec 003: T-001 through T-030 complete; long-heading overflow fixed; all 26 E2E tests pass
- SDD spec, plan, and tasks have separate approval gates; implementation covers only the specifically requested approved task
- tsconfig.json
- vercel.json
- sdd-change/SKILL.md
- sdd-clarify/SKILL.md
- sdd-constitution/SKILL.md
- sdd-implement/SKILL.md
- sdd-plan/SKILL.md
- sdd/SKILL.md
- sdd-spec/SKILL.md
- sdd-status/SKILL.md
- sdd-tasks/SKILL.md
- sdd-validate/SKILL.md
- @chromatic-com/storybook
- constitution.md
- eslint
- eslint.config.js
- eslint-config-prettier
- @eslint/js
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint-plugin-storybook
- globals
- jsdom
- NetworkMonitoringService is the boundary between UI and data
- playwright
- @playwright/test
- prettier
- @storybook/addon-a11y
- @storybook/addon-docs
- @storybook/addon-onboarding
- @storybook/addon-vitest
- @testing-library/react
- @testing-library/user-event
- @types/node
- @types/react
- @types/react-dom
- typescript
- typescript-eslint
- vite
- @vitejs/plugin-react
- vitest
- @vitest/browser
- @vitest/browser-playwright
- @vitest/browser-preview
- @vitest/coverage-v8
- playwright.config.ts
- Bluesky Icon Clip Path
- ref_testing_library_jest_dom_vitest
- 001-rangos-de-metricas-simuladas/tasks.md
- 002-grafica-perdida-de-paquetes/tasks.md
- main.ts
- preview.tsx
- Docker backend container
- Create a local conventional commit when requested changes are complete; push only when explicitly requested; omit authorship and agent attribution trailers
- Represent monitoring records as simulated fixtures; do not imply persistence, live telemetry, uptime calculation, alerting, or authentication
- Purple Lightning Bolt Favicon
- Discord Icon
- Documentation Icon
- GitHub Icon
- Social Icon
- X Icon
- Abstract Violet Layer Stack Illustration
- React Logo
- Vite Logo

## God Nodes (most connected - your core abstractions)
1. `NetworkMonitoringApiTests` - 21 edges
2. `NetworkMonitoringService` - 20 edges
3. `NetworkNode` - 19 edges
4. `compilerOptions` - 18 edges
5. `compilerOptions` - 15 edges
6. `NodeMetrics` - 13 edges
7. `scripts` - 13 edges
8. `SDD Router Skill` - 13 edges
9. `Project Constitution` - 12 edges
10. `MetricsRange` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Fixture Truth Rule` --semantically_similar_to--> `Simulated Monitoring Records`  [INFERRED] [semantically similar]
  DESIGN.md → PRODUCT.md
- `Full-Stack Portfolio Demonstration` --semantically_similar_to--> `Preserve Simulated-Data Honesty`  [INFERRED] [semantically similar]
  PRODUCT.md → specs/003-redisenio-visual-dashboard/spec.md
- `Graphify Query: Remaining Work Status` --references--> `Full-stack Playwright smoke test`  [EXTRACTED]
  graphify-out/memory/query_20261018_063300_queda_algo_pendiente.md → e2e/full-stack.spec.ts
- `Graphify Query: How to Verify the Dashboard` --references--> `Full-stack Playwright smoke test`  [EXTRACTED]
  graphify-out/memory/query_20261018_062535_perfecto__como_compruebo_que_todo_este_correcto.md → e2e/full-stack.spec.ts
- `SDD Change Skill` --references--> `Spec 001: Simulated Metrics Ranges`  [INFERRED]
  .agents/skills/sdd-change/SKILL.md → specs/001-rangos-de-metricas-simuladas/spec.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard change request routing and SDD phases** — agents_skills_sdd_skill_document, agents_skills_feature_skill_document, agents_skills_sdd_coordinator_skill_document, agents_skills_sdd_change_skill_document, agents_skills_sdd_clarify_skill_document, agents_skills_sdd_constitution_skill_document, agents_skills_sdd_implement_skill_document, agents_skills_sdd_plan_skill_document, agents_skills_sdd_spec_skill_document, agents_skills_sdd_status_skill_document, agents_skills_sdd_tasks_skill_document, agents_skills_sdd_validate_skill_document [EXTRACTED 1.00]
- **Spec 003 design, implementation, and verification lifecycle** — specs_003_redisenio_visual_dashboard_spec, specs_003_redisenio_visual_dashboard_plan, specs_003_redisenio_visual_dashboard_tasks [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for simulated metric ranges** — specs_001_rangos_de_metricas_simuladas_spec_document, specs_001_rangos_de_metricas_simuladas_plan_document, specs_001_rangos_de_metricas_simuladas_tasks_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for packet loss chart** — specs_002_grafica_perdida_de_paquetes_spec_document, specs_002_grafica_perdida_de_paquetes_plan_document, specs_002_grafica_perdida_de_paquetes_tasks_document [EXTRACTED 1.00]
- **SDD request classification and approval workflow** — memory_sdd_feature_routing, memory_sdd_approval_gates, memory_sdd_reviewer_qa [EXTRACTED 1.00]

## Communities (104 total, 66 thin omitted)

### Community 0 - "network-fixtures.ts"
Cohesion: 0.06
Nodes (43): MetricsRange, NetworkNode, NodeMetrics, NodeStatus, NetworkNodesPanel(), NetworkNodesPanelProps, StatusFilter, Default (+35 more)

### Community 1 - "NetworkMonitoringApiTests"
Cohesion: 0.09
Nodes (25): DateTimeOffset, IReadOnlyList, MetricPoint, NetworkNode, NodeMetrics, Program, DateTimeOffset, IReadOnlyList (+17 more)

### Community 2 - "network-node-details-page.test.tsx"
Cohesion: 0.07
Nodes (24): CHART_COLORS, formatMetricDate(), formatMetricTime(), LatencyChartPoint, NodeLatencyChart(), NodeLatencyChartProps, CHART_COLORS, formatMetricDate() (+16 more)

### Community 3 - "SDD Router Skill"
Cohesion: 0.13
Nodes (32): Repository Agent Instructions, Feature Skill, SDD Change Skill, SDD Clarify Skill, SDD Constitution Skill, Separate SDD Approval Gates, SDD Coordinator Skill, SDD Implement Skill (+24 more)

### Community 4 - "network-node-details-page.tsx"
Cohesion: 0.09
Nodes (23): ref_react_dom_client, ref_react_router_dom, App(), NotFoundPage(), AppRouter(), router, MetricPoint, NetworkNodeNotFoundState() (+15 more)

### Community 5 - "use-node-metrics.ts"
Cohesion: 0.10
Nodes (23): assertValidMetricPoints(), assertValidMetricsResponse(), isAbortError(), isMetricPoint(), isMetricsRange(), isNodeMetricsResponse(), METRICS_RANGE_RULES, MetricsRangeRules (+15 more)

### Community 6 - "scripts"
Cohesion: 0.07
Nodes (27): dependencies, react, react-dom, react-router, recharts, engines, node, name (+19 more)

### Community 7 - "compilerOptions"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 8 - "DESIGN.md"
Cohesion: 0.09
Nodes (21): Applied Research Journal, Evidence Margin, Evidence Order Rule, Fixture Truth Rule, Measurement Mono Rule, Reduced Motion Preference, WCAG 2.2 AA Contrast Requirements, Operators and Portfolio Evaluators (+13 more)

### Community 9 - "compilerOptions"
Cohesion: 0.10
Nodes (20): node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+12 more)

### Community 10 - "Graphify Query: Remaining Work Status"
Cohesion: 0.13
Nodes (14): Graphify Query: How to Verify the Dashboard, Historical Test Evidence: 97 Vitest and 10 E2E Tests, Vercel Frontend Deployment, Graphify Query: Remaining Work Status, Answer, CI Quality Checks, node-latency-chart.tsx, Outcome (+6 more)

### Community 11 - "network-node-card.tsx"
Cohesion: 0.18
Nodes (11): formatNodeDate(), NetworkNodeCard(), NetworkNodeCardProps, NODE_DATE_FORMATTER, NODE_TIME_FORMATTER, STATUS_LABELS, Degraded, meta (+3 more)

### Community 12 - "AGENTS.md — Network Monitoring Dashboard"
Cohesion: 0.18
Nodes (10): AGENTS.md — Network Monitoring Dashboard, Comandos, Convenciones, Forma de trabajar, Límites, Memoria, Reglas, Reglas de dominio / trampas conocidas (+2 more)

### Community 13 - "NetworkMonitoring.Api.Tests.csproj"
Cohesion: 0.20
Nodes (9): net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.Mvc.Testing (10.0.12), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.NET.Test.Sdk (17.14.1), xunit (2.9.3), xunit.runner.visualstudio (3.1.4), Microsoft.NET.Sdk (+1 more)

### Community 14 - "Spec 001 — Rangos de métricas simuladas"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 15 - "Spec 002 — Gráfica de pérdida de paquetes"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 16 - "http"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 17 - "Plan 001 — Rangos de métricas simuladas"
Cohesion: 0.20
Nodes (9): Alcance y enfoque, Alternativas consideradas, Capas y archivos previstos, Conflictos documentales conocidos, Enfoque técnico, Estrategia de verificación, Plan 001 — Rangos de métricas simuladas, Riesgos y mitigaciones (+1 more)

### Community 18 - "network-nodes-error-state.stories.tsx"
Cohesion: 0.25
Nodes (7): ref_storybook_test, NetworkNodesErrorState(), NetworkNodesErrorStateProps, Default, meta, RetryInteraction, Story

### Community 19 - "Plan 002 — Gráfica de pérdida de paquetes"
Cohesion: 0.22
Nodes (8): Alcance y enfoque, Alternativas consideradas, Archivos previstos, Enfoque técnico, Estrategia de verificación, Plan 002 — Gráfica de pérdida de paquetes, Riesgos y mitigaciones, Trazabilidad de requisitos y evidencia

### Community 20 - "devDependencies"
Cohesion: 0.29
Nodes (8): devDependencies, storybook, @storybook/react-vite, @testing-library/dom, @testing-library/jest-dom, storybook, @storybook/react-vite, @testing-library/dom

### Community 21 - "network-nodes-skeleton.stories.tsx"
Cohesion: 0.33
Nodes (5): NetworkNodesSkeleton(), SKELETON_ITEMS, Default, meta, Story

### Community 23 - "Coordinación SDD"
Cohesion: 0.33
Nodes (5): Aprobaciones y límites, Coordinación SDD, Delegación, Idioma, archivos y entrega, QA automático de specs

### Community 24 - "MEMORY.md — Dashboard"
Cohesion: 0.33
Nodes (5): Aprendizajes y errores a evitar, Decisiones (y por qué), Estado actual, MEMORY.md — Dashboard, Próximos pasos

### Community 25 - "network-nodes-empty-state.stories.tsx"
Cohesion: 0.40
Nodes (4): NetworkNodesEmptyState(), Default, meta, Story

### Community 26 - "Cambios pequeños"
Cohesion: 0.40
Nodes (4): Cambios pequeños, Ejecución, Límites, Verificación y entrega

### Community 27 - "Q: Perfecto, como compruebo que todo este correcto?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, como compruebo que todo este correcto?, Source Nodes

### Community 28 - "Q: Que otros cambios me recomiendas añadir al proyecto?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Que otros cambios me recomiendas añadir al proyecto?, Source Nodes

### Community 29 - "Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?, Source Nodes

### Community 30 - "Q: Perfecto, que mas me recomiendas hacerle al dashboard?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que mas me recomiendas hacerle al dashboard?, Source Nodes

### Community 31 - "vite.config.ts"
Cohesion: 0.50
Nodes (3): ref_node_path, ref_storybook_addon_vitest_vitest_plugin, ref_vitest_config

### Community 33 - "SDD entry point classifies requests and routes localized changes to feature work and broader or cross-layer changes to the SDD coordinator"
Cohesion: 0.67
Nodes (3): Feature workflow implements small requested changes directly without a separate plan or approval step, SDD coordinator workflow handles broader or cross-layer changes through separate phases, SDD entry point classifies requests and routes localized changes to feature work and broader or cross-layer changes to the SDD coordinator

### Community 34 - "Spec 003: T-001 through T-030 complete; long-heading overflow fixed; all 26 E2E tests pass"
Cohesion: 0.67
Nodes (3): Graphify updated after Spec 003 and inspected; integrity clean with no orphan links, missing endpoints, loops, or collapses. Update after a spec or significant change; version the report, HTML, and JSON outputs only., Current project status: no product work pending, Spec 003: T-001 through T-030 complete; long-heading overflow fixed; all 26 E2E tests pass

### Community 35 - "SDD spec, plan, and tasks have separate approval gates; implementation covers only the specifically requested approved task"
Cohesion: 0.67
Nodes (3): SDD spec, plan, and tasks have separate approval gates; implementation covers only the specifically requested approved task, A reviewer performs read-only QA of each spec before it is presented, The user retains approval authority

## Knowledge Gaps
- **297 isolated node(s):** `NetworkNodesPanelProps`, `StatusFilter`, `NetworkNodesPanelStoryArgs`, `Story`, `NodeLookupStatus` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **66 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `Full-stack Playwright smoke test` (3× useful, score=2.974003026)
- `NetworkMonitoringService` (2× useful, score=1.984458669)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`, `@chromatic-com/storybook`, `eslint`, `eslint-config-prettier`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-storybook`, `globals`, `jsdom`, `playwright`, `@playwright/test`, `prettier`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-onboarding`, `@storybook/addon-vitest`, `@testing-library/react`, `@testing-library/user-event`, `@types/node`, `@types/react`, `@types/react-dom`, `typescript`, `typescript-eslint`, `vite`, `@vitejs/plugin-react`, `vitest`, `@vitest/browser`, `@vitest/browser-playwright`, `@vitest/browser-preview`, `@vitest/coverage-v8`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `Graphify Query: Remaining Work Status`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `NetworkMonitoringService` connect `network-fixtures.ts` to `network-node-details-page.test.tsx`, `network-node-details-page.tsx`, `use-node-metrics.ts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `NetworkNodesPanelProps`, `StatusFilter`, `NetworkNodesPanelStoryArgs` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `network-fixtures.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0645045045045045 - nodes in this community are weakly interconnected._
- **Should `NetworkMonitoringApiTests` be split into smaller, more focused modules?**
  _Cohesion score 0.08819345661450925 - nodes in this community are weakly interconnected._
- **Should `network-node-details-page.test.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07394957983193277 - nodes in this community are weakly interconnected._