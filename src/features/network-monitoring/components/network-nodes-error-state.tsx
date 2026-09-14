interface NetworkNodesErrorStateProps {
  readonly onRetry: () => void
}

export function NetworkNodesErrorState({ onRetry }: NetworkNodesErrorStateProps) {
  return (
    <section
      className="network-node-state network-node-state--error"
      role="alert"
      aria-labelledby="network-nodes-error-title"
    >
      <p className="network-node-state__eyebrow">Network nodes</p>

      <h2 id="network-nodes-error-title">Unable to load network nodes</h2>

      <p>We could not retrieve the latest monitoring data. Check the connection and try again.</p>

      <button type="button" onClick={onRetry}>
        Try again
      </button>
    </section>
  )
}
