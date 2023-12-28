import fetcher from './fetcher'

export const getAllProjectAPI = async () => {
  try {
    const response = await fetcher.get('/Project/getAllProject')
    return response.data.content
  } catch (error) {
    throw error
  }
}
