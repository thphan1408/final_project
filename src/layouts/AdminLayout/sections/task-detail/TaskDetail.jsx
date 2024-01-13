import { Typography } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'

const TaskDetail = () => {
  const { id } = useParams()
  return (
    <div>
      {' '}
      <Typography variant="h4">Task Detail - {id}</Typography>
    </div>
  )
}

export default TaskDetail
