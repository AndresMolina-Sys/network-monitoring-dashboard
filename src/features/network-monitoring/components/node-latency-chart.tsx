import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { NodeMetrics } from '../../../domain/network'

interface NodeLatencyChartProps {
  readonly metrics: NodeMetrics
}

interface LatencyChartPoint {
  readonly label: string
  readonly timestamp: string
  readonly latencyMs: number
}

const CHART_COLORS = {
  axis: '#bcb7af',
  grid: 'rgba(188, 183, 175, 0.14)',
  line: '#e8b07e',
  pointOutline: '#222426',
  pointFocus: '#eee9df',
} as const

export function NodeLatencyChart({ metrics }: NodeLatencyChartProps) {
  const chartData: readonly LatencyChartPoint[] = metrics.points.map((point) => ({
    label:
      metrics.range === '7d'
        ? formatMetricDate(point.timestamp)
        : formatMetricTime(point.timestamp),
    timestamp: point.timestamp,
    latencyMs: point.latencyMs,
  }))

  return (
    <figure className="node-latency-chart" aria-labelledby="latency-chart-title">
      <figcaption id="latency-chart-title">
        Latency trend for {metrics.nodeId} (ms, {metrics.range}, UTC)
      </figcaption>

      <div className="node-latency-chart__canvas">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            accessibilityLayer
            title={`Latency trend for ${metrics.nodeId} in milliseconds, range ${metrics.range}, UTC`}
            desc="Use the left and right arrow keys to inspect measurements. Exact values are listed in the table below."
            margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="2 5" />
            <XAxis
              dataKey="label"
              interval={metrics.range === '7d' ? 4 : 'preserveStartEnd'}
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="latencyMs"
              unit=" ms"
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              labelFormatter={(_, payload) => payload[0]?.payload.timestamp ?? ''}
              formatter={(value) => [`${value} ms`, 'Latency']}
            />
            <Line
              type="monotone"
              dataKey="latencyMs"
              name="Latency"
              stroke={CHART_COLORS.line}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: CHART_COLORS.line, stroke: CHART_COLORS.pointOutline }}
              activeDot={{
                r: 6,
                fill: CHART_COLORS.line,
                stroke: CHART_COLORS.pointFocus,
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

function formatMetricTime(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

function formatMetricDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}
