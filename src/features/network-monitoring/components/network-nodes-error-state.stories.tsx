import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { NetworkNodesErrorState } from './network-nodes-error-state'

const meta = {
  title: 'Network Monitoring/NetworkNodesErrorState',
  component: NetworkNodesErrorState,
  args: {
    onRetry: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NetworkNodesErrorState>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const RetryInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const retryButton = canvas.getByRole('button', {
      name: 'Try again',
    })

    await userEvent.click(retryButton)

    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}
