export function NetworkNodesEmptyState() {
  return (
    <section
      className="network-node-state"
      role="status"
      aria-labelledby="network-nodes-empty-title"
    >
      <p className="network-node-state__eyebrow">Network nodes</p>

      <h2 id="network-nodes-empty-title">No network nodes found</h2>

      <p>Add a monitored device to start viewing network health and performance metrics.</p>
    </section>
  )
}
