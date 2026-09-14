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

export function NodeLatencyChart({ metrics }: NodeLatencyChartProps) {
  const chartData: readonly LatencyChartPoint[] = metrics.points.map((point) => ({
    label: formatMetricTime(point.timestamp),
    timestamp: point.timestamp,
    latencyMs: point.latencyMs,
  }))

  return (
    <figure className="node-latency-chart" aria-labelledby="latency-chart-title">
      <figcaption id="latency-chart-title">Latency trend for {metrics.nodeId} (UTC)</figcaption>

      <div className="node-latency-chart__canvas">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            accessibilityLayer
            margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="latencyMs"
              unit=" ms"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip labelFormatter={(_, payload) => payload[0]?.payload.timestamp ?? ''} />
            <Line
              type="monotone"
              dataKey="latencyMs"
              name="Latency"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={{ r: 4, fill: '#22d3ee' }}
              activeDot={{ r: 6 }}
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
