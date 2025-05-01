<template>
  <div class="edit-news">
    <div class="form-container">
      <form @submit.prevent="handleSubmit" :class="{ 'submitting': isSubmitting }">
        <!-- Tiêu đề -->
        <div class="form-group">
          <label>Tiêu đề <span class="required">*</span></label>
          <input 
            type="text" 
            v-model.trim="formData.title"
            :class="{ 'error': errors.title }"
            :disabled="isSubmitting"
            placeholder="Nhập tiêu đề tin tức"
            required
          >
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ 'error': formData.title.length > 200 }">
            {{ formData.title.length }}/200
          </span>
        </div>

        <!-- Ảnh -->
        <div class="form-group">
          <label>Ảnh <span class="required">*</span></label>
          <div class="image-upload-container" :class="{ 'has-error': errors.image }">
            <div 
              class="image-preview" 
              v-if="imagePreview"
              :style="{ backgroundImage: `url(${imagePreview})` }"
            >
              <button type="button" class="remove-image" @click="removeImage" :disabled="isSubmitting">
                <i class="fas fa-times"></i>
              </button>
              <div class="image-info" v-if="formData.image">
                <span>{{ formatFileSize(formData.image.size) }}</span>
                <span>{{ formData.image.name }}</span>
              </div>
            </div>
            <div class="upload-button" v-else>
              <input 
                type="file" 
                ref="fileInput"
                @change="handleImageChange" 
                accept="image/*"
                class="file-input"
                :disabled="isSubmitting"
              >
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
              <p class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
            </div>
          </div>
          <span class="error-message" v-if="errors.image">{{ errors.image }}</span>
        </div>

        <!-- Tóm tắt -->
        <div class="form-group">
          <label>Tóm tắt <span class="required">*</span></label>
          <textarea 
            v-model.trim="formData.summary"
            :class="{ 'error': errors.summary }"
            :disabled="isSubmitting"
            rows="3"
            placeholder="Nhập tóm tắt nội dung"
            required
          ></textarea>
          <span class="error-message" v-if="errors.summary">{{ errors.summary }}</span>
          <span class="character-count" :class="{ 'error': formData.summary.length > 500 }">
            {{ formData.summary.length }}/500
          </span>
        </div>

        <!-- Nội dung chi tiết -->
        <div class="form-group">
          <label>Nội dung chi tiết <span class="required">*</span></label>
          <textarea 
            v-model.trim="formData.content"
            :class="{ 'error': errors.content }"
            :disabled="isSubmitting"
            rows="6"
            placeholder="Nhập nội dung chi tiết"
            required
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ 'error': formData.content.length > 5000 }">
            {{ formData.content.length }}/5000
          </span>
        </div>

        <!-- Phân loại -->
        <div class="form-group">
          <label>Phân loại <span class="required">*</span></label>
          <select 
            v-model="formData.type"
            :class="{ 'error': errors.type }"
            :disabled="isSubmitting"
            required
          >
            <option value="">Chọn loại tin tức</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="su-kien">Sự kiện</option>
            <option value="thong-bao">Thông báo</option>
          </select>
          <span class="error-message" v-if="errors.type">{{ errors.type }}</span>
        </div>

        <!-- Tác giả -->
        <div class="form-group">
          <label>Tác giả <span class="required">*</span></label>
          <input 
            type="text" 
            v-model.trim="formData.author"
            :class="{ 'error': errors.author }"
            :disabled="isSubmitting"
            placeholder="Nhập tên tác giả"
            required
          >
          <span class="error-message" v-if="errors.author">{{ errors.author }}</span>
        </div>

        <!-- Ngày đăng -->
        <div class="form-group">
          <label>Ngày đăng <span class="required">*</span></label>
          <input 
            type="date" 
            v-model="formData.publishedDate"
            :class="{ 'error': errors.publishedDate }"
            :disabled="isSubmitting"
            :min="minDate"
            required
          >
          <span class="error-message" v-if="errors.publishedDate">{{ errors.publishedDate }}</span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link 
            to="/admin/tin-tuc/danh-sach" 
            class="cancel-btn"
            :class="{ 'disabled': isSubmitting }"
            v-if="!hasChanges || !isSubmitting"
          >
            <i class="fas fa-times"></i>
            Hủy
          </router-link>
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting || !isFormValid"
          >
            <i class="fas" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ isSubmitting ? 'Đang lưu...' : 'Cập nhật tin tức' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Confirm Modal -->
    <div class="modal" v-if="showConfirmModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận hủy</h3>
          <button class="close-btn" @click="showConfirmModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="showConfirmModal = false">
              <i class="fas fa-times"></i>
              Tiếp tục chỉnh sửa
            </button>
            <button class="confirm-btn" @click="confirmCancel">
              <i class="fas fa-check"></i>
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import newsService from '@/api/news/newsService'
import eventBus from '@/eventBus'

export default {
  name: 'EditNews',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const initialFormData = {
      title: '',
      summary: '',
      content: '',
      image: null,
      type: '',
      author: '',
      publishedDate: new Date().toISOString().split('T')[0],
      view: 0,
      like: 0,
      isDeleted: false
    }
    
    const formData = ref({ ...initialFormData })
    const imagePreview = ref(null)
    const errors = ref({})
    const fileInput = ref(null)
    const isSubmitting = ref(false)
    const showConfirmModal = ref(false)
    const originalData = ref(null)

    // Computed properties
    const minDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const hasChanges = computed(() => {
      if (!originalData.value) return false
      return Object.keys(formData.value).some(key => {
        if (key === 'image') {
          return formData.value[key] !== originalData.value[key]
        }
        return formData.value[key]?.toString() !== originalData.value[key]?.toString()
      })
    })

    const isFormValid = computed(() => {
      // Kiểm tra các trường bắt buộc có giá trị
      const hasRequiredFields = 
        formData.value.title?.trim() &&
        formData.value.summary?.trim() &&
        formData.value.content?.trim() &&
        formData.value.type &&
        formData.value.author?.trim() &&
        formData.value.publishedDate

      // Kiểm tra độ dài các trường
      const isValidLength = 
        formData.value.title.length <= 200 &&
        formData.value.summary.length <= 500 &&
        formData.value.content.length <= 5000

      // Form hợp lệ khi có đầy đủ thông tin và không có lỗi
      return hasRequiredFields && isValidLength && Object.keys(errors.value).length === 0
    })

    // Methods
    const loadNews = async () => {
      try {
        const response = await newsService.getNewsById(route.params.id)
        if (response.data) {
          const news = response.data
          formData.value = {
            ...news,
            publishedDate: new Date(news.publishedDate).toISOString().split('T')[0]
          }
          originalData.value = { ...formData.value }
          if (news.image) {
            imagePreview.value = news.image
          }
        }
      } catch (error) {
        console.error('Error loading news:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải thông tin tin tức. Vui lòng thử lại.'
        })
      }
    }

    const validateForm = () => {
      const newErrors = {}

      if (!formData.value.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống'
      } else if (formData.value.title.length > 200) {
        newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
      }

      if (!formData.value.summary?.trim()) {
        newErrors.summary = 'Tóm tắt không được để trống'
      } else if (formData.value.summary.length > 500) {
        newErrors.summary = 'Tóm tắt không được vượt quá 500 ký tự'
      }

      if (!formData.value.content?.trim()) {
        newErrors.content = 'Nội dung không được để trống'
      } else if (formData.value.content.length > 5000) {
        newErrors.content = 'Nội dung không được vượt quá 5000 ký tự'
      }

      if (!formData.value.type) {
        newErrors.type = 'Vui lòng chọn loại tin tức'
      }

      if (!formData.value.author?.trim()) {
        newErrors.author = 'Tác giả không được để trống'
      }

      if (!formData.value.publishedDate) {
        newErrors.publishedDate = 'Vui lòng chọn ngày đăng'
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          errors.value.image = 'Kích thước ảnh không được vượt quá 5MB'
          return
        }

        if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
          errors.value.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
          return
        }

        formData.value.image = file
        imagePreview.value = URL.createObjectURL(file)
        errors.value.image = null
      }
    }

    const removeImage = () => {
      formData.value.image = null
      imagePreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Vui lòng kiểm tra lại thông tin nhập vào'
        })
        return
      }

      try {
        isSubmitting.value = true

        // Tạo đối tượng dữ liệu để gửi lên server
        const newsData = {
          title: formData.value.title.trim(),
          summary: formData.value.summary.trim(),
          content: formData.value.content.trim(),
          type: formData.value.type,
          author: formData.value.author.trim(),
          publishedDate: new Date(formData.value.publishedDate).toISOString(),
          view: formData.value.view,
          like: formData.value.like,
          isDeleted: formData.value.isDeleted
        }

        // Nếu có file ảnh mới, upload ảnh
        if (formData.value.image instanceof File) {
          const uploadResponse = await newsService.uploadImage(formData.value.image)
          if (uploadResponse.success) {
            newsData.image = uploadResponse.imagePath
          }
        } else if (imagePreview.value) {
          newsData.image = imagePreview.value
        }

        // Gọi API cập nhật tin tức
        const response = await newsService.updateNews(route.params.id, newsData)
        
        if (response.data.success) {
          // Hiển thị thông báo thành công
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Tin tức đã được cập nhật thành công'
          })
          
          // Chuyển về trang danh sách
          router.push('/admin/tin-tuc/danh-sach')
        } else {
          throw new Error(response.data.message || 'Có lỗi xảy ra khi cập nhật tin tức')
        }
      } catch (error) {
        console.error('Error updating news:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tin tức. Vui lòng thử lại.'
        })
      } finally {
        isSubmitting.value = false
      }
    }

    const confirmCancel = () => {
      showConfirmModal.value = false
      router.push('/admin/tin-tuc/danh-sach')
    }

    // Load news data when component mounts
    onMounted(() => {
      loadNews()
    })

    return {
      formData,
      imagePreview,
      errors,
      fileInput,
      isSubmitting,
      showConfirmModal,
      minDate,
      hasChanges,
      isFormValid,
      handleImageChange,
      removeImage,
      handleSubmit,
      confirmCancel,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.edit-news {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #4a5568;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2d3748;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

input[type="text"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  background-color: #fff;
  min-height: 42px;
  box-sizing: border-box;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234a5568' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.5l-5-5h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.error {
  border-color: #e53e3e !important;
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

.image-upload-container {
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-upload-container:hover {
  border-color: #4299e1;
}

.image-preview {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-button {
  position: relative;
  overflow: hidden;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-button i {
  font-size: 24px;
  color: #718096;
  margin-bottom: 8px;
}

.upload-button span {
  display: block;
  color: #718096;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn,
.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  text-decoration: none;
}

.submit-btn {
  background: #4299e1;
  color: white;
  border: none;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-btn:hover {
  background: #edf2f7;
}

.submit-btn:hover:not(:disabled) {
  background: #3182ce;
}

@media (max-width: 640px) {
  .edit-news {
    padding: 16px;
  }

  .form-container {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Additional styles */
.character-count {
  display: block;
  text-align: right;
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
}

.character-count.error {
  color: #dc2626;
}

.upload-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
}

.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
}

.submitting {
  opacity: 0.7;
  pointer-events: none;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.confirm-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.confirm-btn:hover {
  background: #b91c1c;
}

.has-error {
  border-color: #dc2626;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 