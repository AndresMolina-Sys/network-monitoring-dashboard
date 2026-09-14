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
