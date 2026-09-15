import { useCallback, useEffect, useState } from 'react'
import type { NetworkNode } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'

export type NodeLookupStatus = 'loading' | 'success' | 'not-found' | 'error'

export interface UseNetworkNodeState {
  readonly status: NodeLookupStatus
  readonly node: NetworkNode | null
  readonly error: Error | null
  readonly retry: () => void
}

export function useNetworkNode(
  nodeId: NetworkNode['id'],
  service: NetworkMonitoringService = networkMonitoringService,
): UseNetworkNodeState {
  const [status, setStatus] = useState<NodeLookupStatus>('loading')
  const [node, setNode] = useState<NetworkNode | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [requestKey, setRequestKey] = useState(0)

  const retry = useCallback(() => {
    setStatus('loading')
    setNode(null)
    setError(null)
    setRequestKey((currentKey) => currentKey + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    const loadNode = async (): Promise<void> => {
      try {
        const result = await service.getNode(nodeId, controller.signal)

        if (!isActive) {
          return
        }

        setNode(result)
        setError(null)
        setStatus('success')
      } catch (cause: unknown) {
        if (!isActive || isAbortError(cause)) {
          return
        }

        if (cause instanceof NetworkNodeNotFoundError) {
          setNode(null)
          setError(null)
          setStatus('not-found')
          return
        }

        setNode(null)
        setError(toError(cause))
        setStatus('error')
      }
    }

    void loadNode()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [nodeId, requestKey, service])

  return {
    status,
    node,
    error,
    retry,
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load network node')
}
