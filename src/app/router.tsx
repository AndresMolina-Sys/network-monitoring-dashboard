import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App'
import { NotFoundPage } from './not-found-page'

const router = createBrowserRouter([
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
    path: '*',
    element: <NotFoundPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
