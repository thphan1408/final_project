import React, { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from './routes/path'
import UserLayout from './layouts/UserLayout'
import SignUp from './modules/Auth/SignUp'
const SignIn = lazy(() => import('./modules/Auth/SignIn'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATH.ROOT} element={<SignIn />} />
        <Route path={PATH.SIGN_UP} element={<SignUp />} />
        <Route path={PATH.DASHBOARD} element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
