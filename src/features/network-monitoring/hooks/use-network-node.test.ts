import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNetworkNode } from './use-network-node'

describe('useNetworkNode', () => {
  it('transitions from loading to success', async () => {
    const getNode = vi.fn<NetworkMonitoringService['getNode']>().mockResolvedValue(NETWORK_NODES[0])

    const service = createService(getNode)

    const { result } = renderHook(() => useNetworkNode('core-router', service))

    expect(result.current.status).toBe('loading')

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.node).toEqual(NETWORK_NODES[0])
    expect(result.current.error).toBeNull()
  })

  it('exposes not-found when the node does not exist', async () => {
    const getNode = vi
      .fn<NetworkMonitoringService['getNode']>()
      .mockRejectedValue(new NetworkNodeNotFoundError('unknown-node'))

    const service = createService(getNode)

    const { result } = renderHook(() => useNetworkNode('unknown-node', service))

    await waitFor(() => {
      expect(result.current.status).toBe('not-found')
    })

    expect(result.current.node).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('recovers from an error after retry', async () => {
    const getNode = vi
      .fn<NetworkMonitoringService['getNode']>()
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(NETWORK_NODES[0])

    const service = createService(getNode)

    const { result } = renderHook(() => useNetworkNode('core-router', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    act(() => {
      result.current.retry()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.node).toEqual(NETWORK_NODES[0])
    expect(getNode).toHaveBeenCalledTimes(2)
  })
})

function createService(getNode: NetworkMonitoringService['getNode']): NetworkMonitoringService {
  return {
    listNodes: vi.fn(),
    getNode,
    getNodeMetrics: vi.fn(),
  }
}
