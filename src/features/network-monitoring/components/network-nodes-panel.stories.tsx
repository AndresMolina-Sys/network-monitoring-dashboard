import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import { expect, within } from 'storybook/test'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { createMockNetworkMonitoringService } from '../../../services/mock-network-monitoring-service'
import { NetworkNodesPanel } from './network-nodes-panel'

type NetworkNodesPanelStoryArgs = {
  readonly service: NetworkMonitoringService
}

const meta = {
  title: 'Network Monitoring/NetworkNodesPanel',
  component: NetworkNodesPanel,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<NetworkNodesPanelStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    service: createMockNetworkMonitoringService({
      latencyMs: 0,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      await canvas.findByRole('heading', {
        name: 'Monitored nodes',
      }),
    ).toBeVisible()
  },
}
