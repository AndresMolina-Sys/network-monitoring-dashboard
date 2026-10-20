import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { NetworkNode, NodeMetrics } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { summarizeFleetMetrics, useFleetHealthSummary } from './use-fleet-health-summary'

const INVALID_RESPONSE_CASES: readonly [string, (metrics: NodeMetrics) => NodeMetrics][] = [
  ['an empty response', (metrics) => ({ ...metrics, points: [] })],
  ['an incomplete response', (metrics) => ({ ...metrics, points: metrics.points.slice(1) })],
  [
    'a response with an invalid sample',
    (metrics) => ({
      ...metrics,
      points: metrics.points.map((point, index) =>
        index === 1 ? { ...point, latencyMs: -1 } : point,
      ),
    }),
  ],
  ['a response for a different node', (metrics) => ({ ...metrics, nodeId: 'other-node' })],
  ['a response for a different range', (metrics) => ({ ...metrics, range: '24h' })],
]

const NODES = [
  createNode('core-router'),
  createNode('access-switch-01'),
  createNode('branch-gateway'),
]

describe('useFleetHealthSummary', () => {
  it('aggregates every point instead of averaging per-node averages', () => {
    const summary = summarizeFleetMetrics([
      {
        nodeId: NODES[0].id,
        range: '1h',
        points: [createMetricPoint(0, 1)],
      },
      {
        nodeId: NODES[1].id,
        range: '1h',
        points: [createMetricPoint(30, 2), createMetricPoint(30, 3), createMetricPoint(30, 4)],
      },
    ])

    expect(summary).toEqual({ averageLatencyMs: 22.5, peakPacketLossPercent: 4 })
  })

  it('exposes combined metrics and complete coverage when every node response is valid', async () => {
    const latencies = new Map([
      [NODES[0].id, [10, 10, 10, 10]],
      [NODES[1].id, [20, 20, 20, 20]],
      [NODES[2].id, [30, 30, 30, 30]],
    ])
    const losses = new Map([
      [NODES[0].id, [0.1, 0.2, 0.3, 0.4]],
      [NODES[1].id, [0.5, 0.6, 0.7, 0.8]],
      [NODES[2].id, [1, 2, 3, 4]],
    ])
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) =>
      Promise.resolve(createMetricsWithValues(nodeId, latencies.get(nodeId)!, losses.get(nodeId)!)),
    )
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(result.current.summary).toEqual({ averageLatencyMs: 20, peakPacketLossPercent: 4 })
    expect(result.current.coverage).toEqual({ validNodeCount: 3, totalNodeCount: 3 })
  })

  it('aggregates valid nodes and reports partial coverage when another node fails', async () => {
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) => {
      if (nodeId === NODES[1].id) {
        return Promise.reject(new Error('Metrics request failed'))
      }

      const latency = nodeId === NODES[0].id ? 10 : 30
      const loss = nodeId === NODES[0].id ? 1 : 4

      return Promise.resolve(
        createMetricsWithValues(nodeId, Array(4).fill(latency), Array(4).fill(loss)),
      )
    })
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(result.current.summary).toEqual({ averageLatencyMs: 20, peakPacketLossPercent: 4 })
    expect(result.current.coverage).toEqual({ validNodeCount: 2, totalNodeCount: 3 })
    expect(result.current.failedNodeIds).toEqual([NODES[1].id])
    expect(result.current.metrics.map((metrics) => metrics.nodeId)).toEqual([
      NODES[0].id,
      NODES[2].id,
    ])
  })

  it('retries only failed nodes and preserves the current summary until the retry settles', async () => {
    const retryMetrics = createDeferred<NodeMetrics>()
    let failedNodeAttempts = 0
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) => {
      if (nodeId === NODES[1].id) {
        failedNodeAttempts += 1
        return failedNodeAttempts === 1
          ? Promise.reject(new Error('Metrics request failed'))
          : retryMetrics.promise
      }

      const latency = nodeId === NODES[0].id ? 10 : 30
      const loss = nodeId === NODES[0].id ? 1 : 5

      return Promise.resolve(
        createMetricsWithValues(nodeId, Array(4).fill(latency), Array(4).fill(loss)),
      )
    })
    const service = createService(getNodeMetrics)
    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(result.current.status).toBe('success'))
    const initialMetrics = result.current.metrics
    expect(result.current.summary).toEqual({ averageLatencyMs: 20, peakPacketLossPercent: 5 })
    expect(result.current.coverage).toEqual({ validNodeCount: 2, totalNodeCount: 3 })

    act(() => {
      void result.current.retry()
    })

    await waitFor(() => expect(getNodeMetrics).toHaveBeenCalledTimes(NODES.length + 1))
    expect(getNodeMetrics).toHaveBeenLastCalledWith(NODES[1].id, '1h', expect.anything())
    expect(getNodeMetrics.mock.calls.slice(NODES.length).map(([nodeId]) => nodeId)).toEqual([
      NODES[1].id,
    ])
    expect(result.current.summary).toEqual({ averageLatencyMs: 20, peakPacketLossPercent: 5 })
    expect(result.current.coverage).toEqual({ validNodeCount: 2, totalNodeCount: 3 })
    expect(result.current.failedNodeIds).toEqual([NODES[1].id])
    expect(result.current.metrics).toEqual(initialMetrics)

    await act(async () => {
      retryMetrics.resolve(
        createMetricsWithValues(NODES[1].id, Array(4).fill(50), Array(4).fill(8)),
      )
      await retryMetrics.promise
    })

    await waitFor(() => expect(result.current.failedNodeIds).toEqual([]))
    expect(result.current.summary).toEqual({ averageLatencyMs: 30, peakPacketLossPercent: 8 })
    expect(result.current.coverage).toEqual({ validNodeCount: 3, totalNodeCount: 3 })
    expect(result.current.metrics.map((metrics) => metrics.nodeId)).toEqual(
      NODES.map((node) => node.id),
    )
  })

  it('keeps valid metrics and allows another retry after a retry fails', async () => {
    const retryMetrics = createDeferred<NodeMetrics>()
    let failedNodeAttempts = 0
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) => {
      if (nodeId === NODES[1].id) {
        failedNodeAttempts += 1
        return failedNodeAttempts === 1
          ? Promise.reject(new Error('Initial request failed'))
          : failedNodeAttempts === 2
            ? Promise.reject(new Error('Retry failed'))
            : retryMetrics.promise
      }

      return Promise.resolve(createMetricsWithValues(nodeId, Array(4).fill(20), Array(4).fill(3)))
    })
    const service = createService(getNodeMetrics)
    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(result.current.status).toBe('success'))
    const initialSummary = result.current.summary
    const initialCoverage = result.current.coverage

    await act(async () => {
      await result.current.retry()
    })

    expect(result.current.summary).toEqual(initialSummary)
    expect(result.current.coverage).toEqual(initialCoverage)
    expect(result.current.failedNodeIds).toEqual([NODES[1].id])
    expect(
      getNodeMetrics.mock.calls.slice(NODES.length).map(([nodeId, range]) => [nodeId, range]),
    ).toEqual([[NODES[1].id, '1h']])

    act(() => {
      void result.current.retry()
    })
    await waitFor(() => expect(getNodeMetrics).toHaveBeenCalledTimes(NODES.length + 2))
    expect(getNodeMetrics.mock.calls.slice(NODES.length).map(([nodeId]) => nodeId)).toEqual([
      NODES[1].id,
      NODES[1].id,
    ])

    await act(async () => {
      retryMetrics.resolve(
        createMetricsWithValues(NODES[1].id, Array(4).fill(80), Array(4).fill(9)),
      )
      await retryMetrics.promise
    })

    await waitFor(() => expect(result.current.coverage.validNodeCount).toBe(3))
    expect(result.current.failedNodeIds).toEqual([])
  })

  it.each(['unmount', 'node population change', 'service change'] as const)(
    'aborts an in-flight retry on %s and ignores its late result',
    async (change) => {
      const retryMetrics = createDeferred<NodeMetrics>()
      let failedNodeAttempts = 0
      let retrySignal: AbortSignal | undefined
      const initialGetNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(
        (nodeId, _range, signal) => {
          if (nodeId === NODES[1].id) {
            failedNodeAttempts += 1
            if (failedNodeAttempts === 1) {
              return Promise.reject(new Error('Initial request failed'))
            }

            retrySignal = signal!
            return retryMetrics.promise
          }

          return Promise.resolve(
            createMetricsWithValues(
              nodeId,
              Array(4).fill(nodeId === NODES[0].id ? 10 : 30),
              Array(4).fill(nodeId === NODES[0].id ? 1 : 5),
            ),
          )
        },
      )
      const initialService = createService(initialGetNodeMetrics)
      const nextNodes = [NODES[0], createNode('new-edge-router')]
      const nextService = createService((nodeId) =>
        Promise.resolve(createMetricsWithValues(nodeId, Array(4).fill(70), Array(4).fill(9))),
      )
      const { result, rerender, unmount } = renderHook(
        ({
          nodes,
          service,
        }: {
          nodes: readonly NetworkNode[]
          service: NetworkMonitoringService
        }) => useFleetHealthSummary(nodes, service),
        { initialProps: { nodes: NODES, service: initialService } },
      )

      await waitFor(() => expect(result.current.status).toBe('success'))

      act(() => {
        void result.current.retry()
      })
      await waitFor(() => expect(failedNodeAttempts).toBe(2))
      expect(initialGetNodeMetrics).toHaveBeenCalledTimes(NODES.length + 1)
      expect(initialGetNodeMetrics).toHaveBeenLastCalledWith(NODES[1].id, '1h', expect.anything())
      expect(retrySignal?.aborted).toBe(false)

      if (change === 'unmount') {
        unmount()
      } else if (change === 'node population change') {
        rerender({ nodes: nextNodes, service: initialService })
        await waitFor(() =>
          expect(result.current.coverage).toEqual({ validNodeCount: 2, totalNodeCount: 2 }),
        )
      } else {
        rerender({ nodes: NODES, service: nextService })
        await waitFor(() =>
          expect(result.current.summary).toEqual({
            averageLatencyMs: 70,
            peakPacketLossPercent: 9,
          }),
        )
      }

      expect(retrySignal?.aborted).toBe(true)

      await act(async () => {
        retryMetrics.resolve(
          createMetricsWithValues(NODES[1].id, Array(4).fill(200), Array(4).fill(99)),
        )
        await retryMetrics.promise
      })

      if (change !== 'unmount') {
        expect(result.current.summary).not.toEqual({
          averageLatencyMs: 200,
          peakPacketLossPercent: 99,
        })
        expect(result.current.metrics.some((metrics) => metrics.nodeId === NODES[1].id)).toBe(
          change === 'service change',
        )
      }
    },
  )

  it('returns no summary and zero coverage when every node response is invalid', async () => {
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) =>
      Promise.resolve({ ...createMetrics(nodeId), points: [] }),
    )
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(result.current.summary).toBeNull()
    expect(result.current.coverage).toEqual({ validNodeCount: 0, totalNodeCount: 3 })
    expect(result.current.metrics).toEqual([])
    expect(result.current.failedNodeIds).toEqual(NODES.map((node) => node.id))
  })

  it('requests 1h metrics once for every loaded node in parallel', async () => {
    const pendingRequests = new Map<string, ReturnType<typeof createDeferred<NodeMetrics>>>()
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) => {
      const deferred = createDeferred<NodeMetrics>()
      pendingRequests.set(nodeId, deferred)
      return deferred.promise
    })
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => {
      expect(getNodeMetrics).toHaveBeenCalledTimes(NODES.length)
    })

    expect(result.current.status).toBe('loading')
    for (const [index, node] of NODES.entries()) {
      expect(getNodeMetrics).toHaveBeenNthCalledWith(index + 1, node.id, '1h', expect.anything())
      expect(pendingRequests.has(node.id)).toBe(true)
    }
  })

  it('aborts outstanding requests when the hook unmounts', async () => {
    const signals: AbortSignal[] = []
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(
      (_nodeId, _range, signal) => {
        signals.push(signal!)
        return new Promise(() => {})
      },
    )
    const service = createService(getNodeMetrics)

    const { unmount } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(getNodeMetrics).toHaveBeenCalledTimes(NODES.length))

    expect(signals.every((signal) => !signal.aborted)).toBe(true)

    unmount()

    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })

  it('ignores late results after the node population changes', async () => {
    const nextNodes = [createNode('new-core-router'), createNode('new-access-switch')]
    const requests: DeferredMetricsRequest[] = []
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(
      (nodeId, _range, signal) => {
        const deferred = createDeferred<NodeMetrics>()
        requests.push({ nodeId, deferred, signal: signal! })
        return deferred.promise
      },
    )
    const service = createService(getNodeMetrics)
    const { result, rerender } = renderHook(
      ({ nodes }: { nodes: readonly NetworkNode[] }) => useFleetHealthSummary(nodes, service),
      { initialProps: { nodes: NODES } },
    )

    await waitFor(() => expect(requests).toHaveLength(NODES.length))
    const staleRequests = [...requests]

    rerender({ nodes: nextNodes })

    await waitFor(() => expect(requests).toHaveLength(NODES.length + nextNodes.length))
    const currentRequests = requests.slice(NODES.length)

    expect(staleRequests.every((request) => request.signal.aborted)).toBe(true)

    await act(async () => {
      currentRequests.forEach((request, index) => {
        request.deferred.resolve(
          createMetricsWithValues(
            request.nodeId,
            Array(4).fill(index === 0 ? 50 : 70),
            Array(4).fill(index === 0 ? 1 : 8),
          ),
        )
      })
      await Promise.all(currentRequests.map((request) => request.deferred.promise))
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.summary).toEqual({ averageLatencyMs: 60, peakPacketLossPercent: 8 })
    expect(result.current.coverage).toEqual({ validNodeCount: 2, totalNodeCount: 2 })

    await act(async () => {
      staleRequests.forEach((request) => {
        request.deferred.resolve(
          createMetricsWithValues(request.nodeId, Array(4).fill(200), Array(4).fill(99)),
        )
      })
      await Promise.all(staleRequests.map((request) => request.deferred.promise))
    })

    expect(result.current.summary).toEqual({ averageLatencyMs: 60, peakPacketLossPercent: 8 })
    expect(result.current.coverage).toEqual({ validNodeCount: 2, totalNodeCount: 2 })
    expect(result.current.metrics.map((metrics) => metrics.nodeId)).toEqual(
      nextNodes.map((node) => node.id),
    )
  })

  it('ignores late results after the service changes', async () => {
    const staleRequests: DeferredMetricsRequest[] = []
    const oldGetNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(
      (nodeId, _range, signal) => {
        const deferred = createDeferred<NodeMetrics>()
        staleRequests.push({ nodeId, deferred, signal: signal! })
        return deferred.promise
      },
    )
    const oldService = createService(oldGetNodeMetrics)
    const currentGetNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) =>
      Promise.resolve(createMetricsWithValues(nodeId, Array(4).fill(25), Array(4).fill(2))),
    )
    const currentService = createService(currentGetNodeMetrics)
    const { result, rerender } = renderHook(
      ({ service }: { service: NetworkMonitoringService }) => useFleetHealthSummary(NODES, service),
      { initialProps: { service: oldService } },
    )

    await waitFor(() => expect(staleRequests).toHaveLength(NODES.length))

    rerender({ service: currentService })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(staleRequests.every((request) => request.signal.aborted)).toBe(true)
    expect(currentGetNodeMetrics).toHaveBeenCalledTimes(NODES.length)
    expect(result.current.summary).toEqual({ averageLatencyMs: 25, peakPacketLossPercent: 2 })
    expect(result.current.coverage).toEqual({ validNodeCount: 3, totalNodeCount: 3 })

    await act(async () => {
      staleRequests.forEach((request) => {
        request.deferred.resolve(
          createMetricsWithValues(request.nodeId, Array(4).fill(200), Array(4).fill(99)),
        )
      })
      await Promise.all(staleRequests.map((request) => request.deferred.promise))
    })

    expect(result.current.summary).toEqual({ averageLatencyMs: 25, peakPacketLossPercent: 2 })
    expect(result.current.coverage).toEqual({ validNodeCount: 3, totalNodeCount: 3 })
    expect(result.current.metrics.map((metrics) => metrics.nodeId)).toEqual(
      NODES.map((node) => node.id),
    )
  })

  it('keeps the initial summary loading until every request settles', async () => {
    const coreRouter = createDeferred<NodeMetrics>()
    const accessSwitch = createDeferred<NodeMetrics>()
    const branchGateway = createDeferred<NodeMetrics>()
    const deferredByNode = new Map([
      [NODES[0].id, coreRouter],
      [NODES[1].id, accessSwitch],
      [NODES[2].id, branchGateway],
    ])
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) => {
      return deferredByNode.get(nodeId)!.promise
    })
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(getNodeMetrics).toHaveBeenCalledTimes(NODES.length))

    await act(async () => {
      branchGateway.resolve(createMetrics(NODES[2].id))
      coreRouter.resolve(createMetrics(NODES[0].id))
    })

    expect(result.current.status).toBe('loading')

    await act(async () => {
      accessSwitch.reject(new Error('Metrics request failed'))
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.metrics).toEqual([createMetrics(NODES[0].id), createMetrics(NODES[2].id)])
  })

  it.each(INVALID_RESPONSE_CASES)(
    'excludes the whole node and marks it failed for %s while retaining valid nodes',
    async (_description, createInvalidResponse) => {
      const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) =>
        Promise.resolve(
          nodeId === NODES[0].id
            ? createInvalidResponse(createMetrics(nodeId))
            : createMetrics(nodeId),
        ),
      )
      const service = createService(getNodeMetrics)

      const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

      await waitFor(() => expect(result.current.status).toBe('success'))

      expect(result.current.metrics).toEqual([
        createMetrics(NODES[1].id),
        createMetrics(NODES[2].id),
      ])
      expect(result.current.failedNodeIds).toEqual([NODES[0].id])
    },
  )

  it('excludes a rejected request and marks that node failed while retaining valid nodes', async () => {
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) =>
      nodeId === NODES[0].id
        ? Promise.reject(new Error('Metrics request failed'))
        : Promise.resolve(createMetrics(nodeId)),
    )
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useFleetHealthSummary(NODES, service))

    await waitFor(() => expect(result.current.status).toBe('success'))

    expect(result.current.metrics).toEqual([createMetrics(NODES[1].id), createMetrics(NODES[2].id)])
    expect(result.current.failedNodeIds).toEqual([NODES[0].id])
  })
})

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'],
): NetworkMonitoringService {
  return {
    listNodes: () => Promise.resolve([]),
    getNode: vi.fn(),
    getNodeMetrics: (nodeId, range, signal) => getNodeMetrics(nodeId, range, signal),
  }
}

function createNode(id: string): NetworkNode {
  return {
    id,
    name: id,
    address: '10.0.0.1',
    location: 'Test lab',
    status: 'online',
    lastCheckedAt: '2026-09-13T18:00:00Z',
  }
}

function createMetrics(nodeId: string): NodeMetrics {
  const latestTimestamp = Date.parse('2026-09-13T18:00:00Z')

  return {
    nodeId,
    range: '1h',
    points: Array.from({ length: 4 }, (_, index) =>
      createMetricPoint(18 + index, index / 10, latestTimestamp - (3 - index) * 20 * 60 * 1000),
    ),
  }
}

function createMetricsWithValues(
  nodeId: string,
  latencies: readonly number[],
  packetLoss: readonly number[],
): NodeMetrics {
  const latestTimestamp = Date.parse('2026-09-13T18:00:00Z')

  return {
    nodeId,
    range: '1h',
    points: latencies.map((latencyMs, index) =>
      createMetricPoint(
        latencyMs,
        packetLoss[index],
        latestTimestamp - (latencies.length - 1 - index) * 20 * 60 * 1000,
      ),
    ),
  }
}

function createMetricPoint(
  latencyMs: number,
  packetLossPercent: number,
  timestamp = Date.parse('2026-09-13T18:00:00Z'),
) {
  return {
    timestamp: new Date(timestamp).toISOString(),
    latencyMs,
    packetLossPercent,
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

interface DeferredMetricsRequest {
  readonly nodeId: string
  readonly deferred: ReturnType<typeof createDeferred<NodeMetrics>>
  readonly signal: AbortSignal
}
