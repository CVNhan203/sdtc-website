import api from '../config'

// Dịch vụ tài khoản
const accountService = {
  // Hàm trợ giúp để thực hiện yêu cầu API
  async apiRequest(method, url, data = null, options = {}) {
    try {
      const config = {
        method,
        url,
        ...options,
      }

      if (data && method !== 'get') {
        config.data = data // Thêm dữ liệu vào cấu hình nếu có và phương thức không phải là GET
      }

      const response = await api(config) // Gọi API với cấu hình đã định nghĩa
      return {
        success: true,
        data: response.data.data || response.data, // Trả về dữ liệu từ phản hồi
        message: response.data.message, // Trả về thông điệp từ phản hồi
      }
    } catch (error) {
      // Xử lý lỗi cơ bản
      return {
        success: false,
        status: error.response?.status, // Trả về mã trạng thái lỗi
        message: error.response?.data?.message || `Lỗi khi thực hiện yêu cầu`, // Thông điệp lỗi
      }
    }
  },

  // Đăng nhập admin
  async login(credentials) {
    try {
      const response = await api.post(`/admin/login`, credentials) // Gửi yêu cầu đăng nhập
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token) // Lưu token vào localStorage
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin)) // Lưu thông tin admin
      }
      return response.data // Trả về dữ liệu phản hồi
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể đăng nhập', // Thông điệp lỗi
      }
    }
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('adminToken') // Xóa token khỏi localStorage
    localStorage.removeItem('adminInfo') // Xóa thông tin admin khỏi localStorage
  },

  // Lấy thông tin admin đang đăng nhập
  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo') // Lấy thông tin admin từ localStorage
    return adminInfo ? JSON.parse(adminInfo) : null // Trả về thông tin admin hoặc null
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return !!localStorage.getItem('adminToken') // Trả về true nếu đã đăng nhập
  },

  // Lấy danh sách tài khoản staff
  async getAccounts() {
    return this.apiRequest('get', '/admin/staffs') // Gọi hàm apiRequest để lấy danh sách tài khoản staff
  },

  // Lấy chi tiết một tài khoản
  async getAccountById(id) {
    return this.apiRequest('get', `/admin/staffs/${id}`) // Gọi hàm apiRequest để lấy thông tin tài khoản theo ID
  },

  // Tạo tài khoản mới
  async createAccount(accountData) {
    return this.apiRequest('post', '/admin/staffs', accountData) // Gọi hàm apiRequest để tạo tài khoản mới
  },

  // Cập nhật tài khoản
  async updateAccount(id, accountData) {
    return this.apiRequest('put', `/admin/staffs/${id}`, accountData) // Gọi hàm apiRequest để cập nhật tài khoản
  },

  // Xóa tài khoản (soft delete)
  async deleteAccount(id) {
    return this.apiRequest('delete', `/admin/staffs/${id}`) // Gọi hàm apiRequest để xóa tài khoản
  },

  // Lấy thống kê dashboard
  async getDashboardStats() {
    return this.apiRequest('get', '/admin/dashboard') // Gọi hàm apiRequest để lấy thống kê dashboard
  },

  // Kiểm tra role admin
  isAdmin() {
    const adminInfo = this.getAdminInfo() // Lấy thông tin admin
    return adminInfo?.role === 'admin' // Trả về true nếu là admin
  },

  // Kiểm tra role staff
  isStaff() {
    const adminInfo = this.getAdminInfo() // Lấy thông tin admin
    return adminInfo?.role === 'staff' // Trả về true nếu là staff
  },

  // Lấy tất cả các vai trò
  async getAccountRoles() {
    try {
      const response = await api.get(`/roles`) // Gọi API để lấy danh sách vai trò
      return {
        success: true,
        data: response.data, // Trả về dữ liệu vai trò
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách vai trò', // Thông điệp lỗi
      }
    }
  },

  // Tạo vai trò mới
  async createAccountRole(roleData) {
    try {
      const response = await api.post(`/roles`, roleData) // Gửi yêu cầu tạo vai trò mới
      return {
        success: true,
        data: response.data, // Trả về dữ liệu vai trò mới
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo vai trò mới', // Thông điệp lỗi
      }
    }
  },

  // Cập nhật vai trò
  async updateAccountRoles(id, roleData) {
    try {
      const response = await api.put(`/roles/${id}`, roleData) // Gửi yêu cầu cập nhật vai trò
      return {
        success: true,
        data: response.data, // Trả về dữ liệu vai trò đã cập nhật
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật vai trò', // Thông điệp lỗi
      }
    }
  },

  // Xóa vai trò
  async deleteAccountRole(id) {
    try {
      const response = await api.delete(`/roles/${id}`) // Gửi yêu cầu xóa vai trò
      return {
        success: true,
        data: response.data, // Trả về dữ liệu phản hồi
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa vai trò', // Thông điệp lỗi
      }
    }
  },

  // Lấy quyền của vai trò
  async getRolePermissions() {
    try {
      const response = await api.get(`/roles/permissions`) // Gọi API để lấy danh sách quyền hạn
      return {
        success: true,
        data: response.data, // Trả về dữ liệu quyền hạn
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách quyền hạn', // Thông điệp lỗi
      }
    }
  },

  // Cập nhật vai trò cho tài khoản
  async updateAccountRoleAssignment(accountId, roles) {
    try {
      const response = await api.put(`/accounts/${accountId}/roles`, { roles }) // Gửi yêu cầu cập nhật vai trò cho tài khoản
      return {
        success: true,
        data: response.data, // Trả về dữ liệu phản hồi
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật vai trò cho tài khoản', // Thông điệp lỗi
      }
    }
  },

  // Lấy danh sách tài khoản đã xóa
  async getDeletedAccounts() {
    try {
      const response = await api.get('/admin/deleted-staffs') // Gọi API để lấy danh sách tài khoản đã xóa
      return {
        success: true,
        data: response.data.data || [], // Trả về dữ liệu tài khoản đã xóa
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách tài khoản đã xóa', // Thông điệp lỗi
        data: [],
      }
    }
  },

  // Khôi phục tài khoản (đặt isDeleted = false)
  async restoreAccount(id) {
    return this.apiRequest('put', `/admin/staffs/${id}`, { isDeleted: false }) // Gọi hàm apiRequest để khôi phục tài khoản
  },

  // Khôi phục nhiều tài khoản
  async restoreAccounts(ids) {
    try {
      const results = await Promise.all(ids.map((id) => this.restoreAccount(id))) // Khôi phục từng tài khoản
      const failedCount = results.filter((r) => !r.success).length // Đếm số tài khoản không khôi phục được

      if (failedCount > 0) {
        return {
          success: false,
          message: `Không thể khôi phục ${failedCount} tài khoản`, // Thông điệp lỗi
        }
      }

      return {
        success: true,
        message: `Đã khôi phục ${ids.length} tài khoản thành công`, // Thông điệp thành công
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể khôi phục tài khoản', // Thông điệp lỗi
      }
    }
  },

  // Xóa vĩnh viễn tài khoản
  async permanentDeleteAccount(id) {
    try {
      const response = await api.delete(`/admin/staffs/${id}?permanent=true`) // Gửi yêu cầu xóa vĩnh viễn tài khoản
      return {
        success: response.data.success,
        message: response.data.message || 'Đã xóa vĩnh viễn tài khoản thành công', // Thông điệp thành công
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa vĩnh viễn tài khoản', // Thông điệp lỗi
      }
    }
  },

  // Xóa vĩnh viễn nhiều tài khoản
  async permanentDeleteAccounts(ids) {
    try {
      const results = await Promise.all(ids.map((id) => this.permanentDeleteAccount(id))) // Xóa vĩnh viễn từng tài khoản
      const failedCount = results.filter((result) => !result.success).length // Đếm số tài khoản không xóa được

      if (failedCount > 0) {
        return {
          success: false,
          message: `Không thể xóa vĩnh viễn ${failedCount}/${ids.length} tài khoản`, // Thông điệp lỗi
        }
      }

      return {
        success: true,
        message: `Đã xóa vĩnh viễn ${ids.length} tài khoản thành công`, // Thông điệp thành công
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể xóa vĩnh viễn tài khoản', // Thông điệp lỗi
      }
    }
  },
}

export default accountService // Xuất dịch vụ tài khoản
