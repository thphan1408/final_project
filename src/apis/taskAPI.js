import fetcher from './fetcher'

export const getTaskDetailAPI = async (id) => {
  try {
    const response = await fetcher.get('/Project/getTaskDetail', {
      params: {
        taskId: id,
      },
    })
    return response.data.content
  } catch (error) {
    throw error
  }
}

export const assignUserTaskAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Project/assignUserTask', payload)
    console.log('🚀  response:', response)
    // return response.data.content
  } catch (error) {
    throw error
  }
}

export const createTaskAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Project/createTask', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          content: errorData.content,
          message: errorData.message,
        }
      }
    }
  }
}

export const removeUserTaskAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Project/removeUserFromTask', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          content: errorData.content,
          message: errorData.message,
        }
      }
    }
  }
}

export const removeTaskAPI = async (id) => {
  try {
    const response = await fetcher.delete('/Project/removeTask', {
      params: {
        taskId: id,
      },
    })
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          content: errorData.content,
          message: errorData.message,
        }
      }
    }
  }
}

export const updateTaskAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Project/updateTask', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          content: errorData.content,
          message: errorData.message,
        }
      }
    }
  }
}
