import { afterEach, describe, expect, it, vi } from 'vitest'
import { NETWORK_NODE_METRICS, NETWORK_NODES } from '../mocks/network-fixtures'
import { NetworkNodeNotFoundError, NetworkRequestError } from './network-monitoring-errors'
import { HttpNetworkMonitoringService } from './http-network-monitoring-service'

const API_BASE_URL = 'http://127.0.0.1:5075/api'

describe('HttpNetworkMonitoringService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('lists network nodes from the API', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    fetchMock.mockResolvedValueOnce(jsonResponse(NETWORK_NODES))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.listNodes()).resolves.toEqual(NETWORK_NODES)

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/nodes`,
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }),
    )
  })

  it('returns a known network node', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    fetchMock.mockResolvedValueOnce(jsonResponse(NETWORK_NODES[0]))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.getNode('core-router')).resolves.toMatchObject({
      id: 'core-router',
      name: 'Core Router',
    })
  })

  it('throws a typed error when the node is not found', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    fetchMock.mockResolvedValueOnce(jsonResponse(null, 404))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.getNode('unknown-node')).rejects.toBeInstanceOf(NetworkNodeNotFoundError)
  })

  it('returns metrics for a known node', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    fetchMock.mockResolvedValueOnce(jsonResponse(NETWORK_NODE_METRICS['core-router']))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.getNodeMetrics('core-router', '1h')).resolves.toEqual(
      NETWORK_NODE_METRICS['core-router'],
    )

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/nodes/core-router/metrics?range=1h`,
      expect.any(Object),
    )
  })

  it('throws a request error for an unsuccessful response', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    fetchMock.mockResolvedValueOnce(jsonResponse(null, 400))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.getNodeMetrics('core-router', '24h' as '1h')).rejects.toBeInstanceOf(
      NetworkRequestError,
    )
  })

  it('throws a request error when the API cannot be reached', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.listNodes()).rejects.toBeInstanceOf(NetworkRequestError)
  })

  it('preserves aborted requests', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    const abortError = Object.assign(new Error('The request was aborted'), { name: 'AbortError' })

    fetchMock.mockRejectedValueOnce(abortError)

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.listNodes()).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}
