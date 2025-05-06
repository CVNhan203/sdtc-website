import api from '../config';

const paymentService = {
  // Lấy danh sách thanh toán
  async getPayments() {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Tạo thanh toán mới
  async createPayment(paymentData) {
    try {
      const response = await api.post('/payments/create', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Xác nhận thanh toán
  async confirmPayment(paymentData) {
    try {
      const response = await api.post('/payments/confirm', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
};

export default paymentService; 