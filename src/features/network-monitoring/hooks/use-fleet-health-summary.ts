import { useEffect, useState } from 'react'
import type { NetworkNode, NodeMetrics } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { assertValidMetricPoints, assertValidMetricsResponse } from '../metrics-validation'

export type FleetHealthSummaryStatus = 'loading' | 'success'

export interface UseFleetHealthSummaryState {
  readonly status: FleetHealthSummaryStatus
  readonly metrics: readonly NodeMetrics[]
  readonly failedNodeIds: readonly NetworkNode['id'][]
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
  })

  useEffect(() => {
    setState({
      status: 'loading',
      metrics: EMPTY_METRICS,
      failedNodeIds: EMPTY_FAILED_NODE_IDS,
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

      setState({ status: 'success', metrics, failedNodeIds })
    }

    void loadMetrics()
  }, [nodes, service])

  return state
}
