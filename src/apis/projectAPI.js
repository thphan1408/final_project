import fetcher from './fetcher'

export const getAllProjectAPI = async () => {
  try {
    const response = await fetcher.get('/Project/getAllProject')
    return response.data.content
  } catch (error) {
    throw error
  }
}

export const createProjectAPI = async (values) => {
  try {
    const response = await fetcher.post(
      `/Project/createProjectAuthorize`,
      values
    )
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 500) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          status: 500,
          message: errorData.content || 'Create project failed',
        }
      }
    }
    throw { status: 500, message: 'Unexpected error occurred' }
  }
}

export const deleteProjectAPI = async (projectId) => {
  try {
    const response = await fetcher.delete(`/Project/deleteProject`, {
      params: {
        projectId: projectId,
      },
    })
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          status: 500,
          content: errorData.content,
          message: errorData.message || 'Delete project failed',
        }
      }
    }
  }
}
