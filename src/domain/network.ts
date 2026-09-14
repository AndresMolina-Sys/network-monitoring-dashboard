export type NodeStatus = 'online' | 'degraded' | 'offline'

export type MetricsRange = '1h' | '24h' | '7d'

export interface NetworkNode {
  readonly id: string
  readonly name: string
  readonly address: string
  readonly location: string
  readonly status: NodeStatus
  readonly lastCheckedAt: string
}

export interface MetricPoint {
  readonly timestamp: string
  readonly latencyMs: number
  readonly packetLossPercent: number
}

export interface NodeMetrics {
  readonly nodeId: NetworkNode['id']
  readonly range: MetricsRange
  readonly points: readonly MetricPoint[]
}
