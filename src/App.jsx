import React, { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from './routes/path'
import SignIn from './modules/Auth/SignIn/SignIn'
import SignUp from './modules/Auth/SignUp/SignUp'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DefaultLayout from './layouts/DefaultLayout'
import AdminLayout from './layouts/AdminLayout/AdminApp'
import { UserProvider } from './context/UserContext/UserContext'
import NotFound from './modules/Error/NotFound'
import { Project } from './layouts/AdminLayout/routes/sections'

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path={PATH.ROOT} element={<DefaultLayout />}>
              <Route index element={<SignIn />} />
              <Route path={PATH.SIGN_UP} element={<SignUp />} />
            </Route>

            <Route path={PATH.ADMIN} element={<AdminLayout />}>
              <Route path="project" element={<Project />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </UserProvider>
    </>
  )
}

export default App
