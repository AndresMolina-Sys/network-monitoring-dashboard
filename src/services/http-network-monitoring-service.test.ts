import { afterEach, describe, expect, it, vi } from 'vitest'
import { NETWORK_NODE_METRICS, NETWORK_NODES } from '../mocks/network-fixtures'
import { NetworkNodeNotFoundError, NetworkRequestError } from './network-monitoring-errors'
import { HttpNetworkMonitoringService } from './http-network-monitoring-service'

const API_BASE_URL = 'http://127.0.0.1:5075/api'

describe('HttpNetworkMonitoringService', () => {
  afterEach(() => {
    vi.useRealTimers()
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

  it('rejects a node list containing a malformed node', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(jsonResponse([{ ...NETWORK_NODES[0], name: null }]))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.listNodes()).rejects.toBeInstanceOf(NetworkRequestError)
  })

  it('rejects a node-list response that is not an array', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(jsonResponse({ nodes: NETWORK_NODES }))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.listNodes()).rejects.toBeInstanceOf(NetworkRequestError)
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

  it('rejects a malformed single-node response', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(jsonResponse({ ...NETWORK_NODES[0], status: 'unknown' }))

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.getNode('core-router')).rejects.toBeInstanceOf(NetworkRequestError)
  })

  it('rejects a single-node response with an invalid timestamp', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ ...NETWORK_NODES[0], lastCheckedAt: 'not-a-timestamp' }),
    )

    const service = new HttpNetworkMonitoringService(API_BASE_URL)

    await expect(service.getNode('core-router')).rejects.toBeInstanceOf(NetworkRequestError)
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

  it('turns a stalled request deadline into a request error', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal
          signal?.addEventListener('abort', () => reject(signal.reason), { once: true })
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const service = new HttpNetworkMonitoringService(API_BASE_URL)
    const request = service.listNodes().then(
      () => null,
      (cause: unknown) => cause,
    )

    await vi.advanceTimersByTimeAsync(30_000)

    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true)
    await expect(request).resolves.toMatchObject({
      name: 'NetworkRequestError',
      message: expect.stringContaining('timed out'),
    })
  })

  it('keeps the deadline active while parsing the response body', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn<typeof fetch>((_input, init) => {
      const signal = init?.signal

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          new Promise<unknown>((_resolve, reject) => {
            signal?.addEventListener('abort', () => reject(signal.reason), { once: true })
          }),
      } as Response)
    })
    vi.stubGlobal('fetch', fetchMock)

    const service = new HttpNetworkMonitoringService(API_BASE_URL)
    const request = service.listNodes().then(
      () => null,
      (cause: unknown) => cause,
    )

    await vi.advanceTimersByTimeAsync(30_000)

    expect(fetchMock.mock.calls[0]?.[1]?.signal?.aborted).toBe(true)
    await expect(request).resolves.toMatchObject({ name: 'NetworkRequestError' })
  })

  it('preserves caller cancellation while enforcing a deadline', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal
          signal?.addEventListener('abort', () => reject(signal.reason), { once: true })
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const service = new HttpNetworkMonitoringService(API_BASE_URL)
    const request = service.listNodes(controller.signal)
    controller.abort()

    await expect(request).rejects.toMatchObject({ name: 'AbortError' })
  })
})

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}
