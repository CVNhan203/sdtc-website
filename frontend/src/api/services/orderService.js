import api from '../config'

const orderService = {
  // Lấy danh sách đơn hàng
  async getOrders() {
    try {
      const response = await api.get('/orders')
      // Lấy thông tin dịch vụ cho mỗi đơn hàng
      const orders = response.data.data || []
      const ordersWithService = await Promise.all(
        orders.map(async (order) => {
          try {
            const serviceResponse = await api.get(`/services/${order.serviceId}`)
            const service = serviceResponse.data.data
            return {
              ...order,
              serviceType: service?.title || 'Không xác định',
              paidAmount: service?.price || 0,
            }
          } catch (error) {
            console.error(`Error fetching service for order ${order._id}:`, error)
            return {
              ...order,
              serviceType: 'Không xác định',
              paidAmount: 0,
            }
          }
        })
      )

      return {
        success: true,
        data: ordersWithService,
        message: response.data.message || 'Lấy danh sách đơn hàng thành công',
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách đơn hàng',
      }
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`)
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Lấy thông tin đơn hàng thành công',
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin đơn hàng',
      }
    }
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, updateData) {
    try {
      const response = await api.put(`/orders/${id}`, updateData)
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Cập nhật đơn hàng thành công',
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng',
      }
    }
  },

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData)
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Tạo đơn hàng thành công',
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo đơn hàng',
      }
    }
  },

  // Lấy lịch sử đơn hàng
  async getOrderHistory() {
    try {
      const response = await api.get('/orders/history')
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Lấy lịch sử đơn hàng thành công',
      }
    } catch (error) {
      console.error('Error fetching order history:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải lịch sử đơn hàng',
      }
    }
  },

  // Lấy đơn hàng đang chờ xử lý
  async getPendingOrders() {
    try {
      const response = await api.get('/orders/pending')
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Lấy danh sách đơn hàng chờ xử lý thành công',
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách đơn hàng chờ xử lý',
      }
    }
  },
}

export default orderService
