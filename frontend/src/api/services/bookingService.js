import api from '../config'

export const bookingService = {
  // Lấy tất cả các đặt lịch
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings')
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt lịch:', error)
      throw error
    }
  },

  // Lấy đặt lịch theo ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đặt lịch:', error)
      throw error
    }
  },

  // Cập nhật trạng thái đặt lịch
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status })
      return response.data
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đặt lịch:', error)
      throw error
    }
  },
  
  // Tạo đặt lịch mới
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      console.error('Lỗi khi tạo đặt lịch:', error)
      throw error
    }
  },
}

export default bookingService
