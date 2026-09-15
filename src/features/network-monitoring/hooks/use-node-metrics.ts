import { useCallback, useEffect, useState } from 'react'
import type { MetricsRange, NetworkNode, NodeMetrics } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'

export type NodeMetricsStatus = 'loading' | 'success' | 'empty' | 'not-found' | 'error'

export interface UseNodeMetricsState {
  readonly status: NodeMetricsStatus
  readonly metrics: NodeMetrics | null
  readonly error: Error | null
  readonly retry: () => void
}

export function useNodeMetrics(
  nodeId: NetworkNode['id'],
  range: MetricsRange = '1h',
  service: NetworkMonitoringService = networkMonitoringService,
): UseNodeMetricsState {
  const [status, setStatus] = useState<NodeMetricsStatus>('loading')
  const [metrics, setMetrics] = useState<NodeMetrics | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  const retry = useCallback(() => {
    setStatus('loading')
    setMetrics(null)
    setError(null)
    setRequestKey((currentKey) => currentKey + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    const loadMetrics = async (): Promise<void> => {
      try {
        const result = await service.getNodeMetrics(nodeId, range, controller.signal)

        if (!isActive) {
          return
        }

        if (result.points.length === 0) {
          setMetrics(null)
          setError(null)
          setStatus('empty')
          return
        }

        setMetrics(result)
        setError(null)
        setStatus('success')
      } catch (cause: unknown) {
        if (!isActive || isAbortError(cause)) {
          return
        }

        if (cause instanceof NetworkNodeNotFoundError) {
          setMetrics(null)
          setError(null)
          setStatus('not-found')
          return
        }

        setMetrics(null)
        setError(toError(cause))
        setStatus('error')
      }
    }

    void loadMetrics()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [nodeId, range, requestKey, service])

  return {
    status,
    metrics,
    error,
    retry,
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load node metrics')
}
