import api from '../config';

const paymentService = {
  // Lấy danh sách payment
  async getPayments(params) {
    try {
      const response = await api.get('/payments', { params });
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || null,
        message: response.data.message || ''
      };
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Lấy chi tiết payment
  async getPaymentById(id) {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  },

  // Tạo payment mới
  async createPayment(data) {
    try {
      const response = await api.post('/payments', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Cập nhật payment
  async updatePayment(id, data) {
    try {
      const response = await api.put(`/payments/${id}`, JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  // Xóa payment
  async deletePayment(id) {
    try {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  },

  // Upload ảnh payment (nếu có)
  async uploadImage(formData) {
    try {
      const response = await api.post('/payments/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default paymentService; 