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
            v-model="formData.title"
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

        <div class="info-section">
          <div class="form-fields">
            <!-- Loại dịch vụ -->
            <div class="form-group type-group">
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
            <div class="form-group price-group">
              <label>Giá <span class="required">*</span></label>
              <input
                type="text"
                name="price"
                v-model="formData.price"
                :class="{ error: errors.price }"
                :disabled="loading"
                placeholder="Nhập giá dịch vụ"
                @input="validatePrice"
              />
              <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
            </div>
          </div>

          <!-- Ảnh -->
          <div class="form-group image-group">
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
                style="display: none;"
              />
              <div v-if="!imagePreview" class="upload-button">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Nhấp để tải ảnh lên</span>
                <p class="upload-hint">Định dạng: JPG, PNG, GIF</p>
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
        </div>

        <!-- Mô tả dịch vụ -->
        <div class="form-group content-section">
          <label>Mô tả dịch vụ <span class="required">*</span></label>
          <textarea
            name="content"
            v-model="formData.content"
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
    validatePrice() {
      const priceValue = Number(this.formData.price);
      if (isNaN(priceValue) || priceValue < 0 || priceValue > 1000000000) {
        this.errors.price = 'Giá dịch vụ phải là một số không âm và không vượt quá 1 tỷ';
      } else {
        delete this.errors.price; // Clear error if valid
      }
    },
    validateForm() {
      let isValid = true;
      let newErrors = {};

      // Tiêu đề validation
      if (!this.formData.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống';
        isValid = false; // Set isValid to false
      } else {
        const trimmedTitle = this.formData.title.trim();
        
        // Kiểm tra khoảng trắng đầu và cuối
        if (this.formData.title !== trimmedTitle) {
          newErrors.title = 'Tiêu đề không được có khoảng trắng ở đầu hoặc cuối';
          isValid = false; // Set isValid to false
        }
        // Kiểm tra độ dài
        else if (trimmedTitle.length < 3) {
          newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
          isValid = false; // Set isValid to false
        } else if (trimmedTitle.length > 200) {
          newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
          isValid = false; // Set isValid to false
        }
        // Kiểm tra khoảng trắng liên tiếp
        else if (/\s{2,}/.test(trimmedTitle)) {
          newErrors.title = 'Tiêu đề không được có nhiều khoảng trắng liên tiếp';
          isValid = false; // Set isValid to false
        }
        // Kiểm tra ký tự đặc biệt
        else if (!/^[a-zA-Z0-9À-ỹ\s.,!?-]+$/.test(trimmedTitle)) {
          newErrors.title = 'Tiêu đề chỉ được chứa chữ cái, số, dấu cách và các ký tự .,!?-';
          isValid = false; // Set isValid to false
        }
      }

      // Loại dịch vụ validation
      if (!this.formData.type) {
        newErrors.type = 'Vui lòng chọn loại dịch vụ';
        isValid = false; // Set isValid to false
      } else if (!['web', 'app', 'agency'].includes(this.formData.type)) {
        newErrors.type = 'Loại dịch vụ không hợp lệ';
        isValid = false; // Set isValid to false
      }

      // Giá validation
      if (
        this.formData.price === undefined ||
        this.formData.price === null ||
        this.formData.price === ''
      ) {
        newErrors.price = 'Giá dịch vụ không được để trống';
        isValid = false; // Set isValid to false
      } else {
        const priceValue = Number(this.formData.price);
        if (isNaN(priceValue)) {
          newErrors.price = 'Giá dịch vụ phải là một số';
          isValid = false; // Set isValid to false
        } else if (priceValue <= 0) {
          newErrors.price = 'Giá dịch vụ phải lớn hơn 0';
          isValid = false; // Set isValid to false
        } else if (priceValue > 1000000000) {
          newErrors.price = 'Giá dịch vụ quá lớn';
          isValid = false; // Set isValid to false
        }
      }

      // Mô tả validation
      const content = this.formData.content;

      if (typeof content !== 'string' || content.trim() === '') {
        newErrors.content = 'Mô tả không được để trống';
        isValid = false; // Set isValid to false
      } else {
        const trimmedContent = content.trim();
        
        if (trimmedContent.length < 10) {
          newErrors.content = 'Mô tả phải có ít nhất 10 ký tự.';
          isValid = false; // Set isValid to false
        } else if (trimmedContent.length > 1000) {
          newErrors.content = 'Mô tả không được vượt quá 1000 ký tự.';
          isValid = false; // Set isValid to false
        } else if (/\s{2,}/.test(trimmedContent)) {
          newErrors.content = 'Mô tả không được có nhiều khoảng trắng liên tiếp.';
          isValid = false; // Set isValid to false
        } else if (!/^[a-zA-Z0-9À-ỹ\s.,!?()]+$/.test(trimmedContent)) {
          newErrors.content = 'Mô tả chỉ được chứa chữ cái, số, dấu cách và các ký tự .,!?()';
          isValid = false; // Set isValid to false
        } else {
          this.formData.content = trimmedContent;
        }
      }

      // // Ảnh validation - Chỉ kiểm tra khi thêm mới
      // if (!this.isEditing && !this.formData.image && !this.imagePreview) {
      //   newErrors.image = 'Vui lòng tải lên ảnh cho dịch vụ';
      //   isValid = false; // Set isValid to false
      // }

      this.errors = newErrors;

      return isValid;
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
      // Trim whitespace from title
      this.formData.title = this.formData.title.trim();

      // Perform validation
      if (!this.validateForm()) {
        // Focus on the first field with an error
        const errorFields = Object.keys(this.errors);
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0];
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.focus();
          }
        }
        return;
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
          title: this.formData.title,
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

@import "@/styles/admin.css";

.insert-service {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.form-container {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.required {
  color: #dc2626;
  margin-left: 4px;
}

select{
  background: #f9fafb;
  padding: 10px 32px 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}
input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
textarea:focus {
  border-color: #3b82f6;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 20px;
  align-items: start;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.type-group,
.price-group,
.image-group {
  margin-bottom: 0;
}

.image-upload-container {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.image-upload-container:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.upload-button i {
  font-size: 2.5rem;
  color: #3b82f6;
  margin-bottom: 8px;
}

.upload-button span {
  font-size: 1.1rem;
  color: #374151;
  font-weight: 500;
}

.upload-hint {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.remove-image {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.remove-image:hover {
  background: #dc2626;
  color: white;
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 6px;
  display: block;
}

.character-count {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: right;
  margin-top: 6px;
}

.character-count.error {
  color: #dc2626;
}

.error-alert,
.success-alert {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-alert {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.success-alert {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.file-input {
  display: none;
}

@media (max-width: 1024px) {
  .info-section {
    grid-template-columns: 1fr;
  }
  
  .form-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .insert-service {
    padding: 16px;
  }

  .form-container {
    padding: 24px;
  }

  .info-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .insert-service {
    padding: 12px;
  }

  .form-container {
    padding: 16px;
    border-radius: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
