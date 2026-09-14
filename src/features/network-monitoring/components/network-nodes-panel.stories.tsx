import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { createMockNetworkMonitoringService } from '../../../services/mock-network-monitoring-service'
import { NetworkNodesPanel } from './network-nodes-panel'

const meta = {
  title: 'Network Monitoring/NetworkNodesPanel',
  component: NetworkNodesPanel,
  args: {
    service: createMockNetworkMonitoringService({
      latencyMs: 0,
    }),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NetworkNodesPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      await canvas.findByRole('heading', {
        name: 'Monitored nodes',
      }),
    ).toBeVisible()
  },
}
