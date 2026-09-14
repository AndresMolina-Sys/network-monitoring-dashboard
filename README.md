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
