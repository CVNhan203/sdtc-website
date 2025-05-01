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
            return response.data.data;
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
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
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await api.post('/services/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
};

export default serviceService; 