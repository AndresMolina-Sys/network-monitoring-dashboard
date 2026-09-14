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
  const statusClassName = [
    'network-node-card__status',
    `network-node-card__status--${node.status}`,
  ].join(' ')

  return (
    <article className="network-node-card" aria-labelledby={titleId}>
      <header className="network-node-card__header">
        <div>
          <p className="network-node-card__eyebrow">Network node</p>

          <h3 className="network-node-card__title" id={titleId}>
            {node.name}
          </h3>
        </div>

        <span className={statusClassName} data-status={node.status}>
          {STATUS_LABELS[node.status]}
        </span>
      </header>

      <dl className="network-node-card__details">
        <div className="network-node-card__detail">
          <dt>Address</dt>
          <dd>
            <code>{node.address}</code>
          </dd>
        </div>

        <div className="network-node-card__detail">
          <dt>Location</dt>
          <dd>{node.location}</dd>
        </div>

        <div className="network-node-card__detail">
          <dt>Last checked</dt>
          <dd>
            <time dateTime={node.lastCheckedAt}>{node.lastCheckedAt}</time>
          </dd>
        </div>
      </dl>
    </article>
  )
}
