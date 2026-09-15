import type { MetricsRange, NetworkNode, NodeMetrics } from '../domain/network'

export interface NetworkMonitoringService {
  listNodes(signal?: AbortSignal): Promise<readonly NetworkNode[]>

  getNode(nodeId: NetworkNode['id'], signal?: AbortSignal): Promise<NetworkNode>

  getNodeMetrics(
    nodeId: NetworkNode['id'],
    range: MetricsRange,
    signal?: AbortSignal,
  ): Promise<NodeMetrics>
}
