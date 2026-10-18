import '../../../App.css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { expect, within } from 'storybook/test'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeDetailsPage } from './network-node-details-page'

const coreRouter = NETWORK_NODES[0]

const emptyMetricsService: NetworkMonitoringService = {
  listNodes: async () => NETWORK_NODES,
  getNode: async () => coreRouter,
  getNodeMetrics: async (nodeId, range) => ({
    nodeId,
    range,
    points: [],
  }),
}

const meta = {
  title: 'Network Monitoring/NetworkNodeDetailsPage',
  component: NetworkNodeDetailsPage,
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const router = createMemoryRouter(
      [
        {
          path: '/nodes/:nodeId',
          element: <NetworkNodeDetailsPage service={emptyMetricsService} />,
        },
      ],
      {
        initialEntries: ['/nodes/core-router'],
      },
    )

    return <RouterProvider router={router} />
  },
} satisfies Meta<typeof NetworkNodeDetailsPage>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyMetrics: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('status', { name: 'No metrics available' })).toBeVisible()
    await expect(canvas.getByRole('heading', { name: /Core Router/ })).toBeVisible()
    await expect(canvas.getByRole('group', { name: 'Metrics range' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: '1h' })).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(canvas.queryByLabelText('Metrics summary')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('figure', { name: /Latency chart/ })).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole('figure', { name: /Packet loss chart/ }),
    ).not.toBeInTheDocument()
    await expect(canvas.queryByRole('table')).not.toBeInTheDocument()
  },
}
