import api from '../config'

const accountService = {
  // Helper function để thực hiện request
  async apiRequest(method, url, data = null, options = {}) {
    try {
      const config = {
        method,
        url,
        ...options,
      }

      if (data && method !== 'get') {
        config.data = data
      }

      const response = await api(config)
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      }
    } catch (error) {
      // Xử lý lỗi cơ bản
      return {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || `Lỗi khi thực hiện yêu cầu`,
      }
    }
  },

  // Đăng nhập admin
  async login(credentials) {
    try {
      const response = await api.post(`/admin/login`, credentials)
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token)
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin))
      }
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể đăng nhập',
      }
    }
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
  },

  // Lấy thông tin admin đang đăng nhập
  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo')
    return adminInfo ? JSON.parse(adminInfo) : null
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return !!localStorage.getItem('adminToken')
  },

  // Lấy danh sách tài khoản staff
  async getAccounts() {
    return this.apiRequest('get', '/admin/staffs')
  },

  // Lấy chi tiết một tài khoản
  async getAccountById(id) {
    return this.apiRequest('get', `/admin/staffs/${id}`)
  },

  // Tạo tài khoản mới
  async createAccount(accountData) {
    return this.apiRequest('post', '/admin/staffs', accountData)
  },

  // Cập nhật tài khoản
  async updateAccount(id, accountData) {
    return this.apiRequest('put', `/admin/staffs/${id}`, accountData)
  },

  // Xóa tài khoản (soft delete)
  async deleteAccount(id) {
    return this.apiRequest('delete', `/admin/staffs/${id}`)
  },

  // Lấy thống kê dashboard
  async getDashboardStats() {
    return this.apiRequest('get', '/admin/dashboard')
  },

  // Kiểm tra role admin
  isAdmin() {
    const adminInfo = this.getAdminInfo()
    return adminInfo?.role === 'admin'
  },

  // Kiểm tra role staff
  isStaff() {
    const adminInfo = this.getAdminInfo()
    return adminInfo?.role === 'staff'
  },

  // Get all roles
  async getAccountRoles() {
    try {
      const response = await api.get(`/roles`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách vai trò',
      }
    }
  },

  // Create new role
  async createAccountRole(roleData) {
    try {
      const response = await api.post(`/roles`, roleData)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo vai trò mới',
      }
    }
  },

  // Update role
  async updateAccountRoles(id, roleData) {
    try {
      const response = await api.put(`/roles/${id}`, roleData)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật vai trò',
      }
    }
  },

  // Delete role
  async deleteAccountRole(id) {
    try {
      const response = await api.delete(`/roles/${id}`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa vai trò',
      }
    }
  },

  // Get role permissions
  async getRolePermissions() {
    try {
      const response = await api.get(`/roles/permissions`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách quyền hạn',
      }
    }
  },

  // Update account's roles
  async updateAccountRoleAssignment(accountId, roles) {
    try {
      const response = await api.put(`/accounts/${accountId}/roles`, { roles })
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật vai trò cho tài khoản',
      }
    }
  },

  // Lấy danh sách tài khoản đã xóa
  async getDeletedAccounts() {
    try {
      const response = await api.get('/admin/deleted-staffs')
      return {
        success: true,
        data: response.data.data || [],
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách tài khoản đã xóa',
        data: [],
      }
    }
  },

  // Khôi phục tài khoản (đặt isDeleted = false)
  async restoreAccount(id) {
    return this.apiRequest('put', `/admin/staffs/${id}`, { isDeleted: false })
  },

  // Khôi phục nhiều tài khoản
  async restoreAccounts(ids) {
    try {
      const results = await Promise.all(ids.map((id) => this.restoreAccount(id)))
      const failedCount = results.filter((r) => !r.success).length

      if (failedCount > 0) {
        return {
          success: false,
          message: `Không thể khôi phục ${failedCount} tài khoản`,
        }
      }

      return {
        success: true,
        message: `Đã khôi phục ${ids.length} tài khoản thành công`,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể khôi phục tài khoản',
      }
    }
  },

  // Xóa vĩnh viễn tài khoản
  async permanentDeleteAccount(id) {
    try {
      const response = await api.delete(`/admin/staffs/${id}?permanent=true`)
      return {
        success: response.data.success,
        message: response.data.message || 'Đã xóa vĩnh viễn tài khoản thành công',
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa vĩnh viễn tài khoản',
      }
    }
  },

  // Xóa vĩnh viễn nhiều tài khoản
  async permanentDeleteAccounts(ids) {
    try {
      const results = await Promise.all(ids.map((id) => this.permanentDeleteAccount(id)))
      const failedCount = results.filter((result) => !result.success).length

      if (failedCount > 0) {
        return {
          success: false,
          message: `Không thể xóa vĩnh viễn ${failedCount}/${ids.length} tài khoản`,
        }
      }

      return {
        success: true,
        message: `Đã xóa vĩnh viễn ${ids.length} tài khoản thành công`,
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể xóa vĩnh viễn tài khoản',
      }
    }
  },
}

export default accountService
