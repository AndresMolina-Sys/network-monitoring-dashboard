import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import type { NodeMetrics } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeDetailsPage } from './network-node-details-page'
import userEvent from '@testing-library/user-event'

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
      getNode: vi.fn(),
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

  it('renders the loading state while metrics are pending', () => {
    const getNodeMetrics = vi.fn(() => new Promise<NodeMetrics>(() => undefined))

    const service: NetworkMonitoringService = {
      listNodes: vi.fn(),
      getNode: vi.fn(),
      getNodeMetrics,
    }

    renderDetailsPage(service)

    expect(
      screen.getByRole('heading', {
        name: 'Loading node metrics...',
      }),
    ).toBeInTheDocument()
  })

  it('renders the empty state when no metrics are available', async () => {
    const getNodeMetrics = vi.fn().mockResolvedValue({
      ...TEST_METRICS,
      points: [],
    })

    const service: NetworkMonitoringService = {
      listNodes: vi.fn(),
      getNode: vi.fn(),
      getNodeMetrics,
    }

    renderDetailsPage(service)

    expect(
      await screen.findByRole('heading', {
        name: 'No metrics available',
      }),
    ).toBeInTheDocument()
  })

  it('recovers from an error after retrying', async () => {
    const user = userEvent.setup()
    const getNodeMetrics = vi
      .fn()
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(TEST_METRICS)

    const service: NetworkMonitoringService = {
      listNodes: vi.fn(),
      getNode: vi.fn(),
      getNodeMetrics,
    }

    renderDetailsPage(service)

    expect(
      await screen.findByRole('heading', {
        name: 'Unable to load node metrics',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Try again',
      }),
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Last hour performance (1h)',
      }),
    ).toBeInTheDocument()

    expect(getNodeMetrics).toHaveBeenCalledTimes(2)
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
