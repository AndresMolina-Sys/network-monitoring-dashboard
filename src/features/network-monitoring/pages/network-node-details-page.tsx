import { Link, useParams } from 'react-router'

export function NetworkNodeDetailsPage() {
  const { nodeId = 'unknown' } = useParams()

  return (
    <main className="app-shell">
      <section className="network-node-state" aria-labelledby="node-details-title">
        <p className="network-node-state__eyebrow">Network node</p>
        <h1 id="node-details-title">Node details</h1>
        <p>
          Metrics for <code>{nodeId}</code> will be available in the next iteration.
        </p>
        <Link to="/">Back to dashboard</Link>
      </section>
    </main>
  )
}
