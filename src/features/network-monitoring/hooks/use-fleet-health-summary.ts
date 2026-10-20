import { useEffect, useState } from 'react'
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
}

const EMPTY_METRICS: readonly NodeMetrics[] = []
const EMPTY_FAILED_NODE_IDS: readonly NetworkNode['id'][] = []

export function useFleetHealthSummary(
  nodes: readonly NetworkNode[],
  service: NetworkMonitoringService = networkMonitoringService,
): UseFleetHealthSummaryState {
  const [state, setState] = useState<UseFleetHealthSummaryState>({
    status: 'loading',
    metrics: EMPTY_METRICS,
    failedNodeIds: EMPTY_FAILED_NODE_IDS,
    summary: null,
    coverage: { validNodeCount: 0, totalNodeCount: nodes.length },
  })

  useEffect(() => {
    setState({
      status: 'loading',
      metrics: EMPTY_METRICS,
      failedNodeIds: EMPTY_FAILED_NODE_IDS,
      summary: null,
      coverage: { validNodeCount: 0, totalNodeCount: nodes.length },
    })

    const loadMetrics = async (): Promise<void> => {
      const results = await Promise.allSettled(
        nodes.map((node) => service.getNodeMetrics(node.id, '1h')),
      )
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
        status: 'success',
        metrics,
        failedNodeIds,
        summary: summarizeFleetMetrics(metrics),
        coverage: { validNodeCount: metrics.length, totalNodeCount: nodes.length },
      })
    }

    void loadMetrics()
  }, [nodes, service])

  return state
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
