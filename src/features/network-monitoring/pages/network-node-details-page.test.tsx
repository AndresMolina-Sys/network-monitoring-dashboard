import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import type { MetricsRange, NetworkNode, NodeMetrics } from '../../../domain/network'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeDetailsPage } from './network-node-details-page'

vi.mock('../components/node-latency-chart', () => ({
  NodeLatencyChart: ({ metrics }: { metrics: NodeMetrics }) => (
    <figure
      aria-label={`Latency chart for ${metrics.range}`}
      data-point-count={metrics.points.length}
    >
      <figcaption>Latency trend for {metrics.nodeId} (UTC)</figcaption>
    </figure>
  ),
}))

const TEST_NODE: NetworkNode = {
  id: 'core-router',
  name: 'Core Router',
  address: '10.0.0.1',
  location: 'Main office',
  status: 'online',
  lastCheckedAt: '2026-09-13T18:00:00Z',
}

const RANGE_FIXTURES: Record<
  MetricsRange,
  { readonly sampleCount: number; readonly cadenceMs: number }
> = {
  '1h': { sampleCount: 4, cadenceMs: 20 * 60 * 1000 },
  '24h': { sampleCount: 25, cadenceMs: 60 * 60 * 1000 },
  '7d': { sampleCount: 29, cadenceMs: 6 * 60 * 60 * 1000 },
}

const RANGE_TITLES: Record<MetricsRange, string> = {
  '1h': 'Last hour performance (1h)',
  '24h': 'Last 24 hours performance (24h)',
  '7d': 'Last 7 days performance (7d)',
}

describe('NetworkNodeDetailsPage', () => {
  it('starts a new details view at 1h and renders its chart and accessible table', async () => {
    const service = createService()

    renderDetailsPage(service)

    expect(await screen.findByRole('heading', { name: RANGE_TITLES['1h'] })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Latency trend for core-router (UTC)')).toBeInTheDocument()
    expect(screen.getByRole('figure', { name: 'Latency chart for 1h' })).toHaveAttribute(
      'data-point-count',
      '4',
    )
    expect(
      screen.getByRole('table', {
        name: 'Latency and packet loss measurements for core-router (1h)',
      }),
    ).toBeInTheDocument()
    expect(getTableRows()).toHaveLength(5)
    expect(service.getNodeMetrics).toHaveBeenCalledWith('core-router', '1h', expect.anything())
  })

  it.each(['1h', '24h', '7d'] as const)(
    'selects %s and keeps the heading, chart, and table on the selected period',
    async (range) => {
      const user = userEvent.setup()
      const service = createService()

      renderDetailsPage(service)

      await screen.findByRole('heading', { name: RANGE_TITLES['1h'] })
      if (range === '1h') {
        await user.click(screen.getByRole('button', { name: '24h' }))
        await screen.findByRole('heading', { name: RANGE_TITLES['24h'] })
      }
      await user.click(screen.getByRole('button', { name: range }))

      expect(await screen.findByRole('heading', { name: RANGE_TITLES[range] })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: range })).toHaveAttribute('aria-pressed', 'true')
      const otherRange = range === '1h' ? '24h' : '1h'
      expect(screen.getByRole('button', { name: otherRange })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
      expect(screen.getByRole('figure', { name: `Latency chart for ${range}` })).toHaveAttribute(
        'data-point-count',
        String(RANGE_FIXTURES[range].sampleCount),
      )
      expect(getTableRows()).toHaveLength(RANGE_FIXTURES[range].sampleCount + 1)
      expect(
        screen.getByRole('table', {
          name: `Latency and packet loss measurements for core-router (${range})`,
        }),
      ).toBeInTheDocument()
      expect(
        within(screen.getByRole('table')).getByText(createMetrics(range).points[0].timestamp),
      ).toBeInTheDocument()
      expect(service.getNodeMetrics).toHaveBeenLastCalledWith(
        'core-router',
        range,
        expect.anything(),
      )
    },
  )

  it('returns to 1h when a new details view is opened', async () => {
    const user = userEvent.setup()
    const service = createService()
    const firstView = renderDetailsPage(service)

    await screen.findByRole('heading', { name: RANGE_TITLES['1h'] })
    await user.click(screen.getByRole('button', { name: '24h' }))
    await screen.findByRole('heading', { name: RANGE_TITLES['24h'] })
    firstView.unmount()

    renderDetailsPage(service)

    expect(await screen.findByRole('heading', { name: RANGE_TITLES['1h'] })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    expect(service.getNodeMetrics).toHaveBeenLastCalledWith('core-router', '1h', expect.anything())
  })

  it('keeps the range selector available while metrics are loading', () => {
    const getNodeMetrics = vi.fn(() => new Promise<NodeMetrics>(() => undefined))

    renderDetailsPage(createService(getNodeMetrics))

    expect(screen.getByRole('heading', { name: 'Loading node metrics...' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
  })

  it('keeps the range selector available for empty and error states', async () => {
    const emptyService = createService(
      vi.fn().mockResolvedValue({ ...createMetrics('1h'), points: [] }),
    )
    const emptyView = renderDetailsPage(emptyService)

    expect(await screen.findByRole('heading', { name: 'No metrics available' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
    emptyView.unmount()

    const errorService = createService(vi.fn().mockRejectedValue(new Error('Request failed')))
    renderDetailsPage(errorService)

    expect(
      await screen.findByRole('heading', { name: 'Unable to load node metrics' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
  })

  it('does not show the range selector when the node is not found', async () => {
    const service = createService()
    service.getNode = vi.fn().mockRejectedValue(new NetworkNodeNotFoundError('core-router'))

    renderDetailsPage(service)

    expect(await screen.findByRole('heading', { name: 'Node not found' })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Metrics range' })).not.toBeInTheDocument()
  })
})

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'] = vi
    .fn()
    .mockImplementation((_nodeId: string, range: MetricsRange) =>
      Promise.resolve(createMetrics(range)),
    ),
): NetworkMonitoringService {
  return {
    listNodes: vi.fn(),
    getNode: vi.fn().mockResolvedValue(TEST_NODE),
    getNodeMetrics,
  }
}

function createMetrics(range: MetricsRange): NodeMetrics {
  const { sampleCount, cadenceMs } = RANGE_FIXTURES[range]
  const anchor = Date.parse('2026-09-13T18:00:00Z')

  return {
    nodeId: 'core-router',
    range,
    points: Array.from({ length: sampleCount }, (_, index) => ({
      timestamp: new Date(anchor - cadenceMs * (sampleCount - index - 1)).toISOString(),
      latencyMs: 18 + (index % 5),
      packetLossPercent: index % 2 === 0 ? 0 : 0.2,
    })),
  }
}

function getTableRows(): HTMLElement[] {
  return within(screen.getByRole('table')).getAllByRole('row')
}

function expectSimulatedDataLabel(): void {
  const rangeGroup = screen.getByRole('group', { name: 'Metrics range' })
  const controls = rangeGroup.parentElement

  expect(controls).not.toBeNull()
  expect(within(controls as HTMLElement).getByText('Simulated data', { exact: true })).toBeVisible()
}

function renderDetailsPage(service: NetworkMonitoringService) {
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

  return render(<RouterProvider router={router} />)
}
