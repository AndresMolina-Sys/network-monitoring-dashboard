import { createBrowserRouter, Link, useSearchParams } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App'
import { NotFoundPage } from './not-found-page'

const appRoutes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/nodes/:nodeId',
    hydrateFallbackElement: (
      <main className="app-shell">
        <section
          className="network-node-state network-node-state--loading"
          role="status"
          aria-busy="true"
        >
          <p className="network-node-state__eyebrow">Network node</p>
          <h2>Loading node details...</h2>
        </section>
      </main>
    ),
    lazy: async () => {
      const { NetworkNodeDetailsPage } =
        await import('../features/network-monitoring/pages/network-node-details-page')

      return {
        Component: NetworkNodeDetailsPage,
      }
    },
  },
  {
    path: '/compare',
    hydrateFallbackElement: <ComparisonRouteFallback />,
    lazy: async () => {
      const { NetworkNodeComparisonPage } =
        await import('../features/network-monitoring/pages/network-node-comparison-page')

      function NetworkNodeComparisonRoute() {
        const [searchParams] = useSearchParams()
        const nodeIds = parseSelectedNodeIds(searchParams)

        if (!nodeIds) {
          return <InvalidComparisonSelection />
        }

        return <NetworkNodeComparisonPage nodeIds={nodeIds} />
      }

      return {
        Component: NetworkNodeComparisonRoute,
      }
    },
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

const router = createBrowserRouter(appRoutes)

export function AppRouter() {
  return <RouterProvider router={router} />
}

export function ComparisonRouteFallback() {
  return (
    <main className="app-shell">
      <section
        className="network-node-state network-node-state--loading"
        role="status"
        aria-label="Loading node comparison"
        aria-busy="true"
      >
        <p className="network-node-state__eyebrow">Network comparison</p>
        <h1>Loading node comparison...</h1>
        <p className="network-metrics__data-label">Simulated data</p>
      </section>
    </main>
  )
}

function parseSelectedNodeIds(searchParams: URLSearchParams): string[] | null {
  const nodeIds = searchParams
    .getAll('nodes')
    .flatMap((value) => value.split(',').map((nodeId) => nodeId.trim()))

  if (
    nodeIds.length < 2 ||
    nodeIds.length > 3 ||
    nodeIds.some((nodeId) => nodeId.length === 0) ||
    new Set(nodeIds).size !== nodeIds.length
  ) {
    return null
  }

  return nodeIds
}

function InvalidComparisonSelection() {
  return (
    <main className="app-shell">
      <section
        className="network-node-state"
        role="status"
        aria-labelledby="comparison-selection-title"
      >
        <p className="network-node-state__eyebrow">Node comparison</p>
        <h1 id="comparison-selection-title">Select 2 or 3 nodes to compare</h1>
        <p>Return to the dashboard and select two or three different nodes.</p>
        <Link to="/">Back to dashboard</Link>
      </section>
    </main>
  )
}
