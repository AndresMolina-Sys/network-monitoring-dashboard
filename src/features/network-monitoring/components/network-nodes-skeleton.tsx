const SKELETON_ITEMS = ['skeleton-1', 'skeleton-2', 'skeleton-3'] as const

export function NetworkNodesSkeleton() {
  return (
    <section
      className="network-node-state network-node-state--loading"
      aria-busy="true"
      aria-label="Network nodes"
    >
      <p className="network-node-state__eyebrow">Operations inventory</p>
      <p role="status">Loading network nodes...</p>

      <div className="network-node-list" aria-hidden="true">
        {SKELETON_ITEMS.map((item) => (
          <article className="network-node-card network-node-card--skeleton" key={item}>
            <div className="network-node-card__identity">
              <div className="skeleton skeleton--eyebrow" />
              <div className="skeleton skeleton--title" />
            </div>

            <div className="network-node-card__details" aria-hidden="true">
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" />
            </div>

            <div className="skeleton skeleton--action" />
          </article>
        ))}
      </div>
    </section>
  )
}
