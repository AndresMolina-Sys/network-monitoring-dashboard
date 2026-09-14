import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Latency trend for core-router (UTC)')).toBeInTheDocument()
  },
}
