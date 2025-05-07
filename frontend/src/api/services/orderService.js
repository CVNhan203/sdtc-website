import api from '../config'

const orderService = {
  // Lấy danh sách đơn hàng
  async getOrders(params) {
    try {
      const response = await api.get('/orders', { params });
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || null,
        message: response.data.message || ''
      };
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', JSON.stringify(orderData), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(id, statusData) {
    try {
      const response = await api.put(`/orders/${id}`, JSON.stringify(statusData), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  }
}

export default orderService 