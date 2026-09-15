import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { networkMonitoringService } from '../../../services'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { NodeLatencyChart } from '../components/node-latency-chart'
import { NetworkNodeNotFoundState } from '../components/network-node-not-found-state'
import { useNetworkNode } from '../hooks/use-network-node'
import { useNodeMetrics } from '../hooks/use-node-metrics'

interface NetworkNodeDetailsPageProps {
  readonly service?: NetworkMonitoringService
}

export function NetworkNodeDetailsPage({
  service = networkMonitoringService,
}: NetworkNodeDetailsPageProps) {
  const { nodeId = 'unknown' } = useParams()

  const { status: nodeStatus, retry: retryNode } = useNetworkNode(nodeId, service)

  const {
    status: metricsStatus,
    metrics,
    retry: retryMetrics,
  } = useNodeMetrics(nodeId, '1h', service)

  const retry = useCallback(() => {
    retryNode()
    retryMetrics()
  }, [retryMetrics, retryNode])

  const isNotFound = nodeStatus === 'not-found' || metricsStatus === 'not-found'

  const hasError = nodeStatus === 'error' || metricsStatus === 'error'

  const isLoading = nodeStatus === 'loading' || metricsStatus === 'loading'

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/">Back to dashboard</Link>
        <p className="app-eyebrow">Network node</p>
        <h1>Node details</h1>
        <p>
          Review health and performance for <code>{nodeId}</code>.
        </p>
      </header>

      {isNotFound && <NetworkNodeNotFoundState nodeId={nodeId} />}

      {!isNotFound && hasError && (
        <section className="network-node-state" role="alert" aria-labelledby="metrics-error-title">
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
          className="network-node-state"
          role="status"
          aria-labelledby="metrics-loading-title"
        >
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-loading-title">Loading node metrics...</h2>
        </section>
      )}

      {!isNotFound && !hasError && !isLoading && metricsStatus === 'empty' && (
        <section className="network-node-state" role="status" aria-labelledby="metrics-empty-title">
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
      metrics ? (
        <section className="network-metrics" aria-labelledby="metrics-title">
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-title">Last hour performance ({metrics.range})</h2>

          <NodeLatencyChart metrics={metrics} />

          <table>
            <caption>Latency and packet loss measurements for {nodeId}</caption>
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
        </section>
      ) : null}
    </main>
  )
}
