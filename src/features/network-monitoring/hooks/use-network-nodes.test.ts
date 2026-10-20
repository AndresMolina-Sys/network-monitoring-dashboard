import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { NetworkNode } from '../../../domain/network'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNetworkNodes } from './use-network-nodes'

describe('useNetworkNodes', () => {
  it('clears a loaded node list while a replacement service is loading', async () => {
    const initialService = createService(vi.fn().mockResolvedValue(NETWORK_NODES))
    const nextNodes = createDeferred<readonly NetworkNode[]>()
    const nextService = createService(vi.fn(() => nextNodes.promise))
    const { result, rerender } = renderHook(
      ({ service }: { service: NetworkMonitoringService }) => useNetworkNodes(service),
      { initialProps: { service: initialService } },
    )

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.nodes).toEqual(NETWORK_NODES)

    rerender({ service: nextService })

    expect(result.current.status).toBe('loading')
    expect(result.current.nodes).toEqual([])
    expect(result.current.error).toBeNull()

    await act(async () => {
      nextNodes.resolve([NETWORK_NODES[1]])
      await nextNodes.promise
    })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.nodes).toEqual([NETWORK_NODES[1]])
  })

  it('transitions from loading to success', async () => {
    const listNodes = vi.fn().mockResolvedValue(NETWORK_NODES)

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    const { result } = renderHook(() => useNetworkNodes(service))

    expect(result.current.status).toBe('loading')

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.nodes).toEqual(NETWORK_NODES)
    expect(result.current.error).toBeNull()
  })

  it('exposes empty when the service returns no nodes', async () => {
    const listNodes = vi.fn().mockResolvedValue([])

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    const { result } = renderHook(() => useNetworkNodes(service))

    await waitFor(() => {
      expect(result.current.status).toBe('empty')
    })

    expect(result.current.nodes).toHaveLength(0)
    expect(result.current.error).toBeNull()
  })

  it('recovers from error after retry', async () => {
    const listNodes = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce(NETWORK_NODES)

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    const { result } = renderHook(() => useNetworkNodes(service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.error?.message).toBe('Network unavailable')

    act(() => {
      result.current.retry()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.nodes).toEqual(NETWORK_NODES)
    expect(listNodes).toHaveBeenCalledTimes(2)
  })
})

function createService(listNodes: NetworkMonitoringService['listNodes']): NetworkMonitoringService {
  return {
    listNodes,
    getNode: vi.fn(),
    getNodeMetrics: vi.fn(),
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}
