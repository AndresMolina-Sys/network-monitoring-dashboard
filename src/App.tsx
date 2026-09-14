import './App.css'
import { NetworkNodesPanel } from './features/network-monitoring/components/network-nodes-panel'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">Operations workspace</p>

        <h1>Network Monitoring Dashboard</h1>

        <p>Track network availability and performance across monitored devices.</p>
      </header>

      <NetworkNodesPanel />
    </main>
  )
}

export default App
