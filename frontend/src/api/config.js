import axios from 'axios'

// Cấu hình kết nối đến backend
const backendHost = 'localhost'
const backendPort = '3000'

// Base URL cho API requests
const baseApiUrl = `http://${backendHost}:${backendPort}/api`

// Base URL cho media (hình ảnh, video, vv...)
export const baseMediaUrl = `http://${backendHost}:${backendPort}`

// Thêm log để kiểm tra cấu hình
console.log('Backend URLs:', { baseApiUrl, baseMediaUrl })

// Thêm kiểm tra kết nối đến server
fetch(baseMediaUrl)
  .then(response => {
    console.log('🟢 Kết nối đến backend thành công:', response.status);
  })
  .catch(error => {
    console.error('🔴 Lỗi kết nối đến backend:', error);
  });

const api = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000, // Timeout 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thêm interceptor cho yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // For FormData, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminInfo')
      window.location.href = '/admin/dashboard'
    }
    return Promise.reject(error)
  }
)

export default api
