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
