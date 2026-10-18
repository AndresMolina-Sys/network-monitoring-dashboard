import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { MetricsRange, NodeMetrics } from '../../../domain/network'
import { NetworkNodeNotFoundError } from '../../../services/network-monitoring-errors'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNodeMetrics } from './use-node-metrics'

const EXPECTED_POINT_COUNTS: Record<MetricsRange, number> = {
  '1h': 4,
  '24h': 25,
  '7d': 29,
}

const WINDOW_DURATION_MS: Record<MetricsRange, number> = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

const METRICS_RANGES = [
  { range: '1h', pointCount: 4 },
  { range: '24h', pointCount: 25 },
  { range: '7d', pointCount: 29 },
] as const

const INVALID_SAMPLE_COUNTS = [
  { range: '1h', pointCount: 3 },
  { range: '1h', pointCount: 5 },
  { range: '24h', pointCount: 24 },
  { range: '24h', pointCount: 26 },
  { range: '7d', pointCount: 28 },
  { range: '7d', pointCount: 30 },
] as const

const METRICS = createMetrics()

describe('useNodeMetrics', () => {
  it('transitions from loading to success', async () => {
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => METRICS),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    expect(result.current.status).toBe('loading')

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.metrics).toEqual(METRICS)
    expect(result.current.error).toBeNull()
  })

  it('exposes empty when the service returns no points', async () => {
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => ({
        ...METRICS,
        points: [],
      })),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('empty')
    })

    expect(result.current.metrics).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it.each(METRICS_RANGES)(
    'accepts a complete $range response with $pointCount samples',
    async ({ range, pointCount }) => {
      const metrics = createMetrics(range)
      const service = createService(
        vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics),
      )

      const { result } = renderHook(() => useNodeMetrics('core-router', range, service))

      await waitFor(() => {
        expect(result.current.status).toBe('success')
      })

      expect(result.current.metrics?.points).toHaveLength(pointCount)
      const firstPoint = metrics.points[0]
      const latestPoint = metrics.points[metrics.points.length - 1]
      expect(Date.parse(firstPoint.timestamp)).toBe(
        Date.parse(latestPoint.timestamp) - WINDOW_DURATION_MS[range],
      )
      expect(Date.parse(latestPoint.timestamp)).toBe(Date.parse('2026-09-13T18:00:00Z'))
    },
  )

  it('anchors the selected window to its latest sample rather than the current time', async () => {
    const metrics = createMetrics('1h', 'core-router', 4, '2012-04-05T06:07:08Z')

    await expectMetricsSuccess(metrics)

    expect(Date.parse(metrics.points[0].timestamp)).toBe(Date.parse('2012-04-05T05:07:08Z'))
    expect(Date.parse(metrics.points[metrics.points.length - 1].timestamp)).toBe(
      Date.parse('2012-04-05T06:07:08Z'),
    )
  })

  it('interprets explicit timezone offsets as UTC instants', async () => {
    const metrics = createMetrics('1h')
    const offsetMetrics = {
      ...metrics,
      points: metrics.points.map((point, index) => ({
        ...point,
        timestamp: formatTimestampWithOffset(point.timestamp, index % 2 === 0 ? 120 : -300),
      })),
    }

    await expectMetricsSuccess(offsetMetrics)
  })

  it.each([
    { label: 'unparseable timestamp', timestamp: 'not-a-timestamp' },
    { label: 'timestamp without a timezone', timestamp: '2026-09-13T17:00:00' },
    { label: 'invalid calendar date', timestamp: '2026-02-30T17:00:00Z' },
  ])('exposes error for an $label', async ({ timestamp }) => {
    const points = [...METRICS.points]
    points[0] = { ...points[0], timestamp }

    await expectMetricsError({ ...METRICS, points })
  })

  it.each(METRICS_RANGES)(
    'rejects an off-cadence sample in the $range window',
    async ({ range }) => {
      const metrics = createMetrics(range)
      const points = metrics.points.map((point, index) =>
        index === 1
          ? { ...point, timestamp: new Date(Date.parse(point.timestamp) + 1000).toISOString() }
          : point,
      )

      await expectMetricsError({ ...metrics, points }, range)
    },
  )

  it.each(METRICS_RANGES)(
    'rejects a sample before the inclusive $range window start',
    async ({ range }) => {
      const metrics = createMetrics(range)
      const points = [...metrics.points]
      points[0] = {
        ...points[0],
        timestamp: new Date(Date.parse(points[0].timestamp) - 1).toISOString(),
      }

      await expectMetricsError({ ...metrics, points }, range)
    },
  )

  it.each(METRICS_RANGES)(
    'rejects a shifted latest sample for the $range window',
    async ({ range }) => {
      const metrics = createMetrics(range)
      const points = [...metrics.points]
      const latestIndex = points.length - 1
      points[latestIndex] = {
        ...points[latestIndex],
        timestamp: new Date(Date.parse(points[latestIndex].timestamp) + 1).toISOString(),
      }

      await expectMetricsError({ ...metrics, points }, range)
    },
  )

  it('exposes error when samples are not in strict chronological order', async () => {
    const points = [...METRICS.points]
    const firstPoint = points[0]
    points[0] = points[1]
    points[1] = firstPoint

    await expectMetricsError({ ...METRICS, points })
  })

  it('exposes error when different timestamp strings identify the same instant', async () => {
    const points = [...METRICS.points]
    points[1] = {
      ...points[1],
      timestamp: formatTimestampWithOffset(points[0].timestamp, -300),
    }

    await expectMetricsError({ ...METRICS, points })
  })

  it.each([
    { label: 'negative', value: -0.1 },
    { label: 'not finite', value: Number.NaN },
    { label: 'infinite', value: Number.POSITIVE_INFINITY },
  ])('exposes error for $label latency', async ({ value }) => {
    const points = [...METRICS.points]
    points[0] = { ...points[0], latencyMs: value }

    await expectMetricsError({ ...METRICS, points })
  })

  it.each([
    { label: 'negative', value: -0.1 },
    { label: 'above 100 percent', value: 100.1 },
    { label: 'not finite', value: Number.NaN },
    { label: 'infinite', value: Number.POSITIVE_INFINITY },
  ])('exposes error for $label packet loss', async ({ value }) => {
    const points = [...METRICS.points]
    points[0] = { ...points[0], packetLossPercent: value }

    await expectMetricsError({ ...METRICS, points })
  })

  it('accepts zero latency and packet loss at both inclusive boundaries', async () => {
    const points = [...METRICS.points]
    points[0] = { ...points[0], latencyMs: 0, packetLossPercent: 0 }
    points[points.length - 1] = { ...points[points.length - 1], packetLossPercent: 100 }

    await expectMetricsSuccess({ ...METRICS, points })
  })

  it.each(INVALID_SAMPLE_COUNTS)(
    'exposes error when the $range response has an incomplete or excessive sample count',
    async ({ range, pointCount }) => {
      const metrics = createMetrics(range, 'core-router', pointCount)
      const service = createService(
        vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics),
      )

      const { result } = renderHook(() => useNodeMetrics('core-router', range, service))

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.metrics).toBeNull()
      expect(result.current.error).toBeInstanceOf(Error)
    },
  )

  it.each([
    { field: 'node identifier', metrics: { ...METRICS, nodeId: 'branch-gateway' } },
    { field: 'range', metrics: { ...METRICS, range: '24h' } },
  ])('exposes error when the response has a mismatched $field', async ({ metrics }) => {
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics as NodeMetrics),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.metrics).toBeNull()
  })

  it.each([
    { field: 'nodeId', result: { range: '1h', points: METRICS.points } },
    { field: 'range', result: { nodeId: 'core-router', points: METRICS.points } },
    { field: 'points', result: { nodeId: 'core-router', range: '1h' } },
    { field: 'point array', result: { ...METRICS, points: null } },
  ])('exposes error when the response is missing a valid $field', async ({ result: response }) => {
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(
        async () => response as unknown as NodeMetrics,
      ),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.metrics).toBeNull()
  })

  it.each(['timestamp', 'latencyMs', 'packetLossPercent'] as const)(
    'exposes error when a point is missing %s',
    async (field) => {
      const metrics = createMetricsWithMissingPointField(field)
      const service = createService(
        vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics),
      )

      const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

      await waitFor(() => {
        expect(result.current.status).toBe('error')
      })

      expect(result.current.metrics).toBeNull()
    },
  )

  it('exposes error when the points array contains a missing sample', async () => {
    const points = [...METRICS.points]
    delete points[0]
    const metrics = { ...METRICS, points }
    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics),
    )

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.metrics).toBeNull()
  })

  it('exposes not-found when the node does not exist', async () => {
    const getNodeMetrics = vi
      .fn<NetworkMonitoringService['getNodeMetrics']>()
      .mockRejectedValue(new NetworkNodeNotFoundError('unknown-node'))

    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeMetrics('unknown-node', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('not-found')
    })

    expect(result.current.metrics).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('recovers from error after retry', async () => {
    const getNodeMetrics = vi
      .fn<NetworkMonitoringService['getNodeMetrics']>()
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(METRICS)

    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })

    expect(result.current.error?.message).toBe('Request failed')

    act(() => {
      result.current.retry()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    expect(result.current.metrics).toEqual(METRICS)
    expect(getNodeMetrics).toHaveBeenCalledTimes(2)
  })

  it('does not show metrics from the previous range while the new range is loading', async () => {
    const deferredMetrics = createDeferred<NodeMetrics>()
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((_nodeId, range) =>
      range === '1h' ? Promise.resolve(METRICS) : deferredMetrics.promise,
    )
    const service = createService(getNodeMetrics)

    const { result, rerender } = renderHook(
      ({ range }: { range: MetricsRange }) => useNodeMetrics('core-router', range, service),
      { initialProps: { range: '1h' } },
    )

    await waitFor(() => {
      expect(result.current.status).toBe('success')
    })

    rerender({ range: '24h' })

    expect(result.current.status).toBe('loading')
    expect(result.current.metrics).toBeNull()
    expect(result.current.error).toBeNull()

    await act(async () => {
      deferredMetrics.resolve(createMetrics('24h'))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.metrics?.range).toBe('24h')
  })

  it('keeps the latest range when deferred requests resolve out of order', async () => {
    const olderRequest = createDeferred<NodeMetrics>()
    const latestRequest = createDeferred<NodeMetrics>()
    let olderRequestSignal: AbortSignal | undefined
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>(
      (_nodeId, range, signal) => {
        if (range === '1h') {
          olderRequestSignal = signal
          return olderRequest.promise
        }

        return latestRequest.promise
      },
    )
    const service = createService(getNodeMetrics)

    const { result, rerender } = renderHook(
      ({ range }: { range: MetricsRange }) => useNodeMetrics('core-router', range, service),
      { initialProps: { range: '1h' } },
    )

    await waitFor(() => {
      expect(getNodeMetrics).toHaveBeenCalledTimes(1)
    })

    rerender({ range: '24h' })

    await waitFor(() => {
      expect(getNodeMetrics).toHaveBeenCalledTimes(2)
    })
    expect(olderRequestSignal?.aborted).toBe(true)

    await act(async () => {
      latestRequest.resolve(createMetrics('24h'))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.metrics?.range).toBe('24h')

    await act(async () => {
      olderRequest.resolve(METRICS)
    })

    expect(result.current.status).toBe('success')
    expect(result.current.metrics?.range).toBe('24h')
  })

  it('ignores the old response while the latest range is still loading', async () => {
    const olderRequest = createDeferred<NodeMetrics>()
    const latestRequest = createDeferred<NodeMetrics>()
    const getNodeMetrics = vi.fn<NetworkMonitoringService['getNodeMetrics']>((_nodeId, range) =>
      range === '1h' ? olderRequest.promise : latestRequest.promise,
    )
    const service = createService(getNodeMetrics)

    const { result, rerender } = renderHook(
      ({ range }: { range: MetricsRange }) => useNodeMetrics('core-router', range, service),
      { initialProps: { range: '1h' } },
    )

    await waitFor(() => {
      expect(getNodeMetrics).toHaveBeenCalledTimes(1)
    })

    rerender({ range: '24h' })

    await waitFor(() => {
      expect(getNodeMetrics).toHaveBeenCalledTimes(2)
    })

    await act(async () => {
      olderRequest.resolve(METRICS)
    })

    expect(result.current.status).toBe('loading')
    expect(result.current.metrics).toBeNull()
    expect(result.current.error).toBeNull()

    await act(async () => {
      latestRequest.resolve(createMetrics('24h'))
    })

    expect(result.current.status).toBe('success')
    expect(result.current.metrics?.range).toBe('24h')
    expect(result.current.error).toBeNull()
  })

  it('keeps the error state after repeated retry failures', async () => {
    const getNodeMetrics = vi
      .fn<NetworkMonitoringService['getNodeMetrics']>()
      .mockRejectedValueOnce(new Error('Initial request failed'))
      .mockRejectedValueOnce(new Error('First retry failed'))
      .mockRejectedValueOnce(new Error('Second retry failed'))
    const service = createService(getNodeMetrics)

    const { result } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })
    expect(result.current.error?.message).toBe('Initial request failed')

    act(() => result.current.retry())

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })
    expect(result.current.error?.message).toBe('First retry failed')
    expect(result.current.metrics).toBeNull()

    act(() => result.current.retry())

    await waitFor(() => {
      expect(result.current.status).toBe('error')
    })
    expect(result.current.error?.message).toBe('Second retry failed')
    expect(result.current.metrics).toBeNull()
    expect(getNodeMetrics).toHaveBeenCalledTimes(3)
  })

  it('aborts the request when the hook unmounts', async () => {
    let requestSignal: AbortSignal | undefined

    const service = createService(
      vi.fn<NetworkMonitoringService['getNodeMetrics']>(async (nodeId, range, signal) => {
        const requestLabel = `${nodeId}:${range}`
        void requestLabel

        requestSignal = signal

        return new Promise<NodeMetrics>(() => {})
      }),
    )

    const { unmount } = renderHook(() => useNodeMetrics('core-router', '1h', service))

    await waitFor(() => {
      expect(requestSignal).toBeDefined()
    })

    unmount()

    expect(requestSignal?.aborted).toBe(true)
  })
})

function createService(
  getNodeMetrics: NetworkMonitoringService['getNodeMetrics'],
): NetworkMonitoringService {
  return {
    listNodes: () => Promise.resolve([]),
    getNode: vi.fn(),
    getNodeMetrics: (nodeId, range, signal) => getNodeMetrics(nodeId, range, signal),
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

function createMetrics(
  range: MetricsRange = '1h',
  nodeId = 'core-router',
  pointCount = EXPECTED_POINT_COUNTS[range],
  anchorTimestamp = '2026-09-13T18:00:00Z',
): NodeMetrics {
  const cadenceByRange: Record<MetricsRange, number> = {
    '1h': 20 * 60 * 1000,
    '24h': 60 * 60 * 1000,
    '7d': 6 * 60 * 60 * 1000,
  }
  const latestTimestamp = Date.parse(anchorTimestamp)

  return {
    nodeId,
    range,
    points: Array.from({ length: pointCount }, (_, index) => ({
      timestamp: new Date(
        latestTimestamp - (pointCount - index - 1) * cadenceByRange[range],
      ).toISOString(),
      latencyMs: 19,
      packetLossPercent: 0,
    })),
  }
}

async function expectMetricsError(metrics: NodeMetrics, range: MetricsRange = metrics.range) {
  const service = createService(
    vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics),
  )
  const { result } = renderHook(() => useNodeMetrics('core-router', range, service))

  await waitFor(() => {
    expect(result.current.status).toBe('error')
  })

  expect(result.current.metrics).toBeNull()
  expect(result.current.error).toBeInstanceOf(Error)
}

async function expectMetricsSuccess(metrics: NodeMetrics) {
  const service = createService(
    vi.fn<NetworkMonitoringService['getNodeMetrics']>(async () => metrics),
  )
  const { result } = renderHook(() => useNodeMetrics('core-router', metrics.range, service))

  await waitFor(() => {
    expect(result.current.status).toBe('success')
  })

  expect(result.current.metrics).toEqual(metrics)
  expect(result.current.error).toBeNull()
}

function formatTimestampWithOffset(timestamp: string, offsetMinutes: number): string {
  const localTimestamp = new Date(Date.parse(timestamp) + offsetMinutes * 60 * 1000)
  const sign = offsetMinutes < 0 ? '-' : '+'
  const absoluteOffsetMinutes = Math.abs(offsetMinutes)
  const offsetHours = Math.floor(absoluteOffsetMinutes / 60)
  const remainingOffsetMinutes = absoluteOffsetMinutes % 60

  return `${localTimestamp.toISOString().slice(0, 19)}${sign}${String(offsetHours).padStart(2, '0')}:${String(remainingOffsetMinutes).padStart(2, '0')}`
}

function createMetricsWithMissingPointField(
  field: 'timestamp' | 'latencyMs' | 'packetLossPercent',
): NodeMetrics {
  const points = METRICS.points.map((point, index) => {
    if (index !== 0) {
      return point
    }

    const incompletePoint: Record<string, unknown> = { ...point }
    delete incompletePoint[field]
    return incompletePoint
  })

  return { ...METRICS, points } as unknown as NodeMetrics
}
