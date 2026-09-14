import { useNetworkNodes } from '../hooks/use-network-nodes'
import { NetworkNodeCard } from './network-node-card'
import { NetworkNodesEmptyState } from './network-nodes-empty-state'
import { NetworkNodesErrorState } from './network-nodes-error-state'
import { NetworkNodesSkeleton } from './network-nodes-skeleton'

export function NetworkNodesPanel() {
  const { status, nodes, retry } = useNetworkNodes()

  if (status === 'loading') {
    return <NetworkNodesSkeleton />
  }

  if (status === 'error') {
    return <NetworkNodesErrorState onRetry={retry} />
  }

  if (status === 'empty') {
    return <NetworkNodesEmptyState />
  }

  return (
    <section className="network-nodes-panel" aria-labelledby="network-nodes-title">
      <header>
        <p>Network monitoring</p>
        <h2 id="network-nodes-title">Monitored nodes</h2>
      </header>

      <div className="network-node-grid">
        {nodes.map((node) => (
          <NetworkNodeCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  )
}
