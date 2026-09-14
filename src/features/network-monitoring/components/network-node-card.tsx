import type { NetworkNode } from '../../../domain/network'

interface NetworkNodeCardProps {
  readonly node: NetworkNode
}

const STATUS_LABELS: Record<NetworkNode['status'], string> = {
  online: 'Online',
  degraded: 'Degraded',
  offline: 'Offline',
}

export function NetworkNodeCard({ node }: NetworkNodeCardProps) {
  const titleId = `network-node-${node.id}`

  return (
    <article aria-labelledby={titleId}>
      <header>
        <div>
          <p>Network node</p>
          <h3 id={titleId}>{node.name}</h3>
        </div>

        <span data-status={node.status}>{STATUS_LABELS[node.status]}</span>
      </header>

      <dl>
        <div>
          <dt>Address</dt>
          <dd>
            <code>{node.address}</code>
          </dd>
        </div>

        <div>
          <dt>Location</dt>
          <dd>{node.location}</dd>
        </div>

        <div>
          <dt>Last checked</dt>
          <dd>
            <time dateTime={node.lastCheckedAt}>{node.lastCheckedAt}</time>
          </dd>
        </div>
      </dl>
    </article>
  )
}
