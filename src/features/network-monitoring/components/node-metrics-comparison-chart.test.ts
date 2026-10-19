import { describe, expect, it } from 'vitest'
import type { NodeMetrics } from '../../../domain/network'
import { buildComparisonSeries, getComparisonTooltipLabel } from './node-metrics-comparison-chart'

const CORE_ROUTER_METRICS: NodeMetrics = {
  nodeId: 'core-router',
  range: '1h',
  points: [
    { timestamp: '2026-10-18T11:00:00Z', latencyMs: 18, packetLossPercent: 0 },
    { timestamp: '2026-10-18T12:00:00Z', latencyMs: 20, packetLossPercent: 0.2 },
  ],
}

const ACCESS_SWITCH_METRICS: NodeMetrics = {
  nodeId: 'access-switch-01',
  range: '1h',
  points: [
    { timestamp: '2026-10-19T14:00:00Z', latencyMs: 24, packetLossPercent: 0.4 },
    { timestamp: '2026-10-19T15:00:00Z', latencyMs: 27, packetLossPercent: 0.6 },
  ],
}

describe('node metrics comparison chart data', () => {
  it('identifies every series by node and keeps the selected metric values', () => {
    const latencySeries = buildComparisonSeries(
      [CORE_ROUTER_METRICS, ACCESS_SWITCH_METRICS],
      'latencyMs',
    )
    const packetLossSeries = buildComparisonSeries(
      [CORE_ROUTER_METRICS, ACCESS_SWITCH_METRICS],
      'packetLossPercent',
    )

    expect(latencySeries.map(({ nodeId, name }) => ({ nodeId, name }))).toEqual([
      { nodeId: 'core-router', name: 'core-router' },
      { nodeId: 'access-switch-01', name: 'access-switch-01' },
    ])
    expect(latencySeries.map(({ points }) => points.map(({ value }) => value))).toEqual([
      [18, 20],
      [24, 27],
    ])
    expect(packetLossSeries.map(({ points }) => points.map(({ value }) => value))).toEqual([
      [0, 0.2],
      [0.4, 0.6],
    ])
  })

  it('aligns points by elapsed time within each node’s own UTC window', () => {
    const series = buildComparisonSeries([CORE_ROUTER_METRICS, ACCESS_SWITCH_METRICS], 'latencyMs')

    expect(series.map(({ points }) => points.map(({ elapsedMinutes }) => elapsedMinutes))).toEqual([
      [0, 60],
      [0, 60],
    ])
  })

  it('uses the original UTC timestamp as the tooltip label', () => {
    const [firstPoint] = buildComparisonSeries([CORE_ROUTER_METRICS], 'latencyMs')[0].points

    expect(getComparisonTooltipLabel(firstPoint)).toBe('2026-10-18T11:00:00Z')
  })
})
