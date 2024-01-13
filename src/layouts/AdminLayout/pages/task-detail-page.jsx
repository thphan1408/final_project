import React from 'react'
import { Helmet } from 'react-helmet-async'
import { TaskDetail } from '../sections/task-detail'
const TaskDetailPage = () => {
  return (
    <>
      <Helmet>Task detail</Helmet>
      <TaskDetail />
    </>
  )
}

export default TaskDetailPage
