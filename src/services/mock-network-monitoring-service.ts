import type { MetricsRange, NetworkNode, NodeMetrics } from '../domain/network'
import { NETWORK_NODE_METRICS, NETWORK_NODES } from '../mocks/network-fixtures'
import type { NetworkMonitoringService } from './network-monitoring-service'
import { NetworkNodeNotFoundError, NetworkRequestError } from './network-monitoring-errors'

const DEFAULT_LATENCY_MS = 350

export interface MockNetworkMonitoringServiceOptions {
  readonly latencyMs?: number
  readonly shouldFail?: () => boolean
  readonly nodes?: readonly NetworkNode[]
}

export class MockNetworkMonitoringService implements NetworkMonitoringService {
  private readonly latencyMs: number
  private readonly shouldFail: () => boolean
  private readonly nodes: readonly NetworkNode[]

  constructor(options: MockNetworkMonitoringServiceOptions = {}) {
    this.latencyMs = Math.max(0, options.latencyMs ?? DEFAULT_LATENCY_MS)

    this.shouldFail = options.shouldFail ?? (() => false)
    this.nodes = options.nodes ?? NETWORK_NODES
  }

  async listNodes(signal?: AbortSignal): Promise<readonly NetworkNode[]> {
    await waitForResponse(this.latencyMs, signal)
    this.throwIfFailureConfigured()

    return this.nodes
  }

  async getNode(nodeId: NetworkNode['id'], signal?: AbortSignal): Promise<NetworkNode> {
    await waitForResponse(this.latencyMs, signal)
    this.throwIfFailureConfigured()

    const node = this.nodes.find((candidate) => candidate.id === nodeId)

    if (!node) {
      throw new NetworkNodeNotFoundError(nodeId)
    }

    return node
  }

  async getNodeMetrics(
    nodeId: NetworkNode['id'],
    range: MetricsRange,
    signal?: AbortSignal,
  ): Promise<NodeMetrics> {
    await waitForResponse(this.latencyMs, signal)
    this.throwIfFailureConfigured()

    const metrics = NETWORK_NODE_METRICS[nodeId]

    if (!metrics) {
      throw new NetworkNodeNotFoundError(nodeId)
    }

    if (metrics.range !== range) {
      throw new Error(`Metrics range "${range}" is not available in the mock yet`)
    }

    return metrics
  }

  private throwIfFailureConfigured(): void {
    if (this.shouldFail()) {
      throw new NetworkRequestError('Mock network request failed')
    }
  }
}

export function createMockNetworkMonitoringService(
  options?: MockNetworkMonitoringServiceOptions,
): NetworkMonitoringService {
  return new MockNetworkMonitoringService(options)
}

function waitForResponse(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      signal?.removeEventListener('abort', handleAbort)
    }

    const timerId = setTimeout(() => {
      cleanup()
      resolve()
    }, delayMs)

    const handleAbort = (): void => {
      clearTimeout(timerId)
      cleanup()
      reject(new DOMException('The request was aborted', 'AbortError'))
    }

    if (signal?.aborted) {
      handleAbort()
      return
    }

    signal?.addEventListener('abort', handleAbort, {
      once: true,
    })
  })
}
