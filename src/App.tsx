import './App.css'
import { NetworkNodesPanel } from './features/network-monitoring/components/network-nodes-panel'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header__topline">
          <p className="app-eyebrow">Network operations</p>
          <p className="app-header__signal">
            <span aria-hidden="true" />
            Live inventory
          </p>
        </div>

        <h1>Network Monitoring Dashboard</h1>

        <p className="app-header__lede">Know which link is slipping before it becomes an outage.</p>

        <ul className="app-header__meta" aria-label="Dashboard capabilities">
          <li>Availability</li>
          <li>Latency</li>
          <li>Packet loss</li>
        </ul>
      </header>

      <NetworkNodesPanel />
    </main>
  )
}

export default App
