import { Link } from 'react-router'

interface NetworkNodeNotFoundStateProps {
  readonly nodeId: string
}

export function NetworkNodeNotFoundState({ nodeId }: NetworkNodeNotFoundStateProps) {
  const titleId = 'network-node-not-found-title'

  return (
    <section className="network-node-state network-node-state--not-found" aria-labelledby={titleId}>
      <p className="network-node-state__eyebrow">Network node</p>

      <h2 id={titleId}>Node not found</h2>

      <p>
        We could not find a monitored node with the identifier <code>{nodeId}</code>.
      </p>

      <Link to="/">Back to dashboard</Link>
    </section>
  )
}
