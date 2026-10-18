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
            <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              interval={metrics.range === '7d' ? 3 : 'preserveStartEnd'}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="packetLossPercent"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
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

function formatMetricDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}
