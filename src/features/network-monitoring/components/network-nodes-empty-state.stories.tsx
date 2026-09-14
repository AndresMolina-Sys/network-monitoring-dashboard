import type { Meta, StoryObj } from '@storybook/react-vite'
import { NetworkNodesEmptyState } from './network-nodes-empty-state'

const meta = {
  title: 'Network Monitoring/NetworkNodesEmptyState',
  component: NetworkNodesEmptyState,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NetworkNodesEmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
