import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, waitFor, within } from 'storybook/test'
import type { NodeMetrics } from '../../../domain/network'
import { NodePacketLossChart } from './node-packet-loss-chart'

const PACKET_LOSS_METRICS: NodeMetrics = {
  nodeId: 'core-router',
  range: '1h',
  points: [
    {
      timestamp: '2026-09-13T17:00:00Z',
      latencyMs: 18,
      packetLossPercent: 0,
    },
    {
      timestamp: '2026-09-13T17:20:00Z',
      latencyMs: 20,
      packetLossPercent: 0.2,
    },
    {
      timestamp: '2026-09-13T17:40:00Z',
      latencyMs: 17,
      packetLossPercent: 100,
    },
  ],
}

const meta = {
  title: 'Network Monitoring/NodePacketLossChart',
  component: NodePacketLossChart,
  parameters: {
    layout: 'padded',
  },
  args: {
    metrics: PACKET_LOSS_METRICS,
  },
} satisfies Meta<typeof NodePacketLossChart>

export default meta

type Story = StoryObj<typeof meta>

export const BoundaryValues: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const yAxisLabels = canvasElement.querySelector('.recharts-yAxis-tick-labels')
    const dots = canvasElement.querySelectorAll('.recharts-dot.recharts-line-dot')
    const chartSurface = canvasElement.querySelector('.recharts-surface')

    if (!chartSurface) {
      throw new Error('The packet loss chart surface was not rendered')
    }

    await expect(
      canvas.getByText('Packet loss trend for core-router (percent, 1h, UTC)'),
    ).toBeInTheDocument()
    await expect(yAxisLabels).toHaveTextContent('0%')
    await expect(yAxisLabels).toHaveTextContent('100%')
    await expect(dots).toHaveLength(PACKET_LOSS_METRICS.points.length)

    const tooltip = canvasElement.querySelector('.recharts-default-tooltip')
    const expectedPoints = [
      ['2026-09-13T17:00:00Z', '0%'],
      ['2026-09-13T17:20:00Z', '0.2%'],
      ['2026-09-13T17:40:00Z', '100%'],
    ] as const

    for (const [index, [timestamp, percentage]] of expectedPoints.entries()) {
      const dot = dots[index]

      if (!dot) {
        throw new Error(`Packet loss data point ${index} was not rendered`)
      }

      const dotBounds = dot.getBoundingClientRect()

      await fireEvent.mouseMove(chartSurface, {
        clientX: dotBounds.left + dotBounds.width / 2,
        clientY: dotBounds.top + dotBounds.height / 2,
      })

      await waitFor(() => {
        expect(tooltip).toBeVisible()
        expect(tooltip).toHaveTextContent(timestamp)
        expect(tooltip).toHaveTextContent(percentage)
      })
    }
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const chartSurface = canvasElement.querySelector<SVGSVGElement>('.recharts-surface')
    const tooltip = canvasElement.querySelector('.recharts-default-tooltip')

    if (!chartSurface || !tooltip) {
      throw new Error('The packet loss chart or its tooltip was not rendered')
    }

    await expect(
      canvas.getByText('Packet loss trend for core-router (percent, 1h, UTC)'),
    ).toBeInTheDocument()
    await expect(chartSurface).toHaveAttribute('role', 'application')
    await expect(chartSurface).toHaveAttribute('tabindex', '0')
    await expect(chartSurface).toHaveAccessibleName(
      'Packet loss trend for core-router in percent, range 1h, UTC',
    )
    await expect(chartSurface.querySelector('desc')).toHaveTextContent(
      'Use the left and right arrow keys to inspect measurements. Exact values are listed in the table below.',
    )

    chartSurface.focus()

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('role', 'status')
      expect(tooltip).toHaveTextContent(PACKET_LOSS_METRICS.points[0].timestamp)
      expect(tooltip).toHaveTextContent('0%')
    })

    await fireEvent.keyDown(chartSurface, { key: 'ArrowRight' })

    await waitFor(() => {
      expect(tooltip).toHaveTextContent(PACKET_LOSS_METRICS.points[1].timestamp)
      expect(tooltip).toHaveTextContent('0.2%')
    })
  },
}
