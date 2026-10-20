# Graph Report - Dashboard  (2026-10-19)

## Corpus Check
- 28 files · ~64,958 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 837 nodes · 1212 edges · 132 communities (64 shown, 68 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 16,166 input · 4,440 output

## Community Hubs (Navigation)
- API Integration Test Suite
- Project Scripts and Dependencies
- Fleet Metrics Validation
- SDD Governance and Constitution
- App TypeScript Compiler Settings
- Tooling TypeScript Compiler Settings
- Visual Redesign Requirements
- Node Comparison Charts
- Node Comparison Workflow
- Node Detail Page Tests
- Node Metrics Hook Tests
- App Routing and Navigation
- Node Detail Metric Summary
- Demo Fixtures and Stories
- Comparison Page Tests
- Fleet Summary Specifications
- Packet Loss Trend Chart
- Network Node Card UI
- Latency Trend Chart
- Repository Agent Instructions
- .NET API Test Project
- Simulated Metrics Range Spec
- Packet Loss Chart Requirements
- Comparison Summary Requirements
- Monitoring Service Contracts
- HTTP and Mock Services
- ASP.NET Launch Settings
- Metrics Range Implementation Plan
- Node Comparison Requirements
- Node Entity and Mock Service
- Comparison Hook Tests
- Error State Component Stories
- Packet Loss Chart Implementation Plan
- Node Comparison Implementation Plan
- Inventory Panel and App
- Comparison Chart Test Suite
- Inventory Data Hook
- Frontend and Storybook Dependencies
- Single Node Lookup Hook
- HTTP API Client
- Metric Summary Concepts
- Comparison Summary Plan
- Loading State UI
- SDD Coordination Workflow
- Project Memory and Decisions
- Empty Inventory State
- Feature Change Workflow
- Production Acceptance Evidence
- Historical Completion Evidence
- Dashboard Improvement Discussion
- Inventory Trust and Accessibility
- Node Detail Summary Discussion
- Node Comparison Discussion
- Dashboard Improvement Recommendations
- Metrics Domain and Comparison UI
- Inventory Panel Story
- Comparison Chart Story
- Node Detail Story
- Playwright E2E Scenarios
- Packet Loss Acceptance Evidence
- Vite and Vitest Configuration
- Comparison URL Actions
- Missing Node State
- TypeScript Project References
- Vercel Route Rewrites
- SDD Change Skill
- SDD Clarification Skill
- SDD Constitution Skill
- SDD Implementation Skill
- SDD Planning Skill
- SDD Request Routing
- SDD Specification Skill
- SDD Status Skill
- SDD Task Authoring Skill
- SDD Acceptance Validation
- Chromatic Storybook Integration
- Project Constitution Document
- ESLint Code Linter
- ESLint Config Reference
- Prettier ESLint Integration
- JavaScript ESLint Rules
- React Hooks Lint Rules
- React Refresh Lint Rules
- Storybook Lint Rules
- JavaScript Environment Globals
- DOM Test Environment
- Playwright Test Runner
- Playwright Test Type Definitions
- Prettier Code Formatter
- Storybook Accessibility Addon
- Storybook Documentation Addon
- Storybook Onboarding Addon
- Storybook Vitest Addon
- React Testing Library
- User Event Testing Library
- Node.js Type Definitions
- React Type Definitions
- React DOM Type Definitions
- TypeScript Compiler
- TypeScript ESLint Integration
- Vite Build Tool
- React Vite Plugin
- Vitest Test Runner
- Vitest Browser Support
- Playwright Browser Provider
- Vitest Browser Preview
- Vitest Coverage Plugin
- Playwright Port Configuration
- Bluesky Icon Vector
- Vitest Test Setup
- Metrics Range Task Checklist
- Packet Loss Task Checklist
- Comparison Summary Tasks
- Storybook Main Configuration
- Storybook Preview Configuration
- API Container Image
- Shareable Node Links Discussion
- Dashboard Favicon Artwork
- Discord Brand Icon
- Documentation Link Icon
- GitHub Brand Icon
- Social Media Icon
- X Brand Icon
- Approved Visual Direction
- Graphify Completion Procedure
- Dashboard Hero Artwork
- React Brand Logo
- Vite Brand Logo

## God Nodes (most connected - your core abstractions)
1. `NetworkNode` - 34 edges
2. `NodeMetrics` - 31 edges
3. `NetworkMonitoringService` - 30 edges
4. `MetricsRange` - 24 edges
5. `NetworkMonitoringApiTests` - 21 edges
6. `compilerOptions` - 18 edges
7. `NetworkNodeNotFoundError` - 15 edges
8. `compilerOptions` - 15 edges
9. `scripts` - 13 edges
10. `SDD Router Skill` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Honest simulated-data presentation requirement` --semantically_similar_to--> `Explicitly simulated monitoring records`  [INFERRED] [semantically similar]
  specs/003-redisenio-visual-dashboard/spec.md → PRODUCT.md
- `Node-detail metric summary` --semantically_similar_to--> `Per-node comparison KPIs`  [INFERRED] [semantically similar]
  graphify-out/memory/query_20261018_081722_perfecto__que_mas_me_recomiendas_hacerle_al_dashbo.md → specs/005-resumen-por-nodo-en-comparacion/spec.md
- `Per-node comparison summary` --semantically_similar_to--> `Per-node comparison KPIs`  [INFERRED] [semantically similar]
  graphify-out/memory/query_20261019_215135_perfecto__que_otras_mejoras_me_recomiendas_impleme.md → specs/005-resumen-por-nodo-en-comparacion/spec.md
- `Production Verification Guidance for Packet-Loss Chart` --references--> `Full-stack Playwright smoke test`  [EXTRACTED]
  graphify-out/memory/query_20261018_062535_perfecto__como_compruebo_que_todo_este_correcto.md → e2e/full-stack.spec.ts
- `SDD Change Skill` --references--> `Spec 001: Simulated Metrics Ranges`  [INFERRED]
  .agents/skills/sdd-change/SKILL.md → specs/001-rangos-de-metricas-simuladas/spec.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard change request routing and SDD phases** — agents_skills_sdd_skill_document, agents_skills_feature_skill_document, agents_skills_sdd_coordinator_skill_document, agents_skills_sdd_change_skill_document, agents_skills_sdd_clarify_skill_document, agents_skills_sdd_constitution_skill_document, agents_skills_sdd_implement_skill_document, agents_skills_sdd_plan_skill_document, agents_skills_sdd_spec_skill_document, agents_skills_sdd_status_skill_document, agents_skills_sdd_tasks_skill_document, agents_skills_sdd_validate_skill_document [EXTRACTED 1.00]
- **Node Comparison Behavior** — specs_004_comparacion_de_nodos_spec_selection_constraints, specs_004_comparacion_de_nodos_spec_latency_and_packet_loss, specs_004_comparacion_de_nodos_spec_shared_periods, specs_004_comparacion_de_nodos_spec_elapsed_time_axis [EXTRACTED 1.00]
- **Independent Per-Node Outcomes** — specs_004_comparacion_de_nodos_spec_partial_failure_states, specs_004_comparacion_de_nodos_spec_invalid_data_handling, specs_004_comparacion_de_nodos_spec_stale_response_protection [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for simulated metric ranges** — specs_001_rangos_de_metricas_simuladas_spec_document, specs_001_rangos_de_metricas_simuladas_plan_document, specs_001_rangos_de_metricas_simuladas_tasks_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for packet loss chart** — specs_002_grafica_perdida_de_paquetes_spec_document, specs_002_grafica_perdida_de_paquetes_plan_document, specs_002_grafica_perdida_de_paquetes_tasks_document [EXTRACTED 1.00]
- **Truthful, accessible metric evidence** — product_simulated_monitoring_data, product_accessible_chart_alternative, design_evidence_order_rule, specs_003_redisenio_visual_dashboard_spec_simulated_data_truth [INFERRED 0.85]
- **Spec 005 specification, plan, and task lifecycle** — specs_005_resumen_por_nodo_en_comparacion_spec_document, specs_005_resumen_por_nodo_en_comparacion_plan_document, specs_005_resumen_por_nodo_en_comparacion_tasks_document [INFERRED 0.95]
- **Spec 006 specification, plan, and task lifecycle** — specs_006_resumen_de_salud_de_la_flota_spec_document, specs_006_resumen_de_salud_de_la_flota_plan_document, specs_006_resumen_de_salud_de_la_flota_tasks_document [INFERRED 0.95]

## Communities (132 total, 68 thin omitted)

### Community 0 - "API Integration Test Suite"
Cohesion: 0.09
Nodes (25): DateTimeOffset, IReadOnlyList, MetricPoint, NetworkNode, NodeMetrics, Program, DateTimeOffset, IReadOnlyList (+17 more)

### Community 1 - "Project Scripts and Dependencies"
Cohesion: 0.05
Nodes (34): CI Quality Checks, Production Verification Guidance for Packet-Loss Chart, Stale Graph Snapshot for Packet-Loss Chart, Non-Failing Storybook Chunk Warning, Vercel Frontend Deployment, dependencies, react, react-dom (+26 more)

### Community 2 - "Fleet Metrics Validation"
Cohesion: 0.08
Nodes (27): createLoadingState(), EMPTY_FAILED_NODE_IDS, EMPTY_METRICS, FleetHealthSummaryData, FleetHealthSummaryStatus, FleetMetricsCoverage, FleetMetricsSummary, summarizeFleetMetrics() (+19 more)

### Community 3 - "SDD Governance and Constitution"
Cohesion: 0.13
Nodes (31): Repository Agent Instructions, Feature Skill, SDD Change Skill, SDD Clarify Skill, SDD Constitution Skill, Separate SDD Approval Gates, SDD Coordinator Skill, SDD Implement Skill (+23 more)

### Community 4 - "App TypeScript Compiler Settings"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 5 - "Tooling TypeScript Compiler Settings"
Cohesion: 0.10
Nodes (20): node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+12 more)

### Community 6 - "Visual Redesign Requirements"
Cohesion: 0.12
Nodes (19): Network Monitoring Dashboard design system, Evidence Margin layout rule, Evidence Order Rule, Reduced-motion design behavior, WCAG contrast and control-boundary requirements, Semantic table as chart alternative, Equal-priority operator and portfolio-evaluator audiences, Full-stack portfolio demonstration (+11 more)

### Community 7 - "Node Comparison Charts"
Cohesion: 0.15
Nodes (17): buildComparisonSeries(), ComparisonChartRow, ComparisonMetric, ComparisonMetricChart(), ComparisonSeries, ComparisonSeriesPoint, ComparisonTooltip(), ComparisonTooltipEntry (+9 more)

### Community 8 - "Node Comparison Workflow"
Cohesion: 0.17
Nodes (13): createLoadingStates(), isAbortError(), NodeComparisonState, NodeComparisonStatus, toError(), useNodeComparison(), EMPTY_NODE_NAMES, METRICS_RANGES (+5 more)

### Community 9 - "Node Detail Page Tests"
Cohesion: 0.12
Nodes (6): createMetrics(), expectPeakLossObservation(), RANGE_FIXTURES, RANGE_SUMMARIES, RANGE_TITLES, TEST_NODE

### Community 10 - "Node Metrics Hook Tests"
Cohesion: 0.16
Nodes (11): isAbortError(), createService(), EXPECTED_POINT_COUNTS, expectMetricsError(), expectMetricsSuccess(), INVALID_SAMPLE_COUNTS, METRICS, METRICS_RANGES (+3 more)

### Community 11 - "App Routing and Navigation"
Cohesion: 0.17
Nodes (8): ref_react_dom_client, ref_react_router_dom, NotFoundPage(), AppRouter(), appRoutes, ComparisonRouteFallback(), router, src_index

### Community 12 - "Node Detail Metric Summary"
Cohesion: 0.21
Nodes (12): MetricPoint, formatMetricValue(), MetricsSummary, summarizeMetrics(), formatMetricTime(), formatNodeDate(), getMetricsHeading(), getMetricsRange() (+4 more)

### Community 13 - "Demo Fixtures and Stories"
Cohesion: 0.15
Nodes (11): comparisonService, Default, meta, NODE_IDS, Story, FIXTURE_ANCHOR_TIMESTAMP_MS, FixtureNodeId, HistoricalMetricsProfile (+3 more)

### Community 14 - "Comparison Page Tests"
Cohesion: 0.14
Nodes (5): Deferred, EXPECTED_SUMMARIES, NODE_IDS, PendingRequest, RANGE_DETAILS

### Community 15 - "Fleet Summary Specifications"
Cohesion: 0.21
Nodes (13): Dashboard improvement recommendations: truthful inventory and accessibility, Inventory demo disclosure and chart accessibility status, How to compare nodes, Dashboard project memory, NetworkMonitoringService boundary, Honest simulated-data disclosure, Tasks 004: Node comparison, Plan 005: Per-node comparison summary (+5 more)

### Community 16 - "Packet Loss Trend Chart"
Cohesion: 0.19
Nodes (11): CHART_COLORS, formatMetricDate(), formatMetricTime(), NodePacketLossChart(), NodePacketLossChartProps, PacketLossChartPoint, BoundaryValues, KeyboardNavigation (+3 more)

### Community 17 - "Network Node Card UI"
Cohesion: 0.20
Nodes (10): formatNodeDate(), NetworkNodeCard(), NODE_DATE_FORMATTER, NODE_TIME_FORMATTER, STATUS_LABELS, Degraded, meta, Offline (+2 more)

### Community 18 - "Latency Trend Chart"
Cohesion: 0.21
Nodes (10): CHART_COLORS, formatMetricDate(), formatMetricTime(), LatencyChartPoint, NodeLatencyChart(), Default, KeyboardNavigation, meta (+2 more)

### Community 19 - "Repository Agent Instructions"
Cohesion: 0.18
Nodes (10): AGENTS.md — Network Monitoring Dashboard, Comandos, Convenciones, Forma de trabajar, Límites, Memoria, Reglas, Reglas de dominio / trampas conocidas (+2 more)

### Community 20 - ".NET API Test Project"
Cohesion: 0.20
Nodes (9): net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.Mvc.Testing (10.0.12), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.NET.Test.Sdk (17.14.1), xunit (2.9.3), xunit.runner.visualstudio (3.1.4), Microsoft.NET.Sdk (+1 more)

### Community 21 - "Simulated Metrics Range Spec"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 22 - "Packet Loss Chart Requirements"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 23 - "Comparison Summary Requirements"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 24 - "Monitoring Service Contracts"
Cohesion: 0.27
Nodes (7): MetricsRange, StoredComparisonSnapshot, UseNodeComparisonState, MetricsSnapshot, NodeMetricsStatus, StoredMetricsSnapshot, NetworkMonitoringService

### Community 25 - "HTTP and Mock Services"
Cohesion: 0.40
Nodes (3): NETWORK_NODES, NetworkNodeNotFoundError, NetworkRequestError

### Community 26 - "ASP.NET Launch Settings"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 27 - "Metrics Range Implementation Plan"
Cohesion: 0.20
Nodes (9): Alcance y enfoque, Alternativas consideradas, Capas y archivos previstos, Conflictos documentales conocidos, Enfoque técnico, Estrategia de verificación, Plan 001 — Rangos de métricas simuladas, Riesgos y mitigaciones (+1 more)

### Community 28 - "Node Comparison Requirements"
Cohesion: 0.27
Nodes (10): Accessible Text Alternative for Charts, Approved Spec 004 — Node Comparison, Per-Node Elapsed-Time Axis with Original UTC Timestamps, Per-Node Invalid Metrics Validation, Compare Latency and Packet Loss, Per-Node Partial Failure and Empty States, Select Two or Three Nodes, Shared Periods: 1h, 24h, and 7d (+2 more)

### Community 30 - "Node Entity and Mock Service"
Cohesion: 0.38
Nodes (5): NetworkNode, NetworkNodeCardProps, MockNetworkMonitoringService, MockNetworkMonitoringServiceOptions, waitForResponse()

### Community 31 - "Comparison Hook Tests"
Cohesion: 0.20
Nodes (5): Deferred, NODE_IDS, NodeComparisonState, PendingRequest, RANGE_CASES

### Community 32 - "Error State Component Stories"
Cohesion: 0.25
Nodes (7): ref_storybook_test, NetworkNodesErrorState(), NetworkNodesErrorStateProps, Default, meta, RetryInteraction, Story

### Community 33 - "Packet Loss Chart Implementation Plan"
Cohesion: 0.22
Nodes (8): Alcance y enfoque, Alternativas consideradas, Archivos previstos, Enfoque técnico, Estrategia de verificación, Plan 002 — Gráfica de pérdida de paquetes, Riesgos y mitigaciones, Trazabilidad de requisitos y evidencia

### Community 34 - "Node Comparison Implementation Plan"
Cohesion: 0.25
Nodes (9): Accessible Comparison Table, Dedicated /compare Route with Selected IDs in URL, Approved Plan 004 — Node Comparison, Elapsed-Time Alignment Within Each Node Window, Independent State per Compared Node, Inventory-Based Node Selection, Parallel Per-Node Metrics Loading, NetworkMonitoringService Data Boundary (+1 more)

### Community 35 - "Inventory Panel and App"
Cohesion: 0.25
Nodes (7): App(), NodeStatus, NetworkNodesPanel(), NetworkNodesPanelProps, STATUS_LABELS, STATUS_ORDER, StatusFilter

### Community 36 - "Comparison Chart Test Suite"
Cohesion: 0.22
Nodes (4): NodeMetricsComparisonChart(), ACCESS_SWITCH_METRICS, CORE_ROUTER_METRICS, FixedResizeObserver

### Community 37 - "Inventory Data Hook"
Cohesion: 0.31
Nodes (8): createLoadingState(), EMPTY_NODES, isAbortError(), NetworkNodesData, NetworkNodesStatus, toError(), useNetworkNodes(), UseNetworkNodesState

### Community 38 - "Frontend and Storybook Dependencies"
Cohesion: 0.29
Nodes (8): devDependencies, storybook, @storybook/react-vite, @testing-library/dom, @testing-library/jest-dom, storybook, @storybook/react-vite, @testing-library/dom

### Community 39 - "Single Node Lookup Hook"
Cohesion: 0.36
Nodes (5): isAbortError(), NodeLookupStatus, toError(), useNetworkNode(), UseNetworkNodeState

### Community 41 - "Metric Summary Concepts"
Cohesion: 0.29
Nodes (7): Node-detail metric summary, Node-detail metric summary recommendation, Per-node comparison summary, Comparison improvement recommendations, Fleet-health summary recommendation, Per-node comparison KPIs, Fleet-health summary

### Community 42 - "Comparison Summary Plan"
Cohesion: 0.29
Nodes (6): Archivos y responsabilidades, Enfoque técnico, Plan 005 — Resumen por nodo en la comparación, Riesgos y límites, Trazabilidad de requisitos, Verificación

### Community 43 - "Loading State UI"
Cohesion: 0.33
Nodes (5): NetworkNodesSkeleton(), SKELETON_ITEMS, Default, meta, Story

### Community 44 - "SDD Coordination Workflow"
Cohesion: 0.33
Nodes (5): Aprobaciones y límites, Coordinación SDD, Delegación, Idioma, archivos y entrega, QA automático de specs

### Community 45 - "Project Memory and Decisions"
Cohesion: 0.33
Nodes (5): Aprendizajes y errores a evitar, Decisiones (y por qué), Estado actual, MEMORY.md — Dashboard, Próximos pasos

### Community 46 - "Empty Inventory State"
Cohesion: 0.40
Nodes (4): NetworkNodesEmptyState(), Default, meta, Story

### Community 47 - "Feature Change Workflow"
Cohesion: 0.40
Nodes (4): Cambios pequeños, Ejecución, Límites, Verificación y entrega

### Community 48 - "Production Acceptance Evidence"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, como compruebo que todo este correcto?, Source Nodes

### Community 49 - "Historical Completion Evidence"
Cohesion: 0.40
Nodes (5): Graphify Query: Remaining Work Status, Answer, Outcome, Q: ¿queda algo pendiente?, Source Nodes

### Community 50 - "Dashboard Improvement Discussion"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Que otros cambios me recomiendas añadir al proyecto?, Source Nodes

### Community 51 - "Inventory Trust and Accessibility"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?, Source Nodes

### Community 52 - "Node Detail Summary Discussion"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que mas me recomiendas hacerle al dashboard?, Source Nodes

### Community 53 - "Node Comparison Discussion"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Como comparo los nodos?, Source Nodes

### Community 54 - "Dashboard Improvement Recommendations"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que otras mejoras me recomiendas implementar?, Source Nodes

### Community 55 - "Metrics Domain and Comparison UI"
Cohesion: 0.40
Nodes (5): NodeMetrics, NodeLatencyChartProps, ComparisonMetricChartProps, NodeMetricsComparisonChartProps, UseNodeMetricsState

### Community 56 - "Inventory Panel Story"
Cohesion: 0.40
Nodes (4): Default, meta, NetworkNodesPanelStoryArgs, Story

### Community 57 - "Comparison Chart Story"
Cohesion: 0.40
Nodes (4): COMPARISON_METRICS, Default, meta, Story

### Community 58 - "Node Detail Story"
Cohesion: 0.40
Nodes (4): EmptyMetrics, emptyMetricsService, meta, Story

### Community 60 - "Packet Loss Acceptance Evidence"
Cohesion: 0.50
Nodes (4): Historical Packet-Loss Completion Check, Packet-Loss T-005 Status on 2026-10-18, Production Screenshot Evidence, Graph Snapshot Cannot Verify Current Packet-Loss Status

### Community 61 - "Vite and Vitest Configuration"
Cohesion: 0.50
Nodes (3): ref_node_path, ref_storybook_addon_vitest_vitest_plugin, ref_vitest_config

### Community 62 - "Comparison URL Actions"
Cohesion: 0.50
Nodes (3): getComparisonHeading(), getMetricsRange(), NetworkNodeComparisonPage()

## Knowledge Gaps
- **376 isolated node(s):** `Story`, `NodeLookupStatus`, `Story`, `FixtureNodeId`, `HistoricalMetricsProfile` (+371 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **68 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `NodeMetrics` connect `Metrics Domain and Comparison UI` to `Fleet Metrics Validation`, `Comparison Chart Test Suite`, `Node Comparison Charts`, `Node Comparison Workflow`, `Node Detail Page Tests`, `Node Metrics Hook Tests`, `HTTP API Client`, `Demo Fixtures and Stories`, `Comparison Page Tests`, `Packet Loss Trend Chart`, `Latency Trend Chart`, `Node Entity and Mock Service`, `Monitoring Service Contracts`, `Comparison Chart Story`, `Network Domain and Inventory Tests`, `HTTP and Mock Services`, `Comparison Hook Tests`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `NetworkNode` connect `Node Entity and Mock Service` to `Fleet Metrics Validation`, `Inventory Panel and App`, `Inventory Data Hook`, `Single Node Lookup Hook`, `Node Comparison Workflow`, `Node Detail Page Tests`, `HTTP API Client`, `Node Detail Metric Summary`, `Demo Fixtures and Stories`, `Comparison Page Tests`, `Network Node Card UI`, `Monitoring Service Contracts`, `HTTP and Mock Services`, `Network Domain and Inventory Tests`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `NetworkMonitoringService` connect `Monitoring Service Contracts` to `Fleet Metrics Validation`, `Inventory Panel and App`, `Inventory Data Hook`, `Single Node Lookup Hook`, `Node Comparison Workflow`, `Node Detail Page Tests`, `Node Metrics Hook Tests`, `HTTP API Client`, `Node Detail Metric Summary`, `Demo Fixtures and Stories`, `Comparison Page Tests`, `Inventory Panel Story`, `HTTP and Mock Services`, `Node Detail Story`, `Network Domain and Inventory Tests`, `Node Entity and Mock Service`, `Comparison Hook Tests`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `Story`, `NodeLookupStatus`, `Story` to the rest of the system?**
  _376 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Integration Test Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.08819345661450925 - nodes in this community are weakly interconnected._
- **Should `Project Scripts and Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Fleet Metrics Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._