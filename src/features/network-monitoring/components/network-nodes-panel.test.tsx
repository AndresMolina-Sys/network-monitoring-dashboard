import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import type { NetworkNode } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodesPanel } from './network-nodes-panel'
import { MemoryRouter } from 'react-router'

function createNetworkNodesService(
  nodes: readonly NetworkNode[] = NETWORK_NODES,
): NetworkMonitoringService {
  return {
    listNodes: vi.fn().mockResolvedValue(nodes),
    getNode: vi.fn(),
    getNodeMetrics: vi.fn(),
  }
}

function expectFleetStatusCounts(statusCounts: HTMLElement) {
  for (const [status, count] of [
    ['Online', 1],
    ['Degraded', 1],
    ['Offline', 1],
  ] as const) {
    const label = within(statusCounts).getByText(status)

    expect(label.nextElementSibling).toHaveTextContent(String(count))
  }
}

describe('NetworkNodesPanel', () => {
  it('renders the loading state while nodes are pending', () => {
    const listNodes = vi.fn().mockReturnValue(new Promise(() => undefined))

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )

    const loadingStatus = screen.getByRole('status')

    expect(loadingStatus).toHaveTextContent('Loading network nodes...')
    expect(screen.queryByRole('searchbox', { name: 'Search nodes' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Monitored nodes' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link', { name: /^View metrics for/ })).toHaveLength(0)
  })

  it('renders monitored nodes after a successful response', async () => {
    const listNodes = vi.fn().mockResolvedValue(NETWORK_NODES)

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )
    expect(
      await screen.findByRole('heading', {
        name: 'Monitored nodes',
      }),
    ).toBeInTheDocument()

    const coreRouterLink = screen.getByRole('link', {
      name: 'View metrics for Core Router',
    })

    expect(coreRouterLink).toHaveAttribute('href', '/nodes/core-router')
    expect(screen.getAllByRole('link', { name: /^View metrics for/ })).toHaveLength(
      NETWORK_NODES.length,
    )
    expect(within(coreRouterLink).getByRole('heading', { name: 'Core Router' })).toBeVisible()
    expect(within(coreRouterLink).getByText('core-router')).toBeVisible()
    expect(within(coreRouterLink).getByText('Status')).toBeVisible()
    expect(within(coreRouterLink).getByText('Online')).toBeVisible()
    expect(within(coreRouterLink).getByText('Address')).toBeVisible()
    expect(within(coreRouterLink).getByText('10.0.0.1')).toBeVisible()
    expect(within(coreRouterLink).getByText('Location')).toBeVisible()
    expect(within(coreRouterLink).getByText('Main office')).toBeVisible()
    expect(within(coreRouterLink).getByText('Last checked')).toBeVisible()
    const lastChecked = within(coreRouterLink).getByText(/2026/)
    expect(lastChecked).toBeVisible()
    expect(lastChecked).toHaveAttribute('datetime', NETWORK_NODES[0].lastCheckedAt)
  })

  it('shows counts for each whole-fleet status below the header and before search and filters', async () => {
    render(
      <MemoryRouter>
        <NetworkNodesPanel service={createNetworkNodesService()} />
      </MemoryRouter>,
    )

    const heading = await screen.findByRole('heading', { name: 'Monitored nodes' })
    const inventoryHeader = heading.closest('header')
    const statusCounts = screen.getByRole('group', { name: 'Fleet status counts' })
    const search = screen.getByRole('searchbox', { name: 'Search nodes' })
    const statusFilter = screen.getByRole('combobox', { name: 'Filter by status' })

    expect(inventoryHeader).not.toBeNull()
    expect(
      inventoryHeader!.compareDocumentPosition(statusCounts) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      statusCounts.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(
      statusCounts.compareDocumentPosition(statusFilter) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expectFleetStatusCounts(statusCounts)
  })

  it('keeps whole-fleet status counts unchanged when search and status filters change', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={createNetworkNodesService()} />
      </MemoryRouter>,
    )

    const statusCounts = await screen.findByRole('group', { name: 'Fleet status counts' })
    expectFleetStatusCounts(statusCounts)

    await user.type(screen.getByRole('searchbox', { name: 'Search nodes' }), 'Branch')
    expect(screen.getAllByRole('link', { name: /^View metrics for/ })).toHaveLength(1)
    expectFleetStatusCounts(statusCounts)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'online')
    expect(screen.getByRole('heading', { name: 'No nodes match your filters' })).toBeInTheDocument()
    expectFleetStatusCounts(statusCounts)
  })

  it.each([
    ['node name', 'access switch', 'Access Switch 01'],
    ['node ID', 'branch-gateway', 'Branch Gateway'],
    ['address', '10.10.0.1', 'Branch Gateway'],
    ['location', 'Branch office', 'Branch Gateway'],
  ])('searches nodes by %s', async (_field, query, expectedNode) => {
    const service = {
      listNodes: vi.fn().mockResolvedValue(NETWORK_NODES),
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )

    await user.type(await screen.findByRole('searchbox', { name: 'Search nodes' }), query)

    expect(
      screen.getByRole('link', { name: `View metrics for ${expectedNode}` }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^View metrics for/ })).toHaveLength(1)
  })

  it.each([
    ['online', 'Core Router'],
    ['degraded', 'Access Switch 01'],
    ['offline', 'Branch Gateway'],
  ])('filters nodes by %s status', async (status, expectedNode) => {
    const service = {
      listNodes: vi.fn().mockResolvedValue(NETWORK_NODES),
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )

    await user.selectOptions(
      await screen.findByRole('combobox', { name: 'Filter by status' }),
      status,
    )

    expect(
      screen.getByRole('link', { name: `View metrics for ${expectedNode}` }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^View metrics for/ })).toHaveLength(1)
  })

  it('shows an empty filter result and clears all filters', async () => {
    const service = {
      listNodes: vi.fn().mockResolvedValue(NETWORK_NODES),
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )

    await user.type(await screen.findByRole('searchbox', { name: 'Search nodes' }), 'Branch')
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'online')

    expect(screen.getByRole('heading', { name: 'No nodes match your filters' })).toBeInTheDocument()
    expect(screen.getByText('Showing 0 of 3 nodes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getAllByRole('link', { name: /^View metrics for/ })).toHaveLength(3)
    expect(screen.getByText('Showing 3 of 3 nodes')).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search nodes' })).toHaveValue('')
    expect(screen.getByRole('combobox', { name: 'Filter by status' })).toHaveValue('all')
  })

  it('allows selecting two or three nodes for comparison', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={createNetworkNodesService()} />
      </MemoryRouter>,
    )

    const coreRouter = await screen.findByRole('checkbox', {
      name: 'Select Core Router for comparison',
    })
    const accessSwitch = screen.getByRole('checkbox', {
      name: 'Select Access Switch 01 for comparison',
    })
    const branchGateway = screen.getByRole('checkbox', {
      name: 'Select Branch Gateway for comparison',
    })
    const compareButton = screen.getByRole('button', { name: 'Compare selected nodes' })

    expect(screen.getByText('0 of 3 nodes selected for comparison')).toBeInTheDocument()

    await user.click(coreRouter)
    await user.click(accessSwitch)

    expect(coreRouter).toBeChecked()
    expect(accessSwitch).toBeChecked()
    expect(compareButton).toBeEnabled()
    expect(screen.getByText('2 of 3 nodes selected for comparison')).toBeInTheDocument()

    await user.click(branchGateway)

    expect(branchGateway).toBeChecked()
    expect(compareButton).toBeEnabled()
    expect(screen.getByText('3 of 3 nodes selected for comparison')).toBeInTheDocument()
  })

  it('blocks selecting more than three nodes', async () => {
    const fourthNode: NetworkNode = {
      ...NETWORK_NODES[0],
      id: 'edge-router',
      name: 'Edge Router',
      address: '10.0.0.2',
    }
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={createNetworkNodesService([...NETWORK_NODES, fourthNode])} />
      </MemoryRouter>,
    )

    const coreRouter = await screen.findByRole('checkbox', {
      name: 'Select Core Router for comparison',
    })
    const accessSwitch = screen.getByRole('checkbox', {
      name: 'Select Access Switch 01 for comparison',
    })
    const branchGateway = screen.getByRole('checkbox', {
      name: 'Select Branch Gateway for comparison',
    })
    const edgeRouter = screen.getByRole('checkbox', {
      name: 'Select Edge Router for comparison',
    })

    await user.click(coreRouter)
    await user.click(accessSwitch)
    await user.click(branchGateway)

    expect(coreRouter).toBeChecked()
    expect(accessSwitch).toBeChecked()
    expect(branchGateway).toBeChecked()
    expect(edgeRouter).toBeDisabled()
    expect(edgeRouter).not.toBeChecked()
  })

  it('keeps selection available and blocks continuing until two nodes are selected', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={createNetworkNodesService()} />
      </MemoryRouter>,
    )

    const coreRouter = await screen.findByRole('checkbox', {
      name: 'Select Core Router for comparison',
    })
    const accessSwitch = screen.getByRole('checkbox', {
      name: 'Select Access Switch 01 for comparison',
    })
    const compareButton = screen.getByRole('button', { name: 'Compare selected nodes' })

    expect(compareButton).toBeDisabled()

    await user.click(coreRouter)

    expect(coreRouter).toBeChecked()
    expect(compareButton).toBeDisabled()
    expect(accessSwitch).toBeEnabled()

    await user.click(accessSwitch)

    expect(accessSwitch).toBeChecked()
    expect(compareButton).toBeEnabled()
  })

  it('renders the empty state when no nodes are returned', async () => {
    const listNodes = vi.fn().mockResolvedValue([])

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        name: 'No network nodes found',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('searchbox', { name: 'Search nodes' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link', { name: /^View metrics for/ })).toHaveLength(0)
  })

  it('retries after an error and renders the nodes', async () => {
    const listNodes = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce(NETWORK_NODES)

    const service = {
      listNodes,
      getNode: vi.fn(),
      getNodeMetrics: vi.fn(),
    } satisfies NetworkMonitoringService

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <NetworkNodesPanel service={service} />
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Unable to load network nodes',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox', { name: 'Search nodes' })).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link', { name: /^View metrics for/ })).toHaveLength(0)

    await user.click(
      screen.getByRole('button', {
        name: 'Try again',
      }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Monitored nodes',
        }),
      ).toBeInTheDocument()
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(listNodes).toHaveBeenCalledTimes(2)
  })
})
