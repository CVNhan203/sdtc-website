import api from '../config';

const newsService = {
  // Lấy danh sách tin tức
  async getNews() {
    try {
      const response = await api.get('/news');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Lấy chi tiết tin tức theo ID
  async getNewsById(id) {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news details:', error);
      throw error;
    }
  },

  // Tạo tin tức mới
  async createNews(newsData) {
    try {
      const response = await api.post('/news', newsData);
      return response.data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  // Cập nhật tin tức
  async updateNews(id, newsData) {
    try {
      const response = await api.put(`/news/${id}`, newsData);
      return response.data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  // Xóa tin tức (soft delete)
  async deleteNews(id) {
    try {
      const response = await api.delete(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Khôi phục tin tức đã xóa
  async restoreNews(id) {
    try {
      const response = await api.patch(`/news/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error restoring news:', error);
      throw error;
    }
  },

  // Xóa vĩnh viễn tin tức
  async permanentDeleteNews(id) {
    try {
      const response = await api.delete(`/news/${id}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting news:', error);
      throw error;
    }
  },

  // Upload hình ảnh
  async uploadImage(formData) {
    try {
      const response = await api.post('/news/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default newsService; 