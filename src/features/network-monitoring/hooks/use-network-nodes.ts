import { useCallback, useEffect, useState } from 'react'
import type { NetworkNode } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'

const EMPTY_NODES: readonly NetworkNode[] = []

export type NetworkNodesStatus = 'loading' | 'success' | 'empty' | 'error'

export interface UseNetworkNodesState {
  readonly status: NetworkNodesStatus
  readonly nodes: readonly NetworkNode[]
  readonly error: Error | null
  readonly retry: () => void
}

export function useNetworkNodes(
  service: NetworkMonitoringService = networkMonitoringService,
): UseNetworkNodesState {
  const [status, setStatus] = useState<NetworkNodesStatus>('loading')

  const [nodes, setNodes] = useState<readonly NetworkNode[]>(EMPTY_NODES)

  const [error, setError] = useState<Error | null>(null)

  const [requestKey, setRequestKey] = useState(0)

  const retry = useCallback(() => {
    setStatus('loading')
    setNodes(EMPTY_NODES)
    setError(null)
    setRequestKey((currentKey) => currentKey + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    void service
      .listNodes(controller.signal)
      .then((nextNodes) => {
        if (!isActive) {
          return
        }

        setNodes(nextNodes)
        setStatus(nextNodes.length > 0 ? 'success' : 'empty')
      })
      .catch((cause: unknown) => {
        if (!isActive || isAbortError(cause)) {
          return
        }

        setNodes(EMPTY_NODES)
        setError(toError(cause))
        setStatus('error')
      })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [requestKey, service])

  return {
    status,
    nodes,
    error,
    retry,
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load network nodes')
}
