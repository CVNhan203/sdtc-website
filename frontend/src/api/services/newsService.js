import api from '../config'

// Đối tượng newsService chứa các phương thức để tương tác với API tin tức
const newsService = {
  // Lấy danh sách tin tức
  async getNews() {
    try {
      const response = await api.get('/news') // Gửi yêu cầu GET đến API để lấy danh sách tin tức
      console.log('API Response:', response.data) // Thêm dòng này để debug
      return {
        data: response.data.data || [], // Trả về dữ liệu tin tức, nếu không có thì trả về mảng rỗng
        pagination: response.data.pagination || null, // Trả về thông tin phân trang, nếu không có thì trả về null
        message: response.data.message || '', // Trả về thông điệp, nếu không có thì trả về chuỗi rỗng
      }
    } catch (error) {
      console.error('Error fetching news:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Lấy chi tiết tin tức
  async getNewsById(id) {
    try {
      const response = await api.get(`/news/${id}`) // Gửi yêu cầu GET đến API với ID cụ thể
      return response.data.data // Trả về dữ liệu chi tiết tin tức
    } catch (error) {
      console.error('Error fetching news details:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Tạo tin tức mới
  async createNews(data) {
    try {
      const response = await api.post('/news', JSON.stringify(data), { // Gửi yêu cầu POST để tạo tin tức mới
        headers: {
          'Content-Type': 'application/json', // Đặt header cho yêu cầu
        },
      })
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error creating news:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Cập nhật tin tức
  async updateNews(id, data) {
    try {
      const response = await api.put(`/news/${id}`, JSON.stringify(data), { // Gửi yêu cầu PUT để cập nhật tin tức
        headers: {
          'Content-Type': 'application/json', // Đặt header cho yêu cầu
        },
      })
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error updating news:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Xóa tin tức
  async deleteNews(id) {
    try {
      const response = await api.delete(`/news/${id}`) // Gửi yêu cầu DELETE để xóa tin tức
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error deleting news:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Upload ảnh
  async uploadImage(formData) {
    try {
      const response = await api.post('/news/upload', formData) // Gửi yêu cầu POST để upload ảnh
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error uploading image:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Khôi phục tin tức
  async restoreNews(id) {
    try {
      const response = await api.patch(`/news/${id}/restore`, { isDeleted: false }) // Gửi yêu cầu PATCH để khôi phục tin tức
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error restoring news:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Xóa vĩnh viễn tin tức
  async permanentDeleteNews(id) {
    try {
      const response = await api.delete(`/news/${id}/permanent`) // Gửi yêu cầu DELETE để xóa vĩnh viễn tin tức
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error permanently deleting news:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Lấy tin tức trong thùng rác
  async getNewsInTrash() {
    try {
      const response = await api.get('/news/trash') // Gửi yêu cầu GET để lấy tin tức trong thùng rác
      return {
        data: response.data.data || [], // Trả về dữ liệu tin tức, nếu không có thì trả về mảng rỗng
        pagination: response.data.pagination || null, // Trả về thông tin phân trang, nếu không có thì trả về null
        message: response.data.message || '', // Trả về thông điệp, nếu không có thì trả về chuỗi rỗng
      }
    } catch (error) {
      console.error('Error fetching news in trash:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },
}

export default newsService // Xuất đối tượng newsService để sử dụng ở nơi khác
      