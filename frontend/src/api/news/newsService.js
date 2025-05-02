import api from '../config'

const newsService = {
  // Lấy danh sách tin tức
  async getNews() {
    try {
      const response = await api.get('/news')
      // Assuming the API returns an object with a 'data' property that contains the array
      return response.data.data || [] // Align with serviceService.js
    } catch (error) {
      console.error('Error fetching news:', error)
      throw error
    }
  },

  // Lấy chi tiết tin tức
  async getNewsById(id) {
    try {
      const response = await api.get(`/news/${id}`)
      return response.data
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
          'Content-Type': 'application/json'
        }
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
      console.log('Updating news with ID:', id, 'Data:', data);
      const response = await api.put(`/news/${id}`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Update news response:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
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
      console.log('Sending image upload request with FormData');
      // Don't manually set Content-Type for FormData - let the browser set it with boundary
      const response = await api.post('/news/upload', formData);
      console.log('Raw upload response:', response);
      
      if (!response.data) {
        console.error('No data in upload response');
        throw new Error('Invalid upload response: missing data');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error.response || error);
      throw error;
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
      const response = await api.delete(`/news/${id}/permanent`)
      return response.data
    } catch (error) {
      console.error('Error permanently deleting news:', error)
      throw error
    }
  }
}

export default newsService