import fetcher from './fetcher'

export const getAllPriorityAPI = async () => {
  try {
    const response = await fetcher.get('/Priority/getAll')
    return response.data.content
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorData = error.response.data
      if (errorData.content) {
        throw { status: 400, message: 'Lấy danh sách priority thất bại' }
      }
    }
  }
}
