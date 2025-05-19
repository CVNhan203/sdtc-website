// frontend/src/api/services/serviceService.js
import api from '../config'

const serviceService = {
  async getServices(params) {
    try {
      const response = await api.get('/services', { params })
      return {
        data: response.data.data || [], // Dữ liệu dịch vụ
        pagination: response.data.pagination || null, // Thông tin phân trang
        message: response.data.message || '', // Thông báo từ server
      }
    } catch (error) {
      console.error('Error fetching services:', error) // Ghi log lỗi nếu có
      throw error // Ném lỗi ra ngoài
    }
  },

  async getServiceById(id) {
    try {
      const response = await api.get(`/services/${id}`) // Gọi API để lấy thông tin dịch vụ
      return response.data.data // Trả về dữ liệu dịch vụ
    } catch (error) {
      console.error('Error fetching service details:', error) // Ghi log lỗi nếu có
      throw error // Ném lỗi ra ngoài
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
      console.error('Error creating service:', error); // Ghi log lỗi nếu có
      console.error('Error response:', error.response?.data); // Ghi log phản hồi lỗi từ server
      throw error // Ném lỗi ra ngoài
    }
  },

  // Cập nhật thông tin dịch vụ theo ID
  async updateService(id, serviceData) {
    try {
      // Chuyển đổi mô tả dịch vụ thành mảng nếu không phải là mảng
      serviceData.description = Array.isArray(serviceData.description)
        ? serviceData.description
        : typeof serviceData.description === 'string'
          ? serviceData.description.split('\n').map(line => line.trim()).filter(line => line.length >= 10)
          : ['Mô tả dịch vụ mặc định'];

      // Nếu không có mô tả, gán mô tả mặc định
      if (!serviceData.description.length) {
        serviceData.description = ['Mô tả dịch vụ mặc định'];
      }

      console.log('Updating service data:', serviceData); // Ghi log dữ liệu dịch vụ đang cập nhật
      const response = await api.put(`/services/${id}`, serviceData); // Gọi API để cập nhật dịch vụ

      // Kiểm tra phản hồi từ server
      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể cập nhật dịch vụ'); // Ném lỗi nếu không thành công
      }

      console.log('Service updated successfully:', response.data); // Ghi log thông báo thành công
      return response.data // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error('Error updating service:', error); // Ghi log lỗi nếu có
      throw new Error(error.response?.data?.message || 'Không thể cập nhật dịch vụ'); // Ném lỗi ra ngoài
    }
  },

  // Xóa dịch vụ theo ID
  async deleteService(id) {
    try {
      const response = await api.delete(`/services/${id}`); // Gọi API để xóa dịch vụ
      return response.data // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error('Error deleting service:', error); // Ghi log lỗi nếu có
      throw error // Ném lỗi ra ngoài
    }
  },

  // Khôi phục dịch vụ đã xóa
  async restoreService(id) {
    try {
      const response = await api.patch(`/services/${id}/restore`, { isDeleted: false }); // Gọi API để khôi phục dịch vụ
      return response.data // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error('Error restoring service:', error); // Ghi log lỗi nếu có
      throw error // Ném lỗi ra ngoài
    }
  },

  // Xóa vĩnh viễn dịch vụ
  async permanentDeleteService(id) {
    try {
      const response = await api.delete(`/services/${id}/permanent`); // Gọi API để xóa vĩnh viễn dịch vụ
      return response.data // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error('Error permanently deleting service:', error); // Ghi log lỗi nếu có
      throw error // Ném lỗi ra ngoài
    }
  },

  // Tải ảnh lên
  async uploadImage(formData) {
    try {
      const response = await api.post('/services/upload', formData, {
        maxContentLength: 5 * 1024 * 1024, // Giới hạn kích thước nội dung
        maxBodyLength: 5 * 1024 * 1024, // Giới hạn kích thước body
      });

      // Kiểm tra phản hồi từ server
      if (!response.data?.imagePath) {
        throw new Error('Không nhận được đường dẫn ảnh từ server'); // Ném lỗi nếu không nhận được đường dẫn ảnh
      }

      return response.data // Trả về dữ liệu phản hồi
    } catch (error) {
      console.error('Error uploading image:', error); // Ghi log lỗi nếu có
      if (error.response?.status === 413) {
        throw new Error('Kích thước file quá lớn, vui lòng chọn file nhỏ hơn 5MB'); // Ném lỗi nếu file quá lớn
      }
      throw new Error(error.response?.data?.message || 'Không thể tải ảnh lên'); // Ném lỗi ra ngoài
    }
  },
}

export default serviceService // Xuất đối tượng serviceService để sử dụng ở nơi khác