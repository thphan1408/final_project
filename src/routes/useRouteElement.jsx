import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { PATH } from '../constants/path'
import NotFound from '../modules/Error/NotFound'
import { lazy } from 'react'
import DefaultLayout from '../layouts/DefaultLayout'
import AdminApp from '../layouts/AdminLayout/AdminApp'
import { useAuth } from '../context/UserContext/UserContext'

const SignIn = lazy(() => import('../modules/Auth/SignIn/SignIn'))
const SignUp = lazy(() => import('../modules/Auth/SignUp/SignUp'))

const useRouteElement = () => {
  const { currentUser } = useAuth()

  const routes = [
    {
      path: PATH.ROOT,
      element: <DefaultLayout />,
      children: [
        {
          index: true,
          element: currentUser ? <Navigate to={PATH.ADMIN} /> : <SignIn />,
        },
        {
          path: PATH.SIGN_UP,
          element: currentUser ? <Navigate to={PATH.ROOT} /> : <SignUp />,
        },
      ],
    },
    {
      path: PATH.ADMIN,
      element: currentUser ? <AdminApp /> : <Navigate to={PATH.ROOT} />,
      children: [{ path: 'project' }, { path: 'user' }, { path: 'profile' }],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]
  return useRoutes(routes)
}

export default useRouteElement
