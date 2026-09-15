import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NETWORK_NODES } from '../../../mocks/network-fixtures'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NetworkNodesPanel } from './network-nodes-panel'
import { MemoryRouter } from 'react-router'

describe('NetworkNodesPanel', () => {
  it('renders the loading state while nodes are pending', () => {
    const service = {
      listNodes: vi.fn().mockReturnValue(new Promise(() => undefined)),
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
    const service = {
      listNodes: vi.fn().mockResolvedValue(NETWORK_NODES),
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

  it('renders the empty state when no nodes are returned', async () => {
    const service = {
      listNodes: vi.fn().mockResolvedValue([]),
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
