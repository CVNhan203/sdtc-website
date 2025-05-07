import api from '../config';

const serviceService = {
    // Lấy danh sách dịch vụ
    async getServices() {
        try {
            const response = await api.get('/services');
            return response.data.data || []; // Lấy data từ response
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    // Lấy chi tiết một dịch vụ
    async getServiceById(id) {
        try {
            const response = await api.get(`/services/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching service details:', error);
            throw error;
        }
    },

    // Tạo dịch vụ mới  
    async createService(serviceData) {
        try {
            // Đảm bảo gửi dữ liệu dưới dạng JSON
            const response = await api.post('/services', JSON.stringify(serviceData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    // Cập nhật dịch vụ
    async updateService(id, serviceData) {
        try {
            const response = await api.put(`/services/${id}`, JSON.stringify(serviceData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Không thể cập nhật dịch vụ');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error updating service:', error);
            throw error.response?.data?.message 
                ? new Error(error.response.data.message)
                : new Error('Không thể cập nhật dịch vụ');
        }
    },

    // Xóa dịch vụ
    async deleteService(id) {
        try {
            const response = await api.delete(`/services/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    },

    // Upload ảnh dịch vụ
    async uploadImage(formData) {
        try {
            const response = await api.post('/services/upload', formData, {
                headers: {
                    // Không cần set Content-Type khi upload file,
                    // để browser tự động set với boundary đúng
                },
                maxContentLength: 5 * 1024 * 1024, // 5MB
                maxBodyLength: 5 * 1024 * 1024
            });
            
            if (!response.data || !response.data.imagePath) {
                throw new Error('Không nhận được đường dẫn ảnh từ server');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error.response?.status === 413) {
                throw new Error('Kích thước file quá lớn, vui lòng chọn file nhỏ hơn 5MB');
            }
            throw new Error(error.response?.data?.message || 'Không thể tải ảnh lên');
        }
    }
};

export default serviceService; 