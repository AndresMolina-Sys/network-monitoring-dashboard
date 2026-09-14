import type { MetricsRange, NetworkNode, NodeMetrics } from '../domain/network'

export interface NetworkMonitoringService {
  listNodes(signal?: AbortSignal): Promise<readonly NetworkNode[]>

  getNodeMetrics(
    nodeId: NetworkNode['id'],
    range: MetricsRange,
    signal?: AbortSignal,
  ): Promise<NodeMetrics>
}
