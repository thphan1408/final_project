import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ProjectView } from '../sections/list-project/view'

const Project = () => {
  return (
    <>
      <Helmet>Project</Helmet>
      <ProjectView />
    </>
  )
}

export default Project
