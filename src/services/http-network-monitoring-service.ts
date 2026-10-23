import type { MetricsRange, NetworkNode, NodeMetrics, NodeStatus } from '../domain/network'
import { NetworkNodeNotFoundError, NetworkRequestError } from './network-monitoring-errors'
import type { NetworkMonitoringService } from './network-monitoring-service'

const API_REQUEST_TIMEOUT_MS = 30_000
const NODE_STATUSES = new Set<NodeStatus>(['online', 'degraded', 'offline'])

export class HttpNetworkMonitoringService implements NetworkMonitoringService {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async listNodes(signal?: AbortSignal): Promise<readonly NetworkNode[]> {
    return this.request('/nodes', signal, async (response) => {
      const nodes = await this.parseResponse<unknown>(response)

      if (!isNetworkNodeList(nodes)) {
        throw new NetworkRequestError('Network monitoring API returned invalid data')
      }

      return nodes
    })
  }

  async getNode(nodeId: NetworkNode['id'], signal?: AbortSignal): Promise<NetworkNode> {
    return this.request(`/nodes/${encodeURIComponent(nodeId)}`, signal, async (response) => {
      if (response.status === 404) {
        throw new NetworkNodeNotFoundError(nodeId)
      }

      const node = await this.parseResponse<unknown>(response)

      if (!isNetworkNode(node)) {
        throw new NetworkRequestError('Network monitoring API returned invalid data')
      }

      return node
    })
  }

  async getNodeMetrics(
    nodeId: NetworkNode['id'],
    range: MetricsRange,
    signal?: AbortSignal,
  ): Promise<NodeMetrics> {
    return this.request(
      `/nodes/${encodeURIComponent(nodeId)}/metrics?range=${encodeURIComponent(range)}`,
      signal,
      async (response) => {
        if (response.status === 404) {
          throw new NetworkNodeNotFoundError(nodeId)
        }

        return this.parseResponse<NodeMetrics>(response)
      },
    )
  }

  private async request<T>(
    path: string,
    signal: AbortSignal | undefined,
    parse: (response: Response) => Promise<T>,
  ): Promise<T> {
    const controller = new AbortController()
    let didTimeout = false
    const timeoutId = setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, API_REQUEST_TIMEOUT_MS)
    const abortRequest = () => controller.abort(signal?.reason)

    if (signal?.aborted) {
      abortRequest()
    } else {
      signal?.addEventListener('abort', abortRequest, { once: true })
    }

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      })

      return await parse(response)
    } catch (cause) {
      if (didTimeout) {
        throw new NetworkRequestError('Network monitoring API request timed out')
      }

      if (signal?.aborted || isAbortError(cause)) {
        throw cause
      }

      if (cause instanceof NetworkRequestError || cause instanceof NetworkNodeNotFoundError) {
        throw cause
      }

      throw new NetworkRequestError('Unable to reach the network monitoring API')
    } finally {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', abortRequest)
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new NetworkRequestError(
        `Network monitoring API request failed with status ${response.status}`,
      )
    }

    try {
      return (await response.json()) as T
    } catch (cause) {
      if (isAbortError(cause)) {
        throw cause
      }

      throw new NetworkRequestError('Network monitoring API returned invalid data')
    }
  }
}

function isNetworkNodeList(value: unknown): value is readonly NetworkNode[] {
  return Array.isArray(value) && value.every(isNetworkNode)
}

function isNetworkNode(value: unknown): value is NetworkNode {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const node = value as Record<string, unknown>

  return (
    typeof node.id === 'string' &&
    typeof node.name === 'string' &&
    typeof node.address === 'string' &&
    typeof node.location === 'string' &&
    typeof node.status === 'string' &&
    NODE_STATUSES.has(node.status as NodeStatus) &&
    typeof node.lastCheckedAt === 'string' &&
    Number.isFinite(Date.parse(node.lastCheckedAt))
  )
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}
