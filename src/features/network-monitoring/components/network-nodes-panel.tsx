import { useState } from 'react'
import type { NodeStatus } from '../../../domain/network'
import type { NetworkMonitoringService } from '../../../services/network-monitoring-service'
import { useNetworkNodes } from '../hooks/use-network-nodes'
import { NetworkNodeCard } from './network-node-card'
import { NetworkNodesEmptyState } from './network-nodes-empty-state'
import { NetworkNodesErrorState } from './network-nodes-error-state'
import { NetworkNodesSkeleton } from './network-nodes-skeleton'

interface NetworkNodesPanelProps {
  readonly service?: NetworkMonitoringService
}

type StatusFilter = NodeStatus | 'all'

export function NetworkNodesPanel({ service }: NetworkNodesPanelProps = {}) {
  const { status, nodes, retry } = useNetworkNodes(service)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  if (status === 'loading') {
    return <NetworkNodesSkeleton />
  }

  if (status === 'error') {
    return <NetworkNodesErrorState onRetry={retry} />
  }

  if (status === 'empty') {
    return <NetworkNodesEmptyState />
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredNodes = nodes.filter((node) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [node.name, node.id, node.address, node.location].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      )
    const matchesStatus = statusFilter === 'all' || node.status === statusFilter

    return matchesQuery && matchesStatus
  })

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

      <div className="network-nodes-panel__filters">
        <label className="network-nodes-panel__field">
          <span>Search nodes</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Name, ID, address, or location"
          />
        </label>

        <label className="network-nodes-panel__field">
          <span>Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="all">All statuses</option>
            <option value="online">Online</option>
            <option value="degraded">Degraded</option>
            <option value="offline">Offline</option>
          </select>
        </label>

        <p className="network-nodes-panel__results" aria-live="polite" aria-atomic="true">
          Showing {filteredNodes.length} of {nodes.length} nodes
        </p>
      </div>

      {filteredNodes.length > 0 ? (
        <div className="network-node-grid">
          {filteredNodes.map((node) => (
            <NetworkNodeCard key={node.id} node={node} />
          ))}
        </div>
      ) : (
        <div className="network-nodes-panel__no-results" role="status">
          <h3>No nodes match your filters</h3>
          <p>Try a different search or status.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  )
}
