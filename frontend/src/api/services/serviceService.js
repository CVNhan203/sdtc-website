import api from '../config'

const serviceService = {
  // Lấy danh sách dịch vụ
  async getServices(params) {
    try {
      // Use params for querying if provided
      const response = await api.get('/services', { params })
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || null,
        message: response.data.message || '',
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  // Lấy chi tiết một dịch vụ
  async getServiceById(id) {
    try {
      const response = await api.get(`/services/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching service details:', error)
      throw error
    }
  },

  // Tạo dịch vụ mới
  async createService(serviceData) {
    try {
      // Đảm bảo description là một mảng
      if (serviceData.description && !Array.isArray(serviceData.description)) {
        if (typeof serviceData.description === 'string') {
          serviceData.description = serviceData.description
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length >= 10);
        } else {
          serviceData.description = ['Mô tả dịch vụ mặc định'];
        }
      }
      
      // Nếu description là mảng rỗng, thêm một mô tả mặc định
      if (!serviceData.description || (Array.isArray(serviceData.description) && serviceData.description.length === 0)) {
        serviceData.description = ['Mô tả dịch vụ mặc định'];
      }
      
      // Đảm bảo các trường bắt buộc có giá trị
      if (!serviceData.type) {
        serviceData.type = 'web';
      }
      
      if (!serviceData.title || serviceData.title.trim() === '') {
        serviceData.title = 'Dịch vụ mới ' + new Date().toLocaleDateString();
      }
      
      console.log('Sending service data to backend:', serviceData);
      
      // Gửi dữ liệu trực tiếp, không sử dụng JSON.stringify
      const response = await api.post('/services', serviceData)
      
      console.log('Service created successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Error creating service:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  // Cập nhật dịch vụ
  async updateService(id, serviceData) {
    try {
      // Đảm bảo description là một mảng
      if (serviceData.description && !Array.isArray(serviceData.description)) {
        if (typeof serviceData.description === 'string') {
          serviceData.description = serviceData.description
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length >= 10);
        } else {
          serviceData.description = ['Mô tả dịch vụ mặc định'];
        }
      }
      
      // Nếu description là mảng rỗng, thêm một mô tả mặc định
      if (!serviceData.description || (Array.isArray(serviceData.description) && serviceData.description.length === 0)) {
        serviceData.description = ['Mô tả dịch vụ mặc định'];
      }
      
      console.log('Updating service data:', serviceData);
      
      // Gửi dữ liệu trực tiếp, không sử dụng JSON.stringify
      const response = await api.put(`/services/${id}`, serviceData)

      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể cập nhật dịch vụ')
      }
      
      console.log('Service updated successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Error updating service:', error)
      throw error.response?.data?.message
        ? new Error(error.response.data.message)
        : new Error('Không thể cập nhật dịch vụ')
    }
  },

  // Xóa dịch vụ
  async deleteService(id) {
    try {
      const response = await api.delete(`/services/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },
  
  // Khôi phục dịch vụ đã xóa
  async restoreService(id) {
    try {
      // Gửi yêu cầu PATCH để khôi phục dịch vụ (đặt isDeleted = false)
      const response = await api.patch(`/services/${id}/restore`, { isDeleted: false })
      return response.data
    } catch (error) {
      console.error('Error restoring service:', error)
      throw error
    }
  },
  
  // Xóa vĩnh viễn dịch vụ
  async permanentDeleteService(id) {
    try {
      const response = await api.delete(`/services/${id}/permanent`)
      return response.data
    } catch (error) {
      console.error('Error permanently deleting service:', error)
      throw error
    }
  },

  // Upload ảnh dịch vụ
  async uploadImage(formData) {
    try {
      const response = await api.post('/services/upload', formData, {
        headers: {
          // Không cần set Content-Type khi upload file,
          // để browser tự động set với boundary đúng
        },
        maxContentLength: 5 * 1024 * 1024, // 5MB
        maxBodyLength: 5 * 1024 * 1024,
      })

      if (!response.data || !response.data.imagePath) {
        throw new Error('Không nhận được đường dẫn ảnh từ server')
      }

      return response.data
    } catch (error) {
      console.error('Error uploading image:', error)
      if (error.response?.status === 413) {
        throw new Error('Kích thước file quá lớn, vui lòng chọn file nhỏ hơn 5MB')
      }
      throw new Error(error.response?.data?.message || 'Không thể tải ảnh lên')
    }
  },
}

export default serviceService
