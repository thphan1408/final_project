import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ProfileView } from '../sections/profile'

const Project = () => {
  return (
    <>
      <Helmet>Project</Helmet>
      <Helmet>Profile</Helmet>
      <ProfileView />
    </>
  )
}

export default Project
