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

interface NodePacketLossChartProps {
  readonly metrics: NodeMetrics
}

interface PacketLossChartPoint {
  readonly label: string
  readonly timestamp: string
  readonly packetLossPercent: number
}

const CHART_COLORS = {
  axis: '#bcb7af',
  grid: 'rgba(188, 183, 175, 0.14)',
  line: '#e8b07e',
  pointOutline: '#222426',
  pointFocus: '#eee9df',
} as const

export function NodePacketLossChart({ metrics }: NodePacketLossChartProps) {
  const chartData: readonly PacketLossChartPoint[] = metrics.points.map((point) => ({
    label:
      metrics.range === '7d'
        ? formatMetricDate(point.timestamp)
        : formatMetricTime(point.timestamp),
    timestamp: point.timestamp,
    packetLossPercent: point.packetLossPercent,
  }))

  return (
    <figure className="node-packet-loss-chart" aria-labelledby="packet-loss-chart-title">
      <figcaption id="packet-loss-chart-title">
        Packet loss trend for {metrics.nodeId} (percent, {metrics.range}, UTC)
      </figcaption>

      <div className="node-packet-loss-chart__canvas">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            accessibilityLayer
            title={`Packet loss trend for ${metrics.nodeId} in percent, range ${metrics.range}, UTC`}
            desc="Use the left and right arrow keys to inspect measurements. Exact values are listed in the table below."
            margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="2 5" />
            <XAxis
              dataKey="label"
              interval={metrics.range === '7d' ? 3 : 'preserveStartEnd'}
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="packetLossPercent"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              labelFormatter={(_, payload) => payload[0]?.payload.timestamp ?? ''}
              formatter={(value) => [`${value}%`, 'Packet loss']}
            />
            <Line
              type="monotone"
              dataKey="packetLossPercent"
              name="Packet loss"
              stroke={CHART_COLORS.line}
              strokeWidth={2.5}
              dot={{
                r: 3.5,
                fill: CHART_COLORS.line,
                stroke: CHART_COLORS.pointOutline,
              }}
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
