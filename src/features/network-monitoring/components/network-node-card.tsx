import { Link } from 'react-router'
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
  const cardClassName = ['network-node-card', `network-node-card--${node.status}`].join(' ')

  return (
    <Link
      to={`/nodes/${node.id}`}
      className="network-node-card-link"
      aria-label={`View metrics for ${node.name}`}
    >
      <article className={cardClassName} aria-labelledby={titleId}>
        <header className="network-node-card__header">
          <div>
            <p className="network-node-card__eyebrow">
              Node / <span>{node.id}</span>
            </p>

            <h3 className="network-node-card__title" id={titleId}>
              {node.name}
            </h3>
          </div>

          <span className={statusClassName} data-status={node.status}>
            <span className="network-node-card__status-mark" aria-hidden="true" />
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

        <span className="network-node-card__action" aria-hidden="true">
          Open metrics
        </span>
      </article>
    </Link>
  )
}
