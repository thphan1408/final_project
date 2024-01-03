import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ProfileView } from '../sections/profile'

const Profile = () => {
  return (
    <>
      <Helmet>Profile</Helmet>
      <ProfileView />
    </>
  )
}

export default Profile
