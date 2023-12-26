import React, { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PATH } from './routes/path'
import UserLayout from './layouts/UserLayout'
import SignIn from './modules/Auth/SignIn/SignIn'
import SignUp from './modules/Auth/SignUp/SignUp'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={PATH.ROOT} element={<SignIn />} />
          <Route path={PATH.SIGN_UP} element={<SignUp />} />
          <Route path={PATH.DASHBOARD} element={<UserLayout />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
