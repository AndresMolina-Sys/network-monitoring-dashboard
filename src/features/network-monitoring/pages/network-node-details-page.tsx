import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { MetricsRange, NetworkNode } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NodeLatencyChart } from '../components/node-latency-chart'
import { NodePacketLossChart } from '../components/node-packet-loss-chart'
import { NetworkNodeNotFoundState } from '../components/network-node-not-found-state'
import { useNetworkNode } from '../hooks/use-network-node'
import { useNodeMetrics } from '../hooks/use-node-metrics'

interface NetworkNodeDetailsPageProps {
  readonly service?: NetworkMonitoringService
}

const NODE_STATUS_LABELS: Record<NetworkNode['status'], string> = {
  online: 'Online',
  degraded: 'Degraded',
  offline: 'Offline',
}

const METRICS_RANGES: readonly MetricsRange[] = ['1h', '24h', '7d']

export function NetworkNodeDetailsPage({
  service = networkMonitoringService,
}: NetworkNodeDetailsPageProps) {
  const { nodeId = 'unknown' } = useParams()
  const [selectedRange, setSelectedRange] = useState<MetricsRange>('1h')

  const { status: nodeStatus, node, retry: retryNode } = useNetworkNode(nodeId, service)

  const {
    status: metricsStatus,
    metrics,
    retry: retryMetrics,
  } = useNodeMetrics(nodeId, selectedRange, service)

  const retry = useCallback(() => {
    retryNode()
    retryMetrics()
  }, [retryMetrics, retryNode])

  const isNotFound = nodeStatus === 'not-found' || metricsStatus === 'not-found'
  const hasError = nodeStatus === 'error' || metricsStatus === 'error'
  const isLoading = nodeStatus === 'loading' || metricsStatus === 'loading'

  return (
    <main className="app-shell">
      <header className="app-header app-header--detail">
        <div className="app-header__topline">
          <Link className="network-node-back-link" to="/">
            Back to dashboard
          </Link>
          <p className="app-eyebrow">Network node</p>
        </div>

        <h1>Node details</h1>

        <p className="app-header__lede">
          Review health and performance for <code>{nodeId}</code>.
        </p>
      </header>

      {nodeStatus === 'success' && node ? (
        <section className="network-node-summary" aria-labelledby="node-summary-title">
          <div className="network-node-summary__heading">
            <p className="network-node-state__eyebrow">Node overview</p>
            <h2 id="node-summary-title">{node.name}</h2>
          </div>

          <dl className="network-node-summary__details">
            <div>
              <dt>Status</dt>
              <dd>
                <span
                  className={[
                    'network-node-summary__status',
                    `network-node-summary__status--${node.status}`,
                  ].join(' ')}
                  data-status={node.status}
                >
                  <span className="network-node-summary__status-mark" aria-hidden="true" />
                  {NODE_STATUS_LABELS[node.status]}
                </span>
              </dd>
            </div>

            <div>
              <dt>Address</dt>
              <dd>
                <code>{node.address}</code>
              </dd>
            </div>

            <div>
              <dt>Location</dt>
              <dd>{node.location}</dd>
            </div>

            <div>
              <dt>Last checked</dt>
              <dd>
                <time dateTime={node.lastCheckedAt}>{formatNodeDate(node.lastCheckedAt)}</time>
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {!isNotFound && (
        <div className="network-metrics__toolbar">
          <p className="network-node-state__eyebrow">Network metrics</p>
          <div className="network-metrics__controls">
            <div
              className="network-metrics__range-selector"
              role="group"
              aria-label="Metrics range"
            >
              {METRICS_RANGES.map((range) => (
                <button
                  key={range}
                  className="network-metrics__range-button"
                  type="button"
                  aria-pressed={selectedRange === range}
                  onClick={() => setSelectedRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            <p className="network-metrics__data-label">Simulated data</p>
          </div>
        </div>
      )}

      {isNotFound && <NetworkNodeNotFoundState nodeId={nodeId} />}

      {!isNotFound && hasError && (
        <section
          className="network-node-state network-node-state--metrics"
          role="alert"
          aria-labelledby="metrics-error-title"
        >
          <h2 id="metrics-error-title">Unable to load node metrics</h2>
          <p>We could not retrieve metrics for this node. Check the connection and try again.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </section>
      )}

      {!isNotFound && !hasError && isLoading && (
        <section
          className="network-node-state network-node-state--metrics"
          role="status"
          aria-labelledby="metrics-loading-title"
        >
          <h2 id="metrics-loading-title">Loading node metrics...</h2>
        </section>
      )}

      {!isNotFound && !hasError && !isLoading && metricsStatus === 'empty' && (
        <section
          className="network-node-state network-node-state--metrics"
          role="status"
          aria-labelledby="metrics-empty-title"
        >
          <h2 id="metrics-empty-title">No metrics available</h2>
          <p>There are no data points available for this node in the selected range.</p>
        </section>
      )}

      {!isNotFound &&
      !hasError &&
      !isLoading &&
      nodeStatus === 'success' &&
      metricsStatus === 'success' &&
      metrics ? (
        <section className="network-metrics" aria-labelledby="metrics-title">
          <div className="network-metrics__heading">
            <h2 id="metrics-title">{getMetricsHeading(selectedRange)}</h2>
          </div>

          <NodeLatencyChart metrics={metrics} />
          <NodePacketLossChart metrics={metrics} />

          <div className="network-metrics__table-wrapper">
            <table>
              <caption>
                Full data for both charts: latency and packet loss measurements for {nodeId} (
                {selectedRange})
              </caption>
              <thead>
                <tr>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Latency</th>
                  <th scope="col">Packet loss</th>
                </tr>
              </thead>
              <tbody>
                {metrics.points.map((point) => (
                  <tr key={point.timestamp}>
                    <td>
                      <time dateTime={point.timestamp}>{point.timestamp}</time>
                    </td>
                    <td>{point.latencyMs} ms</td>
                    <td>{point.packetLossPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function getMetricsHeading(range: MetricsRange): string {
  switch (range) {
    case '1h':
      return 'Last hour performance (1h)'
    case '24h':
      return 'Last 24 hours performance (24h)'
    case '7d':
      return 'Last 7 days performance (7d)'
  }
}

function formatNodeDate(timestamp: string): string {
  return `${new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(timestamp))} UTC`
}
