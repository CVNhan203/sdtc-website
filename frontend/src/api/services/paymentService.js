import api from '../config'

// Sử dụng localStorage để lưu trữ dữ liệu thanh toán
const PAYMENTS_STORAGE_KEY = 'payments_data' // Khóa để lưu trữ dữ liệu thanh toán trong localStorage

// Hàm lấy dữ liệu từ localStorage
const getStoredPayments = () => {
  const storedData = localStorage.getItem(PAYMENTS_STORAGE_KEY) // Lấy dữ liệu từ localStorage
  return storedData ? JSON.parse(storedData) : [] // Nếu có dữ liệu, chuyển đổi từ JSON sang mảng, nếu không thì trả về mảng rỗng
}

// Hàm lưu dữ liệu vào localStorage
const storePayments = (data) => {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(data)) // Lưu dữ liệu vào localStorage dưới dạng JSON
}

const paymentService = {
  // Lấy danh sách thanh toán từ localStorage
  async getPayments() {
    try {
      // Backend không có route GET /payments
      // Trả về dữ liệu đã lưu trong localStorage
      const payments = getStoredPayments() // Lấy danh sách thanh toán từ localStorage
      return {
        success: true,
        data: payments, // Trả về dữ liệu thanh toán
        message: 'Lấy danh sách thanh toán thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error fetching payments:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Tạo thanh toán mới
  async createPayment(paymentData) {
    try {
      const response = await api.post('/payments/create', paymentData) // Gửi yêu cầu POST để tạo thanh toán mới

      // Nếu tạo thành công, thêm vào localStorage
      if (response.data.success) {
        const payments = getStoredPayments() // Lấy danh sách thanh toán hiện tại
        payments.push(response.data.data) // Thêm thanh toán mới vào danh sách
        storePayments(payments) // Lưu lại danh sách thanh toán đã cập nhật
      }

      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error creating payment:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Xác nhận thanh toán
  async confirmPayment(paymentData) {
    try {
      const response = await api.post('/payments/confirm', paymentData) // Gửi yêu cầu POST để xác nhận thanh toán

      // Nếu cập nhật thành công, cập nhật trong localStorage
      if (response.data.success) {
        const payments = getStoredPayments() // Lấy danh sách thanh toán hiện tại
        const updatedPayments = payments.map((payment) => {
          if (payment.orderId === paymentData.orderId && payment.method === paymentData.method) {
            return { ...payment, status: paymentData.status } // Cập nhật trạng thái thanh toán
          }
          return payment // Trả về thanh toán không thay đổi
        })
        storePayments(updatedPayments) // Lưu lại danh sách thanh toán đã cập nhật
      }

      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error confirming payment:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },
}

export default paymentService // Xuất đối tượng paymentService để sử dụng ở nơi khác
