import { useEffect, useId, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import type { MetricsRange } from '../../../domain/network'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NodeMetricsComparisonChart } from '../components/node-metrics-comparison-chart'
import { formatMetricValue, summarizeMetrics } from '../metrics-summary'
import { useNodeComparison } from '../hooks/use-node-comparison'

interface NetworkNodeComparisonPageProps {
  readonly nodeIds: readonly string[]
  readonly service?: NetworkMonitoringService
}

const METRICS_RANGES: readonly MetricsRange[] = ['1h', '24h', '7d']
const EMPTY_NODE_NAMES: ReadonlyMap<string, string> = new Map()

interface NodeNameCatalog {
  readonly service: NetworkMonitoringService
  readonly names: ReadonlyMap<string, string>
}

export function NetworkNodeComparisonPage({
  nodeIds,
  service = networkMonitoringService,
}: NetworkNodeComparisonPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [nodeNameCatalog, setNodeNameCatalog] = useState<NodeNameCatalog | null>(null)
  const selectedRange = getMetricsRange(searchParams)
  const shareUrl = `${window.location.origin}${location.pathname}?${new URLSearchParams({
    nodes: nodeIds.join(','),
    range: selectedRange,
  }).toString()}`
  const comparison = useNodeComparison(nodeIds, selectedRange, service)
  const stateIdPrefix = useId()
  const nodeNames = nodeNameCatalog?.service === service ? nodeNameCatalog.names : EMPTY_NODE_NAMES
  const successfulNodes = comparison.nodes.flatMap((node) =>
    node.status === 'success' && node.metrics?.points.length
      ? [{ nodeId: node.nodeId, metrics: node.metrics }]
      : [],
  )
  const availableMetrics = successfulNodes.map(({ metrics }) => metrics)

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

  useEffect(() => {
    let isActive = true

    void service
      .listNodes()
      .then((nodes) => {
        if (!isActive) {
          return
        }

        const names = new Map(
          nodes.flatMap(({ id, name }) => (name.trim() ? [[id, name.trim()] as const] : [])),
        )
        setNodeNameCatalog({ service, names })
      })
      .catch(() => {
        if (isActive) {
          setNodeNameCatalog({ service, names: EMPTY_NODE_NAMES })
        }
      })

    return () => {
      isActive = false
    }
  }, [service])

  async function copyComparisonLink() {
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
          <span aria-current="page">Compare nodes</span>
        </nav>

        <p className="app-eyebrow">Network analysis</p>
        <h1>Compare nodes</h1>
        <p>Review latency and packet loss trends across the selected nodes.</p>
      </header>

      <div className="network-metrics__toolbar">
        <p className="network-node-state__eyebrow">Comparison period</p>
        <div className="network-metrics__controls">
          <div className="network-metrics__range-selector" role="group" aria-label="Metrics range">
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
          <button className="network-metrics__copy-link" type="button" onClick={copyComparisonLink}>
            Copy comparison link
          </button>
          {shareStatus !== 'idle' ? (
            <div className="network-metrics__share-feedback">
              <p role="status" aria-live="polite">
                {shareStatus === 'copied'
                  ? 'Comparison link copied.'
                  : 'Could not copy automatically. Select and copy the comparison link below.'}
              </p>
              {shareStatus === 'error' ? (
                <label>
                  Comparison link
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

      {comparison.nodes.map((node) => {
        if (node.status === 'success') {
          return null
        }

        const titleId = `${stateIdPrefix}-${node.nodeId}-${node.status}-title`

        if (node.status === 'loading') {
          return (
            <section
              key={node.nodeId}
              className="network-node-state network-node-state--metrics network-node-state--loading"
              role="status"
              aria-labelledby={titleId}
              aria-busy="true"
            >
              <p className="network-node-state__eyebrow">Network metrics</p>
              <h2 id={titleId}>Loading metrics for {node.nodeId}...</h2>
            </section>
          )
        }

        if (node.status === 'empty') {
          return (
            <section
              key={node.nodeId}
              className="network-node-state network-node-state--metrics network-node-state--empty"
              role="status"
              aria-labelledby={titleId}
            >
              <p className="network-node-state__eyebrow">Network metrics</p>
              <h2 id={titleId}>No metrics available for {node.nodeId}</h2>
              <p>There are no data points available for this node in the selected period.</p>
            </section>
          )
        }

        if (node.status === 'not-found') {
          return (
            <section
              key={node.nodeId}
              className="network-node-state network-node-state--metrics network-node-state--not-found"
              role="status"
              aria-labelledby={titleId}
            >
              <p className="network-node-state__eyebrow">Network node</p>
              <h2 id={titleId}>Node not found: {node.nodeId}</h2>
              <p>This selected node could not be found. Other available nodes remain visible.</p>
            </section>
          )
        }

        return (
          <section
            key={node.nodeId}
            className="network-node-state network-node-state--metrics network-node-state--error"
            role="alert"
            aria-labelledby={titleId}
          >
            <p className="network-node-state__eyebrow">Network metrics</p>
            <h2 id={titleId}>Unable to load metrics for {node.nodeId}</h2>
            <p>We could not retrieve this node's metrics. Other selected nodes remain available.</p>
          </section>
        )
      })}

      {successfulNodes.length > 0 ? (
        <section className="network-node-comparison-summaries" aria-label="Node metric summaries">
          {successfulNodes.map(({ nodeId, metrics }) => {
            const summary = summarizeMetrics(metrics.points)
            const titleId = `${stateIdPrefix}-${nodeId}-summary-title`
            const nodeName = nodeNames.get(nodeId)

            return (
              <article
                key={nodeId}
                className="network-node-comparison-summary"
                aria-labelledby={titleId}
              >
                <h2 id={titleId}>
                  {nodeName ? (
                    <>
                      {nodeName} <span>({nodeId})</span>
                    </>
                  ) : (
                    nodeId
                  )}
                </h2>
                <dl className="network-node-comparison-summary__metrics">
                  <div>
                    <dt>Latest latency</dt>
                    <dd>{formatMetricValue(summary.latestLatencyMs)} ms</dd>
                  </div>
                  <div>
                    <dt>Average latency</dt>
                    <dd>{formatMetricValue(summary.averageLatencyMs)} ms</dd>
                  </div>
                  <div>
                    <dt>Peak packet loss</dt>
                    <dd>{formatMetricValue(summary.peakPacketLossPercent)}%</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </section>
      ) : null}

      {availableMetrics.length > 0 ? (
        <section className="network-metrics" aria-labelledby="comparison-metrics-title">
          <div className="network-metrics__heading">
            <h2 id="comparison-metrics-title">{getComparisonHeading(selectedRange)}</h2>
          </div>

          <NodeMetricsComparisonChart metrics={availableMetrics} range={selectedRange} />

          <div className="network-metrics__table-wrapper">
            <table>
              <caption>
                Latency and packet loss measurements for selected nodes ({selectedRange})
              </caption>
              <thead>
                <tr>
                  <th scope="col">Node</th>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Latency</th>
                  <th scope="col">Packet loss</th>
                </tr>
              </thead>
              <tbody>
                {availableMetrics.flatMap((metrics) =>
                  metrics.points.map((point) => (
                    <tr key={`${metrics.nodeId}-${point.timestamp}`}>
                      <td>{metrics.nodeId}</td>
                      <td>
                        <time dateTime={point.timestamp}>{point.timestamp}</time>
                      </td>
                      <td>{point.latencyMs} ms</td>
                      <td>{point.packetLossPercent}%</td>
                    </tr>
                  )),
                )}
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

function getComparisonHeading(range: MetricsRange): string {
  switch (range) {
    case '1h':
      return 'Last hour comparison (1h)'
    case '24h':
      return 'Last 24 hours comparison (24h)'
    case '7d':
      return 'Last 7 days comparison (7d)'
  }
}
