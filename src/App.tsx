import './App.css'
import { NetworkNodesPanel } from './features/network-monitoring/components/network-nodes-panel'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header app-header--inventory">
        <div className="app-header__topline">
          <h1 className="app-header__brand">Network operations</h1>
          <p className="app-header__signal">Simulated inventory</p>
        </div>
      </header>

      <NetworkNodesPanel />
    </main>
  )
}

export default App
