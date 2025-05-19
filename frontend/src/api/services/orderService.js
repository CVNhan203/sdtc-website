import api from '../config'

// Đối tượng orderService chứa các phương thức để tương tác với API đơn hàng
const orderService = {
  // Lấy danh sách đơn hàng
  async getOrders() {
    try {
      const response = await api.get('/orders') // Gửi yêu cầu GET đến API để lấy danh sách đơn hàng
      // Lấy thông tin dịch vụ cho mỗi đơn hàng
      const orders = response.data.data || [] // Lấy danh sách đơn hàng từ phản hồi
      const ordersWithService = await Promise.all(
        orders.map(async (order) => {
          try {
            const serviceResponse = await api.get(`/services/${order.serviceId}`) // Gửi yêu cầu GET để lấy thông tin dịch vụ
            const service = serviceResponse.data.data
            return {
              ...order,
              serviceType: service?.title || 'Không xác định', // Thêm loại dịch vụ vào đơn hàng
              paidAmount: service?.price || 0, // Thêm số tiền đã thanh toán vào đơn hàng
            }
          } catch (error) {
            console.error(`Error fetching service for order ${order._id}:`, error) // In ra lỗi nếu có
            return {
              ...order,
              serviceType: 'Không xác định', // Nếu không lấy được dịch vụ, gán loại dịch vụ là 'Không xác định'
              paidAmount: 0, // Gán số tiền đã thanh toán là 0
            }
          }
        })
      )

      return {
        success: true,
        data: ordersWithService, // Trả về danh sách đơn hàng đã có thông tin dịch vụ
        message: response.data.message || 'Lấy danh sách đơn hàng thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error fetching orders:', error) // In ra lỗi nếu có
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách đơn hàng', // Thông điệp lỗi
      }
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`) // Gửi yêu cầu GET đến API với ID cụ thể
      return {
        success: true,
        data: response.data.data, // Trả về dữ liệu chi tiết đơn hàng
        message: response.data.message || 'Lấy thông tin đơn hàng thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error fetching order details:', error) // In ra lỗi nếu có
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin đơn hàng', // Thông điệp lỗi
      }
    }
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, updateData) {
    try {
      const response = await api.put(`/orders/${id}`, updateData) // Gửi yêu cầu PUT để cập nhật trạng thái đơn hàng
      return {
        success: true,
        data: response.data.data, // Trả về dữ liệu từ phản hồi
        message: response.data.message || 'Cập nhật đơn hàng thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error updating order status:', error) // In ra lỗi nếu có
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng', // Thông điệp lỗi
      }
    }
  },

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      // Đảm bảo trạng thái đơn hàng mới luôn là 'pending' (chờ xử lý)
      const orderWithStatus = {
        ...orderData,
        orderStatus: 'pending', // Gán trạng thái mặc định là chờ xử lý
      }

      const response = await api.post('/orders', orderWithStatus) // Gửi yêu cầu POST để tạo đơn hàng mới
      return {
        success: true,
        data: response.data.data, // Trả về dữ liệu từ phản hồi
        message: response.data.message || 'Tạo đơn hàng thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error creating order:', error) // In ra lỗi nếu có
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo đơn hàng', // Thông điệp lỗi
      }
    }
  },

  // Lấy lịch sử đơn hàng
  async getOrderHistory() {
    try {
      const response = await api.get('/orders/history') // Gửi yêu cầu GET để lấy lịch sử đơn hàng
      return {
        success: true,
        data: response.data.data || [], // Trả về dữ liệu lịch sử đơn hàng, nếu không có thì trả về mảng rỗng
        message: response.data.message || 'Lấy lịch sử đơn hàng thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error fetching order history:', error) // In ra lỗi nếu có
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải lịch sử đơn hàng', // Thông điệp lỗi
      }
    }
  },

  // Xử lý thanh toán cho đơn hàng
  async processPayment(orderId, paymentData) {
    try {
      const response = await api.post(`/orders/${orderId}/process-payment`, paymentData) // Gửi yêu cầu POST để xử lý thanh toán
      return {
        success: true,
        data: response.data.data, // Trả về dữ liệu từ phản hồi
        message: response.data.message || 'Xử lý thanh toán thành công', // Thông điệp thành công
      }
    } catch (error) {
      console.error('Error processing payment:', error) // In ra lỗi nếu có
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xử lý thanh toán', // Thông điệp lỗi
      }
    }
  },
}

export default orderService // Xuất đối tượng orderService để sử dụng ở nơi khác
