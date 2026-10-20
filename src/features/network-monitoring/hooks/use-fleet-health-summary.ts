import { useCallback, useEffect, useRef, useState } from 'react'
import type { NetworkNode, NodeMetrics } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { summarizeMetrics } from '../metrics-summary'
import { assertValidMetricPoints, assertValidMetricsResponse } from '../metrics-validation'

export type FleetHealthSummaryStatus = 'loading' | 'success'

export interface FleetMetricsSummary {
  readonly averageLatencyMs: number
  readonly peakPacketLossPercent: number
}

export interface FleetMetricsCoverage {
  readonly validNodeCount: number
  readonly totalNodeCount: number
}

export interface UseFleetHealthSummaryState {
  readonly status: FleetHealthSummaryStatus
  readonly metrics: readonly NodeMetrics[]
  readonly failedNodeIds: readonly NetworkNode['id'][]
  readonly summary: FleetMetricsSummary | null
  readonly coverage: FleetMetricsCoverage
  readonly retry: () => Promise<void>
}

interface FleetHealthSummaryData {
  readonly nodes: readonly NetworkNode[]
  readonly service: NetworkMonitoringService
  readonly status: FleetHealthSummaryStatus
  readonly metrics: readonly NodeMetrics[]
  readonly failedNodeIds: readonly NetworkNode['id'][]
  readonly summary: FleetMetricsSummary | null
  readonly coverage: FleetMetricsCoverage
}

const EMPTY_METRICS: readonly NodeMetrics[] = []
const EMPTY_FAILED_NODE_IDS: readonly NetworkNode['id'][] = []

export function useFleetHealthSummary(
  nodes: readonly NetworkNode[],
  service: NetworkMonitoringService = networkMonitoringService,
): UseFleetHealthSummaryState {
  const [state, setState] = useState<FleetHealthSummaryData>(() =>
    createLoadingState(nodes, service),
  )
  const currentState =
    state.nodes === nodes && state.service === service ? state : createLoadingState(nodes, service)
  const generationRef = useRef(0)
  const retryControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const generation = generationRef.current + 1
    generationRef.current = generation
    let active = true

    const loadMetrics = async (): Promise<void> => {
      const results = await Promise.allSettled(
        nodes.map((node) => service.getNodeMetrics(node.id, '1h', controller.signal)),
      )

      if (!active) {
        return
      }

      const metrics: NodeMetrics[] = []
      const failedNodeIds: NetworkNode['id'][] = []

      results.forEach((result, index) => {
        const node = nodes[index]

        if (result.status === 'rejected') {
          failedNodeIds.push(node.id)
          return
        }

        try {
          assertValidMetricsResponse(result.value, node.id, '1h')
          assertValidMetricPoints(result.value.points, '1h')
          metrics.push(result.value)
        } catch {
          failedNodeIds.push(node.id)
        }
      })

      setState({
        nodes,
        service,
        status: 'success',
        metrics,
        failedNodeIds,
        summary: summarizeFleetMetrics(metrics),
        coverage: { validNodeCount: metrics.length, totalNodeCount: nodes.length },
      })
    }

    void loadMetrics()

    return () => {
      active = false
      generationRef.current += 1
      controller.abort()
      retryControllerRef.current?.abort()
      retryControllerRef.current = null
    }
  }, [nodes, service])

  const retry = useCallback(async (): Promise<void> => {
    if (currentState.failedNodeIds.length === 0) {
      return
    }

    const generation = generationRef.current
    retryControllerRef.current?.abort()
    const controller = new AbortController()
    retryControllerRef.current = controller
    const failedNodeIds = currentState.failedNodeIds
    const results = await Promise.allSettled(
      failedNodeIds.map((nodeId) => service.getNodeMetrics(nodeId, '1h', controller.signal)),
    )

    if (controller.signal.aborted || generationRef.current !== generation) {
      return
    }

    const retriedMetrics = new Map<NetworkNode['id'], NodeMetrics>()
    const remainingFailedNodeIds: NetworkNode['id'][] = []

    results.forEach((result, index) => {
      const nodeId = failedNodeIds[index]
      const node = nodes.find((candidate) => candidate.id === nodeId)

      if (!node || result.status === 'rejected') {
        remainingFailedNodeIds.push(nodeId)
        return
      }

      try {
        assertValidMetricsResponse(result.value, nodeId, '1h')
        assertValidMetricPoints(result.value.points, '1h')
        retriedMetrics.set(nodeId, result.value)
      } catch {
        remainingFailedNodeIds.push(nodeId)
      }
    })

    setState((currentState) => {
      if (
        controller.signal.aborted ||
        generationRef.current !== generation ||
        currentState.nodes !== nodes ||
        currentState.service !== service
      ) {
        return currentState
      }

      const metricsByNodeId = new Map(
        currentState.metrics.map((metrics) => [metrics.nodeId, metrics]),
      )
      retriedMetrics.forEach((metrics, nodeId) => metricsByNodeId.set(nodeId, metrics))

      const metrics = nodes
        .map((node) => metricsByNodeId.get(node.id))
        .filter((nodeMetrics): nodeMetrics is NodeMetrics => nodeMetrics !== undefined)

      return {
        ...currentState,
        status: 'success',
        metrics,
        failedNodeIds: [
          ...currentState.failedNodeIds.filter((nodeId) => !failedNodeIds.includes(nodeId)),
          ...remainingFailedNodeIds,
        ],
        summary: summarizeFleetMetrics(metrics),
        coverage: { validNodeCount: metrics.length, totalNodeCount: nodes.length },
      }
    })

    if (retryControllerRef.current === controller) {
      retryControllerRef.current = null
    }
  }, [currentState.failedNodeIds, nodes, service])

  return { ...currentState, retry }
}

function createLoadingState(
  nodes: readonly NetworkNode[],
  service: NetworkMonitoringService,
): FleetHealthSummaryData {
  return {
    nodes,
    service,
    status: 'loading',
    metrics: EMPTY_METRICS,
    failedNodeIds: EMPTY_FAILED_NODE_IDS,
    summary: null,
    coverage: { validNodeCount: 0, totalNodeCount: nodes.length },
  }
}

export function summarizeFleetMetrics(metrics: readonly NodeMetrics[]): FleetMetricsSummary | null {
  const points = metrics.flatMap((nodeMetrics) => nodeMetrics.points)

  if (points.length === 0) {
    return null
  }

  const summary = summarizeMetrics(points)

  return {
    averageLatencyMs: summary.averageLatencyMs,
    peakPacketLossPercent: summary.peakPacketLossPercent,
  }
}
