import { useEffect, useState } from 'react'
import type { MetricsRange, NetworkNode, NodeMetrics } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import { assertValidMetricPoints, assertValidMetricsResponse } from '../metrics-validation'

export type NodeComparisonStatus = 'loading' | 'success' | 'empty' | 'not-found' | 'error'

export interface NodeComparisonState {
  readonly nodeId: NetworkNode['id']
  readonly status: NodeComparisonStatus
  readonly metrics: NodeMetrics | null
  readonly error: Error | null
}

export interface UseNodeComparisonState {
  readonly nodes: readonly NodeComparisonState[]
}

interface StoredComparisonSnapshot extends UseNodeComparisonState {
  readonly selectionKey: string
  readonly range: MetricsRange
  readonly service: NetworkMonitoringService
}

export function useNodeComparison(
  nodeIds: readonly NetworkNode['id'][],
  range: MetricsRange,
  service: NetworkMonitoringService = networkMonitoringService,
): UseNodeComparisonState {
  const selectionKey = JSON.stringify(nodeIds)
  const [storedSnapshot, setStoredSnapshot] = useState<StoredComparisonSnapshot>(() => ({
    selectionKey,
    range,
    service,
    nodes: createLoadingStates(nodeIds),
  }))

  const isCurrentSnapshot =
    storedSnapshot.selectionKey === selectionKey &&
    storedSnapshot.range === range &&
    storedSnapshot.service === service

  const nodes = isCurrentSnapshot ? storedSnapshot.nodes : createLoadingStates(nodeIds)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true
    const selectedNodeIds = JSON.parse(selectionKey) as NetworkNode['id'][]

    const saveNodeState = (nodeId: NetworkNode['id'], nextState: NodeComparisonState): void => {
      if (!isActive) {
        return
      }

      setStoredSnapshot((currentSnapshot) => {
        const isSnapshotStale =
          currentSnapshot.selectionKey !== selectionKey ||
          currentSnapshot.range !== range ||
          currentSnapshot.service !== service
        const baseSnapshot = isSnapshotStale
          ? {
              selectionKey,
              range,
              service,
              nodes: createLoadingStates(selectedNodeIds),
            }
          : currentSnapshot

        return {
          ...baseSnapshot,
          nodes: baseSnapshot.nodes.map((node) => (node.nodeId === nodeId ? nextState : node)),
        }
      })
    }

    const loadNodeMetrics = async (nodeId: NetworkNode['id']): Promise<void> => {
      try {
        const result: unknown = await service.getNodeMetrics(nodeId, range, controller.signal)

        if (!isActive) {
          return
        }

        assertValidMetricsResponse(result, nodeId, range)

        if (result.points.length === 0) {
          saveNodeState(nodeId, {
            nodeId,
            status: 'empty',
            metrics: null,
            error: null,
          })
          return
        }

        assertValidMetricPoints(result.points, range)
        saveNodeState(nodeId, {
          nodeId,
          status: 'success',
          metrics: result,
          error: null,
        })
      } catch (cause: unknown) {
        if (!isActive || isAbortError(cause)) {
          return
        }

        if (cause instanceof NetworkNodeNotFoundError) {
          saveNodeState(nodeId, {
            nodeId,
            status: 'not-found',
            metrics: null,
            error: null,
          })
          return
        }

        saveNodeState(nodeId, {
          nodeId,
          status: 'error',
          metrics: null,
          error: toError(cause),
        })
      }
    }

    for (const nodeId of selectedNodeIds) {
      void loadNodeMetrics(nodeId)
    }

    return () => {
      isActive = false
      controller.abort()
    }
  }, [range, selectionKey, service])

  return { nodes }
}

function createLoadingStates(nodeIds: readonly NetworkNode['id'][]): NodeComparisonState[] {
  return nodeIds.map((nodeId) => ({
    nodeId,
    status: 'loading',
    metrics: null,
    error: null,
  }))
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error('Unable to load node metrics')
}
