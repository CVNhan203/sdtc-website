import api from '../config'

// Đối tượng serviceService chứa các phương thức để tương tác với API dịch vụ
const serviceService = {
  // Lấy danh sách dịch vụ
  async getServices(params) {
    try {
      // Sử dụng params để truy vấn nếu có
      const response = await api.get('/services', { params }) // Gửi yêu cầu GET đến API để lấy danh sách dịch vụ
      return {
        data: response.data.data || [], // Trả về dữ liệu dịch vụ, nếu không có thì trả về mảng rỗng
        pagination: response.data.pagination || null, // Trả về thông tin phân trang, nếu không có thì trả về null
        message: response.data.message || '', // Trả về thông điệp, nếu không có thì trả về chuỗi rỗng
      }
    } catch (error) {
      console.error('Error fetching services:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Lấy chi tiết một dịch vụ
  async getServiceById(id) {
    try {
      const response = await api.get(`/services/${id}`) // Gửi yêu cầu GET đến API với ID cụ thể
      return response.data.data // Trả về dữ liệu chi tiết dịch vụ
    } catch (error) {
      console.error('Error fetching service details:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Tạo dịch vụ mới
  async createService(serviceData) {
    try {
      // Đảm bảo description là một mảng
      if (serviceData.description && !Array.isArray(serviceData.description)) {
        if (typeof serviceData.description === 'string') {
          serviceData.description = serviceData.description
            .split('\n') // Chia chuỗi thành mảng theo dòng
            .map(line => line.trim()) // Xóa khoảng trắng ở đầu và cuối mỗi dòng
            .filter(line => line.length >= 10); // Lọc ra những dòng có độ dài tối thiểu là 10 ký tự
        } else {
          serviceData.description = ['Mô tả dịch vụ mặc định']; // Gán mô tả mặc định nếu không có
        }
      }
      
      // Nếu description là mảng rỗng, thêm một mô tả mặc định
      if (!serviceData.description || (Array.isArray(serviceData.description) && serviceData.description.length === 0)) {
        serviceData.description = ['Mô tả dịch vụ mặc định']; // Gán mô tả mặc định
      }
      
      // Đảm bảo các trường bắt buộc có giá trị
      if (!serviceData.type) {
        serviceData.type = 'web'; // Gán loại dịch vụ mặc định là 'web'
      }
      
      if (!serviceData.title || serviceData.title.trim() === '') {
        serviceData.title = 'Dịch vụ mới ' + new Date().toLocaleDateString(); // Gán tiêu đề mặc định
      }
      
      console.log('Sending service data to backend:', serviceData); // In ra dữ liệu dịch vụ sẽ gửi
      
      // Gửi dữ liệu trực tiếp, không sử dụng JSON.stringify
      const response = await api.post('/services', serviceData) // Gửi yêu cầu POST để tạo dịch vụ mới
      
      console.log('Service created successfully:', response.data); // In ra thông báo thành công
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error creating service:', error) // In ra lỗi nếu có
      console.error('Error response:', error.response?.data) // In ra phản hồi lỗi
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },

  // Cập nhật dịch vụ
  async updateService(id, serviceData) {
    try {
      // Đảm bảo description là một mảng
      if (serviceData.description && !Array.isArray(serviceData.description)) {
        if (typeof serviceData.description === 'string') {
          serviceData.description = serviceData.description
            .split('\n') // Chia chuỗi thành mảng theo dòng
            .map(line => line.trim()) // Xóa khoảng trắng ở đầu và cuối mỗi dòng
            .filter(line => line.length >= 10); // Lọc ra những dòng có độ dài tối thiểu là 10 ký tự
        } else {
          serviceData.description = ['Mô tả dịch vụ mặc định']; // Gán mô tả mặc định nếu không có
        }
      }
      
      // Nếu description là mảng rỗng, thêm một mô tả mặc định
      if (!serviceData.description || (Array.isArray(serviceData.description) && serviceData.description.length === 0)) {
        serviceData.description = ['Mô tả dịch vụ mặc định']; // Gán mô tả mặc định
      }
      
      console.log('Updating service data:', serviceData); // In ra dữ liệu dịch vụ sẽ cập nhật
      
      // Gửi dữ liệu trực tiếp, không sử dụng JSON.stringify
      const response = await api.put(`/services/${id}`, serviceData) // Gửi yêu cầu PUT để cập nhật dịch vụ

      if (!response.data.success) {
        throw new Error(response.data.message || 'Không thể cập nhật dịch vụ') // Ném lỗi nếu không thành công
      }
      
      console.log('Service updated successfully:', response.data); // In ra thông báo thành công
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error updating service:', error) // In ra lỗi nếu có
      throw error.response?.data?.message
        ? new Error(error.response.data.message) // Ném lỗi từ phản hồi nếu có
        : new Error('Không thể cập nhật dịch vụ') // Ném lỗi mặc định
    }
  },

  // Xóa dịch vụ
  async deleteService(id) {
    try {
      const response = await api.delete(`/services/${id}`) // Gửi yêu cầu DELETE để xóa dịch vụ
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error deleting service:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },
  
  // Khôi phục dịch vụ đã xóa
  async restoreService(id) {
    try {
      // Gửi yêu cầu PATCH để khôi phục dịch vụ (đặt isDeleted = false)
      const response = await api.patch(`/services/${id}/restore`, { isDeleted: false }) // Gửi yêu cầu PATCH để khôi phục dịch vụ
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error restoring service:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
    }
  },
  
  // Xóa vĩnh viễn dịch vụ
  async permanentDeleteService(id) {
    try {
      const response = await api.delete(`/services/${id}/permanent`) // Gửi yêu cầu DELETE để xóa vĩnh viễn dịch vụ
      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error permanently deleting service:', error) // In ra lỗi nếu có
      throw error // Ném lỗi ra ngoài để xử lý
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
        throw new Error('Không nhận được đường dẫn ảnh từ server') // Ném lỗi nếu không nhận được đường dẫn ảnh
      }

      return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
      console.error('Error uploading image:', error) // In ra lỗi nếu có
      if (error.response?.status === 413) {
        throw new Error('Kích thước file quá lớn, vui lòng chọn file nhỏ hơn 5MB') // Ném lỗi nếu file quá lớn
      }
      throw new Error(error.response?.data?.message || 'Không thể tải ảnh lên') // Ném lỗi nếu không thể tải ảnh lên
    }
  },
}

export default serviceService // Xuất đối tượng serviceService để sử dụng ở nơi khác
