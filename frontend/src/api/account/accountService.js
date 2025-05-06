import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

const accountService = {
  // Helper function để thực hiện request
  async apiRequest(method, url, data = null, options = {}) {
    try {
      const headers = this.authHeader();
      const config = {
        method,
        url: `${API_URL}${url}`,
        headers,
        ...options
      };
      
      if (data && method !== 'get') {
        config.data = data;
      }
      
      const response = await axios(config);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message
      };
    } catch (error) {
      console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || `Lỗi khi gọi ${url}`,
        error
      };
    }
  },

  // Đăng nhập admin
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, credentials);
      if (response.data.success) {
        // Lưu token và thông tin admin
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể đăng nhập'
      };
    }
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  },

  // Lấy thông tin admin đang đăng nhập
  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return !!localStorage.getItem('adminToken');
  },

  // Lấy danh sách tài khoản staff
  async getAccounts() {
    return this.apiRequest('get', '/admin/staffs');
  },

  // Lấy chi tiết một tài khoản
  async getAccountById(id) {
    return this.apiRequest('get', `/admin/staffs/${id}`);
  },

  // Tạo tài khoản mới
  async createAccount(accountData) {
    return this.apiRequest('post', '/admin/staffs', accountData);
  },

  // Cập nhật tài khoản
  async updateAccount(id, accountData) {
    return this.apiRequest('put', `/admin/staffs/${id}`, accountData);
  },

  // Xóa tài khoản (soft delete)
  async deleteAccount(id) {
    return this.apiRequest('delete', `/admin/staffs/${id}`);
  },

  // Lấy thống kê dashboard
  async getDashboardStats() {
    return this.apiRequest('get', '/admin/dashboard');
  },

  // Header xác thực
  authHeader() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Kiểm tra role admin
  isAdmin() {
    const adminInfo = this.getAdminInfo();
    return adminInfo?.role === 'admin';
  },

  // Kiểm tra role staff
  isStaff() {
    const adminInfo = this.getAdminInfo();
    return adminInfo?.role === 'staff';
  },

  // Get all roles
  async getAccountRoles() {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách vai trò'
      };
    }
  },

  // Create new role
  async createAccountRole(roleData) {
    try {
      const response = await axios.post(`${API_URL}/roles`, roleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo vai trò mới'
      };
    }
  },

  // Update role
  async updateAccountRoles(id, roleData) {
    try {
      const response = await axios.put(`${API_URL}/roles/${id}`, roleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật vai trò'
      };
    }
  },

  // Delete role
  async deleteAccountRole(id) {
    try {
      const response = await axios.delete(`${API_URL}/roles/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa vai trò'
      };
    }
  },

  // Get role permissions
  async getRolePermissions() {
    try {
      const response = await axios.get(`${API_URL}/roles/permissions`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách quyền hạn'
      };
    }
  },

  // Update account's roles
  async updateAccountRoleAssignment(accountId, roles) {
    try {
      const response = await axios.put(`${API_URL}/accounts/${accountId}/roles`, { roles });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật vai trò cho tài khoản'
      };
    }
  },

  // Lấy danh sách tài khoản đã xóa - Tạm thời dùng filter trong frontend
  async getDeletedAccounts() {
    try {
      // Sử dụng query parameter thay vì path parameter, để tránh lỗi ObjectId
      const response = await this.apiRequest('get', '/admin/staffs');
      if (response.success) {
        // Lọc tài khoản đã xóa (isDeleted = true) trên frontend
        const deletedAccounts = response.data.filter(account => account.isDeleted === true);
        return {
          success: true,
          data: deletedAccounts
        };
      }
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tải danh sách tài khoản đã xóa',
        error
      };
    }
  },

  // Khôi phục tài khoản
  async restoreAccount(id) {
    return this.apiRequest('patch', `/admin/staffs/restore/${id}`, {});
  },

  // Khôi phục nhiều tài khoản
  async restoreAccounts(ids) {
    try {
      await Promise.all(ids.map(id => this.restoreAccount(id)));
      return {
        success: true,
        message: 'Đã khôi phục tài khoản thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể khôi phục tài khoản'
      };
    }
  },

  // Xóa vĩnh viễn tài khoản
  async permanentDeleteAccount(id) {
    return this.apiRequest('delete', `/admin/staffs/${id}/permanent`);
  },

  // Xóa vĩnh viễn nhiều tài khoản
  async permanentDeleteAccounts(ids) {
    try {
      await Promise.all(ids.map(id => this.permanentDeleteAccount(id)));
      return {
        success: true,
        message: 'Đã xóa vĩnh viễn tài khoản thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Không thể xóa vĩnh viễn tài khoản'
      };
    }
  }
};

export default accountService;