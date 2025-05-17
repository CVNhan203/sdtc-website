import api from '../config'

// Đối tượng authService chứa các phương thức liên quan đến xác thực người dùng
const authService = {
  // Phương thức đăng nhập
  async login(credentials) {
    try {
      // Gửi yêu cầu đăng nhập đến API
      const response = await api.post('/admin/login', credentials)

      // Kiểm tra xem đăng nhập có thành công không
      if (response.data.success) {
        const { token, admin } = response.data
        if (token) {
          // Lưu trữ token và thông tin admin vào localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(admin))
          localStorage.setItem('adminToken', token)
          localStorage.setItem('adminInfo', JSON.stringify(admin))
        }
      }

      // Trả về dữ liệu phản hồi
      return response.data
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      }
    }
  },

  // Phương thức đăng xuất
  logout() {
    // Xóa thông tin người dùng và token khỏi localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
  },

  // Phương thức lấy thông tin người dùng hiện tại
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Phương thức lấy thông tin admin
  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo')
    return adminInfo ? JSON.parse(adminInfo) : null
  },

  // Phương thức kiểm tra xem người dùng đã xác thực hay chưa
  isAuthenticated() {
    return !!localStorage.getItem('token') || !!localStorage.getItem('adminToken')
  },
}

// Xuất đối tượng authService để sử dụng ở nơi khác
export default authService
