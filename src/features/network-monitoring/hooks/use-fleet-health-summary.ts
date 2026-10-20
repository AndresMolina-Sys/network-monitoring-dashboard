import { useEffect, useState } from 'react'
import type { NetworkNode, NodeMetrics } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'

export type FleetHealthSummaryStatus = 'loading' | 'success'

export interface UseFleetHealthSummaryState {
  readonly status: FleetHealthSummaryStatus
  readonly metrics: readonly NodeMetrics[]
}

const EMPTY_METRICS: readonly NodeMetrics[] = []

export function useFleetHealthSummary(
  nodes: readonly NetworkNode[],
  service: NetworkMonitoringService = networkMonitoringService,
): UseFleetHealthSummaryState {
  const [state, setState] = useState<UseFleetHealthSummaryState>({
    status: 'loading',
    metrics: EMPTY_METRICS,
  })

  useEffect(() => {
    setState({ status: 'loading', metrics: EMPTY_METRICS })

    const loadMetrics = async (): Promise<void> => {
      const results = await Promise.allSettled(
        nodes.map((node) => service.getNodeMetrics(node.id, '1h')),
      )
      const metrics = results.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : [],
      )

      setState({ status: 'success', metrics })
    }

    void loadMetrics()
  }, [nodes, service])

  return state
}
