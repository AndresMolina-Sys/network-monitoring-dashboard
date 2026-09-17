# Network Monitoring Dashboard

[![CI](https://github.com/AndresMolina-Sys/network-monitoring-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/AndresMolina-Sys/network-monitoring-dashboard/actions/workflows/ci.yml)

A frontend monitoring dashboard for reviewing network availability and latency across monitored devices.

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
- Consume the local ASP.NET Core API when configured.
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
- GitHub Actions
- Vercel

## Current Scope

The frontend uses a typed mock service by default, allowing the Vercel deployment to run autonomously.

When `VITE_API_BASE_URL` is configured, the frontend uses the HTTP service to consume the ASP.NET Core API.

The local API currently provides node listings, node lookup, and range-aware latency metrics.

## Architecture

The application is organized around a replaceable service boundary:

```text
backend/
└── NetworkMonitoring.Api/       # ASP.NET Core minimal API

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
- Deploy the frontend autonomously on Vercel while the backend remains optional for local integration.

## Current Limitations

- Monitoring data is simulated locally unless the API environment variable is configured.
- The backend is currently available for local development only.
- There is no authentication or role-based access control.
- Node data is static and is not persisted in a database.
- The dashboard does not yet support real-time polling or notifications.
- The current chart focuses on latency; packet loss is available in the table but is not visualized yet.

## Roadmap

1. Deploy the ASP.NET Core API publicly.
2. Configure the Vercel environment with `VITE_API_BASE_URL`.
3. Persist monitored nodes and measurements in SQL Server.
4. Add configurable time ranges such as `24h` and `7d`.
5. Add periodic refresh, retry backoff, and monitoring alerts.
6. Expand the dashboard with packet loss visualization and summary metrics.

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

- `GET /api/nodes`
- `GET /api/nodes/{nodeId}`
- `GET /api/nodes/{nodeId}/metrics?range=1h`

### Available Commands

| Command                                                                   | Purpose                                              |
| ------------------------------------------------------------------------- | ---------------------------------------------------- |
| `npm run dev`                                                             | Start the Vite development server.                   |
| `npm run format`                                                          | Format source files with Prettier.                   |
| `npm run format:check`                                                    | Check formatting without modifying files.            |
| `npm run lint`                                                            | Run ESLint.                                          |
| `npm run test`                                                            | Run unit, component, and Storybook tests.            |
| `npm run test:e2e`                                                        | Run Playwright end-to-end tests.                     |
| `npm run storybook`                                                       | Start the Storybook development server.              |
| `npm run build-storybook`                                                 | Build Storybook for production.                      |
| `npm run build`                                                           | Type-check and create the frontend production build. |
| `dotnet build backend/NetworkMonitoring.Api/NetworkMonitoring.Api.csproj` | Build the API.                                       |

### Continuous Integration

Every push to `main` and every pull request runs formatting checks, linting, unit and component tests, Storybook tests, Playwright end-to-end tests, the frontend production build, the Storybook build, and the ASP.NET Core API build through GitHub Actions.

### Deployment

The frontend is deployed on Vercel and uses `vercel.json` to support client-side routes handled by React Router.

The backend is deployed as an ASP.NET Core API on Render using Docker and HTTPS.

- Frontend: [Vercel live demo](https://network-monitoring-dashboard-zeta.vercel.app/)
- Backend health check: [Render API](https://network-monitoring-api-m8a3.onrender.com/health)

The production frontend uses the following Vercel environment variable:

`VITE_API_BASE_URL=https://network-monitoring-api-m8a3.onrender.com/api`

The frontend falls back to the mock service when this variable is not configured. The deployed production environment is configured to consume the Render API.

The Render Free plan may put the API to sleep after inactivity, so the first request after a period without traffic can take longer.
