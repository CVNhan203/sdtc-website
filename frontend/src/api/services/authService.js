import api from '../config';

const authService = {
    async login(credentials) {
        try {
            const response = await api.post('/admin/login', credentials);
            if (response.data.success) {
                const { token, admin } = response.data;
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminInfo', JSON.stringify(admin));
                return { success: true, admin };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Đăng nhập thất bại'
            };
        }
    },

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
    },

    getAdminInfo() {
        const adminInfo = localStorage.getItem('adminInfo');
        return adminInfo ? JSON.parse(adminInfo) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('adminToken');
    }
};

export default authService; 