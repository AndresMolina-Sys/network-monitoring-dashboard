import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router'
import type { MetricsRange, NetworkNode } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NodeLatencyChart } from '../components/node-latency-chart'
import { NodePacketLossChart } from '../components/node-packet-loss-chart'
import { NetworkNodeNotFoundState } from '../components/network-node-not-found-state'
import { useNetworkNode } from '../hooks/use-network-node'
import { useNodeMetrics } from '../hooks/use-node-metrics'
import { formatMetricValue, summarizeMetrics } from '../metrics-summary'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const selectedRange = getMetricsRange(searchParams)
  const shareUrl = `${window.location.origin}${location.pathname}?${new URLSearchParams({
    range: selectedRange,
  }).toString()}`

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
  const metricsSummary = metrics?.points.length ? summarizeMetrics(metrics.points) : null

  useEffect(() => {
    const requestedRanges = searchParams.getAll('range')

    if (
      requestedRanges.length === 1 &&
      METRICS_RANGES.includes(requestedRanges[0] as MetricsRange)
    ) {
      return
    }

    const normalizedParams = new URLSearchParams(searchParams)
    normalizedParams.set('range', '1h')
    setSearchParams(normalizedParams, { replace: true })
  }, [searchParams, setSearchParams])

  async function copyNodeLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareStatus('copied')
    } catch {
      setShareStatus('error')
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header app-header--detail">
        <nav className="app-header__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Dashboard</Link>
          <span aria-hidden="true">/</span>
          <Link to="/">Monitored nodes</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{node?.name ?? nodeId}</span>
        </nav>

        <p className="app-eyebrow">
          Node detail{node ? ` / ${NODE_STATUS_LABELS[node.status]}` : ''}
        </p>

        <h1>
          {node?.name ?? 'Node details'}
          {node ? <code className="app-header__node-id">{node.id}</code> : null}
        </h1>

        {node ? (
          <dl className="app-header__node-meta" aria-label="Node metadata">
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
        ) : null}
      </header>

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
                  onClick={() => {
                    const nextParams = new URLSearchParams(searchParams)
                    nextParams.set('range', range)
                    setSearchParams(nextParams, { replace: true })
                    setShareStatus('idle')
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
            <p className="network-metrics__data-label">Simulated data</p>
            <button className="network-metrics__copy-link" type="button" onClick={copyNodeLink}>
              Copy node link
            </button>
            {shareStatus !== 'idle' ? (
              <div className="network-metrics__share-feedback">
                <p role="status" aria-live="polite">
                  {shareStatus === 'copied'
                    ? 'Node link copied.'
                    : 'Could not copy automatically. Select and copy the node link below.'}
                </p>
                {shareStatus === 'error' ? (
                  <label>
                    Node link
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      onFocus={(event) => event.currentTarget.select()}
                      onClick={(event) => event.currentTarget.select()}
                    />
                  </label>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {isNotFound && <NetworkNodeNotFoundState nodeId={nodeId} />}

      {!isNotFound && hasError && (
        <section
          className="network-node-state network-node-state--metrics network-node-state--error"
          role="alert"
          aria-labelledby="metrics-error-title"
        >
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-error-title">Unable to load node metrics</h2>
          <p>We could not retrieve metrics for this node. Check the connection and try again.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </section>
      )}

      {!isNotFound && !hasError && isLoading && (
        <section
          className="network-node-state network-node-state--metrics network-node-state--loading"
          role="status"
          aria-labelledby="metrics-loading-title"
          aria-busy="true"
        >
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-loading-title">Loading node metrics...</h2>
        </section>
      )}

      {!isNotFound && !hasError && !isLoading && metricsStatus === 'empty' && (
        <section
          className="network-node-state network-node-state--metrics network-node-state--empty"
          role="status"
          aria-labelledby="metrics-empty-title"
        >
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-empty-title">No metrics available</h2>
          <p>There are no data points available for this node in the selected range.</p>
        </section>
      )}

      {!isNotFound &&
      !hasError &&
      !isLoading &&
      nodeStatus === 'success' &&
      metricsStatus === 'success' &&
      metrics &&
      metricsSummary ? (
        <section className="network-metrics" aria-labelledby="metrics-title">
          <div className="network-metrics__heading">
            <h2 id="metrics-title">{getMetricsHeading(selectedRange)}</h2>
          </div>

          <dl className="network-metrics__summary" aria-label="Metrics summary">
            <div>
              <dt>Latest latency</dt>
              <dd>{formatMetricValue(metricsSummary.latestLatencyMs)} ms</dd>
            </div>
            <div>
              <dt>Average latency</dt>
              <dd>{formatMetricValue(metricsSummary.averageLatencyMs)} ms</dd>
            </div>
            <div>
              <dt>Peak packet loss</dt>
              <dd>{formatMetricValue(metricsSummary.peakPacketLossPercent)}%</dd>
            </div>
          </dl>

          <div className="network-metrics__visuals">
            <NodeLatencyChart metrics={metrics} />
            <div className="network-metrics__packet-loss-column">
              <NodePacketLossChart metrics={metrics} />
              <aside
                className="network-metrics__annotation"
                aria-label="Peak packet loss observation"
              >
                <span className="network-metrics__annotation-label">
                  Observed sample · {formatMetricTime(metricsSummary.peakPacketLossPoint.timestamp)}{' '}
                  UTC
                </span>
                <strong>
                  {formatMetricValue(metricsSummary.peakPacketLossPercent)}% packet loss
                </strong>
                <p>Highest loss in this selected period.</p>
                <time dateTime={metricsSummary.peakPacketLossPoint.timestamp}>
                  {metricsSummary.peakPacketLossPoint.timestamp}
                </time>
              </aside>
            </div>
          </div>

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

function getMetricsRange(searchParams: URLSearchParams): MetricsRange {
  const ranges = searchParams.getAll('range')
  return ranges.length === 1 && METRICS_RANGES.includes(ranges[0] as MetricsRange)
    ? (ranges[0] as MetricsRange)
    : '1h'
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

function formatMetricTime(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp))
}

function formatNodeDate(timestamp: string): string {
  return `${new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(timestamp))} UTC`
}
