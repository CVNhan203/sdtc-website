import api from '../config';

const bookingService = {
  // Lấy danh sách booking
  async getBookings(params) {
    try {
      const response = await api.get('/bookings', { params });
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || null,
        message: response.data.message || ''
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Lấy chi tiết booking
  async getBookingById(id) {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },

  // Tạo booking mới
  async createBooking(data) {
    try {
      const response = await api.post('/bookings', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Cập nhật booking
  async updateBooking(id, data) {
    try {
      const response = await api.put(`/bookings/${id}`, JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Xóa booking
  async deleteBooking(id) {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Upload ảnh booking (nếu có)
  async uploadImage(formData) {
    try {
      const response = await api.post('/bookings/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default bookingService; 