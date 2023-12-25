import axios from 'axios'
import { TOKEN_CYBERSOFT } from '../constants'

const fetcher = axios.create({
  baseURL: 'https://jiranew.cybersoft.edu.vn/api',
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
  },
})

// fetcher.interceptors.request.use((config) => {
//   // console.log('🚀  config:', config)
//   //   const user = JSON.parse(localStorage.getItem(CURRENT_USER))
//   //   if (user) {
//   //     // Thêm Authorization vào header
//   //     config.headers['Authorization'] = `Bearer ${user.accessToken}`
//   //   }
//   //   return config
//   console.log('🚀  config:', config)
// })

export default fetcher
