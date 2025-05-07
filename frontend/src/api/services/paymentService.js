import api from '../config';

// Sử dụng localStorage để lưu trữ dữ liệu thanh toán
const PAYMENTS_STORAGE_KEY = 'payments_data';

// Hàm lấy dữ liệu từ localStorage
const getStoredPayments = () => {
  const storedData = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Hàm lưu dữ liệu vào localStorage
const storePayments = (data) => {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(data));
};

const paymentService = {
  // Lấy danh sách thanh toán từ localStorage
  async getPayments() {
    try {
      // Backend không có route GET /payments
      // Trả về dữ liệu đã lưu trong localStorage
      const payments = getStoredPayments();
      return {
        success: true,
        data: payments,
        message: 'Lấy danh sách thanh toán thành công'
      };
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Tạo thanh toán mới
  async createPayment(paymentData) {
    try {
      const response = await api.post('/payments/create', paymentData);

      // Nếu tạo thành công, thêm vào localStorage
      if (response.data.success) {
        const payments = getStoredPayments();
        payments.push(response.data.data);
        storePayments(payments);
      }

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

      // Nếu cập nhật thành công, cập nhật trong localStorage
      if (response.data.success) {
        const payments = getStoredPayments();
        const updatedPayments = payments.map(payment => {
          if (payment.orderId === paymentData.orderId && payment.method === paymentData.method) {
            return { ...payment, status: paymentData.status };
          }
          return payment;
        });
        storePayments(updatedPayments);
      }

      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }
};

export default paymentService; 