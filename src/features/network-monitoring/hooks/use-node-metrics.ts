import { useCallback, useEffect, useState } from 'react'
import type { MetricsRange, NetworkNode, NodeMetrics } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import { assertValidMetricPoints, assertValidMetricsResponse } from '../metrics-validation'

export type NodeMetricsStatus = 'loading' | 'success' | 'empty' | 'not-found' | 'error'

export interface UseNodeMetricsState {
  readonly status: NodeMetricsStatus
  readonly metrics: NodeMetrics | null
  readonly error: Error | null
  readonly retry: () => void
}

type MetricsSnapshot = Pick<UseNodeMetricsState, 'status' | 'metrics' | 'error'>

interface StoredMetricsSnapshot extends MetricsSnapshot {
  readonly nodeId: NetworkNode['id']
  readonly range: MetricsRange
  readonly requestKey: number
  readonly service: NetworkMonitoringService
}

export function useNodeMetrics(
  nodeId: NetworkNode['id'],
  range: MetricsRange = '1h',
  service: NetworkMonitoringService = networkMonitoringService,
): UseNodeMetricsState {
  const [requestKey, setRequestKey] = useState(0)
  const [storedSnapshot, setStoredSnapshot] = useState<StoredMetricsSnapshot>(() => ({
    nodeId,
    range,
    requestKey,
    service,
    status: 'loading',
    metrics: null,
    error: null,
  }))

  const isCurrentSnapshot =
    storedSnapshot.nodeId === nodeId &&
    storedSnapshot.range === range &&
    storedSnapshot.requestKey === requestKey &&
    storedSnapshot.service === service

  const snapshot: MetricsSnapshot = isCurrentSnapshot
    ? storedSnapshot
    : { status: 'loading', metrics: null, error: null }

  const retry = useCallback(() => {
    setRequestKey((currentKey) => currentKey + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true
    const saveSnapshot = (nextSnapshot: MetricsSnapshot): void => {
      setStoredSnapshot({ nodeId, range, requestKey, service, ...nextSnapshot })
    }

    const loadMetrics = async (): Promise<void> => {
      try {
        const result: unknown = await service.getNodeMetrics(nodeId, range, controller.signal)

        if (!isActive) {
          return
        }

        assertValidMetricsResponse(result, nodeId, range)

        if (result.points.length === 0) {
          saveSnapshot({ status: 'empty', metrics: null, error: null })
          return
        }

        assertValidMetricPoints(result.points, range)

        saveSnapshot({ status: 'success', metrics: result, error: null })
      } catch (cause: unknown) {
        if (!isActive || isAbortError(cause)) {
          return
        }

        if (cause instanceof NetworkNodeNotFoundError) {
          saveSnapshot({ status: 'not-found', metrics: null, error: null })
          return
        }

        saveSnapshot({ status: 'error', metrics: null, error: toError(cause) })
      }
    }

    void loadMetrics()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [nodeId, range, requestKey, service])

  return {
    ...snapshot,
    retry,
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load node metrics')
}
