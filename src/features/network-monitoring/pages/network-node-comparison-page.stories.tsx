import '../../../App.css'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { expect, within } from 'storybook/test'
import type { MetricsRange } from '../../../domain/network'
import { NETWORK_NODE_METRICS_BY_RANGE, NETWORK_NODES } from '../../../mocks/network-fixtures'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodeComparisonPage } from './network-node-comparison-page'

const NODE_IDS = [NETWORK_NODES[0].id, NETWORK_NODES[1].id]

const comparisonService: NetworkMonitoringService = {
  listNodes: async () => NETWORK_NODES,
  getNode: async (nodeId) => {
    const node = NETWORK_NODES.find((candidate) => candidate.id === nodeId)

    if (!node) {
      throw new NetworkNodeNotFoundError(nodeId)
    }

    return node
  },
  getNodeMetrics: async (nodeId, range: MetricsRange) => {
    const metrics = NETWORK_NODE_METRICS_BY_RANGE[nodeId]?.[range]

    if (!metrics) {
      throw new NetworkNodeNotFoundError(nodeId)
    }

    return metrics
  },
}

const meta = {
  title: 'Network Monitoring/NetworkNodeComparisonPage',
  component: NetworkNodeComparisonPage,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    nodeIds: NODE_IDS,
  },
  render: ({ nodeIds }) => {
    const router = createMemoryRouter(
      [
        {
          path: '/compare',
          element: <NetworkNodeComparisonPage nodeIds={nodeIds} service={comparisonService} />,
        },
      ],
      {
        initialEntries: ['/compare'],
      },
    )

    return <RouterProvider router={router} />
  },
} satisfies Meta<typeof NetworkNodeComparisonPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByRole('table')).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Compare nodes' })).toBeVisible()
    await expect(canvas.getByRole('group', { name: 'Metrics range' })).toBeVisible()
    await expect(canvas.getByText('Simulated data', { exact: true })).toBeVisible()
    await expect(canvas.getByRole('figure', { name: 'Latency by node (1h, ms)' })).toBeVisible()
    await expect(canvas.getByRole('figure', { name: 'Packet loss by node (1h, %)' })).toBeVisible()
  },
}
