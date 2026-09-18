# Graph Report - Dashboard  (2026-09-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 381 nodes · 656 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c4c895af`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Storybook & Testing Dependencies
- TypeScript Compiler Settings
- Service Layer & HTTP Contracts
- API Integration & CORS Tests
- Frontend Tooling Dependencies
- TypeScript Project Configuration
- UI Stories & Empty State
- App Router & Service Orchestration
- .NET Test Tooling
- Latency Chart & Metrics UI
- CI/CD & Deployment
- .NET Launch Configuration
- Network Node Card UI
- Domain Contracts & API
- TypeScript Project References
- Vercel SPA Routing

## God Nodes (most connected - your core abstractions)
1. `NetworkNode` - 24 edges
2. `NetworkMonitoringService` - 23 edges
3. `NetworkMonitoringApiTests` - 20 edges
4. `compilerOptions` - 18 edges
5. `compilerOptions` - 15 edges
6. `NetworkNodeNotFoundError` - 14 edges
7. `NodeMetrics` - 14 edges
8. `scripts` - 14 edges
9. `HttpNetworkMonitoringService` - 13 edges
10. `MockNetworkMonitoringService` - 12 edges

## Surprising Connections (you probably didn't know these)
- `HTTP service production integration` --references--> `HttpNetworkMonitoringService`  [EXTRACTED]
  README.md → src/services/http-network-monitoring-service.ts
- `Network Monitoring Dashboard README` --references--> `HttpNetworkMonitoringService`  [EXTRACTED]
  README.md → src/services/http-network-monitoring-service.ts
- `VITE_API_BASE_URL configuration` --configures--> `HttpNetworkMonitoringService`  [EXTRACTED]
  README.md → src/services/http-network-monitoring-service.ts
- `Mock service fallback` --references--> `MockNetworkMonitoringService`  [EXTRACTED]
  README.md → src/services/mock-network-monitoring-service.ts
- `Network Monitoring Dashboard README` --references--> `MockNetworkMonitoringService`  [EXTRACTED]
  README.md → src/services/mock-network-monitoring-service.ts

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "Storybook & Testing Dependencies"
Cohesion: 0.06
Nodes (34): devDependencies, @chromatic-com/storybook, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, eslint-plugin-storybook (+26 more)

### Community 1 - "TypeScript Compiler Settings"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 2 - "Service Layer & HTTP Contracts"
Cohesion: 0.10
Nodes (24): HTTP service production integration, Mock service fallback, MetricPoint, MetricsRange, NetworkNode, NodeStatus, isAbortError(), NodeLookupStatus (+16 more)

### Community 3 - "API Integration & CORS Tests"
Cohesion: 0.11
Nodes (21): Program, DateTimeOffset, IReadOnlyList, MetricPointResponse, NetworkMonitoringApiTests, NetworkNodeResponse, NodeMetricsResponse, CORS allowed and rejected origins (+13 more)

### Community 4 - "Frontend Tooling Dependencies"
Cohesion: 0.05
Nodes (45): dependencies, react, react-dom, react-router, recharts, engines, node, name (+37 more)

### Community 5 - "TypeScript Project Configuration"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 6 - "UI Stories & Empty State"
Cohesion: 0.08
Nodes (19): @storybook/react-vite, ref_storybook_test, NetworkNodesEmptyState(), Default, meta, Story, NetworkNodesErrorState(), NetworkNodesErrorStateProps (+11 more)

### Community 7 - "App Router & Service Orchestration"
Cohesion: 0.07
Nodes (41): react, ref_react_dom_client, react-router, ref_react_router_dom, ref_testing_library_jest_dom_vitest, @testing-library/react, @testing-library/user-event, vitest (+33 more)

### Community 8 - ".NET Test Tooling"
Cohesion: 0.17
Nodes (10): net10.0, net10.0, coverlet.collector (6.0.4), Microsoft.AspNetCore.Mvc.Testing (10.0.12), Microsoft.AspNetCore.OpenApi (10.0.12), Microsoft.NET.Test.Sdk (17.14.1), xunit (2.9.3), xunit.runner.visualstudio (3.1.4) (+2 more)

### Community 9 - "Latency Chart & Metrics UI"
Cohesion: 0.21
Nodes (10): recharts, NodeMetrics, formatMetricTime(), LatencyChartPoint, NodeLatencyChart(), NodeLatencyChartProps, Default, meta (+2 more)

### Community 10 - "CI/CD & Deployment"
Cohesion: 0.08
Nodes (28): ASP.NET Core .NET 10 API, Docker backend container, Fixture-based monitoring scope, CI quality checks, GitHub Actions CI workflow, Site metadata, playwright, scripts (+20 more)

### Community 11 - ".NET Launch Configuration"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 12 - "Network Node Card UI"
Cohesion: 0.22
Nodes (8): NetworkNodeCard(), NetworkNodeCardProps, STATUS_LABELS, Degraded, meta, Offline, Online, Story

### Community 13 - "Domain Contracts & API"
Cohesion: 0.47
Nodes (5): DateTimeOffset, IReadOnlyList, MetricPoint, NetworkNode, NodeMetrics

## Knowledge Gaps
- **174 isolated node(s):** `Story`, `MetricPoint`, `NodeStatus`, `NodeLookupStatus`, `FixtureNodeId` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Storybook & Testing Dependencies` to `CI/CD & Deployment`, `Frontend Tooling Dependencies`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `NetworkMonitoringApiTests` connect `API Integration & CORS Tests` to `CI/CD & Deployment`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `GitHub Actions CI workflow` connect `CI/CD & Deployment` to `API Integration & CORS Tests`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **What connects `Story`, `MetricPoint`, `NodeStatus` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Storybook & Testing Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Settings` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Service Layer & HTTP Contracts` be split into smaller, more focused modules?**
  _Cohesion score 0.09863945578231292 - nodes in this community are weakly interconnected._