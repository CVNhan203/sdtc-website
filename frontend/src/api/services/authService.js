import api from '../config'

const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/admin/login', credentials)

      if (response.data.success) {
        const { token, admin } = response.data
        if (token) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(admin))
          localStorage.setItem('adminToken', token)
          localStorage.setItem('adminInfo', JSON.stringify(admin))
        }
      }

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      }
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo')
    return adminInfo ? JSON.parse(adminInfo) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('token') || !!localStorage.getItem('adminToken')
  },
}

export default authService
