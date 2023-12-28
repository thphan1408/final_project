import { lazy, Suspense } from 'react'
import { Outlet, Navigate, useRoutes } from 'react-router-dom'

import DashboardLayout from '../layouts/dashboard'

export const IndexPage = lazy(() => import('../pages/app'))
// export const BlogPage = lazy(() => import('../pages/blog'))
// export const UserPage = lazy(() => import('../pages/user'))
export const Project = lazy(() => import('../pages/project'))
// export const MoviePage = lazy(() => import('../pages/MovieManagement'))
// export const Page404 = lazy(() => import('../pages/page-not-found'))

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        // { path: 'user', element: <UserPage /> },
        { path: 'project', element: <Project /> },
      ],
    },
    // {
    //   path: '404',
    //   element: <Page404 />,
    // },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ])

  return routes
}
