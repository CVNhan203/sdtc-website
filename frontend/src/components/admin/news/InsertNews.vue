<template>
  <div class="insert-news">
    <div class="form-container">
      <form @submit.prevent="handleSubmit" :class="{ submitting: loading }" novalidate>
        <!-- Thông báo lỗi chung -->
        <div v-if="error" class="error-alert">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>

        <!-- Thông báo thành công -->
        <div v-if="successMessage" class="success-alert">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </div>

        <!-- Tiêu đề + Phân loại -->
        <div class="info-section">
          <!-- Tiêu đề -->
          <div class="form-group">
            <label>Tiêu đề <span class="required">*</span></label>
            <input
              type="text"
              name="title"
              v-model.trim="formData.title"
              :class="{ error: errors.title }"
              :disabled="loading"
              placeholder="Nhập tiêu đề tin tức"
              maxlength="200"
            />
            <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
            <span
              class="character-count"
              :class="{
                error:
                  formData.title.length > 200 ||
                  (formData.title.length < 3 && formData.title.length > 0),
              }"
            >
              {{ formData.title.length }}/200 (Tối thiểu 3 ký tự)
            </span>
          </div>

          <!-- Phân loại -->
          <div class="form-group">
            <label>Phân loại <span class="required">*</span></label>
            <input
              type="text"
              name="type"
              v-model.trim="formData.type"
              :class="{ error: errors.type }"
              :disabled="loading"
              placeholder="Nhập phân loại tin tức"
              maxlength="50"
            />
            <span class="error-message" v-if="errors.type">{{ errors.type }}</span>
            <span class="character-count" :class="{ error: formData.type.length > 50 }">
              {{ formData.type.length }}/50
            </span>
          </div>
        </div>

        <!-- Ngày đăng -->
        <!-- <div class="form-group">
            <label>Ngày đăng <span class="required">*</span></label>
            <input
              type="date"
              name="publishedDate"
              v-model="formData.publishedDate"
              :class="{ error: errors.publishedDate }"
              :disabled="loading"
              :min="minDate"
            />
            <span class="error-message" v-if="errors.publishedDate">{{
              errors.publishedDate
            }}</span>
          </div> -->

        <!-- Ảnh -->
        <div class="form-group">
          <label>Ảnh <span class="required">*</span></label>
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

        <!-- Tóm tắt -->
        <div class="form-group">
          <label>Tóm tắt <span class="required">*</span></label>
          <textarea
            name="summary"
            v-model.trim="formData.summary"
            :class="{ error: errors.summary }"
            :disabled="loading"
            rows="3"
            placeholder="Nhập tóm tắt nội dung"
            maxlength="500"
          ></textarea>
          <span class="error-message" v-if="errors.summary">{{ errors.summary }}</span>
          <span
            class="character-count"
            :class="{
              error:
                formData.summary.length > 500 ||
                (formData.summary.length < 10 && formData.summary.length > 0),
            }"
          >
            {{ formData.summary.length }}/500 (Tối thiểu 10 ký tự)
          </span>
        </div>

        <!-- Nội dung chi tiết -->
        <div class="form-group content-section">
          <label>Nội dung chi tiết <span class="required">*</span></label>
          <textarea
            name="content"
            v-model.trim="formData.content"
            :class="{ error: errors.content }"
            :disabled="loading"
            rows="6"
            placeholder="Nhập nội dung chi tiết"
            maxlength="5000"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span
            class="character-count"
            :class="{
              error:
                formData.content.length > 5000 ||
                (formData.content.length < 100 && formData.content.length > 0),
            }"
          >
            {{ formData.content.length }}/5000 (Tối thiểu 100 ký tự)
          </span>
        </div>

        <!-- Tác giả -->
        <!-- <div class="form-group">
          <label>Tác giả</label>
          <input
            type="text"
            name="author"
            v-model.trim="formData.author"
            :class="{ error: errors.author }"
            :disabled="loading"
            placeholder="Nhập tên tác giả (mặc định: Admin)"
            maxlength="50"
          />
          <span class="error-message" v-if="errors.author">{{ errors.author }}</span>
          <span
            class="character-count"
            :class="{
              error:
                formData.author.length > 50 ||
                (formData.author.length < 3 && formData.author.length > 0),
            }"
          >
            {{ formData.author.length }}/50 (Tối thiểu 3 ký tự)
          </span>
        </div> -->

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="button"
            class="cancel-btn"
            @click="$router.push('/admin/tin-tuc/danh-sach')"
            :disabled="loading"
          >
            <i class="fas fa-times"></i> Hủy
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ loading ? 'Đang xử lý...' : 'Thêm tin tức' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import newsService from '@/api/services/newsService'

export default {
  name: 'InsertNews',
  data() {
    return {
      formData: {
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        publishedDate: new Date().toISOString().split('T')[0],
        author: 'Admin',
        view: 0,
        like: 0,
        isDeleted: false,
      },
      imagePreview: null,
      loading: false,
      error: null,
      successMessage: null,
      maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
      errors: {},
      uploadStatus: '',
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      today.setMonth(today.getMonth() - 1) // Cho phép chọn ngày trong vòng 1 tháng trước
      return today.toISOString().split('T')[0]
    },
    isFormValid() {
      // Kiểm tra các trường bắt buộc có giá trị và đáp ứng quy tắc
      return (
        this.formData.title?.trim().length >= 10 &&
        this.formData.title.length <= 200 &&
        this.formData.summary?.trim().length >= 20 &&
        this.formData.summary.length <= 500 &&
        this.formData.content?.trim().length >= 100 &&
        this.formData.content.length <= 5000 &&
        this.formData.type?.trim() &&
        this.formData.publishedDate &&
        (this.formData.image || this.imagePreview) &&
        (!this.formData.author || this.formData.author.length >= 3) &&
        (!this.formData.author || this.formData.author.length <= 50) &&
        (!this.formData.author || /^[a-zA-ZÀ-ỹ\s]+$/.test(this.formData.author.trim()))
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

      // Validate tiêu đề (title)
      if (!this.formData.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống'
      } else if (this.formData.title.trim().length < 3) {
        newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự'
      } else if (this.formData.title.trim().length > 200) {
        newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
      }

      // Validate tóm tắt (summary) giống như mô tả trong InsertService
      if (!this.formData.summary?.trim()) {
        newErrors.summary = 'Tóm tắt không được để trống'
      } else if (this.formData.summary.trim().length < 10) {
        newErrors.summary = 'Tóm tắt phải có ít nhất 10 ký tự'
      } else if (this.formData.summary.trim().length > 500) {
        newErrors.summary = 'Tóm tắt không được vượt quá 500 ký tự'
      }

      // Validate nội dung (content) giống như mô tả trong InsertService
      if (!this.formData.content?.trim()) {
        newErrors.content = 'Nội dung không được để trống'
      } else if (this.formData.content.trim().length < 100) {
        newErrors.content = 'Nội dung phải có ít nhất 100 ký tự'
      } else if (this.formData.content.trim().length > 5000) {
        newErrors.content = 'Nội dung không được vượt quá 5000 ký tự'
      }

      // Validate loại (type)
      if (!this.formData.type?.trim()) {
        newErrors.type = 'Phân loại không được để trống'
      } else if (this.formData.type.trim().length > 50) {
        newErrors.type = 'Phân loại không được vượt quá 50 ký tự'
      }

      // Validate ngày đăng (publishedDate)
      if (!this.formData.publishedDate) {
        newErrors.publishedDate = 'Vui lòng chọn ngày đăng'
      } else {
        const publishDate = new Date(this.formData.publishedDate)
        const minDate = new Date()
        minDate.setMonth(minDate.getMonth() - 1)

        if (publishDate < minDate) {
          newErrors.publishedDate = 'Ngày đăng không được vượt quá 1 tháng trước'
        }

        const today = new Date()
        today.setMonth(today.getMonth() + 1)
        if (publishDate > today) {
          newErrors.publishedDate = 'Ngày đăng không được vượt quá 1 tháng tới'
        }
      }

      // Validate ảnh (image)
      if (!this.formData.image && !this.imagePreview) {
        newErrors.image = 'Vui lòng chọn ảnh cho tin tức'
      }

      // Validate tác giả (author) nếu có
      if (this.formData.author && this.formData.author.trim() !== '') {
        if (this.formData.author.trim().length < 3) {
          newErrors.author = 'Tên tác giả phải có ít nhất 3 ký tự'
        } else if (this.formData.author.trim().length > 50) {
          newErrors.author = 'Tên tác giả không được vượt quá 50 ký tự'
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(this.formData.author.trim())) {
          newErrors.author = 'Tên tác giả chỉ được chứa chữ cái và khoảng trắng'
        }
      }

      this.errors = newErrors
      return Object.keys(newErrors).length === 0
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Reset image error
      delete this.errors.image

      if (file.size > this.maxFileSize) {
        this.errors.image = `Kích thước file không được vượt quá ${this.maxFileSize / (1024 * 1024)}MB`
        this.$refs.fileInput.value = ''
        return
      }

      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        this.errors.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
        this.$refs.fileInput.value = ''
        return
      }

      // Kiểm tra kích thước ảnh
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)

        // Kiểm tra kích thước tối thiểu
        if (img.width < 300 || img.height < 200) {
          this.errors.image = 'Kích thước ảnh quá nhỏ (tối thiểu 300x200 pixels)'
          this.$refs.fileInput.value = ''
          this.formData.image = null
          this.imagePreview = null
          return
        }

        // Kiểm tra kích thước tối đa
        if (img.width > 3000 || img.height > 3000) {
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
      this.errors.image = 'Vui lòng chọn ảnh cho tin tức'
    },
    async handleSubmit() {
      this.error = null
      this.successMessage = null

      if (!this.validateForm()) {
        // Focus vào trường lỗi đầu tiên
        const firstErrorField = Object.keys(this.errors)[0]
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        if (element) {
          element.focus()
        }
        return
      }

      if (this.loading) return

      this.loading = true

      try {
        let imageUrl = null

        // Upload ảnh trước nếu có
        if (this.formData.image instanceof File) {
          const formData = new FormData()
          formData.append('image', this.formData.image)

          try {
            this.uploadStatus = 'Đang tải ảnh lên...'
            const uploadResponse = await newsService.uploadImage(formData)
            if (!uploadResponse?.imagePath) {
              throw new Error('Không thể tải ảnh lên')
            }
            imageUrl = uploadResponse.imagePath
            this.uploadStatus = 'Tải ảnh thành công!'
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError)
            this.error = 'Lỗi khi tải ảnh lên: ' + (uploadError.message || 'Không xác định')
            this.$emit('show-toast', {
              type: 'error',
              message: this.error,
            })
            this.loading = false
            return
          }
        }

        // Chuẩn bị dữ liệu tin tức
        this.uploadStatus = 'Đang xử lý...'
        const newsData = {
          title: this.formData.title.trim(),
          summary: this.formData.summary.trim(),
          content: this.formData.content.trim(),
          type: this.formData.type.trim(),
          publishedDate: this.formData.publishedDate,
          view: 0,
          like: 0,
          isDeleted: false,
          author: this.formData.author.trim() || 'Admin',
        }

        if (imageUrl) {
          newsData.image = imageUrl
        }

        // Tạo tin tức
        const response = await newsService.createNews(newsData)

        if (response.success) {
          this.successMessage = 'Tin tức đã được tạo thành công'
          this.$emit('show-toast', {
            type: 'success',
            message: this.successMessage,
          })

          // Delay để hiển thị message thành công
          setTimeout(() => {
            this.resetForm()
            this.$router.push('/admin/tin-tuc/danh-sach')
          }, 1500)
        } else {
          throw new Error(response.message || 'Không thể tạo tin tức')
        }
      } catch (err) {
        console.error('Error creating news:', err)

        // Xử lý lỗi validation từ server
        if (err.response?.data?.errors) {
          const serverErrors = err.response.data.errors
          Object.keys(serverErrors).forEach((key) => {
            this.errors[key] = serverErrors[key]
          })
          this.error = 'Vui lòng kiểm tra lại thông tin nhập vào'
        } else {
          this.error =
            err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm tin tức'
        }

        this.$emit('show-toast', {
          type: 'error',
          message: this.error,
        })
      } finally {
        this.loading = false
        this.uploadStatus = ''
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        publishedDate: new Date().toISOString().split('T')[0],
        author: 'Admin',
        view: 0,
        like: 0,
        isDeleted: false,
      }
      this.imagePreview = null
      this.error = null
      this.successMessage = null
      this.errors = {}
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

.insert-news {
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

input[type="text"],
input[type="date"],
textarea {
  width: 100%;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
  border-color: #3b82f6;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.info-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.image-upload-container {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 20px;
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
  padding: 20px;
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
  padding: 20px;
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

@media (max-width: 768px) {
  .insert-news {
    padding: 20px;
  }

  .form-container {
    padding: 20px;
  }

  .info-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .insert-news {
    padding: 20px;
  }

  .form-container {
    padding: 20px;
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
