import type { MetricPoint } from '../../domain/network'

export interface MetricsSummary {
  readonly latestLatencyMs: number
  readonly averageLatencyMs: number
  readonly peakPacketLossPercent: number
  readonly peakPacketLossPoint: MetricPoint
}

export function summarizeMetrics(points: readonly MetricPoint[]): MetricsSummary {
  const latencyTotal = points.reduce((total, point) => total + point.latencyMs, 0)
  const latestPoint = points.reduce(
    (latest, point) =>
      Date.parse(point.timestamp) > Date.parse(latest.timestamp) ? point : latest,
    points[0],
  )
  const peakPacketLossPoint = points.reduce(
    (peak, point) => (point.packetLossPercent >= peak.packetLossPercent ? point : peak),
    points[0],
  )

  return {
    latestLatencyMs: latestPoint.latencyMs,
    averageLatencyMs: latencyTotal / points.length,
    peakPacketLossPercent: peakPacketLossPoint.packetLossPercent,
    peakPacketLossPoint,
  }
}

export function formatMetricValue(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)
}
