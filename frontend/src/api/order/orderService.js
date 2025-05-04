import api from '../config'

const orderService = {
  // Lấy danh sách đơn hàng
  async getOrders() {
    try {
      const response = await api.get('/orders')
      console.log('Order API response:', response)
      
      // Ensure we return an array of orders
      if (response && response.data) {
        // If response.data is already an array, return it
        if (Array.isArray(response.data)) {
          return { data: response.data }
        }
        // If response.data has a data property that is an array, return that
        else if (response.data.data && Array.isArray(response.data.data)) {
          return { data: response.data.data }
        }
        // If response.data has an items property that is an array, return that
        else if (response.data.items && Array.isArray(response.data.items)) {
          return { data: response.data.items }
        }
      }
      
      // Default to empty array
      return { data: [] }
    } catch (error) {
      console.error('Error in getOrders:', error)
      throw error
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error)
      throw error
    }
  },

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData)
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, statusData) {
    try {
      const response = await api.put(`/orders/${id}`, statusData)
      return response.data
    } catch (error) {
      console.error(`Error updating order ${id}:`, error)
      throw error
    }
  }
}

export default orderService 