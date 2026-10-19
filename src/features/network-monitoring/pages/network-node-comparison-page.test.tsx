import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { MetricsRange, NodeMetrics } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeComparisonPage } from './network-node-comparison-page'

vi.mock('../components/node-metrics-comparison-chart', () => ({
  NodeMetricsComparisonChart: ({
    metrics,
    range,
  }: {
    readonly metrics: readonly NodeMetrics[]
    readonly range: MetricsRange
  }) => (
    <section aria-label={`Comparison charts for ${range}`}>
      {metrics.map((nodeMetrics) => (
        <p key={nodeMetrics.nodeId}>
          {nodeMetrics.nodeId}: {nodeMetrics.range} ({nodeMetrics.points.length} samples)
        </p>
      ))}
    </section>
  ),
}))

const NODE_IDS = ['core-router', 'access-switch-01'] as const

const RANGE_DETAILS: Record<
  MetricsRange,
  { readonly sampleCount: number; readonly cadenceMs: number }
> = {
  '1h': { sampleCount: 4, cadenceMs: 20 * 60 * 1000 },
  '24h': { sampleCount: 25, cadenceMs: 60 * 60 * 1000 },
  '7d': { sampleCount: 29, cadenceMs: 6 * 60 * 60 * 1000 },
}

describe('NetworkNodeComparisonPage', () => {
  it('starts at 1h and shows accessible measurements for each selected node', async () => {
    const service = createService()

    renderComparisonPage(service)

    await screen.findByRole('table')

    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Simulated data', { exact: true })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Comparison charts for 1h' })).toBeVisible()

    const table = screen.getByRole('table')
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    const rows = within(table).getAllByRole('row').slice(1)

    expect(headers).toEqual(['Node', 'Timestamp', 'Latency', 'Packet loss'])
    expect(rows).toHaveLength(RANGE_DETAILS['1h'].sampleCount * NODE_IDS.length)
    expect(rows[0]).toHaveTextContent('core-router')
    expect(rows[0].querySelector('time')).toHaveAttribute(
      'datetime',
      createMetrics('1h', 'core-router').points[0].timestamp,
    )
    expect(rows[0]).toHaveTextContent('18 ms')
    expect(rows[0]).toHaveTextContent('0%')
    expect(rows.some((row) => row.textContent?.includes('access-switch-01'))).toBe(true)
  })

  it.each(['24h', '7d'] as const)(
    'updates every node and the table when selecting %s',
    async (range) => {
      const user = userEvent.setup()
      const service = createService()

      renderComparisonPage(service)
      await screen.findByRole('table')
      await user.click(screen.getByRole('button', { name: range }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: range })).toHaveAttribute('aria-pressed', 'true')
        expect(
          screen.getByRole('region', { name: `Comparison charts for ${range}` }),
        ).toHaveTextContent(`core-router: ${range} (${RANGE_DETAILS[range].sampleCount} samples)`)
        expect(
          screen.getByRole('region', { name: `Comparison charts for ${range}` }),
        ).toHaveTextContent(
          `access-switch-01: ${range} (${RANGE_DETAILS[range].sampleCount} samples)`,
        )
        expect(service.getNodeMetrics).toHaveBeenCalledWith(NODE_IDS[0], range, expect.anything())
        expect(service.getNodeMetrics).toHaveBeenCalledWith(NODE_IDS[1], range, expect.anything())
      })

      const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
      expect(rows).toHaveLength(RANGE_DETAILS[range].sampleCount * NODE_IDS.length)
      expect(
        rows.some((row) =>
          row.textContent?.includes(createMetrics(range, NODE_IDS[0]).points[0].timestamp),
        ),
      ).toBe(true)
    },
  )

  it.each(['loading', 'success', 'empty', 'error'] as const)(
    'keeps the simulated-data label visible during the %s state',
    async (state) => {
      const service = createService((nodeId, range) => {
        if (state === 'loading') {
          return new Promise<NodeMetrics>(() => undefined)
        }

        if (state === 'error') {
          return Promise.reject(new Error(`Unable to load ${nodeId}`))
        }

        const metrics = createMetrics(range, nodeId)
        return Promise.resolve(state === 'empty' ? { ...metrics, points: [] } : metrics)
      })

      renderComparisonPage(service)

      expect(screen.getByText('Simulated data', { exact: true })).toBeVisible()

      if (state === 'loading') {
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
        expect(screen.queryByRole('region', { name: /Comparison charts/ })).not.toBeInTheDocument()
        return
      }

      if (state === 'success') {
        expect(await screen.findByRole('table')).toBeVisible()
        return
      }

      if (state === 'empty') {
        expect(await screen.findAllByText(/No metrics available/i)).toHaveLength(NODE_IDS.length)
      } else {
        expect((await screen.findAllByRole('alert')).length).toBeGreaterThan(0)
      }

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(screen.queryByRole('region', { name: /Comparison charts/ })).not.toBeInTheDocument()
    },
  )

  it('keeps valid nodes visible when another selected node fails', async () => {
    const service = createService((nodeId, range) =>
      nodeId === NODE_IDS[0]
        ? Promise.reject(new Error('Connection failed'))
        : Promise.resolve(createMetrics(range, nodeId)),
    )

    renderComparisonPage(service)

    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)

    expect(await screen.findByRole('alert')).toHaveTextContent('core-router')
    expect(screen.getByRole('region', { name: 'Comparison charts for 1h' })).toHaveTextContent(
      'access-switch-01: 1h (4 samples)',
    )
    expect(rows).toHaveLength(RANGE_DETAILS['1h'].sampleCount)
    expect(rows.every((row) => row.textContent?.includes('access-switch-01'))).toBe(true)
    expect(screen.getByText('Simulated data', { exact: true })).toBeVisible()
  })
})

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'] = vi.fn(
    async (nodeId: string, range: MetricsRange) => createMetrics(range, nodeId),
  ),
): NetworkMonitoringService {
  return {
    listNodes: vi.fn(async () => []),
    getNode: vi.fn(),
    getNodeMetrics: vi.fn(getNodeMetrics),
  }
}

function createMetrics(range: MetricsRange, nodeId: string): NodeMetrics {
  const { sampleCount, cadenceMs } = RANGE_DETAILS[range]
  const anchor = Date.parse(
    nodeId === NODE_IDS[0] ? '2026-10-18T12:00:00Z' : '2026-10-19T15:00:00Z',
  )
  const latencyStart = nodeId === NODE_IDS[0] ? 18 : 24

  return {
    nodeId,
    range,
    points: Array.from({ length: sampleCount }, (_, index) => ({
      timestamp: new Date(anchor - cadenceMs * (sampleCount - index - 1)).toISOString(),
      latencyMs: latencyStart + index,
      packetLossPercent: nodeId === NODE_IDS[0] ? (index % 2) * 0.2 : 0.4 + index / 10,
    })),
  }
}

function renderComparisonPage(service: NetworkMonitoringService) {
  return render(
    <MemoryRouter>
      <NetworkNodeComparisonPage nodeIds={NODE_IDS} service={service} />
    </MemoryRouter>,
  )
}
