import React from 'react'
import { Helmet } from 'react-helmet-async'
import { ProjectDetail } from '../sections/project-detail'

const ProjectDetailPage = () => {
  return (
    <>
      <Helmet>Project detail</Helmet>
      <ProjectDetail />
    </>
  )
}

export default ProjectDetailPage
