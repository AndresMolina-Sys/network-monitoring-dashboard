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

interface NetworkNodesData extends Omit<UseNetworkNodesState, 'retry'> {
  readonly service: NetworkMonitoringService
  readonly requestKey: number
}

export function useNetworkNodes(
  service: NetworkMonitoringService = networkMonitoringService,
): UseNetworkNodesState {
  const [requestKey, setRequestKey] = useState(0)
  const [state, setState] = useState<NetworkNodesData>(() =>
    createLoadingState(service, requestKey),
  )
  const currentState =
    state.service === service && state.requestKey === requestKey
      ? state
      : createLoadingState(service, requestKey)

  const retry = useCallback(() => {
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

        setState({
          service,
          requestKey,
          status: nextNodes.length > 0 ? 'success' : 'empty',
          nodes: nextNodes,
          error: null,
        })
      })
      .catch((cause: unknown) => {
        if (!isActive || isAbortError(cause)) {
          return
        }

        setState({
          service,
          requestKey,
          status: 'error',
          nodes: EMPTY_NODES,
          error: toError(cause),
        })
      })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [requestKey, service])

  return {
    status: currentState.status,
    nodes: currentState.nodes,
    error: currentState.error,
    retry,
  }
}

function createLoadingState(
  service: NetworkMonitoringService,
  requestKey: number,
): NetworkNodesData {
  return {
    service,
    requestKey,
    status: 'loading',
    nodes: EMPTY_NODES,
    error: null,
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load network nodes')
}
