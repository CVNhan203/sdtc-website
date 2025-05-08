import api from '../config'
const newsService = {
  // Lấy danh sách tin tức
  async getNews() {
    try {
      const response = await api.get('/news')
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || null,
        message: response.data.message || '',
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      throw error
    }
  },

  // Lấy chi tiết tin tức
  async getNewsById(id) {
    try {
      const response = await api.get(`/news/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching news details:', error)
      throw error
    }
  },

  // Tạo tin tức mới
  async createNews(data) {
    try {
      const response = await api.post('/news', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error creating news:', error)
      throw error
    }
  },

  // Cập nhật tin tức
  async updateNews(id, data) {
    try {
      const response = await api.put(`/news/${id}`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error updating news:', error)
      throw error
    }
  },

  // Xóa tin tức
  async deleteNews(id) {
    try {
      const response = await api.delete(`/news/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting news:', error)
      throw error
    }
  },

  // Upload ảnh
  async uploadImage(formData) {
    try {
      const response = await api.post('/news/upload', formData)
      return response.data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  // Khôi phục tin tức
  async restoreNews(id) {
    try {
      const response = await api.patch(`/news/${id}/restore`)
      return response.data
    } catch (error) {
      console.error('Error restoring news:', error)
      throw error
    }
  },

  // Xóa vĩnh viễn tin tức
  async permanentDeleteNews(id) {
    try {
      const response = await api.delete(`/news/${id}`)
      return response.data
    } catch (error) {
      console.error('Error permanently deleting news:', error)
      throw error
    }
  },
}

export default newsService
