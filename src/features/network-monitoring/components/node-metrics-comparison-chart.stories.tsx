import '../../../App.css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fireEvent, waitFor, within, expect } from 'storybook/test'
import type { NodeMetrics } from '../../../domain/network'
import { NodeMetricsComparisonChart } from './node-metrics-comparison-chart'

const COMPARISON_METRICS: readonly NodeMetrics[] = [
  {
    nodeId: 'core-router',
    range: '1h',
    points: [
      { timestamp: '2026-10-18T11:00:00Z', latencyMs: 18, packetLossPercent: 0 },
      { timestamp: '2026-10-18T11:20:00Z', latencyMs: 20, packetLossPercent: 0.2 },
      { timestamp: '2026-10-18T11:40:00Z', latencyMs: 17, packetLossPercent: 0.1 },
      { timestamp: '2026-10-18T12:00:00Z', latencyMs: 19, packetLossPercent: 0 },
    ],
  },
  {
    nodeId: 'access-switch-01',
    range: '1h',
    points: [
      { timestamp: '2026-10-19T14:00:00Z', latencyMs: 24, packetLossPercent: 0.4 },
      { timestamp: '2026-10-19T14:20:00Z', latencyMs: 27, packetLossPercent: 0.6 },
      { timestamp: '2026-10-19T14:40:00Z', latencyMs: 25, packetLossPercent: 0.3 },
      { timestamp: '2026-10-19T15:00:00Z', latencyMs: 26, packetLossPercent: 0.2 },
    ],
  },
]

const meta = {
  title: 'Network Monitoring/NodeMetricsComparisonChart',
  component: NodeMetricsComparisonChart,
  parameters: {
    layout: 'padded',
  },
  args: {
    metrics: COMPARISON_METRICS,
    range: '1h',
  },
} satisfies Meta<typeof NodeMetricsComparisonChart>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const latencyFigure = canvas.getByRole('figure', { name: 'Latency by node (1h, ms)' })
    const packetLossFigure = canvas.getByRole('figure', {
      name: 'Packet loss by node (1h, %)',
    })

    await expect(latencyFigure).toBeVisible()
    await expect(packetLossFigure).toBeVisible()
    await expect(within(latencyFigure).getByText('core-router')).toBeVisible()
    await expect(within(latencyFigure).getByText('access-switch-01')).toBeVisible()
    await expect(within(packetLossFigure).getByText('core-router')).toBeVisible()
    await expect(within(packetLossFigure).getByText('access-switch-01')).toBeVisible()

    const latencySurface = latencyFigure.querySelector<SVGSVGElement>(
      'svg.recharts-surface[role="application"]',
    )

    if (!latencySurface) {
      throw new Error('The comparison chart was not rendered')
    }

    await expect(latencySurface).toHaveAccessibleName('Latency by node in milliseconds, range 1h')
    const axisLabels = Array.from(
      latencySurface.querySelectorAll('.recharts-cartesian-axis-tick-value'),
    ).map((label) => label.textContent)
    await expect(axisLabels).toEqual(expect.arrayContaining(['0m', '60m']))

    latencySurface.focus()

    await waitFor(() => {
      const latencyTooltip = latencyFigure.querySelector('.node-metrics-comparison-chart__tooltip')

      expect(latencyTooltip).not.toBeNull()
      expect(latencyTooltip).toHaveTextContent('2026-10-18T11:00:00Z')
      expect(latencyTooltip).toHaveTextContent('2026-10-19T14:00:00Z')
      expect(latencyTooltip).toHaveTextContent('18 ms')
      expect(latencyTooltip).toHaveTextContent('24 ms')
    })

    await fireEvent.keyDown(latencySurface, { key: 'ArrowRight' })

    await waitFor(() => {
      const latencyTooltip = latencyFigure.querySelector('.node-metrics-comparison-chart__tooltip')

      expect(latencyTooltip).toHaveTextContent('2026-10-18T11:20:00Z')
      expect(latencyTooltip).toHaveTextContent('2026-10-19T14:20:00Z')
    })
  },
}
