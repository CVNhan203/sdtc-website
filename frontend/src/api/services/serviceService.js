// frontend/src/api/services/serviceService.js
import api from '../config'

const serviceService = {
  async getServices(params) {
    try {
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

  async getServiceById(id) {
    try {
      const response = await api.get(`/services/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching service details:', error)
      throw error
    }
  },

  async createService(serviceData) {
    try {
      serviceData.description = Array.isArray(serviceData.description)
        ? serviceData.description
        : typeof serviceData.description === 'string'
          ? serviceData.description
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line.length >= 10)
          : ['Mô tả dịch vụ mặc định']

      if (!serviceData.description.length) {
        serviceData.description = ['Mô tả dịch vụ mặc định']
      }

      serviceData.type = serviceData.type || 'web'
      serviceData.title =
        serviceData.title?.trim() || 'Dịch vụ mới ' + new Date().toLocaleDateString()

      console.log('Sending service data to backend:', serviceData)
      const response = await api.post('/services', serviceData)
      console.log('Service created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating service:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  async updateService(id, serviceData) {
    try {
      serviceData.description = Array.isArray(serviceData.description)
        ? serviceData.description
        : typeof serviceData.description === 'string'
          ? serviceData.description
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line.length >= 10)
          : ['Mô tả dịch vụ mặc định']

      if (!serviceData.description.length) {
        serviceData.description = ['Mô tả dịch vụ mặc định']
      }

      console.log('Updating service data:', serviceData)
      const response = await api.put(`/services/${id}`, serviceData)

      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể cập nhật dịch vụ')
      }

      console.log('Service updated successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error updating service:', error)
      throw new Error(error.response?.data?.message || 'Không thể cập nhật dịch vụ')
    }
  },

  async deleteService(id) {
    try {
      const response = await api.delete(`/services/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },

  async restoreService(id) {
    try {
      const response = await api.patch(`/services/${id}/restore`, { isDeleted: false })
      return response.data
    } catch (error) {
      console.error('Error restoring service:', error)
      throw error
    }
  },

  async permanentDeleteService(id) {
    try {
      const response = await api.delete(`/services/${id}/permanent`)
      return response.data
    } catch (error) {
      console.error('Error permanently deleting service:', error)
      throw error
    }
  },

  async uploadImage(formData) {
    try {
      const response = await api.post('/services/upload', formData, {
        maxContentLength: 5 * 1024 * 1024,
        maxBodyLength: 5 * 1024 * 1024,
      })

      if (!response.data?.imagePath) {
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
