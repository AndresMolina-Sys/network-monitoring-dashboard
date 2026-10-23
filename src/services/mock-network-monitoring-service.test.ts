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

  it('rejects mixed-case node IDs for node and metrics lookups', async () => {
    const service = new MockNetworkMonitoringService({
      latencyMs: 0,
    })

    await expect(service.getNode('CORE-ROUTER')).rejects.toBeInstanceOf(NetworkNodeNotFoundError)
    await expect(service.getNodeMetrics('CORE-ROUTER', '1h')).rejects.toBeInstanceOf(
      NetworkNodeNotFoundError,
    )
  })

  it.each([
    { range: '1h' as const, expectedCount: 4, cadenceMs: 20 * 60 * 1000 },
    { range: '24h' as const, expectedCount: 25, cadenceMs: 60 * 60 * 1000 },
    { range: '7d' as const, expectedCount: 29, cadenceMs: 6 * 60 * 60 * 1000 },
  ])(
    'returns complete $range metrics for every known node',
    async ({ range, expectedCount, cadenceMs }) => {
      const service = new MockNetworkMonitoringService({
        latencyMs: 0,
      })

      for (const node of NETWORK_NODES) {
        const anchorMetrics = await service.getNodeMetrics(node.id, '1h')
        const metrics = await service.getNodeMetrics(node.id, range)

        expect(metrics).toMatchObject({
          nodeId: node.id,
          range,
        })
        expect(metrics.points).toHaveLength(expectedCount)

        const timestamps = metrics.points.map((point) => point.timestamp)
        const timestampsInMilliseconds = timestamps.map((timestamp) => Date.parse(timestamp))
        const anchorTimestamp = Date.parse(
          anchorMetrics.points[anchorMetrics.points.length - 1].timestamp,
        )

        expect(timestamps.every((timestamp) => timestamp.endsWith('Z'))).toBe(true)
        expect(timestampsInMilliseconds.every(Number.isFinite)).toBe(true)
        expect(timestampsInMilliseconds).toEqual(
          [...timestampsInMilliseconds].sort((first, second) => first - second),
        )
        expect(timestampsInMilliseconds[0]).toBe(anchorTimestamp - cadenceMs * (expectedCount - 1))
        expect(timestampsInMilliseconds[timestampsInMilliseconds.length - 1]).toBe(anchorTimestamp)

        for (let index = 1; index < timestampsInMilliseconds.length; index += 1) {
          expect(timestampsInMilliseconds[index] - timestampsInMilliseconds[index - 1]).toBe(
            cadenceMs,
          )
        }
      }
    },
  )

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
