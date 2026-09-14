import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { NodeMetrics } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNodeMetrics } from './use-node-metrics'

const METRICS: NodeMetrics = {
  nodeId: 'core-router',
  range: '1h',
  points: [
    {
      timestamp: '2026-09-13T18:00:00Z',
      latencyMs: 19,
      packetLossPercent: 0,
    },
  ],
}

describe('useNodeMetrics', () => {
  it('transitions from loading to success', async () => {
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => METRICS),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    expect(result.current.status).toBe('loading')

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.metrics).toEqual(METRICS)
    expect(result.current.error).toBeNull()
  })

  it('exposes empty when the service returns no points', async () => {
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => ({
        ...METRICS,
        points: [],
      })),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('empty')
    })

    expect(result.current.metrics).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('recovers from error after retry', async () => {
    const getNodeMetrics = vi
      .fn<NetworkMonitoringService['getNodeMetrics']>()
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(METRICS)

    const service = createService(getNodeMetrics)
    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.error?.message).toBe('Request failed')

    act(() => {
      result.current.retry()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.metrics).toEqual(METRICS)
    expect(getNodeMetrics).toHaveBeenCalledTimes(2)
  })

  it('aborts the request when the hook unmounts', async () => {
    let requestSignal: AbortSignal | undefined

    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async (nodeId, range, signal) => {
        const requestLabel = `${nodeId}:${range}`
        void requestLabel

        requestSignal = signal

        return new Promise<NodeMetrics>(() => {})
      }),
    )

    const { unmount } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(requestSignal).toBeDefined()
    })

    unmount()

    expect(requestSignal?.aborted).toBe(true)
  })
})

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'],
): NetworkMonitoringService {
  return {
    listNodes: async () => [],
    getNodeMetrics,
  }
}
