import Router from './routes/sections'
import ThemeProvider from './themes'
import { useScrollToTop } from './hooks/use-scroll-to-top'
import { useAuth } from '../../context/UserContext/UserContext'
import { Navigate } from 'react-router-dom'
import { PATH } from '../../routes/path'

export default function AdminApp() {
  useScrollToTop()
  const { currentUser } = useAuth()
  if (currentUser) {
    return (
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    )
  }

  return <Navigate to={PATH.ROOT} />
}
