# Graph Report - Dashboard  (2026-10-19)

## Corpus Check
- 55 files · ~63,060 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 795 nodes · 1125 edges · 112 communities (49 shown, 63 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Network UI Stories and Statuses
- Charts, Stories, and Error States
- ASP.NET API Contracts
- Node Metrics Request State
- CI and Deployment Checks
- Repository Agent Workflow
- Evidence-First Visual System
- Frontend Runtime Dependencies
- Node Details Evidence Layout
- Frontend Type Configuration
- Build and Test Tooling
- Node Comparison State
- Application Routes
- Network Node Card
- Node Detail and Not Found State
- Packet Loss Chart
- Node Details Page Tests
- Latency Trend Chart
- Domain Contracts and Comparison Tests
- Node Inventory Panel
- Repository Contributor Guide
- .NET API Test Tooling
- Metrics Range Specification
- Packet Loss Specification
- .NET Launch Configuration
- Metrics Range Implementation Plan
- Node Comparison Hook Tests
- Packet Loss Implementation Plan
- Network API Service Boundary
- Storybook Dependencies
- Node Inventory Hook
- Node Search and Status Filter
- Node Loading Skeleton
- SDD Coordinator Process
- Project Memory and Decisions
- Node Inventory Design
- Feature Skill Workflow
- Packet Loss Verification Notes
- Historical Completion Review
- Dashboard Feature Recommendations
- Honest Inventory and Chart Accessibility
- Dashboard Improvement Notes
- Empty State Storybook
- Packet Loss Acceptance Evidence
- Vite and Vitest Integration
- Codex Coordinator Profile
- TypeScript Project References
- Vercel Routing Rules
- SDD Change Skill
- SDD Clarification Skill
- SDD Constitution Skill
- SDD Implementation Skill
- SDD Planning Skill
- SDD Router Skill
- SDD Specification Skill
- SDD Status Skill
- SDD Task Breakdown Skill
- SDD Validation Skill
- Chromatic Storybook Package
- Project Constitution
- ESLint Package
- ESLint Configuration
- Prettier ESLint Compatibility
- ESLint JavaScript Rules
- React Hooks Linting
- React Refresh Linting
- Storybook Linting
- Shared Globals Package
- JSDOM Test Environment
- Playwright Browser Automation
- Playwright Test Framework
- Prettier Formatter
- Storybook Accessibility Addon
- Storybook Documentation Addon
- Storybook Onboarding Addon
- Storybook Vitest Addon
- React Testing Library
- User Event Testing Library
- Node Type Definitions
- React Type Definitions
- React DOM Type Definitions
- TypeScript Compiler
- TypeScript ESLint Parser
- Vite Build Tool
- Vite React Plugin
- Vitest Test Runner
- Vitest Browser Runner
- Vitest Playwright Provider
- Vitest Browser Preview
- Vitest Coverage Provider
- Playwright Port Configuration
- Bluesky Brand Icon
- Jest DOM Test Setup
- Metrics Range Task List
- Packet Loss Task List
- Storybook Configuration
- Storybook Preview
- Docker API Container
- Evidence Review Design Thesis
- Dashboard Brand Favicon
- Discord Icon
- Documentation Icon
- GitHub Icon
- Social Link Icon
- X Brand Icon
- Dashboard Hero Illustration
- React Logo
- Vite Logo

## God Nodes (most connected - your core abstractions)
1. `NetworkMonitoringService` - 25 edges
2. `NetworkNode` - 23 edges
3. `NodeMetrics` - 21 edges
4. `NetworkMonitoringApiTests` - 21 edges
5. `MetricsRange` - 19 edges
6. `compilerOptions` - 18 edges
7. `compilerOptions` - 15 edges
8. `NetworkNodeNotFoundError` - 14 edges
9. `scripts` - 13 edges
10. `SDD Router Skill` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Inventory-to-metrics user journey` --semantically_similar_to--> `Inventory-to-node-metrics flow`  [INFERRED] [semantically similar]
  .impeccable/surfaces/src-app-tsx.md → PRODUCT.md
- `Honest simulated-data presentation requirement` --semantically_similar_to--> `Explicitly simulated monitoring records`  [INFERRED] [semantically similar]
  specs/003-redisenio-visual-dashboard/spec.md → PRODUCT.md
- `Pending Final Graphify Refresh T-017` --semantically_similar_to--> `Stale Graph Snapshot for Packet-Loss Chart`  [INFERRED] [semantically similar]
  specs/004-comparacion-de-nodos/tasks.md → graphify-out/memory/query_20261018_062535_perfecto__como_compruebo_que_todo_este_correcto.md
- `SDD Change Skill` --references--> `Spec 001: Simulated Metrics Ranges`  [INFERRED]
  .agents/skills/sdd-change/SKILL.md → specs/001-rangos-de-metricas-simuladas/spec.md
- `Production Verification Guidance for Packet-Loss Chart` --references--> `Full-stack Playwright smoke test`  [EXTRACTED]
  graphify-out/memory/query_20261018_062535_perfecto__como_compruebo_que_todo_este_correcto.md → e2e/full-stack.spec.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Empty-Metrics Node Detail Composition** — impeccable_review_empty_metrics_desktop_node_details_page, impeccable_review_empty_metrics_desktop_metrics_period_selector, impeccable_review_node_details_mobile_simulated_data_indicator, impeccable_review_empty_metrics_desktop_empty_metrics_state [INFERRED 0.85]
- **Desktop Node Inventory Composition** — _impeccable_review_inventory_desktop_mockup, _impeccable_review_inventory_desktop_simulated_inventory, _impeccable_review_inventory_desktop_node_search_and_status_filter, _impeccable_review_inventory_desktop_health_status_indicators, _impeccable_review_inventory_desktop_compact_node_roster [EXTRACTED 1.00]
- **Approved code-first visual references** — impeccable_mocks_decision_t001_research_journal_applied_research_journal, impeccable_mocks_decision_t003_evidence_margin_evidence_margin, impeccable_surfaces_src_app_tsx_code_first [EXTRACTED 1.00]
- **Truthful, accessible metric evidence** — product_simulated_monitoring_data, product_accessible_chart_alternative, design_evidence_order_rule, specs_003_redisenio_visual_dashboard_spec_simulated_data_truth [INFERRED 0.85]
- **Node Comparison Behavior** — specs_004_comparacion_de_nodos_spec_selection_constraints, specs_004_comparacion_de_nodos_spec_latency_and_packet_loss, specs_004_comparacion_de_nodos_spec_shared_periods, specs_004_comparacion_de_nodos_spec_elapsed_time_axis [EXTRACTED 1.00]
- **Independent Per-Node Outcomes** — specs_004_comparacion_de_nodos_spec_partial_failure_states, specs_004_comparacion_de_nodos_spec_invalid_data_handling, specs_004_comparacion_de_nodos_spec_stale_response_protection [EXTRACTED 1.00]
- **Selected-Period Node Metrics View** — impeccable_review_node_details_mobile_period_selector, _impeccable_review_node_details_desktop_latency_chart, _impeccable_review_node_details_desktop_packet_loss_chart, _impeccable_review_node_details_desktop_measurements_table [INFERRED 0.85]
- **Node Metrics Evidence Composition** — impeccable_review_node_details_mobile_metrics_summary, impeccable_review_node_details_mobile_latency_chart, impeccable_review_node_details_mobile_packet_loss_chart, impeccable_review_node_details_mobile_measurements_table [EXTRACTED 1.00]
- **Dashboard change request routing and SDD phases** — agents_skills_sdd_skill_document, agents_skills_feature_skill_document, agents_skills_sdd_coordinator_skill_document, agents_skills_sdd_change_skill_document, agents_skills_sdd_clarify_skill_document, agents_skills_sdd_constitution_skill_document, agents_skills_sdd_implement_skill_document, agents_skills_sdd_plan_skill_document, agents_skills_sdd_spec_skill_document, agents_skills_sdd_status_skill_document, agents_skills_sdd_tasks_skill_document, agents_skills_sdd_validate_skill_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for simulated metric ranges** — specs_001_rangos_de_metricas_simuladas_spec_document, specs_001_rangos_de_metricas_simuladas_plan_document, specs_001_rangos_de_metricas_simuladas_tasks_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for packet loss chart** — specs_002_grafica_perdida_de_paquetes_spec_document, specs_002_grafica_perdida_de_paquetes_plan_document, specs_002_grafica_perdida_de_paquetes_tasks_document [EXTRACTED 1.00]

## Communities (112 total, 63 thin omitted)

### Community 0 - "Network UI Stories and Statuses"
Cohesion: 0.08
Nodes (27): Degraded, meta, Offline, Online, Story, isAbortError(), NodeLookupStatus, toError() (+19 more)

### Community 1 - "Charts, Stories, and Error States"
Cohesion: 0.06
Nodes (34): ref_storybook_test, NetworkNodesErrorState(), NetworkNodesErrorStateProps, Default, meta, RetryInteraction, Story, buildComparisonSeries() (+26 more)

### Community 2 - "ASP.NET API Contracts"
Cohesion: 0.09
Nodes (25): DateTimeOffset, IReadOnlyList, MetricPoint, NetworkNode, NodeMetrics, Program, DateTimeOffset, IReadOnlyList (+17 more)

### Community 3 - "Node Metrics Request State"
Cohesion: 0.09
Nodes (26): isAbortError(), MetricsSnapshot, NodeMetricsStatus, StoredMetricsSnapshot, createService(), EXPECTED_POINT_COUNTS, expectMetricsError(), expectMetricsSuccess() (+18 more)

### Community 4 - "CI and Deployment Checks"
Cohesion: 0.07
Nodes (31): CI Quality Checks, Production Verification Guidance for Packet-Loss Chart, Stale Graph Snapshot for Packet-Loss Chart, Non-Failing Storybook Chunk Warning, Vercel Frontend Deployment, test:e2e:full-stack, Full-stack Playwright smoke test, Accessible Comparison Table (+23 more)

### Community 5 - "Repository Agent Workflow"
Cohesion: 0.13
Nodes (32): Repository Agent Instructions, Feature Skill, SDD Change Skill, SDD Clarify Skill, SDD Constitution Skill, Separate SDD Approval Gates, SDD Coordinator Skill, SDD Implement Skill (+24 more)

### Community 6 - "Evidence-First Visual System"
Cohesion: 0.08
Nodes (32): Network Monitoring Dashboard design system, Evidence Margin layout rule, Evidence Order Rule, Reduced-motion design behavior, WCAG contrast and control-boundary requirements, Category Standard inventory direction, Night Survey Atlas inventory direction, Applied Research Journal inventory direction (+24 more)

### Community 7 - "Frontend Runtime Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, react, react-dom, react-router, recharts, engines, node, name (+19 more)

### Community 8 - "Node Details Evidence Layout"
Cohesion: 0.12
Nodes (26): Dashboard / Monitored Nodes / Core Router Breadcrumb, Node Latency Trend Chart, Accessible Measurements Table for Both Charts, Core Router Node Overview, Observed Peak Packet-Loss Sample Annotation, Node Packet-Loss Trend Chart, Desktop Node Details Screenshot, Empty Metrics State (+18 more)

### Community 9 - "Frontend Type Configuration"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 10 - "Build and Test Tooling"
Cohesion: 0.10
Nodes (20): node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+12 more)

### Community 11 - "Node Comparison State"
Cohesion: 0.18
Nodes (14): createLoadingStates(), isAbortError(), NodeComparisonState, NodeComparisonStatus, StoredComparisonSnapshot, toError(), useNodeComparison(), UseNodeComparisonState (+6 more)

### Community 12 - "Application Routes"
Cohesion: 0.15
Nodes (9): ref_react_dom_client, ref_react_router_dom, App(), NotFoundPage(), AppRouter(), appRoutes, ComparisonRouteFallback(), router (+1 more)

### Community 13 - "Network Node Card"
Cohesion: 0.15
Nodes (13): NodeStatus, formatNodeDate(), NetworkNodeCard(), NetworkNodeCardProps, NODE_DATE_FORMATTER, NODE_TIME_FORMATTER, STATUS_LABELS, NetworkNodesEmptyState() (+5 more)

### Community 14 - "Node Detail and Not Found State"
Cohesion: 0.21
Nodes (12): MetricPoint, NetworkNodeNotFoundState(), NetworkNodeNotFoundStateProps, formatMetricTime(), formatMetricValue(), formatNodeDate(), getMetricsHeading(), METRICS_RANGES (+4 more)

### Community 15 - "Packet Loss Chart"
Cohesion: 0.18
Nodes (12): CHART_COLORS, formatMetricDate(), formatMetricTime(), NodePacketLossChart(), NodePacketLossChartProps, PacketLossChartPoint, BoundaryValues, KeyboardNavigation (+4 more)

### Community 16 - "Node Details Page Tests"
Cohesion: 0.15
Nodes (6): createMetrics(), expectPeakLossObservation(), RANGE_FIXTURES, RANGE_SUMMARIES, RANGE_TITLES, TEST_NODE

### Community 17 - "Latency Trend Chart"
Cohesion: 0.19
Nodes (11): CHART_COLORS, formatMetricDate(), formatMetricTime(), LatencyChartPoint, NodeLatencyChart(), NodeLatencyChartProps, Default, KeyboardNavigation (+3 more)

### Community 18 - "Domain Contracts and Comparison Tests"
Cohesion: 0.30
Nodes (4): MetricsRange, NodeMetrics, NODE_IDS, RANGE_DETAILS

### Community 19 - "Node Inventory Panel"
Cohesion: 0.18
Nodes (7): NetworkNodesPanel(), Default, meta, NetworkNodesPanelStoryArgs, Story, createMockNetworkMonitoringService(), NetworkMonitoringService

### Community 20 - "Repository Contributor Guide"
Cohesion: 0.18
Nodes (10): AGENTS.md — Network Monitoring Dashboard, Comandos, Convenciones, Forma de trabajar, Límites, Memoria, Reglas, Reglas de dominio / trampas conocidas (+2 more)

### Community 21 - ".NET API Test Tooling"
Cohesion: 0.20
Nodes (9): net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.Mvc.Testing (10.0.12), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.NET.Test.Sdk (17.14.1), xunit (2.9.3), xunit.runner.visualstudio (3.1.4), Microsoft.NET.Sdk (+1 more)

### Community 22 - "Metrics Range Specification"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 23 - "Packet Loss Specification"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 24 - ".NET Launch Configuration"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 25 - "Metrics Range Implementation Plan"
Cohesion: 0.20
Nodes (9): Alcance y enfoque, Alternativas consideradas, Capas y archivos previstos, Conflictos documentales conocidos, Enfoque técnico, Estrategia de verificación, Plan 001 — Rangos de métricas simuladas, Riesgos y mitigaciones (+1 more)

### Community 26 - "Node Comparison Hook Tests"
Cohesion: 0.20
Nodes (5): Deferred, NODE_IDS, NodeComparisonState, PendingRequest, RANGE_CASES

### Community 27 - "Packet Loss Implementation Plan"
Cohesion: 0.22
Nodes (8): Alcance y enfoque, Alternativas consideradas, Archivos previstos, Enfoque técnico, Estrategia de verificación, Plan 002 — Gráfica de pérdida de paquetes, Riesgos y mitigaciones, Trazabilidad de requisitos y evidencia

### Community 28 - "Network API Service Boundary"
Cohesion: 0.44
Nodes (3): NetworkNode, HttpNetworkMonitoringService, isAbortError()

### Community 29 - "Storybook Dependencies"
Cohesion: 0.29
Nodes (8): devDependencies, storybook, @storybook/react-vite, @testing-library/dom, @testing-library/jest-dom, storybook, @storybook/react-vite, @testing-library/dom

### Community 30 - "Node Inventory Hook"
Cohesion: 0.36
Nodes (6): EMPTY_NODES, isAbortError(), NetworkNodesStatus, toError(), useNetworkNodes(), UseNetworkNodesState

### Community 31 - "Node Search and Status Filter"
Cohesion: 0.29
Nodes (7): Access Switch 01 — Degraded, Branch Gateway — Offline, Core Router — Online, Node Search, Mobile Inventory Screenshot, Simulated Inventory Label, Node Status Filter

### Community 32 - "Node Loading Skeleton"
Cohesion: 0.33
Nodes (5): NetworkNodesSkeleton(), SKELETON_ITEMS, Default, meta, Story

### Community 33 - "SDD Coordinator Process"
Cohesion: 0.33
Nodes (5): Aprobaciones y límites, Coordinación SDD, Delegación, Idioma, archivos y entrega, QA automático de specs

### Community 34 - "Project Memory and Decisions"
Cohesion: 0.33
Nodes (5): Aprendizajes y errores a evitar, Decisiones (y por qué), Estado actual, MEMORY.md — Dashboard, Próximos pasos

### Community 35 - "Node Inventory Design"
Cohesion: 0.40
Nodes (5): Compact Node Roster, Node Health Status Indicators, Desktop Node Inventory Mockup, Node Search and Status Filter, Simulated Node Inventory

### Community 36 - "Feature Skill Workflow"
Cohesion: 0.40
Nodes (4): Cambios pequeños, Ejecución, Límites, Verificación y entrega

### Community 37 - "Packet Loss Verification Notes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, como compruebo que todo este correcto?, Source Nodes

### Community 38 - "Historical Completion Review"
Cohesion: 0.40
Nodes (5): Graphify Query: Remaining Work Status, Answer, Outcome, Q: ¿queda algo pendiente?, Source Nodes

### Community 39 - "Dashboard Feature Recommendations"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Que otros cambios me recomiendas añadir al proyecto?, Source Nodes

### Community 40 - "Honest Inventory and Chart Accessibility"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?, Source Nodes

### Community 41 - "Dashboard Improvement Notes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que mas me recomiendas hacerle al dashboard?, Source Nodes

### Community 42 - "Empty State Storybook"
Cohesion: 0.40
Nodes (4): EmptyMetrics, emptyMetricsService, meta, Story

### Community 43 - "Packet Loss Acceptance Evidence"
Cohesion: 0.50
Nodes (4): Historical Packet-Loss Completion Check, Packet-Loss T-005 Status on 2026-10-18, Production Screenshot Evidence, Graph Snapshot Cannot Verify Current Packet-Loss Status

### Community 44 - "Vite and Vitest Integration"
Cohesion: 0.50
Nodes (3): ref_node_path, ref_storybook_addon_vitest_vitest_plugin, ref_vitest_config

## Knowledge Gaps
- **361 isolated node(s):** `NetworkNodesPanelStoryArgs`, `Story`, `NodeLookupStatus`, `NetworkNodesStatus`, `FixtureNodeId` (+356 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Storybook Dependencies` to `Frontend Runtime Dependencies`, `Chromatic Storybook Package`, `ESLint Package`, `Prettier ESLint Compatibility`, `ESLint JavaScript Rules`, `React Hooks Linting`, `React Refresh Linting`, `Storybook Linting`, `Shared Globals Package`, `JSDOM Test Environment`, `Playwright Browser Automation`, `Playwright Test Framework`, `Prettier Formatter`, `Storybook Accessibility Addon`, `Storybook Documentation Addon`, `Storybook Onboarding Addon`, `Storybook Vitest Addon`, `React Testing Library`, `User Event Testing Library`, `Node Type Definitions`, `React Type Definitions`, `React DOM Type Definitions`, `TypeScript Compiler`, `TypeScript ESLint Parser`, `Vite Build Tool`, `Vite React Plugin`, `Vitest Test Runner`, `Vitest Browser Runner`, `Vitest Playwright Provider`, `Vitest Browser Preview`, `Vitest Coverage Provider`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `NodeMetrics` connect `Domain Contracts and Comparison Tests` to `Network UI Stories and Statuses`, `Charts, Stories, and Error States`, `Node Metrics Request State`, `Node Comparison State`, `Packet Loss Chart`, `Node Details Page Tests`, `Latency Trend Chart`, `Node Comparison Hook Tests`, `Network API Service Boundary`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `scripts` connect `Frontend Runtime Dependencies` to `CI and Deployment Checks`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `NetworkNodesPanelStoryArgs`, `Story`, `NodeLookupStatus` to the rest of the system?**
  _361 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Network UI Stories and Statuses` be split into smaller, more focused modules?**
  _Cohesion score 0.07536231884057971 - nodes in this community are weakly interconnected._
- **Should `Charts, Stories, and Error States` be split into smaller, more focused modules?**
  _Cohesion score 0.05647840531561462 - nodes in this community are weakly interconnected._
- **Should `ASP.NET API Contracts` be split into smaller, more focused modules?**
  _Cohesion score 0.08819345661450925 - nodes in this community are weakly interconnected._