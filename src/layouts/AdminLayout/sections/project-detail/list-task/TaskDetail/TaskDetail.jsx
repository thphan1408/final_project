import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getTaskDetailAPI } from '../../../../../../apis/taskAPI'

const TaskDetail = ({ taskId }) => {
  const { data } = useQuery({
    queryKey: ['get-task-detail-by-id', taskId],
    queryFn: () => getTaskDetailAPI(taskId),
    enabled: !!taskId,
  })

  console.log('data:', data)

  return <div>TaskDetail</div>
}

export default TaskDetail
