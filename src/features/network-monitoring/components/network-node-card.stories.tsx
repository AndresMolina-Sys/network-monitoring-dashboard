import type { Meta, StoryObj } from '@storybook/react-vite'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import { NetworkNodeCard } from './network-node-card'
import { MemoryRouter } from 'react-router'

const meta = {
  title: 'Network Monitoring/NetworkNodeCard',
  component: NetworkNodeCard,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof NetworkNodeCard>

export default meta

type Story = StoryObj<typeof meta>

export const Online: Story = {
  args: {
    node: NETWORK_NODES[0],
  },
}

export const Degraded: Story = {
  args: {
    node: NETWORK_NODES[1],
  },
}

export const Offline: Story = {
  args: {
    node: NETWORK_NODES[2],
  },
}
