import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { MetricsRange, NodeMetrics } from '../../../domain/network'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNodeComparison } from './use-node-comparison'

const NODE_IDS = ['core-router', 'access-switch-01'] as const

const RANGE_CASES = [
  { range: '1h', sampleCount: 4, cadenceMs: 20 * 60 * 1000 },
  { range: '24h', sampleCount: 25, cadenceMs: 60 * 60 * 1000 },
  { range: '7d', sampleCount: 29, cadenceMs: 6 * 60 * 60 * 1000 },
] as const satisfies readonly { range: MetricsRange; sampleCount: number; cadenceMs: number }[]

describe('useNodeComparison', () => {
  it.each(RANGE_CASES)(
    'requests every selected node independently for the $range period',
    async ({ range, sampleCount }) => {
      const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(
        async (nodeId, requestedRange) => createMetrics(requestedRange, nodeId),
      )
      const service = createService(getNodeMetrics)

      const { result } = renderHook(() => useNodeComparison(NODE_IDS, range, service))

      await waitFor(() => {
        expect(result.current.nodes).toHaveLength(NODE_IDS.length)
        expect(result.current.nodes.every((node) => node.status === 'success')).toBe(true)
      })

      expect(getNodeMetrics).toHaveBeenCalledTimes(NODE_IDS.length)
      expect(getNodeMetrics).toHaveBeenNthCalledWith(1, NODE_IDS[0], range, expect.any(AbortSignal))
      expect(getNodeMetrics).toHaveBeenNthCalledWith(2, NODE_IDS[1], range, expect.any(AbortSignal))

      for (const nodeId of NODE_IDS) {
        const node = getNodeState(result.current.nodes, nodeId)
        expect(node.metrics?.nodeId).toBe(nodeId)
        expect(node.metrics?.range).toBe(range)
        expect(node.metrics?.points).toHaveLength(sampleCount)
        expect(node.error).toBeNull()
      }
    },
  )

  it('updates each node independently as its request succeeds', async () => {
    const coreRouter = createDeferred<NodeMetrics>()
    const accessSwitch = createDeferred<NodeMetrics>()
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId) =>
      nodeId === NODE_IDS[0] ? coreRouter.promise : accessSwitch.promise,
    )
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeComparison(NODE_IDS, '1h', service))

    await waitFor(() => expect(getNodeMetrics).toHaveBeenCalledTimes(2))
    expect(getNodeState(result.current.nodes, NODE_IDS[0]).status).toBe('loading')
    expect(getNodeState(result.current.nodes, NODE_IDS[1]).status).toBe('loading')

    await act(async () => {
      coreRouter.resolve(createMetrics('1h', NODE_IDS[0]))
    })

    await waitFor(() => {
      expect(getNodeState(result.current.nodes, NODE_IDS[0]).status).toBe('success')
    })
    expect(getNodeState(result.current.nodes, NODE_IDS[1])).toMatchObject({
      status: 'loading',
      metrics: null,
      error: null,
    })

    await act(async () => {
      accessSwitch.resolve(createMetrics('1h', NODE_IDS[1]))
    })

    await waitFor(() => {
      expect(getNodeState(result.current.nodes, NODE_IDS[1]).status).toBe('success')
    })
  })

  it('keeps a successful node available when another request fails', async () => {
    const requestError = new Error('Metrics request failed')
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(async (nodeId) => {
      if (nodeId === NODE_IDS[0]) {
        throw requestError
      }

      return createMetrics('1h', nodeId)
    })
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeComparison(NODE_IDS, '1h', service))

    await waitFor(() => {
      expect(getNodeState(result.current.nodes, NODE_IDS[0]).status).toBe('error')
      expect(getNodeState(result.current.nodes, NODE_IDS[1]).status).toBe('success')
    })

    expect(getNodeState(result.current.nodes, NODE_IDS[0])).toMatchObject({
      metrics: null,
      error: requestError,
    })
    expect(getNodeState(result.current.nodes, NODE_IDS[1]).metrics?.nodeId).toBe(NODE_IDS[1])
  })

  it('marks a missing node without hiding another successful result', async () => {
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(async (nodeId) => {
      if (nodeId === NODE_IDS[0]) {
        throw new NetworkNodeNotFoundError(nodeId)
      }

      return createMetrics('1h', nodeId)
    })
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeComparison(NODE_IDS, '1h', service))

    await waitFor(() => {
      expect(getNodeState(result.current.nodes, NODE_IDS[0]).status).toBe('not-found')
      expect(getNodeState(result.current.nodes, NODE_IDS[1]).status).toBe('success')
    })

    expect(getNodeState(result.current.nodes, NODE_IDS[0])).toMatchObject({
      metrics: null,
      error: null,
    })
  })

  it('classifies an empty response separately while retaining other node metrics', async () => {
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(async (nodeId) => {
      const metrics = createMetrics('1h', nodeId)

      return nodeId === NODE_IDS[0] ? { ...metrics, points: [] } : metrics
    })
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeComparison(NODE_IDS, '1h', service))

    await waitFor(() => {
      expect(getNodeState(result.current.nodes, NODE_IDS[0]).status).toBe('empty')
      expect(getNodeState(result.current.nodes, NODE_IDS[1]).status).toBe('success')
    })

    expect(getNodeState(result.current.nodes, NODE_IDS[0])).toMatchObject({
      metrics: null,
      error: null,
    })
    expect(getNodeState(result.current.nodes, NODE_IDS[1]).metrics?.points).toHaveLength(4)
  })

  it.each(['identity mismatch', 'incomplete sample set'] as const)(
    'marks an invalid response as an error for only that node (%s)',
    async (invalidCase) => {
      const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(async (nodeId) => {
        const metrics = createMetrics('1h', nodeId)

        if (nodeId !== NODE_IDS[0]) {
          return metrics
        }

        if (invalidCase === 'identity mismatch') {
          return { ...metrics, nodeId: 'branch-gateway' } as NodeMetrics
        }

        return { ...metrics, points: metrics.points.slice(1) } as NodeMetrics
      })
      const service = createService(getNodeMetrics)

      const { result } = renderHook(() => useNodeComparison(NODE_IDS, '1h', service))

      await waitFor(() => {
        expect(getNodeState(result.current.nodes, NODE_IDS[0]).status).toBe('error')
        expect(getNodeState(result.current.nodes, NODE_IDS[1]).status).toBe('success')
      })

      expect(getNodeState(result.current.nodes, NODE_IDS[0]).metrics).toBeNull()
      expect(getNodeState(result.current.nodes, NODE_IDS[0]).error).toBeInstanceOf(Error)
      expect(getNodeState(result.current.nodes, NODE_IDS[1]).metrics?.nodeId).toBe(NODE_IDS[1])
    },
  )

  it('clears old node results when the selected node IDs change', async () => {
    const firstSelection = NODE_IDS
    const nextSelection = ['branch-gateway', 'remote-switch'] as const
    const pendingRequests: PendingRequest[] = []
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId, range) => {
      const deferred = createDeferred<NodeMetrics>()
      pendingRequests.push({ nodeId, range, deferred })
      return deferred.promise
    })
    const service = createService(getNodeMetrics)

    const { result, rerender } = renderHook(
      ({ nodeIds, range }: { nodeIds: readonly string[]; range: MetricsRange }) =>
        useNodeComparison(nodeIds, range, service),
      { initialProps: { nodeIds: firstSelection, range: '1h' as const } },
    )

    await waitFor(() => expect(pendingRequests).toHaveLength(2))
    rerender({ nodeIds: nextSelection, range: '1h' })
    await waitFor(() => expect(pendingRequests).toHaveLength(4))

    expect(result.current.nodes.map((node) => node.nodeId)).toEqual(nextSelection)
    expect(
      result.current.nodes.every((node) => node.status === 'loading' && node.metrics === null),
    ).toBe(true)

    await act(async () => {
      pendingRequests[2].deferred.resolve(createMetrics('1h', nextSelection[0]))
      pendingRequests[3].deferred.resolve(createMetrics('1h', nextSelection[1]))
    })

    await waitFor(() => {
      expect(result.current.nodes.every((node) => node.status === 'success')).toBe(true)
    })

    await act(async () => {
      pendingRequests[0].deferred.resolve(createMetrics('1h', firstSelection[0]))
      pendingRequests[1].deferred.resolve(createMetrics('1h', firstSelection[1]))
    })

    expect(result.current.nodes.map((node) => node.nodeId)).toEqual(nextSelection)
    expect(result.current.nodes.map((node) => node.metrics?.nodeId)).toEqual(nextSelection)
  })

  it('clears old range data and ignores deferred responses that resolve out of order', async () => {
    const pendingRequests: PendingRequest[] = []
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((nodeId, range) => {
      const deferred = createDeferred<NodeMetrics>()
      pendingRequests.push({ nodeId, range, deferred })
      return deferred.promise
    })
    const service = createService(getNodeMetrics)

    const { result, rerender } = renderHook(
      ({ range }: { range: MetricsRange }) => useNodeComparison(NODE_IDS, range, service),
      { initialProps: { range: '1h' as const } },
    )

    await waitFor(() => expect(pendingRequests).toHaveLength(2))
    rerender({ range: '24h' })
    await waitFor(() => expect(pendingRequests).toHaveLength(4))

    expect(
      result.current.nodes.every((node) => node.status === 'loading' && node.metrics === null),
    ).toBe(true)

    await act(async () => {
      pendingRequests[2].deferred.resolve(createMetrics('24h', NODE_IDS[0]))
      pendingRequests[3].deferred.resolve(createMetrics('24h', NODE_IDS[1]))
    })

    await waitFor(() => {
      expect(result.current.nodes.every((node) => node.status === 'success')).toBe(true)
    })

    await act(async () => {
      pendingRequests[0].deferred.resolve(createMetrics('1h', NODE_IDS[0]))
      pendingRequests[1].deferred.resolve(createMetrics('1h', NODE_IDS[1]))
    })

    expect(result.current.nodes.map((node) => node.metrics?.range)).toEqual(['24h', '24h'])
    expect(result.current.nodes.map((node) => node.metrics?.nodeId)).toEqual(NODE_IDS)
  })
})

type NodeComparisonState = {
  readonly nodeId: string
  readonly status: 'loading' | 'success' | 'empty' | 'not-found' | 'error'
  readonly metrics: NodeMetrics | null
  readonly error: Error | null
}

interface PendingRequest {
  readonly nodeId: string
  readonly range: MetricsRange
  readonly deferred: Deferred<NodeMetrics>
}

interface Deferred<T> {
  readonly promise: Promise<T>
  readonly resolve: (value: T) => void
}

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'],
): NetworkMonitoringService {
  return {
    listNodes: vi.fn<NetworkMonitoringService['listNodes']>(async () => []),
    getNode: vi.fn<NetworkMonitoringService['getNode']>(),
    getNodeMetrics,
  }
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

function createMetrics(range: MetricsRange, nodeId: string): NodeMetrics {
  const rangeCase = RANGE_CASES.find((candidate) => candidate.range === range)

  if (rangeCase === undefined) {
    throw new Error(`Unsupported metrics range: ${range}`)
  }

  const latestTimestamp = Date.parse('2026-10-19T12:00:00Z')

  return {
    nodeId,
    range,
    points: Array.from({ length: rangeCase.sampleCount }, (_, index) => ({
      timestamp: new Date(
        latestTimestamp - (rangeCase.sampleCount - index - 1) * rangeCase.cadenceMs,
      ).toISOString(),
      latencyMs: 12 + index,
      packetLossPercent: index / 10,
    })),
  }
}

function getNodeState(nodes: readonly NodeComparisonState[], nodeId: string): NodeComparisonState {
  const node = nodes.find((candidate) => candidate.nodeId === nodeId)

  if (node === undefined) {
    throw new Error(`No comparison state found for node ${nodeId}`)
  }

  return node
}
