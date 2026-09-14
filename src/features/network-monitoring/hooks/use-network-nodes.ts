import { useEffect, useState } from 'react'
import type { NetworkNode } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'

const EMPTY_NODES: readonly NetworkNode[] = []

export type NetworkNodesStatus = 'loading' | 'success' | 'empty' | 'error'

export interface UseNetworkNodesState {
  readonly status: NetworkNodesStatus
  readonly nodes: readonly NetworkNode[]
  readonly error: Error | null
}

export function useNetworkNodes(
  service: NetworkMonitoringService = networkMonitoringService,
): UseNetworkNodesState {
  const [status, setStatus] = useState<NetworkNodesStatus>('loading')
  const [nodes, setNodes] = useState<readonly NetworkNode[]>(EMPTY_NODES)
  const [error, setError] = useState<Error | null>(null)

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
  }, [service])

  return {
    status,
    nodes,
    error,
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load network nodes')
}
