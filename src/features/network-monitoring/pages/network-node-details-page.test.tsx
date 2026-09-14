import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import type { NodeMetrics } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeDetailsPage } from './network-node-details-page'

const TEST_METRICS: NodeMetrics = {
  nodeId: 'core-router',
  range: '1h',
  points: [
    {
      timestamp: '2026-09-13T17:00:00Z',
      latencyMs: 18,
      packetLossPercent: 0,
    },
  ],
}

describe('NetworkNodeDetailsPage', () => {
  it('renders the chart and accessible table after a successful response', async () => {
    const getNodeMetrics = vi.fn().mockResolvedValue(TEST_METRICS)

    const service: NetworkMonitoringService = {
      listNodes: vi.fn(),
      getNodeMetrics,
    }

    renderDetailsPage(service)

    expect(
      await screen.findByRole('heading', {
        name: 'Last hour performance (1h)',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Latency trend for core-router (UTC)')).toBeInTheDocument()

    expect(
      screen.getByRole('table', {
        name: 'Latency and packet loss measurements for core-router',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('18 ms')).toBeInTheDocument()
    expect(getNodeMetrics).toHaveBeenCalledWith('core-router', '1h', expect.anything())
  })
})

function renderDetailsPage(service: NetworkMonitoringService): void {
  const router = createMemoryRouter(
    [
      {
        path: '/nodes/:nodeId',
        element: <NetworkNodeDetailsPage service={service} />,
      },
    ],
    {
      initialEntries: ['/nodes/core-router'],
    },
  )

  render(<RouterProvider router={router} />)
}
