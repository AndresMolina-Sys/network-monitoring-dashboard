import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import App from '../App'
import { NetworkNodeDetailsPage } from '../features/network-monitoring/pages/network-node-details-page'
import { NotFoundPage } from './not-found-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/nodes/:nodeId',
    element: <NetworkNodeDetailsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
