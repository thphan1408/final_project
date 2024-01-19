import fetcher from './fetcher'

export const getAllCommentAPI = async (taskId) => {
  try {
    const response = await fetcher.get('Comment/getAll', {
      params: {
        taskId,
      },
    })

    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Lấy danh sách comment thất bại' }
      }
    }
  }
}

export const insertCommentAPI = async (payload) => {
  try {
    const response = await fetcher.post('Comment/insertComment', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Gửi comment thất bại' }
      }
    }
  }
}

export const updateCommentAPI = async (payload) => {
  const { contentComment, id } = payload
  console.log('payload update: ', payload)

  try {
    const response = await fetcher.put(
      `Comment/updateComment?id=${id}&contentComment=${contentComment}`
    )
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Update comment thất bại' }
      }
    }
  }
}

export const deleteCommentAPI = async (idComment) => {
  try {
    const response = await fetcher.delete('Comment/deleteComment', {
      params: {
        idComment,
      },
    })
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Xóa comment thất bại' }
      }
    }
  }
}
