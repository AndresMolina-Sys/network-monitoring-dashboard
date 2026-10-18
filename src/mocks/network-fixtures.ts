import type { MetricsRange, NetworkNode, NodeMetrics } from '../domain/network'

export const NETWORK_NODES = [
  {
    id: 'core-router',
    name: 'Core Router',
    address: '10.0.0.1',
    location: 'Main office',
    status: 'online',
    lastCheckedAt: '2026-09-13T18:00:00Z',
  },
  {
    id: 'access-switch-01',
    name: 'Access Switch 01',
    address: '10.0.0.10',
    location: 'Main office',
    status: 'degraded',
    lastCheckedAt: '2026-09-13T17:58:00Z',
  },
  {
    id: 'branch-gateway',
    name: 'Branch Gateway',
    address: '10.10.0.1',
    location: 'Branch office',
    status: 'offline',
    lastCheckedAt: '2026-09-13T17:45:00Z',
  },
] as const satisfies readonly NetworkNode[]

type FixtureNodeId = (typeof NETWORK_NODES)[number]['id']

const FIXTURE_ANCHOR_TIMESTAMP_MS = Date.parse('2026-09-13T18:00:00Z')

const METRICS_RANGE_FIXTURES = {
  '1h': {
    sampleCount: 4,
    cadenceMs: 20 * 60 * 1000,
  },
  '24h': {
    sampleCount: 25,
    cadenceMs: 60 * 60 * 1000,
  },
  '7d': {
    sampleCount: 29,
    cadenceMs: 6 * 60 * 60 * 1000,
  },
} as const

interface HistoricalMetricsProfile {
  readonly latencyMs: number
  readonly latencyVariationMs: number
  readonly packetLossPercent: number
  readonly packetLossStepPercent: number
}

function createHistoricalMetrics(
  nodeId: FixtureNodeId,
  range: '24h' | '7d',
  profile: HistoricalMetricsProfile,
): NodeMetrics {
  const { sampleCount, cadenceMs } = METRICS_RANGE_FIXTURES[range]
  const points = Array.from({ length: sampleCount }, (_, index) => ({
    timestamp: new Date(
      FIXTURE_ANCHOR_TIMESTAMP_MS - cadenceMs * (sampleCount - index - 1),
    ).toISOString(),
    latencyMs: Math.max(0, profile.latencyMs + ((index % 9) - 4) * profile.latencyVariationMs),
    packetLossPercent:
      Math.round((profile.packetLossPercent + (index % 5) * profile.packetLossStepPercent) * 10) /
      10,
  }))

  return { nodeId, range, points }
}

const NETWORK_NODE_METRICS_BY_RANGE_FIXTURE = {
  'core-router': {
    '1h': {
      nodeId: 'core-router',
      range: '1h',
      points: [
        { timestamp: '2026-09-13T17:00:00Z', latencyMs: 18, packetLossPercent: 0 },
        { timestamp: '2026-09-13T17:20:00Z', latencyMs: 20, packetLossPercent: 0 },
        { timestamp: '2026-09-13T17:40:00Z', latencyMs: 17, packetLossPercent: 0.2 },
        { timestamp: '2026-09-13T18:00:00Z', latencyMs: 19, packetLossPercent: 0 },
      ],
    },
    '24h': createHistoricalMetrics('core-router', '24h', {
      latencyMs: 19,
      latencyVariationMs: 1,
      packetLossPercent: 0,
      packetLossStepPercent: 0.1,
    }),
    '7d': createHistoricalMetrics('core-router', '7d', {
      latencyMs: 19,
      latencyVariationMs: 1,
      packetLossPercent: 0,
      packetLossStepPercent: 0.1,
    }),
  },
  'access-switch-01': {
    '1h': {
      nodeId: 'access-switch-01',
      range: '1h',
      points: [
        { timestamp: '2026-09-13T17:00:00Z', latencyMs: 34, packetLossPercent: 0 },
        { timestamp: '2026-09-13T17:20:00Z', latencyMs: 35, packetLossPercent: 0.5 },
        { timestamp: '2026-09-13T17:40:00Z', latencyMs: 40, packetLossPercent: 1.2 },
        { timestamp: '2026-09-13T18:00:00Z', latencyMs: 38, packetLossPercent: 0.6 },
      ],
    },
    '24h': createHistoricalMetrics('access-switch-01', '24h', {
      latencyMs: 38,
      latencyVariationMs: 2,
      packetLossPercent: 0.5,
      packetLossStepPercent: 0.2,
    }),
    '7d': createHistoricalMetrics('access-switch-01', '7d', {
      latencyMs: 38,
      latencyVariationMs: 2,
      packetLossPercent: 0.5,
      packetLossStepPercent: 0.2,
    }),
  },
  'branch-gateway': {
    '1h': {
      nodeId: 'branch-gateway',
      range: '1h',
      points: [
        { timestamp: '2026-09-13T17:00:00Z', latencyMs: 125, packetLossPercent: 2.5 },
        { timestamp: '2026-09-13T17:20:00Z', latencyMs: 140, packetLossPercent: 3 },
        { timestamp: '2026-09-13T17:40:00Z', latencyMs: 152, packetLossPercent: 4.2 },
        { timestamp: '2026-09-13T18:00:00Z', latencyMs: 148, packetLossPercent: 3.1 },
      ],
    },
    '24h': createHistoricalMetrics('branch-gateway', '24h', {
      latencyMs: 145,
      latencyVariationMs: 5,
      packetLossPercent: 3,
      packetLossStepPercent: 0.4,
    }),
    '7d': createHistoricalMetrics('branch-gateway', '7d', {
      latencyMs: 145,
      latencyVariationMs: 5,
      packetLossPercent: 3,
      packetLossStepPercent: 0.4,
    }),
  },
} satisfies Readonly<Record<FixtureNodeId, Readonly<Record<MetricsRange, NodeMetrics>>>>

export const NETWORK_NODE_METRICS_BY_RANGE: Readonly<
  Record<string, Readonly<Record<MetricsRange, NodeMetrics>>>
> = NETWORK_NODE_METRICS_BY_RANGE_FIXTURE

// Preserve the existing 1h fixture export for consumers that only need the default range.
export const NETWORK_NODE_METRICS: Readonly<Record<string, NodeMetrics>> = {
  'core-router': NETWORK_NODE_METRICS_BY_RANGE_FIXTURE['core-router']['1h'],
  'access-switch-01': NETWORK_NODE_METRICS_BY_RANGE_FIXTURE['access-switch-01']['1h'],
  'branch-gateway': NETWORK_NODE_METRICS_BY_RANGE_FIXTURE['branch-gateway']['1h'],
}
