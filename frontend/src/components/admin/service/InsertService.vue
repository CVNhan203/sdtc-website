<template>
  <div class="insert-service">
    <div class="form-container">
      <!-- Success message -->
      <div v-if="successMessage" class="success-alert">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" :class="{ submitting: loading }" novalidate>
        <!-- Hiển thị lỗi chung -->
        <div v-if="error" class="error-alert">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>

        <!-- Upload status -->
        <div v-if="uploadStatus" class="status-alert">
          <i class="fas fa-spinner fa-spin" v-if="uploadStatus.includes('Đang')"></i>
          <i class="fas fa-check" v-else></i>
          {{ uploadStatus }}
        </div>

        <!-- Tiêu đề -->
        <div class="form-group">
          <label>Tiêu đề <span class="required">*</span></label>
          <input
            type="text"
            name="title"
            v-model.trim="formData.title"
            :class="{ error: errors.title }"
            :disabled="loading"
            placeholder="Nhập tiêu đề dịch vụ"
            minlength="3"
            maxlength="200"
          />
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ error: formData.title.length > 200 }">
            {{ formData.title.length }}/200
          </span>
        </div>

        <!-- Info section: Type and Price -->
        <div class="info-section">
          <!-- Loại dịch vụ -->
          <div class="form-group">
            <label>Loại dịch vụ <span class="required">*</span></label>
            <select
              name="type"
              v-model="formData.type"
              :class="{ error: errors.type }"
              :disabled="loading"
            >
              <option value="">Chọn loại dịch vụ</option>
              <option value="web">Website</option>
              <option value="app">Ứng dụng</option>
              <option value="agency">Agency</option>
            </select>
            <span class="error-message" v-if="errors.type">{{ errors.type }}</span>
          </div>

          <!-- Giá -->
          <div class="form-group">
            <label>Giá <span class="required">*</span></label>
            <input
              type="number"
              name="price"
              v-model="formData.price"
              :class="{ error: errors.price }"
              :disabled="loading"
              placeholder="Nhập giá dịch vụ"
              min="0"
            />
            <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
          </div>
        </div>

        <!-- Ảnh -->
        <div class="form-group">
          <label>Ảnh</label>
          <div
            class="image-upload-container"
            @click="triggerFileInput"
            :class="{ 'error-border': errors.image }"
          >
            <input
              type="file"
              name="image"
              class="file-input"
              @change="handleImageUpload"
              accept="image/*"
              ref="fileInput"
              :disabled="loading"
            />
            <div v-if="!imagePreview" class="upload-button">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
              <p class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
              <p class="upload-hint">Kích thước tối thiểu: 200x200px, tối đa 2000x2000px</p>
            </div>
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" class="preview-img" />
              <button
                type="button"
                @click.stop="removeImage"
                class="remove-image"
                :disabled="loading"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <span class="error-message" v-if="errors.image">{{ errors.image }}</span>
        </div>

        <!-- Mô tả dịch vụ -->
        <div class="form-group content-section">
          <label>Mô tả dịch vụ <span class="required">*</span></label>
          <textarea
            name="content"
            v-model.trim="formData.content"
            :class="{ error: errors.content }"
            :disabled="loading"
            rows="6"
            placeholder="Nhập mô tả chi tiết về dịch vụ"
            maxlength="2000"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ error: formData.content.length > 2000 }">
            {{ formData.content.length }}/2000
          </span>
          <small class="form-help-text"
            >Mỗi dòng mô tả cần có ít nhất 10 ký tự và tối đa 500 ký tự.</small
          >
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="button"
            class="cancel-btn"
            @click="$router.push('/admin/dich-vu/danh-sach')"
            :disabled="loading"
          >
            <i class="fas fa-times"></i> Hủy
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ loading ? 'Đang xử lý...' : 'Thêm dịch vụ' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService'

export default {
  name: 'InsertService',
  data() {
    return {
      formData: {
        title: '',
        price: '',
        content: '',
        image: null,
        type: '',
      },
      imagePreview: null,
      loading: false,
      error: null,
      maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
      errors: {}, // Add errors object for validation
      uploadStatus: '',
      successMessage: '',
    }
  },
  computed: {
    isFormValid() {
      // Only basic validation - check required fields
      return (
        this.formData.title?.trim() &&
        this.formData.type &&
        this.formData.price > 0 &&
        this.formData.content?.trim()
      )
    },
  },
  methods: {
    triggerFileInput() {
      if (this.$refs.fileInput && !this.loading) {
        this.$refs.fileInput.click()
      }
    },
    validateForm() {
      const newErrors = {}

      // Tiêu đề validation
      if (!this.formData.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống'
      } else if (this.formData.title.trim().length < 3) {
        newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự'
      } else if (this.formData.title.trim().length > 100) {
        newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự'
      } else if (!/^[a-zA-Z0-9\sÀ-ỹ[\]{}()!@#$%^&*,.?-]+$/.test(this.formData.title.trim())) {
        newErrors.title = 'Tiêu đề chứa ký tự không hợp lệ'
      }

      // Loại dịch vụ validation
      if (!this.formData.type) {
        newErrors.type = 'Vui lòng chọn loại dịch vụ'
      } else if (!['web', 'app', 'agency'].includes(this.formData.type)) {
        newErrors.type = 'Loại dịch vụ không hợp lệ'
      }

      // Giá validation
      if (
        this.formData.price === undefined ||
        this.formData.price === null ||
        this.formData.price === ''
      ) {
        newErrors.price = 'Giá dịch vụ không được để trống'
      } else {
        const priceValue = Number(this.formData.price)
        if (isNaN(priceValue)) {
          newErrors.price = 'Giá dịch vụ phải là một số'
        } else if (priceValue <= 0) {
          newErrors.price = 'Giá dịch vụ phải lớn hơn 0'
        } else if (priceValue > 1000000000) {
          newErrors.price = 'Giá dịch vụ quá lớn'
        }
      }

      // Mô tả validation
      if (!this.formData.content?.trim()) {
        newErrors.content = 'Mô tả không được để trống'
      } else {
        const lines = this.formData.content.split('\n').filter((line) => line.trim())
        if (lines.length === 0) {
          newErrors.content = 'Mô tả không được để trống'
        } else {
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            if (line.length < 10) {
              newErrors.content = `Dòng ${i + 1}: Mỗi dòng mô tả phải có ít nhất 10 ký tự`
              break
            } else if (line.length > 500) {
              newErrors.content = `Dòng ${i + 1}: Mỗi dòng mô tả không được vượt quá 500 ký tự`
              break
            }
          }
        }
      }

      // Ảnh validation is now optional - only validate if an image is provided
      // No validation needed if no image is provided

      this.errors = newErrors
      return Object.keys(newErrors).length === 0
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Reset image error
      delete this.errors.image

      // Check file size (5MB limit)
      if (file.size > this.maxFileSize) {
        this.errors.image = `Kích thước file không được vượt quá ${this.maxFileSize / (1024 * 1024)}MB`
        this.$refs.fileInput.value = ''
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        this.errors.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
        this.$refs.fileInput.value = ''
        return
      }

      // Check image dimensions (create a temporary image to check)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)

        // Minimum dimensions check
        if (img.width < 200 || img.height < 200) {
          this.errors.image = 'Kích thước ảnh quá nhỏ (tối thiểu 200x200 pixels)'
          this.$refs.fileInput.value = ''
          this.formData.image = null
          this.imagePreview = null
          return
        }

        // Maximum dimensions check
        if (img.width > 2000 || img.height > 2000) {
          this.errors.image = 'Kích thước ảnh quá lớn (tối đa 2000x2000 pixels)'
          this.$refs.fileInput.value = ''
          this.formData.image = null
          this.imagePreview = null
          return
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        this.errors.image = 'File không phải là ảnh hợp lệ'
        this.$refs.fileInput.value = ''
        this.formData.image = null
        this.imagePreview = null
      }

      img.src = URL.createObjectURL(file)

      // Set image preview and data
      this.formData.image = file
      this.imagePreview = URL.createObjectURL(file)
    },
    removeImage(e) {
      if (e) e.stopPropagation()
      this.formData.image = null
      this.imagePreview = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    async handleSubmit() {
      // Perform validation
      if (!this.validateForm()) {
        // Focus on the first field with an error
        const errorFields = Object.keys(this.errors)
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0]
          const element = document.querySelector(`[name="${firstErrorField}"]`)
          if (element) {
            element.focus()
          }
        }
        return
      }

      if (this.loading) return
      this.loading = true
      this.error = null

      try {
        let imageUrl = null

        // Upload image if exists
        if (this.formData.image instanceof File) {
          const formData = new FormData()
          formData.append('image', this.formData.image)

          try {
            this.uploadStatus = 'Đang tải ảnh lên...'
            const uploadResponse = await serviceService.uploadImage(formData)
            if (uploadResponse && uploadResponse.imagePath) {
              imageUrl = uploadResponse.imagePath
              this.uploadStatus = 'Tải ảnh thành công!'
            } else {
              throw new Error('Không nhận được đường dẫn ảnh')
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError)
            this.error = 'Lỗi khi tải ảnh lên: ' + (uploadError.message || 'Không xác định')
            this.loading = false
            return
          }
        }

        // Prepare service data according to backend model
        this.uploadStatus = 'Đang xử lý...'
        const serviceData = {
          title: this.formData.title.trim(),
          description: this.formData.content
            .trim()
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => line.trim()),
          price: Number(this.formData.price),
          type: this.formData.type,
        }

        if (imageUrl) {
          serviceData.image = imageUrl
        }

        // Create service
        const response = await serviceService.createService(serviceData)

        if (response.success) {
          // Show success message
          this.successMessage = 'Thêm dịch vụ thành công!'

          // Reset form and navigate after a brief delay to show success message
          setTimeout(() => {
            this.resetForm()
            this.$router.push('/admin/dich-vu/danh-sach')
          }, 1000)
        } else {
          throw new Error(response.message || 'Không thể tạo dịch vụ')
        }
      } catch (error) {
        console.error('Error submitting form:', error)

        // Handle validation errors from backend
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors

          // Map backend errors to form fields
          const errorMapping = {
            title: 'title',
            description: 'content',
            price: 'price',
            type: 'type',
            image: 'image',
          }

          // Reset all errors first
          this.errors = {}

          // Map backend errors to frontend error fields
          Object.entries(backendErrors).forEach(([field, message]) => {
            const frontendField = errorMapping[field] || field
            this.errors[frontendField] = Array.isArray(message) ? message[0] : message
          })

          // Scroll to the first error field
          const errorFields = Object.keys(this.errors)
          if (errorFields.length > 0) {
            const firstErrorField = errorFields[0]
            const element = document.querySelector(`[name="${firstErrorField}"]`)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              setTimeout(() => element.focus(), 500)
            }
          }

          this.error = 'Vui lòng kiểm tra lại thông tin nhập'
        } else {
          // General error message
          this.error =
            error.response?.data?.message ||
            error.message ||
            'Có lỗi xảy ra khi thêm dịch vụ. Vui lòng thử lại!'
        }
      } finally {
        this.loading = false
        this.uploadStatus = ''
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        price: '',
        content: '',
        image: null,
        type: '',
      }
      this.imagePreview = null
      this.error = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
  },
  beforeUnmount() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview)
    }
  },
}
</script>

<style scoped>
@import '@/styles/admin.css';

/* Component-specific styles that aren't in admin.css */
.content-section {
  grid-column: 1 / -1;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 0;
  grid-column: 1 / -1;
}

.image-upload-container {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  position: relative;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.image-upload-container:hover {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.file-input {
  display: none;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.preview-img {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.remove-image:hover {
  background: var(--danger-color);
  color: white;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.upload-button i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 4px;
  line-height: 1.3;
}

.character-count {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 6px;
}

.character-count.error {
  color: var(--danger-color);
}

.error-border {
  border-color: var(--danger-color) !important;
}

.form-help-text {
  font-size: 0.75rem;
  margin-top: 3px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .image-upload-container {
    min-height: 180px;
    padding: 16px;
  }
}
</style>
