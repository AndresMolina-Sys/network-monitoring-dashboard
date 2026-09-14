import type { NetworkNode, NodeMetrics } from '../domain/network'

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

type FixtureNodeMetrics = {
  readonly [NodeId in FixtureNodeId]: Omit<NodeMetrics, 'nodeId'> & {
    readonly nodeId: NodeId
  }
}

const NETWORK_NODE_METRICS_FIXTURE = {
  'core-router': {
    nodeId: 'core-router',
    range: '1h',
    points: [
      {
        timestamp: '2026-09-13T17:00:00Z',
        latencyMs: 18,
        packetLossPercent: 0,
      },
      {
        timestamp: '2026-09-13T17:20:00Z',
        latencyMs: 20,
        packetLossPercent: 0,
      },
      {
        timestamp: '2026-09-13T17:40:00Z',
        latencyMs: 17,
        packetLossPercent: 0.2,
      },
      {
        timestamp: '2026-09-13T18:00:00Z',
        latencyMs: 19,
        packetLossPercent: 0,
      },
    ],
  },
  'access-switch-01': {
    nodeId: 'access-switch-01',
    range: '1h',
    points: [
      {
        timestamp: '2026-09-13T17:00:00Z',
        latencyMs: 34,
        packetLossPercent: 0,
      },
      {
        timestamp: '2026-09-13T17:20:00Z',
        latencyMs: 35,
        packetLossPercent: 0.5,
      },
      {
        timestamp: '2026-09-13T17:40:00Z',
        latencyMs: 40,
        packetLossPercent: 1.2,
      },
      {
        timestamp: '2026-09-13T18:00:00Z',
        latencyMs: 38,
        packetLossPercent: 0.6,
      },
    ],
  },
  'branch-gateway': {
    nodeId: 'branch-gateway',
    range: '1h',
    points: [
      {
        timestamp: '2026-09-13T17:00:00Z',
        latencyMs: 125,
        packetLossPercent: 2.5,
      },
      {
        timestamp: '2026-09-13T17:20:00Z',
        latencyMs: 140,
        packetLossPercent: 3,
      },
      {
        timestamp: '2026-09-13T17:40:00Z',
        latencyMs: 152,
        packetLossPercent: 4.2,
      },
      {
        timestamp: '2026-09-13T18:00:00Z',
        latencyMs: 148,
        packetLossPercent: 3.1,
      },
    ],
  },
} satisfies FixtureNodeMetrics

export const NETWORK_NODE_METRICS: Readonly<Record<string, NodeMetrics>> =
  NETWORK_NODE_METRICS_FIXTURE
