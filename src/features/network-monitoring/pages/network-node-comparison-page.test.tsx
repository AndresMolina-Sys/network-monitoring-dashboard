import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { MetricsRange, NetworkNode, NodeMetrics } from '../../../domain/network'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
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

const EXPECTED_SUMMARIES: Record<
  MetricsRange,
  {
    readonly coreRouter: readonly [string, string, string]
    readonly accessSwitch: readonly [string, string, string]
  }
> = {
  '1h': { coreRouter: ['21 ms', '19.5 ms', '0.2%'], accessSwitch: ['27 ms', '25.5 ms', '0.7%'] },
  '24h': { coreRouter: ['42 ms', '30 ms', '0.2%'], accessSwitch: ['48 ms', '36 ms', '2.8%'] },
  '7d': { coreRouter: ['46 ms', '32 ms', '0.2%'], accessSwitch: ['52 ms', '38 ms', '3.2%'] },
}

describe('NetworkNodeComparisonPage', () => {
  it('starts at 1h and shows accessible measurements for each selected node', async () => {
    const service = createService()

    renderComparisonPage(service)

    await screen.findByRole('table')

    expect(screen.getByRole('group', { name: 'Metrics range' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('Current comparison URL')).toHaveTextContent(
      '/compare?nodes=core-router%2Caccess-switch-01&range=1h',
    )
    expect(screen.getByText('Simulated data', { exact: true })).toBeVisible()
    expect(screen.getByRole('region', { name: 'Comparison charts for 1h' })).toBeVisible()
    expect(screen.getAllByRole('article')).toHaveLength(NODE_IDS.length)
    expectNodeSummary('core-router', EXPECTED_SUMMARIES['1h'].coreRouter)
    expectNodeSummary('access-switch-01', EXPECTED_SUMMARIES['1h'].accessSwitch)

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
    'loads the %s period from a direct comparison URL',
    async (range) => {
      renderComparisonPage(
        createService(),
        NODE_IDS,
        `/compare?nodes=${NODE_IDS.join(',')}&range=${range}`,
      )

      await screen.findByRole('table')

      expect(screen.getByRole('button', { name: range })).toHaveAttribute('aria-pressed', 'true')
      expect(
        screen.getByRole('region', { name: `Comparison charts for ${range}` }),
      ).toHaveTextContent(`${RANGE_DETAILS[range].sampleCount} samples`)
      expect(screen.getByLabelText('Current comparison URL')).toHaveTextContent(`range=${range}`)
    },
  )

  it('normalizes an invalid period to 1h while preserving the other query parameters', async () => {
    renderComparisonPage(
      createService(),
      NODE_IDS,
      '/compare?nodes=core-router%2Caccess-switch-01&range=30d&demo=slow',
    )

    await screen.findByRole('table')

    expect(screen.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('Current comparison URL')).toHaveTextContent(
      '/compare?nodes=core-router%2Caccess-switch-01&range=1h&demo=slow',
    )
  })

  it('updates the URL when the selected period changes', async () => {
    const user = userEvent.setup()

    renderComparisonPage(createService())
    await screen.findByRole('table')
    await user.click(screen.getByRole('button', { name: '24h' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Current comparison URL')).toHaveTextContent('range=24h')
      expect(screen.getByRole('button', { name: '24h' })).toHaveAttribute('aria-pressed', 'true')
    })
  })

  it('copies a clean comparison URL and announces success', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    const restoreClipboard = mockClipboard(writeText)

    try {
      renderComparisonPage(
        createService(),
        NODE_IDS,
        '/compare?nodes=core-router%2Caccess-switch-01&range=1h&demo=slow&debug=true',
      )
      await screen.findByRole('table')
      await user.click(screen.getByRole('button', { name: 'Copy comparison link' }))

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('Comparison link copied.'),
      )
      expect(writeText).toHaveBeenCalledWith(
        `${window.location.origin}/compare?nodes=core-router%2Caccess-switch-01&range=1h`,
      )
    } finally {
      restoreClipboard()
    }
  })

  it('offers a clean comparison URL for manual copying when clipboard access fails', async () => {
    const user = userEvent.setup()
    const restoreClipboard = mockClipboard(vi.fn().mockRejectedValue(new Error('Clipboard denied')))

    try {
      renderComparisonPage(
        createService(),
        NODE_IDS,
        '/compare?nodes=core-router%2Caccess-switch-01&range=7d&demo=slow',
      )
      await screen.findByRole('table')
      await user.click(screen.getByRole('button', { name: 'Copy comparison link' }))

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Could not copy automatically. Select and copy the comparison link below.',
      )
      expect(screen.getByRole('textbox', { name: 'Comparison link' })).toHaveValue(
        `${window.location.origin}/compare?nodes=core-router%2Caccess-switch-01&range=7d`,
      )
    } finally {
      restoreClipboard()
    }
  })

  it('places identifiable node summaries between the period controls and charts', async () => {
    const service = createService(undefined, async () => [
      createNode(NODE_IDS[0], 'Core Router'),
      createNode(NODE_IDS[1], 'Access Switch 01'),
    ])

    renderComparisonPage(service)

    const controls = screen
      .getByRole('group', { name: 'Metrics range' })
      .closest('.network-metrics__toolbar')
    const summaries = await screen.findByRole('region', { name: 'Node metric summaries' })
    const charts = await screen.findByRole('region', { name: 'Comparison charts for 1h' })

    expect(controls).not.toBeNull()
    expect(
      controls!.compareDocumentPosition(summaries) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      summaries.compareDocumentPosition(charts) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      within(summaries).getByRole('article', { name: 'Core Router (core-router)' }),
    ).toBeVisible()
    expect(
      within(summaries).getByRole('article', { name: 'Access Switch 01 (access-switch-01)' }),
    ).toBeVisible()
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
        expectNodeSummary(NODE_IDS[0], EXPECTED_SUMMARIES[range].coreRouter)
        expectNodeSummary(NODE_IDS[1], EXPECTED_SUMMARIES[range].accessSwitch)
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
        expect(screen.queryByRole('article')).not.toBeInTheDocument()
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
      expect(screen.queryByRole('article')).not.toBeInTheDocument()
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
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.queryByRole('article', { name: 'core-router' })).not.toBeInTheDocument()
    expectNodeSummary('access-switch-01', EXPECTED_SUMMARIES['1h'].accessSwitch)
    expect(screen.getByText('Simulated data', { exact: true })).toBeVisible()
  })

  it.each(['not-found', 'invalid'] as const)(
    'omits the summary for a %s node while retaining the valid node summary',
    async (state) => {
      const service = createService((nodeId, range) => {
        if (nodeId === NODE_IDS[1]) {
          return Promise.resolve(createMetrics(range, nodeId))
        }

        if (state === 'not-found') {
          return Promise.reject(new NetworkNodeNotFoundError(nodeId))
        }

        const metrics = createMetrics(range, nodeId)
        return Promise.resolve({ ...metrics, points: metrics.points.slice(1) })
      })

      renderComparisonPage(service)

      await screen.findByRole('table')

      if (state === 'not-found') {
        expect(await screen.findByText('Node not found: core-router')).toBeVisible()
      } else {
        expect(await screen.findByRole('alert')).toHaveTextContent('core-router')
      }

      expect(screen.getAllByRole('article')).toHaveLength(1)
      expect(screen.queryByRole('article', { name: 'core-router' })).not.toBeInTheDocument()
      expectNodeSummary('access-switch-01', EXPECTED_SUMMARIES['1h'].accessSwitch)
    },
  )

  it.each(['empty', 'error', 'not-found', 'invalid'] as const)(
    'does not retain a previous summary when the next range is %s',
    async (state) => {
      const service = createService((nodeId, range) => {
        const metrics = createMetrics(range, nodeId)

        if (range === '1h' || nodeId === NODE_IDS[1]) {
          return Promise.resolve(metrics)
        }

        if (state === 'empty') {
          return Promise.resolve({ ...metrics, points: [] })
        }

        if (state === 'not-found') {
          return Promise.reject(new NetworkNodeNotFoundError(nodeId))
        }

        if (state === 'invalid') {
          return Promise.resolve({ ...metrics, points: metrics.points.slice(1) })
        }

        return Promise.reject(new Error('Metrics request failed'))
      })
      const user = userEvent.setup()

      renderComparisonPage(service)
      await screen.findByRole('table')
      expectNodeSummary('core-router', EXPECTED_SUMMARIES['1h'].coreRouter)

      await user.click(screen.getByRole('button', { name: '24h' }))

      if (state === 'empty') {
        expect(await screen.findByText('No metrics available for core-router')).toBeVisible()
      } else if (state === 'not-found') {
        expect(await screen.findByText('Node not found: core-router')).toBeVisible()
      } else {
        expect(await screen.findByRole('alert')).toHaveTextContent('core-router')
      }

      await waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(1)
        expectNodeSummary('access-switch-01', EXPECTED_SUMMARIES['24h'].accessSwitch)
      })
      expect(screen.queryByRole('article', { name: 'core-router' })).not.toBeInTheDocument()
    },
  )

  it('clears stale summaries across range and selection changes', async () => {
    const nextNodeIds = ['branch-gateway', 'remote-switch'] as const
    const pendingRequests: PendingRequest[] = []
    const service = createService((nodeId, range) => {
      if (range === '1h') {
        return Promise.resolve(createMetrics(range, nodeId))
      }

      const deferred = createDeferred<NodeMetrics>()
      pendingRequests.push({ nodeId, range, deferred })
      return deferred.promise
    })
    const user = userEvent.setup()
    const view = renderComparisonPage(service)

    await screen.findByRole('table')
    expect(screen.getAllByRole('article')).toHaveLength(NODE_IDS.length)

    await user.click(screen.getByRole('button', { name: '24h' }))
    await waitFor(() => expect(pendingRequests).toHaveLength(NODE_IDS.length))

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByText('21 ms', { exact: true })).not.toBeInTheDocument()
    expect(screen.queryByText('19.5 ms', { exact: true })).not.toBeInTheDocument()

    view.rerender(
      <MemoryRouter
        initialEntries={[`/compare?nodes=${encodeURIComponent(NODE_IDS.join(','))}&range=24h`]}
      >
        <CurrentComparisonUrl />
        <NetworkNodeComparisonPage nodeIds={nextNodeIds} service={service} />
      </MemoryRouter>,
    )
    await waitFor(() => expect(pendingRequests).toHaveLength(NODE_IDS.length * 2))

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.queryByText('core-router')).not.toBeInTheDocument()
    expect(screen.queryByText('access-switch-01')).not.toBeInTheDocument()

    await act(async () => {
      pendingRequests[2].deferred.resolve(createMetrics('24h', nextNodeIds[0]))
      pendingRequests[3].deferred.resolve(createMetrics('24h', nextNodeIds[1]))
    })

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(nextNodeIds.length)
      expectNodeSummary(nextNodeIds[0], EXPECTED_SUMMARIES['24h'].accessSwitch)
      expectNodeSummary(nextNodeIds[1], EXPECTED_SUMMARIES['24h'].accessSwitch)
    })

    await act(async () => {
      pendingRequests[0].deferred.resolve(createMetrics('24h', NODE_IDS[0]))
      pendingRequests[1].deferred.resolve(createMetrics('24h', NODE_IDS[1]))
    })

    expect(screen.getAllByRole('article')).toHaveLength(nextNodeIds.length)
    expect(screen.queryByRole('article', { name: 'core-router' })).not.toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'access-switch-01' })).not.toBeInTheDocument()
    expectNodeSummary(nextNodeIds[0], EXPECTED_SUMMARIES['24h'].accessSwitch)
    expectNodeSummary(nextNodeIds[1], EXPECTED_SUMMARIES['24h'].accessSwitch)
  })

  it('shows each recognized node name together with its ID', async () => {
    const service = createService(undefined, async () => [
      createNode('core-router', 'Core Router'),
      createNode('access-switch-01', 'Access Switch 01'),
    ])

    renderComparisonPage(service)

    await screen.findByRole('table')

    expect(screen.getByRole('article', { name: 'Core Router (core-router)' })).toBeVisible()
    expect(
      screen.getByRole('article', { name: 'Access Switch 01 (access-switch-01)' }),
    ).toBeVisible()
  })

  it('uses the ID while the node catalogue is pending without blocking metrics', async () => {
    const listNodes = vi.fn(() => new Promise<readonly NetworkNode[]>(() => undefined))
    const service = createService(undefined, listNodes)

    renderComparisonPage(service)

    const table = await screen.findByRole('table')

    expect(listNodes).toHaveBeenCalledOnce()
    expect(screen.getByRole('article', { name: 'core-router' })).toBeVisible()
    expectNodeSummary('core-router', EXPECTED_SUMMARIES['1h'].coreRouter)
    expect(within(table).getAllByRole('row')).toHaveLength(
      1 + RANGE_DETAILS['1h'].sampleCount * NODE_IDS.length,
    )
  })

  it('uses the ID when the node catalogue request is rejected', async () => {
    const listNodes = vi.fn(async () => {
      throw new Error('Catalogue unavailable')
    })
    const service = createService(undefined, listNodes)

    renderComparisonPage(service)

    await screen.findByRole('table')

    expect(listNodes).toHaveBeenCalledOnce()
    expect(screen.getByRole('article', { name: 'core-router' })).toBeVisible()
    expectNodeSummary('core-router', EXPECTED_SUMMARIES['1h'].coreRouter)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('uses the ID when the catalogue does not contain the selected node', async () => {
    const service = createService(undefined, async () => [createNode('other-node', 'Other Node')])

    renderComparisonPage(service)

    await screen.findByRole('table')

    expect(screen.getByRole('article', { name: 'core-router' })).toBeVisible()
    expect(screen.getByRole('article', { name: 'access-switch-01' })).toBeVisible()
    expectNodeSummary('core-router', EXPECTED_SUMMARIES['1h'].coreRouter)
    expectNodeSummary('access-switch-01', EXPECTED_SUMMARIES['1h'].accessSwitch)
  })
})

function expectNodeSummary(
  nodeId: string,
  [latestLatency, averageLatency, peakPacketLoss]: readonly [string, string, string],
) {
  const summary = screen.getByRole('article', { name: nodeId })

  expect(within(summary).getByText('Latest latency')).toBeInTheDocument()
  expect(within(summary).getByText(latestLatency, { exact: true })).toBeInTheDocument()
  expect(within(summary).getByText('Average latency')).toBeInTheDocument()
  expect(within(summary).getByText(averageLatency, { exact: true })).toBeInTheDocument()
  expect(within(summary).getByText('Peak packet loss')).toBeInTheDocument()
  expect(within(summary).getByText(peakPacketLoss, { exact: true })).toBeInTheDocument()
}

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'] = vi.fn(
    async (nodeId: string, range: MetricsRange) => createMetrics(range, nodeId),
  ),
  listNodes: NetworkMonitoringService['listNodes'] = vi.fn(async () => []),
): NetworkMonitoringService {
  return {
    listNodes: vi.fn(listNodes),
    getNode: vi.fn(),
    getNodeMetrics: vi.fn(getNodeMetrics),
  }
}

function createNode(id: string, name: string): NetworkNode {
  return {
    id,
    name,
    address: '192.0.2.1',
    location: 'Test office',
    status: 'online',
    lastCheckedAt: '2026-10-19T15:00:00Z',
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

interface Deferred<T> {
  readonly promise: Promise<T>
  readonly resolve: (value: T) => void
}

interface PendingRequest {
  readonly nodeId: string
  readonly range: MetricsRange
  readonly deferred: Deferred<NodeMetrics>
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

function CurrentComparisonUrl() {
  const location = useLocation()

  return (
    <div aria-label="Current comparison URL">
      {location.pathname}
      {location.search}
    </div>
  )
}

function mockClipboard(writeText: (text: string) => Promise<void>) {
  const previousDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })

  return () => {
    if (previousDescriptor) {
      Object.defineProperty(navigator, 'clipboard', previousDescriptor)
    } else {
      Reflect.deleteProperty(navigator, 'clipboard')
    }
  }
}

function renderComparisonPage(
  service: NetworkMonitoringService,
  nodeIds: readonly string[] = NODE_IDS,
  initialEntry = `/compare?nodes=${encodeURIComponent(nodeIds.join(','))}`,
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CurrentComparisonUrl />
      <NetworkNodeComparisonPage nodeIds={nodeIds} service={service} />
    </MemoryRouter>,
  )
}
