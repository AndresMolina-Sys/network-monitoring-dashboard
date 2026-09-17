# Network Monitoring Dashboard

[![CI](https://github.com/AndresMolina-Sys/network-monitoring-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/AndresMolina-Sys/network-monitoring-dashboard/actions/workflows/ci.yml)

A full-stack network monitoring dashboard for reviewing device availability, latency, and packet loss through a React frontend and an ASP.NET Core API.

## Live Demo

[Open the live demo](https://network-monitoring-dashboard-zeta.vercel.app/)

## Problem

Network operations teams need a clear way to identify monitored devices, review their current status, and inspect recent performance measurements.

This project explores that experience with a typed React frontend, explicit asynchronous states, reusable components, a replaceable service layer, and an ASP.NET Core Web API.

## Features

- Display monitored network nodes and their current status.
- Support online, degraded, and offline states.
- Show loading, empty, error, not-found, and successful data states.
- Retry failed monitoring requests.
- Review node latency and packet loss measurements.
- Visualize latency trends with a responsive chart.
- Keep a semantic metrics table as an accessible data representation.
- Navigate between the dashboard, node details, and fallback 404 page.
- Simulate latency, failures, cancellation, and empty responses locally.
- Consume the ASP.NET Core API locally or in production when configured.
- Run unit, component, accessibility, Storybook, and browser-based tests.

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- Recharts
- Vitest
- React Testing Library
- Storybook
- Playwright
- ASP.NET Core
- .NET 10
- Docker
- GitHub Actions
- Vercel
- Render

## Current Scope

The production frontend uses the HTTP service to consume the ASP.NET Core API deployed on Render.

For local development, the frontend uses the mock service when `VITE_API_BASE_URL` is not configured. Dedicated mock demo modes are also available locally for slow, error, and empty states.

The API provides node listings, node lookup, health checks, and range-aware latency metrics.

## Architecture

The application is organized around a replaceable service boundary:

```text
backend/
├── NetworkMonitoring.Api/          # ASP.NET Core minimal API and Dockerfile
└── NetworkMonitoring.Api.Tests/    # xUnit integration tests

src/
├── app/                         # Router and fallback page
├── domain/                      # Shared network contracts
├── features/
│   └── network-monitoring/
│       ├── components/          # UI and Storybook stories
│       ├── hooks/               # Async state orchestration
│       └── pages/               # Route-level screens
├── mocks/                       # Typed local monitoring fixtures
├── services/                    # Service contract, mock, and HTTP implementations
└── test/                        # Shared test setup
```

### Data Flow

1. A route renders the dashboard or a node details page.
2. A feature hook calls the `NetworkMonitoringService` contract.
3. The service selection uses the mock for demo modes or when no API URL is configured.
4. When `VITE_API_BASE_URL` is available, the HTTP service requests data from the ASP.NET Core API.
5. Components render the result without depending directly on the data source.

This keeps data access replaceable and prevents UI components from becoming coupled to a specific implementation.

## Async State Model

The frontend handles each request explicitly:

| State       | User-facing behavior                                              |
| ----------- | ----------------------------------------------------------------- |
| `loading`   | Render skeleton or loading feedback while the request is pending. |
| `success`   | Render nodes, metrics chart, and accessible metrics table.        |
| `empty`     | Explain that no monitored data is available.                      |
| `not-found` | Explain that the requested node does not exist.                   |
| `error`     | Explain the failure and offer a retry action.                     |

Cancellation is handled with `AbortController` so obsolete requests do not update unmounted or outdated screens.

## Technical Decisions

- Use React with TypeScript and Vite to keep the frontend fast, explicit, and easy to deploy.
- Keep data access behind the `NetworkMonitoringService` contract.
- Provide both mock and HTTP service implementations.
- Use React Router for dashboard, node details, and fallback routes.
- Lazy-load the node details route to keep the initial dashboard bundle smaller.
- Use Recharts for visual latency trends while keeping a semantic HTML table for accessible data inspection.
- Use Vitest, React Testing Library, Storybook, and Playwright to validate behavior and visual states.
- Implement the backend as an ASP.NET Core .NET 10 minimal API.
- Deploy the frontend on Vercel and the ASP.NET Core API on Render, connected through an environment-configured HTTP service.

## Current Limitations

- Monitoring data is fixture-based and is not persisted in a database.
- The deployed API does not yet provide authentication or role-based access control.
- The dashboard does not yet support real-time polling or notifications.
- The current chart focuses on latency; packet loss is available in the table but is not visualized yet.

## Roadmap

1. Persist monitored nodes and measurements in SQL Server.
2. Add configurable time ranges such as `24h` and `7d`.
3. Add periodic refresh, retry backoff, and monitoring alerts.
4. Expand the dashboard with packet loss visualization and summary metrics.

## Getting Started

### Prerequisites

- Node.js 22.x
- npm
- .NET SDK 10.0.x for the local API

### Installation

```bash
git clone https://github.com/AndresMolina-Sys/network-monitoring-dashboard.git
cd network-monitoring-dashboard
nvm use 22.23.2
npm ci
```

### Run the local API

Start the ASP.NET Core API in one terminal:

```powershell
dotnet run --project '.\backend\NetworkMonitoring.Api\NetworkMonitoring.Api.csproj' --urls 'http://127.0.0.1:5075'
```

### Connect the frontend to the local API

In a second terminal, create the local environment file:

```powershell
Copy-Item -LiteralPath '.env.example' -Destination '.env.local'
```

The file should contain:

```env
VITE_API_BASE_URL=http://127.0.0.1:5075/api
```

Then start the frontend:

```powershell
npm run dev
```

The application will be available at `http://localhost:5173/`.

If `VITE_API_BASE_URL` is not configured, the frontend uses the mock service.

### Demo States

The mock service supports dedicated demo scenarios:

- `http://localhost:5173/?demo=slow` — Simulates a slow response.
- `http://localhost:5173/?demo=error` — Simulates a failed request.
- `http://localhost:5173/?demo=empty` — Simulates an empty response.

### API Endpoints

- `GET /health`
- `GET /api/nodes`
- `GET /api/nodes/{nodeId}`
- `GET /api/nodes/{nodeId}/metrics?range=1h`

### Available Commands

| Command                                                                              | Purpose                                              |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `npm run dev`                                                                        | Start the Vite development server.                   |
| `npm run format`                                                                     | Format source files with Prettier.                   |
| `npm run format:check`                                                               | Check formatting without modifying files.            |
| `npm run lint`                                                                       | Run ESLint.                                          |
| `npm run test`                                                                       | Run unit, component, and Storybook tests.            |
| `npm run test:e2e`                                                                   | Run Playwright end-to-end tests.                     |
| `npm run storybook`                                                                  | Start the Storybook development server.              |
| `npm run build-storybook`                                                            | Build Storybook for production.                      |
| `npm run build`                                                                      | Type-check and create the frontend production build. |
| `dotnet build backend/NetworkMonitoring.Api/NetworkMonitoring.Api.csproj`            | Build the API.                                       |
| `dotnet test backend/NetworkMonitoring.Api.Tests/NetworkMonitoring.Api.Tests.csproj` | Run the API integration tests.                       |

### Continuous Integration

Every push to main and every pull request runs formatting, linting, frontend tests, Playwright E2E tests, Storybook and production builds, ASP.NET Core compilation, and eight xUnit integration tests using WebApplicationFactory.

### Deployment

The frontend is deployed on Vercel and uses `vercel.json` to support client-side routes handled by React Router.

The backend is deployed as an ASP.NET Core API on Render using Docker and HTTPS.

- Frontend: [Vercel live demo](https://network-monitoring-dashboard-zeta.vercel.app/)
- Backend health check: [Render API](https://network-monitoring-api-m8a3.onrender.com/health)

The production frontend uses the following Vercel environment variable:

`VITE_API_BASE_URL=https://network-monitoring-api-m8a3.onrender.com/api`

The frontend falls back to the mock service when this variable is not configured. The deployed production environment is configured to consume the Render API.

The Render Free plan may put the API to sleep after inactivity, so the first request after a period without traffic can take longer.
