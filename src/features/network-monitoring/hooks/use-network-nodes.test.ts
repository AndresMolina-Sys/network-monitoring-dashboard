import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNetworkNodes } from './use-network-nodes'

describe('useNetworkNodes', () => {
  it('transitions from loading to success', async () => {
    const listNodes = vi.fn().mockResolvedValue(NETWORK_NODES)
    const service = {
      listNodes,
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
    const service = {
      listNodes: vi.fn().mockResolvedValue([]),
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
