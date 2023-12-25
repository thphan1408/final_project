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