import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNetworkNodes } from '../hooks/use-network-nodes'
import { NetworkNodeCard } from './network-node-card'
import { NetworkNodesEmptyState } from './network-nodes-empty-state'
import { NetworkNodesErrorState } from './network-nodes-error-state'
import { NetworkNodesSkeleton } from './network-nodes-skeleton'

interface NetworkNodesPanelProps {
  readonly service?: NetworkMonitoringService
}

export function NetworkNodesPanel({ service }: NetworkNodesPanelProps = {}) {
  const { status, nodes, retry } = useNetworkNodes(service)

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
      <header className="network-nodes-panel__header">
        <div>
          <p className="network-nodes-panel__kicker">Operations inventory</p>
          <h2 id="network-nodes-title">Monitored nodes</h2>
        </div>

        <p className="network-nodes-panel__summary">
          {String(nodes.length).padStart(2, '0')} endpoints / last hour
        </p>
      </header>

      <div className="network-node-grid">
        {nodes.map((node) => (
          <NetworkNodeCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  )
}
