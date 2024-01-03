import fetcher from './fetcher'

export const signinAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Users/signin', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content === 'Email') {
        throw { status: 404, message: 'Tài khoản email không tồn tại.' }
      } else if (errorData.message === 'Tài khoản hoặc mật khẩu không đúng !') {
        throw { status: 401, message: 'Tài khoản hoặc mật khẩu không đúng.' }
      }
    }
  }
}

export const signupAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Users/signup', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Email đã được sử dụng!' }
      }
    }
  }
}

export const getUserListAPI = async (user = '') => {
  try {
    const response = await fetcher.get('/Users/getUser', {
      params: {
        keyword: user,
      },
    })
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Lấy danh sách user thất bại' }
      }
    }
  }
}

export const deleteUserAPI = async (id) => {
  const response = await fetcher.delete('/Users/deleteUser', {
    params: { id },
  })
  return response.data.content
}

export const assignUserProjectAPI = async (payload) => {
  try {
    const response = await fetcher.post('/Project/assignUserProject', payload)
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          status: 403,
          content: errorData.content,
          message: errorData.message,
        }
      }
    }
  }
}

export const removeUserProjectAPI = async (payload) => {
  try {
    const response = await fetcher.post(
      '/Project/removeUserFromProject',
      payload
    )
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 403) {
      const errorData = error.response.data
      if (errorData.content) {
        throw {
          status: 403,
          content: errorData.content,
          message: errorData.message,
        }
      }
    }
  }
}
