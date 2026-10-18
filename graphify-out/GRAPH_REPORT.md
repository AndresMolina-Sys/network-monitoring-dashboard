# Graph Report - Dashboard  (2026-10-18)

## Corpus Check
- 54 files · ~27,340 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 595 nodes · 815 edges · 94 communities (31 shown, 63 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.83)
- Token cost: 1,618 input · 880 output

## Community Hubs (Navigation)
- Network Domain & Services
- Metrics Charts & Accessibility
- Dashboard Components & Routing
- API Integration Tests
- Project Standards & Documentation
- Build Scripts & CI
- Metrics Validation & State
- TypeScript Compiler Options
- TypeScript Project Configuration
- Contributor Guide & Repository Rules
- .NET API Test Dependencies
- Metrics Range Specification
- Packet Loss Specification
- .NET Launch Settings
- Metrics Range Implementation Plan
- Network Node Card
- Packet Loss Implementation Plan
- Frontend Testing Dependencies
- Monitoring Service Implementations
- SDD Coordination Workflow
- Project Memory Notes
- Small Feature Workflow
- Conversation: Verification Checks
- Conversation: Project Status
- Conversation: Dashboard Roadmap
- Conversation: Feature Review
- Conversation: Dashboard Ideas
- SDD Workflow Routing
- Coordinator Agent Profile
- TypeScript Project References
- Vercel SPA Routing
- SDD Change Phase
- SDD Clarify Phase
- SDD Constitution Phase
- SDD Implementation Phase
- SDD Planning Phase
- SDD Router Skill
- SDD Coordinator Profile
- SDD Change Skill
- SDD Clarify Skill
- SDD Validation Skill
- Chromatic Storybook
- Storybook Accessibility Addon
- ESLint Tooling
- ESLint Configuration
- Prettier ESLint Integration
- ESLint JavaScript Config
- React Hooks Linting
- React Refresh Linting
- Storybook Linting
- Global Lint Environment
- JSDOM Test Environment
- Playwright Browser Testing
- Playwright E2E Framework
- Prettier Formatter
- Storybook Accessibility
- Storybook Documentation
- Storybook Onboarding
- Storybook Vitest Integration
- React Testing Library
- User Event Testing
- Node Type Definitions
- React Type Definitions
- React DOM Type Definitions
- TypeScript Compiler
- TypeScript ESLint Parser
- Vite Build Tool
- Vite React Plugin
- Vitest Test Runner
- Vitest Browser Testing
- Playwright Browser Provider
- Vitest Browser Preview
- Vitest Coverage Provider
- Playwright Configuration
- Social Media Icons
- Vitest Testing Setup
- Metrics Range Task List
- Packet Loss Task List
- Storybook Main Configuration
- Storybook Preview Configuration
- Backend Docker Container
- Application Favicon
- Discord Brand Icon
- Documentation Brand Icon
- GitHub Brand Icon
- Social Network Icon
- X Brand Icon
- Dashboard Hero Illustration
- React Logo Asset
- Vite Logo Asset

## God Nodes (most connected - your core abstractions)
1. `NetworkMonitoringApiTests` - 21 edges
2. `NetworkNode` - 19 edges
3. `NetworkMonitoringService` - 19 edges
4. `compilerOptions` - 18 edges
5. `compilerOptions` - 15 edges
6. `NodeMetrics` - 13 edges
7. `scripts` - 13 edges
8. `SDD Router Skill` - 13 edges
9. `Project Constitution` - 12 edges
10. `NetworkNodeNotFoundError` - 11 edges

## Surprising Connections (you probably didn't know these)
- `SDD Change Skill` --references--> `Spec 001: Simulated Metrics Ranges`  [INFERRED]
  .agents/skills/sdd-change/SKILL.md → specs/001-rangos-de-metricas-simuladas/spec.md
- `SDD Clarify Skill` --references--> `Project Constitution`  [EXTRACTED]
  .agents/skills/sdd-clarify/SKILL.md → docs/constitution.md
- `SDD Constitution Skill` --references--> `Project Constitution`  [EXTRACTED]
  .agents/skills/sdd-constitution/SKILL.md → docs/constitution.md
- `SDD Status Skill` --references--> `Spec 001: Simulated Metrics Ranges`  [EXTRACTED]
  .agents/skills/sdd-status/SKILL.md → specs/001-rangos-de-metricas-simuladas/spec.md
- `Repository Agent Instructions` --references--> `GitHub Actions CI Workflow`  [EXTRACTED]
  AGENTS.md → .github/workflows/ci.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard change request routing and SDD phases** — agents_skills_sdd_skill_document, agents_skills_feature_skill_document, agents_skills_sdd_coordinator_skill_document, agents_skills_sdd_change_skill_document, agents_skills_sdd_clarify_skill_document, agents_skills_sdd_constitution_skill_document, agents_skills_sdd_implement_skill_document, agents_skills_sdd_plan_skill_document, agents_skills_sdd_spec_skill_document, agents_skills_sdd_status_skill_document, agents_skills_sdd_tasks_skill_document, agents_skills_sdd_validate_skill_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for simulated metric ranges** — specs_001_rangos_de_metricas_simuladas_spec_document, specs_001_rangos_de_metricas_simuladas_plan_document, specs_001_rangos_de_metricas_simuladas_tasks_document [EXTRACTED 1.00]
- **Approved specification, plan, and task chain for packet loss chart** — specs_002_grafica_perdida_de_paquetes_spec_document, specs_002_grafica_perdida_de_paquetes_plan_document, specs_002_grafica_perdida_de_paquetes_tasks_document [EXTRACTED 1.00]

## Communities (94 total, 63 thin omitted)

### Community 0 - "Network Domain & Services"
Cohesion: 0.08
Nodes (31): MetricsRange, NetworkNode, NodeMetrics, NodeStatus, isAbortError(), NodeLookupStatus, toError(), useNetworkNode() (+23 more)

### Community 1 - "Metrics Charts & Accessibility"
Cohesion: 0.06
Nodes (35): MetricPoint, NetworkNodeNotFoundState(), NetworkNodeNotFoundStateProps, formatMetricDate(), formatMetricTime(), LatencyChartPoint, NodeLatencyChart(), NodeLatencyChartProps (+27 more)

### Community 2 - "Dashboard Components & Routing"
Cohesion: 0.06
Nodes (30): ref_react_dom_client, ref_react_router_dom, ref_storybook_test, App(), NotFoundPage(), AppRouter(), router, NetworkNodesEmptyState() (+22 more)

### Community 3 - "API Integration Tests"
Cohesion: 0.09
Nodes (25): DateTimeOffset, IReadOnlyList, MetricPoint, NetworkNode, NodeMetrics, Program, DateTimeOffset, IReadOnlyList (+17 more)

### Community 4 - "Project Standards & Documentation"
Cohesion: 0.14
Nodes (33): Repository Agent Instructions, Feature Skill, SDD Change Skill, SDD Clarify Skill, SDD Constitution Skill, Separate SDD Approval Gates, SDD Coordinator Skill, SDD Implement Skill (+25 more)

### Community 5 - "Build Scripts & CI"
Cohesion: 0.06
Nodes (29): dependencies, react, react-dom, react-router, recharts, engines, node, name (+21 more)

### Community 6 - "Metrics Validation & State"
Cohesion: 0.10
Nodes (23): assertValidMetricPoints(), assertValidMetricsResponse(), isAbortError(), isMetricPoint(), isMetricsRange(), isNodeMetricsResponse(), METRICS_RANGE_RULES, MetricsRangeRules (+15 more)

### Community 7 - "TypeScript Compiler Options"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 8 - "TypeScript Project Configuration"
Cohesion: 0.10
Nodes (20): node, playwright.config.ts, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module (+12 more)

### Community 9 - "Contributor Guide & Repository Rules"
Cohesion: 0.18
Nodes (10): AGENTS.md — Network Monitoring Dashboard, Comandos, Convenciones, Forma de trabajar, Límites, Memoria, Reglas, Reglas de dominio / trampas conocidas (+2 more)

### Community 10 - ".NET API Test Dependencies"
Cohesion: 0.20
Nodes (9): net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.Mvc.Testing (10.0.12), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.NET.Test.Sdk (17.14.1), xunit (2.9.3), xunit.runner.visualstudio (3.1.4), Microsoft.NET.Sdk (+1 more)

### Community 11 - "Metrics Range Specification"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 12 - "Packet Loss Specification"
Cohesion: 0.18
Nodes (10): Casos límite, Contexto y objetivo, Criterios de finalización, Dudas abiertas, Fuera de alcance, Historias de usuario, Requisitos funcionales (criterios de aceptación en EARS), Requisitos no funcionales (+2 more)

### Community 13 - ".NET Launch Settings"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 14 - "Metrics Range Implementation Plan"
Cohesion: 0.20
Nodes (9): Alcance y enfoque, Alternativas consideradas, Capas y archivos previstos, Conflictos documentales conocidos, Enfoque técnico, Estrategia de verificación, Plan 001 — Rangos de métricas simuladas, Riesgos y mitigaciones (+1 more)

### Community 15 - "Network Node Card"
Cohesion: 0.22
Nodes (8): NetworkNodeCard(), NetworkNodeCardProps, STATUS_LABELS, Degraded, meta, Offline, Online, Story

### Community 16 - "Packet Loss Implementation Plan"
Cohesion: 0.22
Nodes (8): Alcance y enfoque, Alternativas consideradas, Archivos previstos, Enfoque técnico, Estrategia de verificación, Plan 002 — Gráfica de pérdida de paquetes, Riesgos y mitigaciones, Trazabilidad de requisitos y evidencia

### Community 17 - "Frontend Testing Dependencies"
Cohesion: 0.29
Nodes (8): devDependencies, storybook, @storybook/react-vite, @testing-library/dom, @testing-library/jest-dom, storybook, @storybook/react-vite, @testing-library/dom

### Community 19 - "SDD Coordination Workflow"
Cohesion: 0.33
Nodes (5): Aprobaciones y límites, Coordinación SDD, Delegación, Idioma, archivos y entrega, QA automático de specs

### Community 20 - "Project Memory Notes"
Cohesion: 0.33
Nodes (5): Aprendizajes y errores a evitar, Decisiones (y por qué), Estado actual, MEMORY.md — Dashboard, Próximos pasos

### Community 21 - "Small Feature Workflow"
Cohesion: 0.40
Nodes (4): Cambios pequeños, Ejecución, Límites, Verificación y entrega

### Community 22 - "Conversation: Verification Checks"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, como compruebo que todo este correcto?, Source Nodes

### Community 23 - "Conversation: Project Status"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ¿queda algo pendiente?, Source Nodes

### Community 24 - "Conversation: Dashboard Roadmap"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Que otros cambios me recomiendas añadir al proyecto?, Source Nodes

### Community 25 - "Conversation: Feature Review"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ¿Ya implementaste aclarar que el inventario es de demostración y pulir la accesibilidad de las gráficas?, Source Nodes

### Community 26 - "Conversation: Dashboard Ideas"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Perfecto, que mas me recomiendas hacerle al dashboard?, Source Nodes

### Community 27 - "SDD Workflow Routing"
Cohesion: 0.50
Nodes (3): ref_node_path, ref_storybook_addon_vitest_vitest_plugin, ref_vitest_config

## Knowledge Gaps
- **268 isolated node(s):** `Story`, `Story`, `Story`, `NetworkNodesErrorStateProps`, `Story` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Frontend Testing Dependencies` to `Build Scripts & CI`, `Chromatic Storybook`, `ESLint Tooling`, `Prettier ESLint Integration`, `ESLint JavaScript Config`, `React Hooks Linting`, `React Refresh Linting`, `Storybook Linting`, `Global Lint Environment`, `JSDOM Test Environment`, `Playwright Browser Testing`, `Playwright E2E Framework`, `Prettier Formatter`, `Storybook Accessibility`, `Storybook Documentation`, `Storybook Onboarding`, `Storybook Vitest Integration`, `React Testing Library`, `User Event Testing`, `Node Type Definitions`, `React Type Definitions`, `React DOM Type Definitions`, `TypeScript Compiler`, `TypeScript ESLint Parser`, `Vite Build Tool`, `Vite React Plugin`, `Vitest Test Runner`, `Vitest Browser Testing`, `Playwright Browser Provider`, `Vitest Browser Preview`, `Vitest Coverage Provider`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `NetworkMonitoringService` connect `Network Domain & Services` to `Metrics Charts & Accessibility`, `Dashboard Components & Routing`, `Metrics Validation & State`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `NetworkNode` connect `Network Domain & Services` to `Metrics Charts & Accessibility`, `Metrics Validation & State`, `Network Node Card`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `Story`, `Story`, `Story` to the rest of the system?**
  _268 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Network Domain & Services` be split into smaller, more focused modules?**
  _Cohesion score 0.0847457627118644 - nodes in this community are weakly interconnected._
- **Should `Metrics Charts & Accessibility` be split into smaller, more focused modules?**
  _Cohesion score 0.0563265306122449 - nodes in this community are weakly interconnected._
- **Should `Dashboard Components & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._