import type { MetricsRange, NetworkNode, NodeMetrics } from '../../domain/network'

interface MetricsRangeRules {
  readonly sampleCount: number
  readonly windowNanoseconds: bigint
  readonly cadenceNanoseconds: bigint
}

const METRICS_RANGE_RULES: Record<MetricsRange, MetricsRangeRules> = {
  '1h': {
    sampleCount: 4,
    windowNanoseconds: 3_600_000_000_000n,
    cadenceNanoseconds: 1_200_000_000_000n,
  },
  '24h': {
    sampleCount: 25,
    windowNanoseconds: 86_400_000_000_000n,
    cadenceNanoseconds: 3_600_000_000_000n,
  },
  '7d': {
    sampleCount: 29,
    windowNanoseconds: 604_800_000_000_000n,
    cadenceNanoseconds: 21_600_000_000_000n,
  },
}

const ISO_TIMESTAMP_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|([+-])(\d{2}):(\d{2}))$/

export function assertValidMetricsResponse(
  result: unknown,
  nodeId: NetworkNode['id'],
  range: MetricsRange,
): asserts result is NodeMetrics {
  if (!isNodeMetricsResponse(result)) {
    throw new Error('Metrics response is missing required fields')
  }

  if (result.nodeId !== nodeId || result.range !== range) {
    throw new Error('Metrics response does not match the requested node and range')
  }
}

export function assertValidMetricPoints(points: NodeMetrics['points'], range: MetricsRange): void {
  const rangeRules = METRICS_RANGE_RULES[range]

  if (points.length !== rangeRules.sampleCount) {
    throw new Error('Metrics response does not contain the expected number of samples')
  }

  const instants: bigint[] = []

  for (const point of points) {
    const instant = parseUtcInstant(point.timestamp)

    if (instant === null) {
      throw new Error('Metrics response contains an invalid timestamp')
    }

    instants.push(instant)

    if (!Number.isFinite(point.latencyMs) || point.latencyMs < 0) {
      throw new Error('Metrics response contains an invalid latency value')
    }

    if (
      !Number.isFinite(point.packetLossPercent) ||
      point.packetLossPercent < 0 ||
      point.packetLossPercent > 100
    ) {
      throw new Error('Metrics response contains an invalid packet loss value')
    }
  }

  for (let index = 1; index < instants.length; index += 1) {
    if (instants[index] <= instants[index - 1]) {
      throw new Error('Metrics timestamps must be unique and strictly chronological')
    }
  }

  const latestInstant = instants[instants.length - 1]
  const windowStart = latestInstant - rangeRules.windowNanoseconds

  for (let index = 0; index < instants.length; index += 1) {
    const instant = instants[index]
    const expectedInstant = windowStart + BigInt(index) * rangeRules.cadenceNanoseconds

    if (instant < windowStart || instant > latestInstant || instant !== expectedInstant) {
      throw new Error('Metrics timestamps do not match the selected window and cadence')
    }
  }
}

function isNodeMetricsResponse(result: unknown): result is NodeMetrics {
  if (typeof result !== 'object' || result === null) {
    return false
  }

  const candidate = result as Record<string, unknown>

  return (
    typeof candidate.nodeId === 'string' &&
    isMetricsRange(candidate.range) &&
    Array.isArray(candidate.points) &&
    Array.from(candidate.points).every(isMetricPoint)
  )
}

function isMetricPoint(point: unknown): boolean {
  if (typeof point !== 'object' || point === null) {
    return false
  }

  const candidate = point as Record<string, unknown>

  return (
    typeof candidate.timestamp === 'string' &&
    typeof candidate.latencyMs === 'number' &&
    typeof candidate.packetLossPercent === 'number'
  )
}

function isMetricsRange(range: unknown): range is MetricsRange {
  return range === '1h' || range === '24h' || range === '7d'
}

function parseUtcInstant(timestamp: string): bigint | null {
  const match = ISO_TIMESTAMP_PATTERN.exec(timestamp)

  if (match === null) {
    return null
  }

  const [
    ,
    yearText,
    monthText,
    dayText,
    hourText,
    minuteText,
    secondText,
    fractionText = '',
    ,
    offsetSign,
    offsetHourText,
    offsetMinuteText,
  ] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const hour = Number(hourText)
  const minute = Number(minuteText)
  const second = Number(secondText)

  if (hour > 23 || minute > 59 || second > 59) {
    return null
  }

  const localDate = new Date(0)
  localDate.setUTCFullYear(year, month - 1, day)
  localDate.setUTCHours(hour, minute, second, 0)

  if (
    localDate.getUTCFullYear() !== year ||
    localDate.getUTCMonth() !== month - 1 ||
    localDate.getUTCDate() !== day
  ) {
    return null
  }

  let offsetMinutes = 0

  if (offsetSign !== undefined && offsetHourText !== undefined && offsetMinuteText !== undefined) {
    const offsetHours = Number(offsetHourText)
    const offsetRemainderMinutes = Number(offsetMinuteText)

    if (
      offsetHours > 14 ||
      offsetRemainderMinutes > 59 ||
      (offsetHours === 14 && offsetRemainderMinutes !== 0)
    ) {
      return null
    }

    const offsetDirection = offsetSign === '+' ? 1 : -1
    offsetMinutes = offsetDirection * (offsetHours * 60 + offsetRemainderMinutes)
  }

  const localMilliseconds = localDate.getTime() - offsetMinutes * 60 * 1000
  const fractionalNanoseconds = BigInt(fractionText.padEnd(9, '0') || '0')

  return BigInt(localMilliseconds) * 1_000_000n + fractionalNanoseconds
}
