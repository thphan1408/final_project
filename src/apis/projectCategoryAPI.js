import fetcher from './fetcher'

export const getProjectCategoryAPI = async () => {
  try {
    const response = await fetcher.get('/ProjectCategory')
    return response.data.content
  } catch (error) {
    throw error
  }
}
