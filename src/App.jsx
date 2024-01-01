import React, { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from './constants/path'
import SignIn from './modules/Auth/SignIn/SignIn'
import SignUp from './modules/Auth/SignUp/SignUp'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DefaultLayout from './layouts/DefaultLayout'
import AdminLayout from './layouts/AdminLayout/AdminApp'
import { UserProvider } from './context/UserContext/UserContext'
import NotFound from './modules/Error/NotFound'
import { Project } from './layouts/AdminLayout/routes/sections'
import UserPage from './layouts/AdminLayout/pages/user'
import useRouteElement from './routes/useRouteElement'

function App() {
  const routeElement = useRouteElement()
  return (
    <>
      {routeElement}
      <ToastContainer />
    </>
  )
}

export default App
