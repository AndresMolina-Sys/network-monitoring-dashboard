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

const NODE_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const NODE_TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
})

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
        <div className="network-node-card__identity">
          <p className="network-node-card__eyebrow">
            Node / <span>{node.id}</span>
          </p>

          <h3 className="network-node-card__title" id={titleId}>
            {node.name}
          </h3>
        </div>

        <dl className="network-node-card__details">
          <div className="network-node-card__detail">
            <dt>Status</dt>
            <dd>
              <span className={statusClassName} data-status={node.status}>
                <span className="network-node-card__status-mark" aria-hidden="true" />
                {STATUS_LABELS[node.status]}
              </span>
            </dd>
          </div>

          <div className="network-node-card__detail">
            <dt>Address</dt>
            <dd>
              <code>{node.address}</code>
            </dd>
          </div>

          <div className="network-node-card__detail network-node-card__detail--location">
            <dt>Location</dt>
            <dd>{node.location}</dd>
            <dt>Last checked</dt>
            <dd>
              <time dateTime={node.lastCheckedAt}>{formatNodeDate(node.lastCheckedAt)}</time>
            </dd>
          </div>
        </dl>

        <span className="network-node-card__action" aria-hidden="true">
          Open metrics <span>↗</span>
        </span>
      </article>
    </Link>
  )
}

function formatNodeDate(timestamp: string): string {
  const date = new Date(timestamp)
  const dateLabel = NODE_DATE_FORMATTER.format(date).replace('Sept', 'Sep')
  const timeLabel = NODE_TIME_FORMATTER.format(date)

  return `${dateLabel} · ${timeLabel} UTC`
}
