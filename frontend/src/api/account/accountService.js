import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

const accountService = {
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
    try {
      const response = await axios.get(`${API_URL}/admin/staffs`, {
        headers: this.authHeader()
      });
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách tài khoản'
      };
    }
  },

  // Lấy chi tiết một tài khoản
  async getAccountById(id) {
    try {
      const response = await axios.get(`${API_URL}/admin/staffs/${id}`, {
        headers: this.authHeader()
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin tài khoản'
      };
    }
  },

  // Tạo tài khoản mới
  async createAccount(accountData) {
    try {
      const response = await axios.post(`${API_URL}/admin/staffs`, accountData, {
        headers: this.authHeader()
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo tài khoản'
      };
    }
  },

  // Cập nhật tài khoản
  async updateAccount(id, accountData) {
    try {
      const response = await axios.put(`${API_URL}/admin/staffs/${id}`, accountData, {
        headers: this.authHeader()
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật tài khoản'
      };
    }
  },

  // Xóa tài khoản (soft delete)
  async deleteAccount(id) {
    try {
      const response = await axios.delete(`${API_URL}/admin/staffs/${id}`, {
        headers: this.authHeader()
      });
      return {
        success: true,
        message: response.data?.message || 'Đã chuyển tài khoản vào thùng rác'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa tài khoản'
      };
    }
  },

  // Lấy thống kê dashboard
  async getDashboardStats() {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: this.authHeader()
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thống kê'
      };
    }
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

  // Get deleted accounts
  async getDeletedAccounts() {
    try {
      console.log('Fetching deleted accounts...');
      const headers = this.authHeader();
      console.log('Auth headers:', headers);
      
      const response = await axios.get(`${API_URL}/admin/staffs/deleted`, {
        headers: headers,
        validateStatus: function (status) {
          return status < 500; // 接受任何小于500的状态码
        }
      });
      
      console.log('Raw API response:', response);
      
      if (response.status === 200) {
        return {
          success: true,
          data: response.data.data || []
        };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Failed to load deleted accounts'
        };
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return {
        success: false,
        message: error.response?.data?.message || 'Could not load deleted accounts',
        error: error
      };
    }
  },

  // Restore account
  async restoreAccount(id) {
    try {
      const response = await axios.patch(`${API_URL}/admin/staffs/restore/${id}`, {}, {
        headers: this.authHeader()
      });
      return {
        success: true,
        data: response.data,
        message: 'Account restored successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not restore account'
      };
    }
  },

  // Restore multiple accounts
  async restoreAccounts(ids) {
    try {
      await Promise.all(ids.map(id => this.restoreAccount(id)));
      return {
        success: true,
        message: 'Accounts restored successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not restore accounts'
      };
    }
  },

  // Permanent delete account
  async permanentDeleteAccount(id) {
    try {
      await axios.delete(`${API_URL}/admin/staffs/${id}/permanent`, {
        headers: this.authHeader()
      });
      return {
        success: true,
        message: 'Account permanently deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not delete account'
      };
    }
  },

  // Permanent delete multiple accounts
  async permanentDeleteAccounts(ids) {
    try {
      await Promise.all(ids.map(id => this.permanentDeleteAccount(id)));
      return {
        success: true,
        message: 'Accounts permanently deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not delete accounts'
      };
    }
  }
};

export default accountService;