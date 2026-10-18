import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, waitFor, within } from 'storybook/test'
import { NETWORK_NODE_METRICS } from '../../../mocks/network-fixtures'
import { NodeLatencyChart } from './node-latency-chart'

const meta = {
  title: 'Network Monitoring/NodeLatencyChart',
  component: NodeLatencyChart,
  parameters: {
    layout: 'padded',
  },
  args: {
    metrics: NETWORK_NODE_METRICS['core-router'],
  },
} satisfies Meta<typeof NodeLatencyChart>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const chartSurface = canvasElement.querySelector<SVGSVGElement>('.recharts-surface')

    await expect(
      canvas.getByText('Latency trend for core-router (ms, 1h, UTC)'),
    ).toBeInTheDocument()
    await expect(chartSurface).not.toBeNull()
    await expect(chartSurface).toHaveAccessibleName(
      'Latency trend for core-router in milliseconds, range 1h, UTC',
    )
    const axisLabels = Array.from(
      chartSurface?.querySelectorAll('.recharts-cartesian-axis-tick-value') ?? [],
    ).map((label) => label.textContent)
    await expect(axisLabels).toContain('17:00')
    await expect(axisLabels.some((label) => label?.includes('ms'))).toBe(true)
    await expect(chartSurface?.querySelectorAll('.recharts-dot')).toHaveLength(
      args.metrics.points.length,
    )
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const chartSurface = canvasElement.querySelector<SVGSVGElement>('.recharts-surface')
    const tooltip = canvasElement.querySelector('.recharts-default-tooltip')
    const points = NETWORK_NODE_METRICS['core-router'].points

    if (!chartSurface || !tooltip) {
      throw new Error('The latency chart or its tooltip was not rendered')
    }

    await expect(
      canvas.getByText('Latency trend for core-router (ms, 1h, UTC)'),
    ).toBeInTheDocument()
    await expect(chartSurface).toHaveAttribute('role', 'application')
    await expect(chartSurface).toHaveAttribute('tabindex', '0')
    await expect(chartSurface).toHaveAccessibleName(
      'Latency trend for core-router in milliseconds, range 1h, UTC',
    )
    await expect(chartSurface.querySelector('desc')).toHaveTextContent(
      'Use the left and right arrow keys to inspect measurements. Exact values are listed in the table below.',
    )

    chartSurface.focus()

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('role', 'status')
      expect(tooltip).toHaveTextContent(points[0].timestamp)
      expect(tooltip).toHaveTextContent(`${points[0].latencyMs} ms`)
    })

    await fireEvent.keyDown(chartSurface, { key: 'ArrowRight' })

    await waitFor(() => {
      expect(tooltip).toHaveTextContent(points[1].timestamp)
      expect(tooltip).toHaveTextContent(`${points[1].latencyMs} ms`)
    })
  },
}
