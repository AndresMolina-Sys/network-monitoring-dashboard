import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodesPanel } from './network-nodes-panel'
import { MemoryRouter } from 'react-router'

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

    expect(
      screen.getByRole('heading', {
        name: 'Core Router',
      }),
    ).toBeInTheDocument()
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

    expect(listNodes).toHaveBeenCalledTimes(2)
  })
})
