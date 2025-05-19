import axios from 'axios'

// Cấu hình kết nối đến backend
// Kiểm tra môi trường để sử dụng URL phù hợp
const isProduction = process.env.NODE_ENV === 'production'

// Base URL cho API requests
const baseApiUrl = isProduction 
  ? 'https://sdtc-website.onrender.com/api'  // Đảm bảo có /api ở cuối
  : 'http://localhost:3000/api'

// Base URL cho media (hình ảnh, video, vv...)
export const baseMediaUrl = isProduction
  ? 'https://sdtc-website.onrender.com'  // URL từ Render dashboard
  : 'http://localhost:3000'

const api = axios.create({
  baseURL: baseApiUrl,
  timeout: 10000, // Timeout 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
  // Thêm withCredentials để gửi cookies nếu cần
  withCredentials: false
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
