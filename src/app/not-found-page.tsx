import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="app-shell">
      <section className="network-node-state" aria-labelledby="not-found-title">
        <p className="network-node-state__eyebrow">Page not found</p>
        <h1 id="not-found-title">This page does not exist</h1>
        <p>The address you entered does not match any available dashboard route.</p>
        <Link to="/">Return to dashboard</Link>
      </section>
    </main>
  )
}
