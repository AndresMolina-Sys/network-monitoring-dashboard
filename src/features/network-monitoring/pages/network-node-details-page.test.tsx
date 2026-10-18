import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import type { MetricsRange, NetworkNode, NodeMetrics } from '../../../domain/network'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NodeLatencyChart } from '../components/node-latency-chart'
import { NodePacketLossChart } from '../components/node-packet-loss-chart'
import { NetworkNodeDetailsPage } from './network-node-details-page'

vi.mock('../components/node-latency-chart', () => ({
  NodeLatencyChart: vi.fn(({ metrics }: { readonly metrics: NodeMetrics }) => (
    <figure
      aria-label={`Latency chart for ${metrics.nodeId} in milliseconds (${metrics.range}, UTC)`}
      data-point-count={metrics.points.length}
    >
      <figcaption>
        Latency trend for {metrics.nodeId} (ms, {metrics.range}, UTC)
      </figcaption>
    </figure>
  )),
}))

vi.mock('../components/node-packet-loss-chart', () => ({
  NodePacketLossChart: vi.fn(({ metrics }: { readonly metrics: NodeMetrics }) => (
    <figure
      aria-label={`Packet loss chart for ${metrics.nodeId} in percent (${metrics.range}, UTC)`}
      data-node-id={metrics.nodeId}
      data-range={metrics.range}
      data-point-count={metrics.points.length}
    >
      <figcaption>
        Packet loss trend for {metrics.nodeId} (percent, {metrics.range}, UTC)
      </figcaption>
    </figure>
  )),
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

const RANGE_SUMMARIES: Record<
  MetricsRange,
  {
    readonly latestLatency: string
    readonly averageLatency: string
    readonly peakPacketLoss: string
  }
> = {
  '1h': { latestLatency: '21 ms', averageLatency: '19.5 ms', peakPacketLoss: '0.2%' },
  '24h': { latestLatency: '22 ms', averageLatency: '20 ms', peakPacketLoss: '0.2%' },
  '7d': { latestLatency: '21 ms', averageLatency: '19.9 ms', peakPacketLoss: '0.2%' },
}

describe('NetworkNodeDetailsPage', () => {
  it('shows the selected node details and a return link to the inventory', async () => {
    renderDetailsPage(createService())

    const nodeSummary = await screen.findByRole('region', { name: 'Core Router' })

    expect(screen.getByRole('link', { name: 'Back to dashboard' })).toHaveAttribute('href', '/')
    expect(within(nodeSummary).getByText('Status')).toBeVisible()
    expect(within(nodeSummary).getByText('Online')).toBeVisible()
    expect(within(nodeSummary).getByText('Address')).toBeVisible()
    expect(within(nodeSummary).getByText('10.0.0.1')).toBeVisible()
    expect(within(nodeSummary).getByText('Location')).toBeVisible()
    expect(within(nodeSummary).getByText('Main office')).toBeVisible()
    expect(within(nodeSummary).getByText('Last checked')).toBeVisible()

    const checkedAt = nodeSummary.querySelector('time')
    expect(checkedAt).toHaveAttribute('datetime', TEST_NODE.lastCheckedAt)
    expect(checkedAt).not.toBeEmptyDOMElement()
  })

  it('starts a new details view at 1h and renders its chart and accessible table', async () => {
    const service = createService()

    renderDetailsPage(service)

    expect(await screen.findByRole('heading', { name: RANGE_TITLES['1h'] })).toBeInTheDocument()
    expectMetricsSummary('1h')
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Latency trend for core-router (ms, 1h, UTC)')).toBeInTheDocument()
    expect(
      screen.getByRole('figure', {
        name: 'Latency chart for core-router in milliseconds (1h, UTC)',
      }),
    ).toHaveAttribute('data-point-count', '4')
    expect(
      screen.getByRole('figure', {
        name: 'Packet loss chart for core-router in percent (1h, UTC)',
      }),
    ).toHaveAttribute('data-point-count', '4')
    expectChartsShareMetrics()

    const latencyChart = screen.getByRole('figure', {
      name: 'Latency chart for core-router in milliseconds (1h, UTC)',
    })
    const packetLossChart = screen.getByRole('figure', {
      name: 'Packet loss chart for core-router in percent (1h, UTC)',
    })
    const table = screen.getByRole('table', {
      name: 'Full data for both charts: latency and packet loss measurements for core-router (1h)',
    })
    expect(
      latencyChart.compareDocumentPosition(packetLossChart) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      packetLossChart.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(getTableRows()).toHaveLength(5)
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((header) => header.textContent),
    ).toEqual(['Timestamp', 'Latency', 'Packet loss'])
    expect(
      Array.from(within(table).getAllByRole('row')[1].querySelectorAll('td')).map(
        (cell) => cell.textContent,
      ),
    ).toEqual([createMetrics('1h').points[0].timestamp, '18 ms', '0%'])
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
      expectMetricsSummary(range)
      expect(screen.getByRole('button', { name: range })).toHaveAttribute('aria-pressed', 'true')
      const otherRange = range === '1h' ? '24h' : '1h'
      expect(screen.getByRole('button', { name: otherRange })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
      expect(
        screen.getByRole('figure', {
          name: `Latency chart for core-router in milliseconds (${range}, UTC)`,
        }),
      ).toHaveAttribute('data-point-count', String(RANGE_FIXTURES[range].sampleCount))
      expect(
        screen.getByRole('figure', {
          name: `Packet loss chart for core-router in percent (${range}, UTC)`,
        }),
      ).toHaveAttribute('data-point-count', String(RANGE_FIXTURES[range].sampleCount))
      expectChartsShareMetrics()
      expectSimulatedDataLabel()
      expect(getTableRows()).toHaveLength(RANGE_FIXTURES[range].sampleCount + 1)
      expect(
        screen.getByRole('table', {
          name: `Full data for both charts: latency and packet loss measurements for core-router (${range})`,
        }),
      ).toBeInTheDocument()
      expect(
        within(screen.getByRole('table')).getByText(createMetrics(range).points[0].timestamp),
      ).toBeInTheDocument()
      const expectedRows = createMetrics(range).points
      const tableRows = within(screen.getByRole('table')).getAllByRole('row').slice(1)

      expectedRows.forEach((point, index) => {
        expect(
          within(tableRows[index])
            .getAllByRole('cell')
            .map((cell) => cell.textContent),
        ).toEqual([point.timestamp, `${point.latencyMs} ms`, `${point.packetLossPercent}%`])
      })
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

    const loadingState = screen.getByRole('status', { name: 'Loading node metrics...' })

    expect(loadingState).toHaveClass('network-node-state--metrics', 'network-node-state--loading')
    expect(loadingState).toHaveAttribute('aria-busy', 'true')
    expect(within(loadingState).getByText('Network metrics')).toBeVisible()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
    expectNoMetricsVisuals()
  })

  it('does not show the previous period chart while the selected period is loading', async () => {
    const user = userEvent.setup()
    const deferredMetrics = createDeferred<NodeMetrics>()
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>((_nodeId, range) =>
        range === '1h' ? Promise.resolve(createMetrics(range)) : deferredMetrics.promise,
      ),
    )

    renderDetailsPage(service)

    expect(
      await screen.findByRole('figure', {
        name: 'Packet loss chart for core-router in percent (1h, UTC)',
      }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '24h' }))

    expect(await screen.findByRole('heading', { name: 'Loading node metrics...' })).toBeVisible()
    expect(screen.getByRole('button', { name: '24h' })).toHaveAttribute('aria-pressed', 'true')
    expectSimulatedDataLabel()
    expectNoMetricsVisuals()
  })

  it('keeps the range selector available for empty and error states', async () => {
    const emptyService = createService(
      vi.fn().mockResolvedValue({ ...createMetrics('1h'), points: [] }),
    )
    const emptyView = renderDetailsPage(emptyService)
    const emptyState = await screen.findByRole('status', { name: 'No metrics available' })

    expect(emptyState).toHaveClass('network-node-state--metrics', 'network-node-state--empty')
    expect(within(emptyState).getByText('Network metrics')).toBeVisible()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
    expectNoMetricsVisuals()
    emptyView.unmount()

    const errorService = createService(vi.fn().mockRejectedValue(new Error('Request failed')))
    renderDetailsPage(errorService)

    const errorState = await screen.findByRole('alert', { name: 'Unable to load node metrics' })

    expect(errorState).toHaveClass('network-node-state--metrics', 'network-node-state--error')
    expect(within(errorState).getByText('Network metrics')).toBeVisible()
    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expectSimulatedDataLabel()
    expectNoMetricsVisuals()
  })

  it('does not show the range selector when the node is not found', async () => {
    const service = createService()
    service.getNode = vi.fn().mockRejectedValue(new NetworkNodeNotFoundError('core-router'))

    renderDetailsPage(service)

    const notFoundState = await screen.findByRole('region', { name: 'Node not found' })

    expect(notFoundState).toHaveClass('network-node-state--not-found')
    expect(within(notFoundState).getByText('Network node')).toBeVisible()
    expect(screen.queryByRole('group', { name: 'Metrics range' })).not.toBeInTheDocument()
    expectNoMetricsVisuals()
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

function createDeferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

function expectChartsShareMetrics(): void {
  const latencyMetrics = vi.mocked(NodeLatencyChart).mock.lastCall?.[0].metrics
  const packetLossMetrics = vi.mocked(NodePacketLossChart).mock.lastCall?.[0].metrics

  expect(latencyMetrics).toBeDefined()
  expect(packetLossMetrics).toBe(latencyMetrics)
}

function expectNoMetricsVisuals(): void {
  expect(screen.queryByLabelText('Metrics summary')).not.toBeInTheDocument()
  expect(screen.queryByRole('figure', { name: /Latency chart/ })).not.toBeInTheDocument()
  expect(screen.queryByRole('figure', { name: /Packet loss chart/ })).not.toBeInTheDocument()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
}

function expectMetricsSummary(range: MetricsRange): void {
  const summary = screen.getByLabelText('Metrics summary')
  const expected = RANGE_SUMMARIES[range]

  expect(within(summary).getByText('Latest latency')).toBeInTheDocument()
  expect(within(summary).getByText(expected.latestLatency)).toBeVisible()
  expect(within(summary).getByText('Average latency')).toBeInTheDocument()
  expect(within(summary).getByText(expected.averageLatency)).toBeVisible()
  expect(within(summary).getByText('Peak packet loss')).toBeInTheDocument()
  expect(within(summary).getByText(expected.peakPacketLoss)).toBeVisible()
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
