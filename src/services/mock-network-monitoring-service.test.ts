import { describe, expect, it } from 'vitest'
import { NETWORK_NODES } from '../mocks/network-fixtures'
import { NetworkNodeNotFoundError, NetworkRequestError } from './network-monitoring-errors'
import { MockNetworkMonitoringService } from './mock-network-monitoring-service'

describe('MockNetworkMonitoringService', () => {
  it('returns configured network nodes', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 0,
    })

    await expect(service.listNodes()).resolves.toEqual(NETWORK_NODES)
  })

  it('returns a known network node', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 0,
    })

    await expect(service.getNode('core-router')).resolves.toMatchObject({
      id: 'core-router',
      name: 'Core Router',
    })
  })

  it('returns metrics for a known node', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 0,
    })

    const metrics = await service.getNodeMetrics('core-router', '1h')

    expect(metrics).toMatchObject({
      nodeId: 'core-router',
      range: '1h',
    })

    expect(metrics.points).not.toHaveLength(0)
  })

  it('rejects with a typed error when failure is configured', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 0,
      shouldFail: () => true,
    })

    await expect(service.listNodes()).rejects.toBeInstanceOf(NetworkRequestError)
  })

  it('rejects with a not-found error for an unknown node', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 0,
    })

    await expect(service.getNodeMetrics('unknown-node', '1h')).rejects.toBeInstanceOf(
      NetworkNodeNotFoundError,
    )
  })

  it('rejects when the request is aborted', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 100,
    })
    const controller = new AbortController()
    const pendingRequest = service.listNodes(controller.signal)

    controller.abort()

    await expect(pendingRequest).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})
