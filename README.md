# Network Monitoring Dashboard

[![CI](https://github.com/AndresMolina-Sys/network-monitoring-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/AndresMolina-Sys/network-monitoring-dashboard/actions/workflows/ci.yml)

A frontend monitoring dashboard for reviewing network availability and latency across monitored devices.

## Live Demo

[Open the live demo](https://network-monitoring-dashboard-zeta.vercel.app/)

## Problem

Network operations teams need a clear way to identify monitored devices, review their current status, and inspect recent performance measurements.

This project explores how to build that experience with a typed React frontend, explicit asynchronous states, reusable components, and a service layer that can later connect to an ASP.NET Core Web API.

## Features

- Display monitored network nodes and their current status.
- Support online, degraded, and offline states.
- Show loading, empty, error, and successful data states.
- Retry failed monitoring requests.
- Review node latency and packet loss measurements.
- Visualize latency trends with a responsive chart.
- Keep a semantic metrics table as an accessible data representation.
- Navigate between the dashboard, node details, and fallback 404 page.
- Simulate latency, failures, cancellation, and empty responses locally.
- Run unit, component, accessibility, and browser-based Storybook tests.

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- Recharts
- Vitest
- React Testing Library
- Storybook
- GitHub Actions
- Vercel

## Current Scope

The application currently uses a typed mock monitoring service so the frontend can run autonomously in Vercel.

The service boundary is designed to be replaced later by an ASP.NET Core Web API without coupling the UI components to the data source.

## Architecture

The application is organized around a small service boundary:

```text
src/
├── app/                         # Router and fallback page
├── domain/                      # Shared network contracts
├── features/
│   └── network-monitoring/
│       ├── components/          # UI and Storybook stories
│       ├── hooks/               # Async state orchestration
│       └── pages/               # Route-level screens
├── mocks/                       # Typed local monitoring fixtures
├── services/                    # Monitoring service interface and mock implementation
└── test/                        # Shared test setup
```

### Data Flow

1. A route renders the dashboard or a node details page.
2. A feature hook calls the `NetworkMonitoringService` contract.
3. The current mock implementation simulates latency, failures, empty responses, and request cancellation.
4. Components render the result without depending directly on the data source.
5. The same service contract can later be implemented by an ASP.NET Core Web API.

This keeps data access replaceable and prevents UI components from becoming coupled to the mock implementation.

## Async State Model

The frontend handles each request explicitly:

| State     | User-facing behavior                                              |
| --------- | ----------------------------------------------------------------- |
| `loading` | Render skeleton or loading feedback while the request is pending. |
| `success` | Render nodes, metrics chart, and accessible metrics table.        |
| `empty`   | Explain that no monitored data is available.                      |
| `error`   | Explain the failure and offer a retry action.                     |

Cancellation is handled with `AbortController` so obsolete requests do not update unmounted or outdated screens.

## Technical Decisions

- Use React with TypeScript and Vite to keep the frontend fast, explicit, and easy to deploy.
- Keep data access behind the `NetworkMonitoringService` contract so the UI is independent from the current mock implementation.
- Use React Router for dashboard, node details, and fallback routes.
- Lazy-load the node details route to keep the initial dashboard bundle smaller.
- Use Recharts for visual latency trends while keeping a semantic HTML table for accessible data inspection.
- Use Vitest, React Testing Library, Storybook, and browser-based tests to validate behavior and visual states.
- Deploy the frontend autonomously on Vercel before introducing a live backend.

## Current Limitations

- Monitoring data is simulated locally and is not connected to real network devices.
- There is no authentication or role-based access control.
- Node data is static and is not persisted in a database.
- The dashboard does not yet support real-time polling or notifications.
- The current chart focuses on latency; packet loss is available in the table but is not visualized yet.

## Roadmap

1. Implement an ASP.NET Core Web API using the existing monitoring service contract.
2. Replace the mock service with an environment-based API implementation.
3. Persist monitored nodes and measurements in SQL Server.
4. Add configurable time ranges such as `24h` and `7d`.
5. Add periodic refresh, retry backoff, and monitoring alerts.
6. Expand the dashboard with packet loss visualization and summary metrics.

## Getting Started

### Prerequisites

- Node.js 22.x
- npm

### Installation

```bash
git clone https://github.com/AndresMolina-Sys/network-monitoring-dashboard.git
cd network-monitoring-dashboard
nvm use 22.23.2
npm ci
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`.

### Demo States

The mock service supports dedicated demo scenarios:

- `http://localhost:5173/?demo=slow` — Simulates a slow response.
- `http://localhost:5173/?demo=error` — Simulates a failed request.
- `http://localhost:5173/?demo=empty` — Simulates an empty response.

### Available Commands

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the Vite development server.          |
| `npm run format`       | Format the source files with Prettier.      |
| `npm run format:check` | Check formatting without modifying files.   |
| `npm run lint`         | Run ESLint.                                 |
| `npm run test`         | Run unit, component, and Storybook tests.   |
| `npm run storybook`    | Start the Storybook development server.     |
| `npm run build`        | Type-check and create the production build. |

### Continuous Integration

Every push to `main` and every pull request runs formatting checks, linting, tests, and the production build through GitHub Actions.

### Deployment

The frontend is deployed on Vercel and uses `vercel.json` to support client-side routes handled by React Router.
