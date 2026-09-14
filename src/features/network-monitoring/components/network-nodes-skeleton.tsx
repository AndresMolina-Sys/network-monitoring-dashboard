const SKELETON_ITEMS = ['skeleton-1', 'skeleton-2', 'skeleton-3'] as const

export function NetworkNodesSkeleton() {
  return (
    <section aria-busy="true" aria-label="Network nodes">
      <p role="status">Loading network nodes...</p>

      <div className="network-node-grid" aria-hidden="true">
        {SKELETON_ITEMS.map((item) => (
          <article className="network-node-card network-node-card--skeleton" key={item}>
            <div className="skeleton skeleton--eyebrow" />
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" />
          </article>
        ))}
      </div>
    </section>
  )
}
