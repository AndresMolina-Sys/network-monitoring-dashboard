# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Network operators or administrators reviewing node health and performance.
- Portfolio evaluators exploring the full-stack project.

Both audiences have equal priority. These are intended audiences, not verified customer segments.

## Product Purpose

Demonstrate a full-stack network-monitoring experience with clearly identified simulated data. Success means both audiences can move from the node inventory to a node's metrics and understand the sample status and measurements without mistaking them for live telemetry.

## Positioning

A portfolio demonstration of a network dashboard and API working together over explicitly simulated monitoring records. It is not an operational monitoring service and does not provide live network telemetry.

## Operating Context

The dashboard is explored as a local demo or through its deployed frontend and API. The primary flow is to review the node inventory, search or filter nodes, open a node, select a `1h`, `24h`, or `7d` period, then inspect its summary, charts, and measurements table.

## Capabilities and Constraints

- The inventory shows node identity, location, address, and sample health status; users can search and filter loaded nodes.
- Node details show period-specific latency and packet-loss summaries, charts, and a semantic measurements table.
- Local mock fixtures and the HTTP API share the monitoring-service boundary.
- Monitoring records are simulated fixtures, not live, persisted, or continuously refreshed telemetry.
- The product does not provide a database, uptime calculation, alerting, authentication, or authorization.
- Application interface text is English and the dashboard supports responsive layouts.

## Evidence on Hand

- Typed local fixtures: `src/mocks/`.
- API endpoints and in-memory sample records: `backend/NetworkMonitoring.Api/Program.cs`.
- Unit/component, accessibility, API integration, and browser tests are present in the repository.
- The README links to the deployed demo. No verified customer usage, real-world monitoring data, testimonials, or performance claims are available; do not invent them.

## Product Principles

1. Make node health and performance straightforward to inspect.
2. Identify simulated data clearly and consistently.
3. Demonstrate frontend-to-API integration without overstating operational capabilities.
4. Keep the inventory-to-detail journey understandable on desktop and mobile.

## Accessibility & Inclusion

Keep chart measurements available in the semantic table, and preserve accessible names and states for interactive controls. Do not claim formal accessibility conformance without evidence.
