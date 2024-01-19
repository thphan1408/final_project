import React, { Suspense } from 'react'
import { Header } from '../../components/header'
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  )
}

export default DefaultLayout
