import { useId } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MetricsRange, NodeMetrics } from '../../../domain/network'

type ComparisonMetric = 'latencyMs' | 'packetLossPercent'

interface ComparisonSeriesPoint {
  readonly elapsedMinutes: number
  readonly timestamp: string
  readonly value: number
}

interface ComparisonSeries {
  readonly nodeId: string
  readonly name: string
  readonly points: readonly ComparisonSeriesPoint[]
}

interface ComparisonChartRow {
  readonly elapsedMinutes: number
  readonly values: Readonly<Record<string, number | null>>
  readonly timestamps: Readonly<Record<string, string | null>>
}

interface ComparisonTooltipEntry {
  readonly name?: string | number
  readonly color?: string
  readonly payload?: ComparisonChartRow
}

interface ComparisonTooltipProps {
  readonly active?: boolean
  readonly payload?: readonly ComparisonTooltipEntry[]
  readonly metric: ComparisonMetric
}

interface NodeMetricsComparisonChartProps {
  readonly metrics: readonly NodeMetrics[]
  readonly range: MetricsRange
}

interface ComparisonMetricChartProps {
  readonly metric: ComparisonMetric
  readonly metrics: readonly NodeMetrics[]
  readonly range: MetricsRange
}

const RANGE_MINUTES: Record<MetricsRange, number> = {
  '1h': 60,
  '24h': 1_440,
  '7d': 10_080,
}

const SERIES_COLORS = [
  'var(--color-focus)',
  'var(--color-kicker)',
  'var(--color-muted-foreground)',
] as const

const SERIES_DASHES = [undefined, '7 4', '2 4'] as const

function buildComparisonSeries(
  metrics: readonly NodeMetrics[],
  metric: ComparisonMetric,
): ComparisonSeries[] {
  return metrics.map((nodeMetrics) => {
    const latestTimestamp = nodeMetrics.points.at(-1)?.timestamp
    const latestTimestampMs = latestTimestamp ? Date.parse(latestTimestamp) : Number.NaN
    const windowStartMs = latestTimestampMs - RANGE_MINUTES[nodeMetrics.range] * 60_000

    return {
      nodeId: nodeMetrics.nodeId,
      name: nodeMetrics.nodeId,
      points: nodeMetrics.points.map((point) => ({
        elapsedMinutes: Math.round((Date.parse(point.timestamp) - windowStartMs) / 60_000),
        timestamp: point.timestamp,
        value: point[metric],
      })),
    }
  })
}

function getComparisonTooltipLabel(
  point: Pick<ComparisonSeriesPoint, 'timestamp'> | null | undefined,
): string {
  return point?.timestamp ?? ''
}

export function NodeMetricsComparisonChart({ metrics, range }: NodeMetricsComparisonChartProps) {
  return (
    <section
      className="node-metrics-comparison-chart"
      aria-label={`Node metrics comparison charts for ${range}`}
    >
      <ComparisonMetricChart metric="latencyMs" metrics={metrics} range={range} />
      <ComparisonMetricChart metric="packetLossPercent" metrics={metrics} range={range} />
    </section>
  )
}

function ComparisonMetricChart({ metric, metrics, range }: ComparisonMetricChartProps) {
  const titleId = useId()
  const isPacketLoss = metric === 'packetLossPercent'
  const title = isPacketLoss ? 'Packet loss by node' : 'Latency by node'
  const unit = isPacketLoss ? 'percent' : 'milliseconds'
  const unitLabel = isPacketLoss ? '%' : 'ms'
  const series = buildComparisonSeries(metrics, metric)
  const chartRows = mergeComparisonSeries(series)
  const figureClassName = isPacketLoss ? 'node-packet-loss-chart' : 'node-latency-chart'
  const canvasClassName = isPacketLoss
    ? 'node-packet-loss-chart__canvas'
    : 'node-latency-chart__canvas'

  return (
    <figure
      className={`${figureClassName} node-metrics-comparison-chart__figure`}
      aria-labelledby={titleId}
    >
      <figcaption id={titleId}>
        {title} ({range}, {unitLabel})
      </figcaption>

      <div className={canvasClassName}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartRows}
            accessibilityLayer
            title={`${title} in ${unit}, range ${range}`}
            desc={`Each line is identified by node and a distinct line style. The horizontal axis shows elapsed time in this period. Focus the chart and use arrow keys to inspect values with each sample’s original UTC timestamp.`}
            margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
          >
            <CartesianGrid stroke="var(--color-border-soft)" strokeDasharray="2 5" />
            <XAxis
              dataKey="elapsedMinutes"
              domain={[0, RANGE_MINUTES[range]]}
              interval="preserveStartEnd"
              scale="linear"
              tick={{ fill: 'var(--color-subtle-foreground)', fontSize: 12 }}
              tickFormatter={(value: number) => formatElapsedLabel(value, range)}
              tickLine={false}
              axisLine={false}
              ticks={getElapsedTicks(range)}
              type="number"
            />
            <YAxis
              domain={isPacketLoss ? [0, 100] : ['auto', 'auto']}
              tick={{ fill: 'var(--color-subtle-foreground)', fontSize: 12 }}
              tickFormatter={(value: number) => (isPacketLoss ? `${value}%` : `${value} ms`)}
              tickLine={false}
              axisLine={false}
              ticks={isPacketLoss ? [0, 20, 40, 60, 80, 100] : undefined}
              width={56}
            />
            <Tooltip
              content={(tooltipProps) => <ComparisonTooltip {...tooltipProps} metric={metric} />}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '3 3' }}
            />
            <Legend verticalAlign="bottom" />
            {series.map((nodeSeries, index) => (
              <Line
                key={nodeSeries.nodeId}
                type="monotone"
                dataKey={(row: ComparisonChartRow) => row.values[nodeSeries.nodeId] ?? null}
                name={nodeSeries.name}
                stroke={SERIES_COLORS[index] ?? SERIES_COLORS[0]}
                strokeDasharray={SERIES_DASHES[index]}
                strokeWidth={2.5}
                dot={{ r: 3.5, stroke: 'var(--color-surface)' }}
                activeDot={{ r: 6, stroke: 'var(--color-foreground)', strokeWidth: 2 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

function ComparisonTooltip({ active, payload, metric }: ComparisonTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className="recharts-default-tooltip node-metrics-comparison-chart__tooltip"
      role="status"
      aria-live="polite"
    >
      {payload.map((entry) => {
        const nodeId = String(entry.name ?? '')
        const value = entry.payload?.values[nodeId]
        const timestamp = entry.payload?.timestamps[nodeId]

        if (value === null || value === undefined || !timestamp) {
          return null
        }

        return (
          <div className="node-metrics-comparison-chart__tooltip-entry" key={nodeId}>
            <span className="node-metrics-comparison-chart__tooltip-node">
              <span
                className="node-metrics-comparison-chart__tooltip-marker"
                aria-hidden="true"
                style={{ backgroundColor: entry.color }}
              />
              {nodeId}
            </span>
            <time dateTime={timestamp}>{getComparisonTooltipLabel({ timestamp })}</time>
            <strong>{formatMetricValue(value, metric)}</strong>
          </div>
        )
      })}
    </div>
  )
}

function mergeComparisonSeries(series: readonly ComparisonSeries[]): ComparisonChartRow[] {
  const elapsedValues = Array.from(
    new Set(series.flatMap((nodeSeries) => nodeSeries.points.map((point) => point.elapsedMinutes))),
  ).sort((first, second) => first - second)

  return elapsedValues.map((elapsedMinutes) => {
    const values: Record<string, number | null> = {}
    const timestamps: Record<string, string | null> = {}

    for (const nodeSeries of series) {
      const point = nodeSeries.points.find(
        (nodePoint) => nodePoint.elapsedMinutes === elapsedMinutes,
      )
      values[nodeSeries.nodeId] = point?.value ?? null
      timestamps[nodeSeries.nodeId] = point?.timestamp ?? null
    }

    return { elapsedMinutes, values, timestamps }
  })
}

function getElapsedTicks(range: MetricsRange): number[] {
  if (range === '1h') {
    return [0, 20, 40, 60]
  }

  if (range === '24h') {
    return [0, 360, 720, 1_080, 1_440]
  }

  return [0, 1_440, 2_880, 4_320, 5_760, 7_200, 8_640, 10_080]
}

function formatElapsedLabel(elapsedMinutes: number, range: MetricsRange): string {
  if (range === '1h') {
    return `${elapsedMinutes}m`
  }

  if (range === '24h') {
    return `${elapsedMinutes / 60}h`
  }

  return `Day ${elapsedMinutes / 1_440}`
}

function formatMetricValue(value: number, metric: ComparisonMetric): string {
  if (metric === 'latencyMs') {
    return `${value} ms`
  }

  return `${value}%`
}
