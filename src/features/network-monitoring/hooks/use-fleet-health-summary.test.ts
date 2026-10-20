import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { NetworkNode, NodeMetrics } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useFleetHealthSummary } from './use-fleet-health-summary'

const NODES = [
  createNode('core-router'),
  createNode('access-switch-01'),
  createNode('branch-gateway'),
]

describe('useFleetHealthSummary', () => {
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
      expect(getNodeMetrics).toHaveBeenNthCalledWith(index + 1, node.id, '1h', undefined)
      expect(pendingRequests.has(node.id)).toBe(true)
    }
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
  return {
    nodeId,
    range: '1h',
    points: [
      {
        timestamp: '2026-09-13T18:00:00Z',
        latencyMs: 18,
        packetLossPercent: 0,
      },
    ],
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
