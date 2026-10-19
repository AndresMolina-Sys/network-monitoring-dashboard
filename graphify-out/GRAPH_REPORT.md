# Graph Report - Dashboard  (2026-10-19)

## Corpus Check
- 113 files · ~55,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 787 nodes · 1140 edges · 113 communities (48 shown, 65 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ae90d0b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NetworkNode
- node-metrics-comparison-chart.tsx
- NetworkMonitoringApiTests
- use-node-metrics.ts
- Approved Spec 004 — Node Comparison
- SDD Router Skill
- Spec 003 visual redesign requirements
- scripts
- use-node-metrics.test.ts
- compilerOptions
- compilerOptions
- use-node-comparison.ts
- router.tsx
- network-node-card.tsx
- Spec 005 — Resumen por nodo en la comparación
- node-packet-loss-chart.tsx
- network.ts
- node-latency-chart.tsx
- network-node-comparison-page.test.tsx
- Plan 005 — Resumen por nodo en la comparación
- AGENTS.md — Network Monitoring Dashboard
- NetworkMonitoring.Api.Tests.csproj
- Spec 001 — Rangos de métricas simuladas
- Spec 002 — Gráfica de pérdida de paquetes
- http
- Plan 001 — Rangos de métricas simuladas
- use-node-comparison.test.ts
- Plan 002 — Gráfica de pérdida de paquetes
- NodeMetrics
- devDependencies
- network-nodes-empty-state.stories.tsx
- metrics-validation.test.ts
- network-nodes-skeleton.stories.tsx
- Coordinación SDD
- MEMORY.md — Dashboard
- Q: Como comparo los nodos?
- Cambios pequeños
- Q: Perfecto, como compruebo que todo este correcto?
- Q: ¿queda algo pendiente?
- Q: Que otros cambios me recomiendas añadir al proyecto?
- Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?
- Q: Perfecto, que mas me recomiendas hacerle al dashboard?
- Q: Perfecto, que otras mejoras me recomiendas implementar?
- Historical Packet-Loss Completion Check
- vite.config.ts
- storybook
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
- @testing-library/dom
- constitution.md
- network-monitoring.spec.ts
- eslint
- eslint.config.js
- eslint-config-prettier
- @eslint/js
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint-plugin-storybook
- globals
- jsdom
- playwright
- @playwright/test
- prettier
- @storybook/addon-a11y
- @storybook/addon-docs
- @storybook/addon-onboarding
- @testing-library/jest-dom
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
- 005-resumen-por-nodo-en-comparacion/tasks.md
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
- Spec 003 visual-design decisions
- Purple Lightning Bolt Favicon
- Discord Icon
- Documentation Icon
- GitHub Icon
- Social Icon
- X Icon
- Abstract Violet Layer Stack Illustration
- React Logo
- Vite Logo
- Approved visual-direction and reference gates

## God Nodes (most connected - your core abstractions)
1. `NetworkNode` - 32 edges
2. `NetworkMonitoringService` - 32 edges
3. `NodeMetrics` - 30 edges
4. `MetricsRange` - 26 edges
5. `NetworkMonitoringApiTests` - 21 edges
6. `compilerOptions` - 18 edges
7. `NetworkNodeNotFoundError` - 15 edges
8. `compilerOptions` - 15 edges
9. `scripts` - 13 edges
10. `SDD Router Skill` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Pending Final Graphify Refresh T-017` --semantically_similar_to--> `Stale Graph Snapshot for Packet-Loss Chart`  [INFERRED] [semantically similar]
  specs/004-comparacion-de-nodos/tasks.md → graphify-out/memory/query_20261018_062535_perfecto__como_compruebo_que_todo_este_correcto.md
- `Honest simulated-data presentation requirement` --semantically_similar_to--> `Explicitly simulated monitoring records`  [INFERRED] [semantically similar]
  specs/003-redisenio-visual-dashboard/spec.md → PRODUCT.md
- `SDD Change Skill` --references--> `Spec 001: Simulated Metrics Ranges`  [INFERRED]
  .agents/skills/sdd-change/SKILL.md → specs/001-rangos-de-metricas-simuladas/spec.md
- `Production Verification Guidance for Packet-Loss Chart` --references--> `Full-stack Playwright smoke test`  [EXTRACTED]
  graphify-out/memory/query_20261018_062535_perfecto__como_compruebo_que_todo_este_correcto.md → e2e/full-stack.spec.ts
- `Repository Agent Instructions` --references--> `Separate SDD Approval Gates`  [EXTRACTED]
  AGENTS.md → .agents/skills/sdd-coordinator/SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard change request routing and SDD phases** — agents_skills_sdd_skill_document, agents_skills_feature_skill_document, agents_skills_sdd_coordinator_skill_document, agents_skills_sdd_change_skill_document, agents_skills_sdd_clarify_skill_document, agents_skills_sdd_constitution_skill_document, agents_skills_sdd_implement_skill_document, agents_skills_sdd_plan_skill_document, agents_skills_sdd_spec_skill_document, agents_skills_sdd_status_skill_document, agents_skills_sdd_tasks_skill_document, agents_skills_sdd_validate_skill_document [EXTRACTED 1.00]
- **Node Comparison Behavior** — specs_004_comparacion_de_nodos_spec_selection_constraints, specs_004_comparacion_de_nodos_spec_latency_and_packet_loss, specs_004_comparacion_de_nodos_spec_shared_periods, specs_004_comparacion_de_nodos_spec_elapsed_time_axis [EXTRACTED 1.00]
- **Independent Per-Node Outcomes** — specs_004_comparacion_de_nodos_spec_partial_failure_states, specs_004_comparacion_de_nodos_spec_invalid_data_handling, specs_004_comparacion_de_nodos_spec_stale_response_protection [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for simulated metric ranges** — specs_001_rangos_de_metricas_simuladas_spec_document, specs_001_rangos_de_metricas_simuladas_plan_document, specs_001_rangos_de_metricas_simuladas_tasks_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for packet loss chart** — specs_002_grafica_perdida_de_paquetes_spec_document, specs_002_grafica_perdida_de_paquetes_plan_document, specs_002_grafica_perdida_de_paquetes_tasks_document [EXTRACTED 1.00]
- **Truthful, accessible metric evidence** — product_simulated_monitoring_data, product_accessible_chart_alternative, design_evidence_order_rule, specs_003_redisenio_visual_dashboard_spec_simulated_data_truth [INFERRED 0.85]

## Communities (113 total, 65 thin omitted)

### Community 0 - "NetworkNode"
Cohesion: 0.07
Nodes (30): NetworkNode, Default, KeyboardNavigation, meta, Story, isAbortError(), NodeLookupStatus, toError() (+22 more)

### Community 1 - "node-metrics-comparison-chart.tsx"
Cohesion: 0.08
Nodes (25): buildComparisonSeries(), ComparisonChartRow, ComparisonMetric, ComparisonMetricChart(), ComparisonSeries, ComparisonSeriesPoint, ComparisonTooltip(), ComparisonTooltipEntry (+17 more)

### Community 2 - "NetworkMonitoringApiTests"
Cohesion: 0.09
Nodes (25): DateTimeOffset, IReadOnlyList, MetricPoint, NetworkNode, NodeMetrics, Program, DateTimeOffset, IReadOnlyList (+17 more)

### Community 3 - "use-node-metrics.ts"
Cohesion: 0.20
Nodes (15): isAbortError(), MetricsSnapshot, NodeMetricsStatus, StoredMetricsSnapshot, toError(), useNodeMetrics(), UseNodeMetricsState, assertValidMetricPoints() (+7 more)

### Community 4 - "Approved Spec 004 — Node Comparison"
Cohesion: 0.07
Nodes (31): CI Quality Checks, Production Verification Guidance for Packet-Loss Chart, Stale Graph Snapshot for Packet-Loss Chart, Non-Failing Storybook Chunk Warning, Vercel Frontend Deployment, test:e2e:full-stack, Full-stack Playwright smoke test, Accessible Comparison Table (+23 more)

### Community 5 - "SDD Router Skill"
Cohesion: 0.13
Nodes (31): Repository Agent Instructions, Feature Skill, SDD Change Skill, SDD Clarify Skill, SDD Constitution Skill, Separate SDD Approval Gates, SDD Coordinator Skill, SDD Implement Skill (+23 more)

### Community 6 - "Spec 003 visual redesign requirements"
Cohesion: 0.10
Nodes (21): Network Monitoring Dashboard design system, Evidence Margin layout rule, Evidence Order Rule, Reduced-motion design behavior, WCAG contrast and control-boundary requirements, Graphify output versioning decision, Semantic table as chart alternative, Equal-priority operator and portfolio-evaluator audiences (+13 more)

### Community 7 - "scripts"
Cohesion: 0.07
Nodes (27): dependencies, react, react-dom, react-router, recharts, engines, node, name (+19 more)

### Community 8 - "use-node-metrics.test.ts"
Cohesion: 0.18
Nodes (8): createService(), EXPECTED_POINT_COUNTS, expectMetricsError(), expectMetricsSuccess(), INVALID_SAMPLE_COUNTS, METRICS, METRICS_RANGES, WINDOW_DURATION_MS

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 10 - "compilerOptions"
Cohesion: 0.10
Nodes (20): node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+12 more)

### Community 11 - "use-node-comparison.ts"
Cohesion: 0.33
Nodes (8): createLoadingStates(), isAbortError(), NodeComparisonState, NodeComparisonStatus, StoredComparisonSnapshot, toError(), useNodeComparison(), UseNodeComparisonState

### Community 12 - "router.tsx"
Cohesion: 0.17
Nodes (8): ref_react_dom_client, ref_react_router_dom, NotFoundPage(), AppRouter(), appRoutes, ComparisonRouteFallback(), router, src_index

### Community 13 - "network-node-card.tsx"
Cohesion: 0.18
Nodes (11): formatNodeDate(), NetworkNodeCard(), NetworkNodeCardProps, NODE_DATE_FORMATTER, NODE_TIME_FORMATTER, STATUS_LABELS, Degraded, meta (+3 more)

### Community 14 - "Spec 005 — Resumen por nodo en la comparación"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 15 - "node-packet-loss-chart.tsx"
Cohesion: 0.11
Nodes (18): ref_storybook_test, NetworkNodesErrorState(), NetworkNodesErrorStateProps, Default, meta, RetryInteraction, Story, CHART_COLORS (+10 more)

### Community 16 - "network.ts"
Cohesion: 0.05
Nodes (48): App(), MetricPoint, NodeStatus, NetworkNodeNotFoundState(), NetworkNodeNotFoundStateProps, NetworkNodesPanel(), NetworkNodesPanelProps, StatusFilter (+40 more)

### Community 17 - "node-latency-chart.tsx"
Cohesion: 0.32
Nodes (7): CHART_COLORS, formatMetricDate(), formatMetricTime(), LatencyChartPoint, NodeLatencyChart(), NodeLatencyChartProps, expectChartsShareMetrics()

### Community 18 - "network-node-comparison-page.test.tsx"
Cohesion: 0.18
Nodes (4): Deferred, EXPECTED_SUMMARIES, NODE_IDS, RANGE_DETAILS

### Community 19 - "Plan 005 — Resumen por nodo en la comparación"
Cohesion: 0.29
Nodes (6): Archivos y responsabilidades, Enfoque técnico, Plan 005 — Resumen por nodo en la comparación, Riesgos y límites, Trazabilidad de requisitos, Verificación

### Community 20 - "AGENTS.md — Network Monitoring Dashboard"
Cohesion: 0.18
Nodes (10): AGENTS.md — Network Monitoring Dashboard, Comandos, Convenciones, Forma de trabajar, Límites, Memoria, Reglas, Reglas de dominio / trampas conocidas (+2 more)

### Community 21 - "NetworkMonitoring.Api.Tests.csproj"
Cohesion: 0.17
Nodes (10): net10.0, net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.Mvc.Testing (10.0.12), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.NET.Test.Sdk (17.14.1), xunit (2.9.3), xunit.runner.visualstudio (3.1.4) (+2 more)

### Community 22 - "Spec 001 — Rangos de métricas simuladas"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 23 - "Spec 002 — Gráfica de pérdida de paquetes"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 24 - "http"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 25 - "Plan 001 — Rangos de métricas simuladas"
Cohesion: 0.20
Nodes (9): Alcance y enfoque, Alternativas consideradas, Capas y archivos previstos, Conflictos documentales conocidos, Enfoque técnico, Estrategia de verificación, Plan 001 — Rangos de métricas simuladas, Riesgos y mitigaciones (+1 more)

### Community 26 - "use-node-comparison.test.ts"
Cohesion: 0.22
Nodes (4): Deferred, NODE_IDS, NodeComparisonState, RANGE_CASES

### Community 27 - "Plan 002 — Gráfica de pérdida de paquetes"
Cohesion: 0.22
Nodes (8): Alcance y enfoque, Alternativas consideradas, Archivos previstos, Enfoque técnico, Estrategia de verificación, Plan 002 — Gráfica de pérdida de paquetes, Riesgos y mitigaciones, Trazabilidad de requisitos y evidencia

### Community 28 - "NodeMetrics"
Cohesion: 0.48
Nodes (6): MetricsRange, NodeMetrics, ComparisonMetricChartProps, NodeMetricsComparisonChartProps, PendingRequest, PendingRequest

### Community 29 - "devDependencies"
Cohesion: 0.22
Nodes (9): @chromatic-com/storybook, devDependencies, @chromatic-com/storybook, @storybook/addon-vitest, @storybook/react-vite, @vitest/browser-playwright, @storybook/addon-vitest, @storybook/react-vite (+1 more)

### Community 30 - "network-nodes-empty-state.stories.tsx"
Cohesion: 0.40
Nodes (4): NetworkNodesEmptyState(), Default, meta, Story

### Community 31 - "metrics-validation.test.ts"
Cohesion: 0.40
Nodes (3): createMetrics(), createPoints(), RANGE_CASES

### Community 32 - "network-nodes-skeleton.stories.tsx"
Cohesion: 0.33
Nodes (5): NetworkNodesSkeleton(), SKELETON_ITEMS, Default, meta, Story

### Community 33 - "Coordinación SDD"
Cohesion: 0.33
Nodes (5): Aprobaciones y límites, Coordinación SDD, Delegación, Idioma, archivos y entrega, QA automático de specs

### Community 34 - "MEMORY.md — Dashboard"
Cohesion: 0.33
Nodes (5): Aprendizajes y errores a evitar, Decisiones (y por qué), Estado actual, MEMORY.md — Dashboard, Próximos pasos

### Community 35 - "Q: Como comparo los nodos?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Como comparo los nodos?, Source Nodes

### Community 36 - "Cambios pequeños"
Cohesion: 0.40
Nodes (4): Cambios pequeños, Ejecución, Límites, Verificación y entrega

### Community 37 - "Q: Perfecto, como compruebo que todo este correcto?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, como compruebo que todo este correcto?, Source Nodes

### Community 38 - "Q: ¿queda algo pendiente?"
Cohesion: 0.40
Nodes (5): Graphify Query: Remaining Work Status, Answer, Outcome, Q: ¿queda algo pendiente?, Source Nodes

### Community 39 - "Q: Que otros cambios me recomiendas añadir al proyecto?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Que otros cambios me recomiendas añadir al proyecto?, Source Nodes

### Community 40 - "Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?, Source Nodes

### Community 41 - "Q: Perfecto, que mas me recomiendas hacerle al dashboard?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que mas me recomiendas hacerle al dashboard?, Source Nodes

### Community 42 - "Q: Perfecto, que otras mejoras me recomiendas implementar?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que otras mejoras me recomiendas implementar?, Source Nodes

### Community 43 - "Historical Packet-Loss Completion Check"
Cohesion: 0.50
Nodes (4): Historical Packet-Loss Completion Check, Packet-Loss T-005 Status on 2026-10-18, Production Screenshot Evidence, Graph Snapshot Cannot Verify Current Packet-Loss Status

### Community 44 - "vite.config.ts"
Cohesion: 0.50
Nodes (3): ref_node_path, ref_storybook_addon_vitest_vitest_plugin, ref_vitest_config

## Knowledge Gaps
- **356 isolated node(s):** `config`, `preview`, `net10.0`, `coverlet.collector (6.0.4)`, `Microsoft.AspNetCore.Mvc.Testing (10.0.12)` (+351 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **65 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `Full-stack Playwright smoke test` (3× useful, score=2.888653995)
- `network-nodes-panel.tsx` (2× useful, score=1.96407613)
- `NetworkMonitoringService` (2× useful, score=1.927507945)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`, `storybook`, `@testing-library/dom`, `eslint`, `eslint-config-prettier`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-storybook`, `globals`, `jsdom`, `playwright`, `@playwright/test`, `prettier`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-onboarding`, `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`, `@types/node`, `@types/react`, `@types/react-dom`, `typescript`, `typescript-eslint`, `vite`, `@vitejs/plugin-react`, `vitest`, `@vitest/browser`, `@vitest/browser-preview`, `@vitest/coverage-v8`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `NodeMetrics` connect `NodeMetrics` to `NetworkNode`, `node-metrics-comparison-chart.tsx`, `use-node-metrics.ts`, `use-node-metrics.test.ts`, `use-node-comparison.ts`, `node-packet-loss-chart.tsx`, `network.ts`, `node-latency-chart.tsx`, `network-node-comparison-page.test.tsx`, `use-node-comparison.test.ts`, `metrics-validation.test.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `NetworkNode` connect `NetworkNode` to `use-node-metrics.ts`, `use-node-comparison.ts`, `network-node-card.tsx`, `network.ts`, `network-node-comparison-page.test.tsx`, `NodeMetrics`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `config`, `preview`, `net10.0` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NetworkNode` be split into smaller, more focused modules?**
  _Cohesion score 0.07080200501253132 - nodes in this community are weakly interconnected._
- **Should `node-metrics-comparison-chart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._
- **Should `NetworkMonitoringApiTests` be split into smaller, more focused modules?**
  _Cohesion score 0.08819345661450925 - nodes in this community are weakly interconnected._