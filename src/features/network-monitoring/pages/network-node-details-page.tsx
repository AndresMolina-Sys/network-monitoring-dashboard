import { Link, useParams } from 'react-router'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { networkMonitoringService } from '../../../services'
import { useNodeMetrics } from '../hooks/use-node-metrics'
import { NodeLatencyChart } from '../components/node-latency-chart'

interface NetworkNodeDetailsPageProps {
  readonly service?: NetworkMonitoringService
}

export function NetworkNodeDetailsPage({
  service = networkMonitoringService,
}: NetworkNodeDetailsPageProps) {
  const { nodeId = 'unknown' } = useParams()
  const { status, metrics, retry } = useNodeMetrics(nodeId, '1h', service)

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link to="/">Back to dashboard</Link>
        <p className="app-eyebrow">Network node</p>
        <h1>Node details</h1>
        <p>
          Review health and performance metrics for <code>{nodeId}</code>.
        </p>
      </header>

      {status === 'loading' && (
        <section
          className="network-node-state"
          role="status"
          aria-labelledby="metrics-loading-title"
        >
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-loading-title">Loading node metrics...</h2>
        </section>
      )}

      {status === 'error' && (
        <section className="network-node-state" role="alert" aria-labelledby="metrics-error-title">
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-error-title">Unable to load node metrics</h2>
          <p>We could not retrieve metrics for this node. Check the connection and try again.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </section>
      )}

      {status === 'empty' && (
        <section className="network-node-state" role="status" aria-labelledby="metrics-empty-title">
          <p className="network-node-state__eyebrow">Network metrics</p>
          <h2 id="metrics-empty-title">No metrics available</h2>
          <p>There are no data points available for this node in the selected range.</p>
        </section>
      )}

      {status === 'success' && metrics ? (
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
