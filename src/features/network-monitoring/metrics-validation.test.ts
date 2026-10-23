import { describe, expect, it } from 'vitest'
import type { MetricsRange, NodeMetrics } from '../../domain/network'
import { assertValidMetricPoints, assertValidMetricsResponse } from './metrics-validation'

const RANGE_CASES = [
  { range: '1h', sampleCount: 4, cadenceMs: 20 * 60 * 1000, windowMs: 60 * 60 * 1000 },
  { range: '24h', sampleCount: 25, cadenceMs: 60 * 60 * 1000, windowMs: 24 * 60 * 60 * 1000 },
  {
    range: '7d',
    sampleCount: 29,
    cadenceMs: 6 * 60 * 60 * 1000,
    windowMs: 7 * 24 * 60 * 60 * 1000,
  },
] as const satisfies readonly {
  range: MetricsRange
  sampleCount: number
  cadenceMs: number
  windowMs: number
}[]

const NODE_ID = 'core-router'
const LATEST_TIMESTAMP = '2026-10-19T12:34:56.789Z'

describe('assertValidMetricsResponse', () => {
  it.each(RANGE_CASES)('accepts a well-formed $range response', ({ range }) => {
    const response = createMetrics(range)

    expect(() => assertValidMetricsResponse(response, NODE_ID, range)).not.toThrow()
  })

  it('accepts an empty, correctly shaped response for the hook to classify as empty', () => {
    const response = { nodeId: NODE_ID, range: '1h', points: [] }

    expect(() => assertValidMetricsResponse(response, NODE_ID, '1h')).not.toThrow()
  })

  it.each([
    ['a null response', null],
    ['a response without node identity', { range: '1h', points: [] }],
    ['a response with non-string node identity', { nodeId: 42, range: '1h', points: [] }],
    ['a response without a range', { nodeId: NODE_ID, points: [] }],
    ['a response with an unsupported range', { nodeId: NODE_ID, range: '2h', points: [] }],
    ['a response without points', { nodeId: NODE_ID, range: '1h' }],
    ['a response with non-array points', { nodeId: NODE_ID, range: '1h', points: {} }],
  ])('rejects %s', (_description, response) => {
    expect(() => assertValidMetricsResponse(response, NODE_ID, '1h')).toThrow()
  })

  it('rejects a response for a different node or range', () => {
    const response = createMetrics('1h')

    expect(() =>
      assertValidMetricsResponse({ ...response, nodeId: 'branch-gateway' }, NODE_ID, '1h'),
    ).toThrow()
    expect(() =>
      assertValidMetricsResponse({ ...response, nodeId: 'CORE-ROUTER' }, NODE_ID, '1h'),
    ).toThrow()
    expect(() => assertValidMetricsResponse({ ...response, range: '24h' }, NODE_ID, '1h')).toThrow()
  })

  it.each([
    ['a point without a timestamp', { latencyMs: 1, packetLossPercent: 0 }],
    ['a point with a non-string timestamp', { timestamp: 42, latencyMs: 1, packetLossPercent: 0 }],
    ['a point without latency', { timestamp: LATEST_TIMESTAMP, packetLossPercent: 0 }],
    [
      'a point with non-numeric latency',
      { timestamp: LATEST_TIMESTAMP, latencyMs: '1', packetLossPercent: 0 },
    ],
    ['a point without packet loss', { timestamp: LATEST_TIMESTAMP, latencyMs: 1 }],
    [
      'a point with non-numeric packet loss',
      { timestamp: LATEST_TIMESTAMP, latencyMs: 1, packetLossPercent: '0' },
    ],
  ])('rejects %s', (_description, point) => {
    const response = { nodeId: NODE_ID, range: '1h', points: [point] }

    expect(() => assertValidMetricsResponse(response, NODE_ID, '1h')).toThrow()
  })
})

describe('assertValidMetricPoints', () => {
  it.each(RANGE_CASES)(
    'accepts all $sampleCount samples at the $range cadence with inclusive endpoints',
    ({ range, sampleCount, cadenceMs, windowMs }) => {
      const points = createPoints(range)

      expect(points).toHaveLength(sampleCount)
      expect(Date.parse(points[0].timestamp)).toBe(Date.parse(LATEST_TIMESTAMP) - windowMs)
      expect(Date.parse(points[points.length - 1].timestamp)).toBe(Date.parse(LATEST_TIMESTAMP))
      expect(() => assertValidMetricPoints(points, range)).not.toThrow()

      for (let index = 1; index < points.length; index += 1) {
        expect(Date.parse(points[index].timestamp) - Date.parse(points[index - 1].timestamp)).toBe(
          cadenceMs,
        )
      }
    },
  )

  it.each(RANGE_CASES)(
    'anchors the $range window to its latest sample, not the current time',
    ({ range, windowMs }) => {
      const anchor = '2001-02-03T04:05:06.789Z'
      const points = createPoints(range, undefined, anchor)

      expect(() => assertValidMetricPoints(points, range)).not.toThrow()
      expect(Date.parse(points[points.length - 1].timestamp)).toBe(Date.parse(anchor))
      expect(Date.parse(points[0].timestamp)).toBe(Date.parse(anchor) - windowMs)
    },
  )

  it.each(RANGE_CASES)(
    'rejects a sample count other than the required $sampleCount for $range',
    ({ range, sampleCount }) => {
      expect(() => assertValidMetricPoints(createPoints(range, sampleCount - 1), range)).toThrow()
      expect(() => assertValidMetricPoints(createPoints(range, sampleCount + 1), range)).toThrow()
    },
  )

  it('interprets UTC offsets as instants and accepts equivalent offset timestamps', () => {
    const points = createPoints('1h').map((point, index) => ({
      ...point,
      timestamp: formatTimestampWithOffset(point.timestamp, index % 2 === 0 ? 120 : -300),
    }))

    expect(() => assertValidMetricPoints(points, '1h')).not.toThrow()
  })

  it.each([
    ['an unparseable value', 'not-a-timestamp'],
    ['a timestamp without a timezone', '2026-10-19T12:34:56.789'],
    ['an impossible calendar date', '2026-02-30T12:34:56Z'],
    ['an invalid UTC offset', '2026-10-19T12:34:56+15:00'],
  ])('rejects %s', (_description, timestamp) => {
    const points = replacePoint(createPoints('1h'), 0, { timestamp })

    expect(() => assertValidMetricPoints(points, '1h')).toThrow()
  })

  it('rejects timestamps outside the inclusive window', () => {
    const points = replacePoint(createPoints('1h'), 0, {
      timestamp: new Date(Date.parse(createPoints('1h')[0].timestamp) - 1).toISOString(),
    })

    expect(() => assertValidMetricPoints(points, '1h')).toThrow()
  })

  it('rejects timestamps that do not match the selected cadence', () => {
    const points = replacePoint(createPoints('1h'), 1, {
      timestamp: new Date(Date.parse(createPoints('1h')[1].timestamp) + 1000).toISOString(),
    })

    expect(() => assertValidMetricPoints(points, '1h')).toThrow()
  })

  it('rejects samples that are not in strict chronological order', () => {
    const points = createPoints('1h')
    const reversed = [...points].reverse()

    expect(() => assertValidMetricPoints(reversed, '1h')).toThrow()
  })

  it('rejects duplicate instants even when their timestamp strings use different offsets', () => {
    const originalPoints = createPoints('1h')
    const points = replacePoint(originalPoints, 1, {
      timestamp: formatTimestampWithOffset(originalPoints[0].timestamp, -300),
    })

    expect(() => assertValidMetricPoints(points, '1h')).toThrow()
  })

  it.each([
    ['negative', -0.1],
    ['NaN', Number.NaN],
    ['positive infinity', Number.POSITIVE_INFINITY],
    ['negative infinity', Number.NEGATIVE_INFINITY],
  ])('rejects %s latency', (_description, latencyMs) => {
    const points = replacePoint(createPoints('1h'), 0, { latencyMs })

    expect(() => assertValidMetricPoints(points, '1h')).toThrow()
  })

  it.each([
    ['below zero', -0.1],
    ['above 100 percent', 100.1],
    ['NaN', Number.NaN],
    ['positive infinity', Number.POSITIVE_INFINITY],
    ['negative infinity', Number.NEGATIVE_INFINITY],
  ])('rejects packet loss %s', (_description, packetLossPercent) => {
    const points = replacePoint(createPoints('1h'), 0, { packetLossPercent })

    expect(() => assertValidMetricPoints(points, '1h')).toThrow()
  })

  it('accepts zero latency and packet loss values at both inclusive loss boundaries', () => {
    const zeroBoundaryPoints = replacePoint(createPoints('1h'), 0, {
      latencyMs: 0,
      packetLossPercent: 0,
    })
    const points = replacePoint(zeroBoundaryPoints, zeroBoundaryPoints.length - 1, {
      packetLossPercent: 100,
    })

    expect(() => assertValidMetricPoints(points, '1h')).not.toThrow()
  })
})

function createMetrics(range: MetricsRange): NodeMetrics {
  return { nodeId: NODE_ID, range, points: createPoints(range) }
}

function createPoints(
  range: MetricsRange,
  count?: number,
  latestTimestamp = LATEST_TIMESTAMP,
): NodeMetrics['points'] {
  const rangeCase = RANGE_CASES.find((candidate) => candidate.range === range)

  if (rangeCase === undefined) {
    throw new Error(`Unsupported range: ${range}`)
  }

  const sampleCount = count ?? rangeCase.sampleCount
  const latestInstant = Date.parse(latestTimestamp)

  return Array.from({ length: sampleCount }, (_, index) => ({
    timestamp: new Date(
      latestInstant - (sampleCount - index - 1) * rangeCase.cadenceMs,
    ).toISOString(),
    latencyMs: 10 + index,
    packetLossPercent: index / 10,
  }))
}

function replacePoint(
  points: NodeMetrics['points'],
  index: number,
  changes: Record<string, unknown>,
): NodeMetrics['points'] {
  return points.map((point, pointIndex) =>
    pointIndex === index ? { ...point, ...changes } : point,
  ) as NodeMetrics['points']
}

function formatTimestampWithOffset(timestamp: string, offsetMinutes: number): string {
  const offsetDirection = offsetMinutes >= 0 ? '+' : '-'
  const absoluteOffset = Math.abs(offsetMinutes)
  const localTimestamp = new Date(Date.parse(timestamp) + offsetMinutes * 60 * 1000)
    .toISOString()
    .replace(/Z$/, '')
  const offsetHours = Math.floor(absoluteOffset / 60)
    .toString()
    .padStart(2, '0')
  const offsetRemainderMinutes = (absoluteOffset % 60).toString().padStart(2, '0')

  return `${localTimestamp}${offsetDirection}${offsetHours}:${offsetRemainderMinutes}`
}
