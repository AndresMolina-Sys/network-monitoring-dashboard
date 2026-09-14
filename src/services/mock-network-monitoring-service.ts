import type { MetricsRange, NetworkNode, NodeMetrics } from '../domain/network'
import { NETWORK_NODE_METRICS, NETWORK_NODES } from '../mocks/network-fixtures'
import type { NetworkMonitoringService } from './network-monitoring-service'

const DEFAULT_LATENCY_MS = 350

export interface MockNetworkMonitoringServiceOptions {
  readonly latencyMs?: number
  readonly shouldFail?: () => boolean
}

export class MockNetworkMonitoringService implements NetworkMonitoringService {
  private readonly latencyMs: number
  private readonly shouldFail: () => boolean

  constructor(options: MockNetworkMonitoringServiceOptions = {}) {
    this.latencyMs = Math.max(0, options.latencyMs ?? DEFAULT_LATENCY_MS)
    this.shouldFail = options.shouldFail ?? (() => false)
  }

  async listNodes(signal?: AbortSignal): Promise<readonly NetworkNode[]> {
    await waitForResponse(this.latencyMs, signal)
    this.throwIfFailureConfigured()

    return NETWORK_NODES
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
      throw new Error(`No metrics found for node: ${nodeId}`)
    }

    if (metrics.range !== range) {
      throw new Error(`Metrics range "${range}" is not available in the mock yet`)
    }

    return metrics
  }

  private throwIfFailureConfigured(): void {
    if (this.shouldFail()) {
      throw new Error('Mock network request failed')
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
