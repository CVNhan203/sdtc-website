import api from '../config'

const newsService = {
  // Lấy danh sách tin tức
  getNews() {
    return api.get('/news')
  },

  // Lấy chi tiết tin tức
  getNewsById(id) {
    return api.get(`/news/${id}`)
  },

  // Tạo tin tức mới
  createNews(data) {
    const formData = new FormData()
    
    // Thêm các trường dữ liệu vào FormData
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key])
      } else {
        formData.append(key, data[key])
      }
    })

    return api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Cập nhật tin tức
  updateNews(id, data) {
    const formData = new FormData()
    
    // Thêm các trường dữ liệu vào FormData
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key])
      } else {
        formData.append(key, data[key])
      }
    })

    return api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Xóa tin tức
  deleteNews(id) {
    return api.delete(`/news/${id}`)
  },

  // Upload ảnh
  async uploadImage(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    return api.post('/news/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  restoreNews(id) {
    return api.patch(`/news/${id}/restore`)
  },

  permanentDeleteNews(id) {
    return api.delete(`/news/${id}/permanent`)
  }
}

export default newsService 