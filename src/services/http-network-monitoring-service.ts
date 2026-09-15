import type { MetricsRange, NetworkNode, NodeMetrics } from '../domain/network'
import { NetworkNodeNotFoundError, NetworkRequestError } from './network-monitoring-errors'
import type { NetworkMonitoringService } from './network-monitoring-service'

export class HttpNetworkMonitoringService implements NetworkMonitoringService {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async listNodes(signal?: AbortSignal): Promise<readonly NetworkNode[]> {
    const response = await this.request('/nodes', signal)

    return this.parseResponse<readonly NetworkNode[]>(response)
  }

  async getNode(nodeId: NetworkNode['id'], signal?: AbortSignal): Promise<NetworkNode> {
    const response = await this.request(`/nodes/${encodeURIComponent(nodeId)}`, signal)

    if (response.status === 404) {
      throw new NetworkNodeNotFoundError(nodeId)
    }

    return this.parseResponse<NetworkNode>(response)
  }

  async getNodeMetrics(
    nodeId: NetworkNode['id'],
    range: MetricsRange,
    signal?: AbortSignal,
  ): Promise<NodeMetrics> {
    const response = await this.request(
      `/nodes/${encodeURIComponent(nodeId)}/metrics?range=${encodeURIComponent(range)}`,
      signal,
    )

    if (response.status === 404) {
      throw new NetworkNodeNotFoundError(nodeId)
    }

    return this.parseResponse<NodeMetrics>(response)
  }

  private async request(path: string, signal?: AbortSignal): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal,
      })
    } catch (cause) {
      if (isAbortError(cause)) {
        throw cause
      }

      throw new NetworkRequestError('Unable to reach the network monitoring API')
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
    } catch {
      throw new NetworkRequestError('Network monitoring API returned invalid data')
    }
  }
}

function isAbortError(cause: unknown): boolean {
  return cause instanceof Error && cause.name === 'AbortError'
}
