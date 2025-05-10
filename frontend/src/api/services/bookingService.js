import api from '../config'

// Đối tượng bookingService chứa các phương thức để tương tác với API đặt lịch
export const bookingService = {
  // Lấy tất cả các đặt lịch
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings') // Gửi yêu cầu GET đến API để lấy danh sách đặt lịch
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đặt lịch:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Lấy đặt lịch theo ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`) // Gửi yêu cầu GET đến API với ID cụ thể
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đặt lịch:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Cập nhật trạng thái đặt lịch
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status }) // Gửi yêu cầu PUT để cập nhật trạng thái đặt lịch
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đặt lịch:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },
  
  // Tạo đặt lịch mới
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData) // Gửi yêu cầu POST để tạo đặt lịch mới
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Lỗi khi tạo đặt lịch:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },
}

export default bookingService // Xuất đối tượng bookingService để sử dụng ở nơi khác
