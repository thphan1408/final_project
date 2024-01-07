import { lazy, Suspense } from 'react'
import { Outlet, Navigate, useRoutes } from 'react-router-dom'

import DashboardLayout from '../layouts/dashboard'

import ProjectDetail from '../pages/project-detail-page'

export const IndexPage = lazy(() => import('../pages/app'))
// export const ProjectDetail = lazy(() => import('../pages/project-detail-page'))
export const UserPage = lazy(() => import('../pages/user'))
export const Project = lazy(() => import('../pages/project'))
export const Profile = lazy(() => import('../pages/profile'))
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
        { path: 'project', element: <Project /> },
        { path: 'user', element: <UserPage /> },
        { path: 'profile', element: <Profile /> },
        { path: `project-detail/:id`, element: <ProjectDetail /> },
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
