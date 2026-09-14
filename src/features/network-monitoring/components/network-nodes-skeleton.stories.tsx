import type { Meta, StoryObj } from '@storybook/react-vite'
import { NetworkNodesSkeleton } from './network-nodes-skeleton'

const meta = {
  title: 'Network Monitoring/NetworkNodesSkeleton',
  component: NetworkNodesSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NetworkNodesSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
