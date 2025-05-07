<template>
  <div class="insert-news">
    <div class="form-container">
      <form @submit.prevent="handleSubmit" :class="{ submitting: loading }">
        <!-- Tiêu đề -->
        <div class="form-group">
          <label>Tiêu đề <span class="required">*</span></label>
          <input
            type="text"
            v-model.trim="formData.title"
            :class="{ error: errors.title }"
            :disabled="loading"
            placeholder="Nhập tiêu đề tin tức"
            required
            maxlength="200"
          />
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ error: formData.title.length > 200 }">
            {{ formData.title.length }}/200
          </span>
        </div>

        <!-- Phân loại + Tác giả + Ngày -->
        <div class="info-section">
          <!-- Phân loại -->
          <div class="form-group">
            <label>Phân loại <span class="required">*</span></label>
            <select
              v-model="formData.type"
              :class="{ error: errors.type }"
              :disabled="loading"
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
              :class="{ error: errors.author }"
              :disabled="loading"
              placeholder="Nhập tên tác giả"
              required
            />
            <span class="error-message" v-if="errors.author">{{ errors.author }}</span>
          </div>

          <!-- Ngày đăng -->
          <div class="form-group">
            <label>Ngày đăng <span class="required">*</span></label>
            <input
              type="date"
              v-model="formData.publishedDate"
              :class="{ error: errors.publishedDate }"
              :disabled="loading"
              :min="minDate"
              required
            />
            <span class="error-message" v-if="errors.publishedDate">{{
              errors.publishedDate
            }}</span>
          </div>
        </div>

        <!-- Ảnh -->
        <div class="form-group">
          <label>Ảnh <span class="required">*</span></label>
          <div class="image-upload-container" @click="triggerFileInput">
            <input
              type="file"
              class="file-input"
              @change="handleImageUpload"
              accept="image/*"
              ref="fileInput"
              :disabled="loading"
            />
            <div v-if="!imagePreview" class="upload-button">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
              <p class="upload-hint">Kích thước tối đa: 10MB. Định dạng: JPG, PNG, GIF</p>
            </div>
            <div
              v-if="imagePreview"
              class="image-preview"
              :style="{ backgroundImage: `url(${imagePreview})` }"
            >
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
            v-model.trim="formData.summary"
            :class="{ error: errors.summary }"
            :disabled="loading"
            rows="3"
            placeholder="Nhập tóm tắt nội dung"
            required
            maxlength="500"
          ></textarea>
          <span class="error-message" v-if="errors.summary">{{ errors.summary }}</span>
          <span class="character-count" :class="{ error: formData.summary.length > 500 }">
            {{ formData.summary.length }}/500
          </span>
        </div>

        <!-- Nội dung chi tiết -->
        <div class="form-group content-section">
          <label>Nội dung chi tiết <span class="required">*</span></label>
          <textarea
            v-model.trim="formData.content"
            :class="{ error: errors.content }"
            :disabled="loading"
            rows="6"
            placeholder="Nhập nội dung chi tiết"
            required
            maxlength="5000"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ error: formData.content.length > 5000 }">
            {{ formData.content.length }}/5000
          </span>
        </div>

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
        author: '',
        publishedDate: new Date().toISOString().split('T')[0],
        view: 0,
        like: 0,
        isDeleted: false,
      },
      imagePreview: null,
      loading: false,
      error: null,
      maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
      errors: {},
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },
    isFormValid() {
      // Kiểm tra các trường bắt buộc có giá trị
      return (
        this.formData.title?.trim() &&
        this.formData.summary?.trim() &&
        this.formData.content?.trim() &&
        this.formData.type &&
        this.formData.author?.trim() &&
        this.formData.publishedDate &&
        (this.formData.image || this.imagePreview) &&
        this.formData.title.length <= 200 &&
        this.formData.summary.length <= 500 &&
        this.formData.content.length <= 5000
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

      if (!this.formData.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống'
      } else if (this.formData.title.length > 200) {
        newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
      }

      if (!this.formData.summary?.trim()) {
        newErrors.summary = 'Tóm tắt không được để trống'
      } else if (this.formData.summary.length > 500) {
        newErrors.summary = 'Tóm tắt không được vượt quá 500 ký tự'
      }

      if (!this.formData.content?.trim()) {
        newErrors.content = 'Nội dung không được để trống'
      } else if (this.formData.content.length > 5000) {
        newErrors.content = 'Nội dung không được vượt quá 5000 ký tự'
      }

      if (!this.formData.type) {
        newErrors.type = 'Vui lòng chọn loại tin tức'
      }

      if (!this.formData.author?.trim()) {
        newErrors.author = 'Tác giả không được để trống'
      }

      if (!this.formData.publishedDate) {
        newErrors.publishedDate = 'Vui lòng chọn ngày đăng'
      }

      if (!this.formData.image && !this.imagePreview) {
        newErrors.image = 'Vui lòng chọn ảnh cho tin tức'
      }

      this.errors = newErrors
      return Object.keys(newErrors).length === 0
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > this.maxFileSize) {
          this.errors.image = 'Kích thước file không được vượt quá 10MB'
          this.$refs.fileInput.value = ''
          return
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          this.errors.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
          this.$refs.fileInput.value = ''
          return
        }

        this.formData.image = file
        this.imagePreview = URL.createObjectURL(file)
        delete this.errors.image
      }
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
      if (!this.validateForm()) return
      if (this.loading) return

      this.loading = true
      this.error = null

      try {
        let imageUrl = null

        // Upload ảnh trước nếu có
        if (this.formData.image instanceof File) {
          const formData = new FormData()
          formData.append('image', this.formData.image)

          try {
            const uploadResponse = await newsService.uploadImage(formData)
            if (!uploadResponse?.imagePath) {
              throw new Error('Không thể tải ảnh lên')
            }
            imageUrl = uploadResponse.imagePath
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
        const newsData = {
          title: this.formData.title.trim(),
          summary: this.formData.summary.trim(),
          content: this.formData.content.trim(),
          type: this.formData.type,
          author: this.formData.author.trim(),
          publishedDate: this.formData.publishedDate,
          view: 0,
          like: 0,
          isDeleted: false,
          image: imageUrl,
        }

        // Tạo tin tức
        const response = await newsService.createNews(newsData)

        if (response.success) {
          this.$emit('show-toast', {
            type: 'success',
            message: 'Tin tức đã được tạo thành công',
          })
          this.resetForm()
          this.$router.push('/admin/tin-tuc/danh-sach')
        } else {
          throw new Error(response.message || 'Không thể tạo tin tức')
        }
      } catch (err) {
        console.error('Error creating news:', err)
        this.error = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi thêm tin tức'
        this.$emit('show-toast', {
          type: 'error',
          message: this.error,
        })
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        author: '',
        publishedDate: new Date().toISOString().split('T')[0],
        view: 0,
        like: 0,
        isDeleted: false,
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
.insert-news {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.07),
    0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

input[type='text'],
input[type='date'],
select,
textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.3s ease;
  background-color: #fff;
  min-height: 46px;
  box-sizing: border-box;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234a5568' viewBox='0 0 16 16'%3E%3Cpath d='M8 11.5l-5-5h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
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
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.error {
  border-color: #e53e3e !important;
}

.error-message {
  color: #e53e3e;
  font-size: 13px;
  margin-top: 6px;
}

.image-upload-container {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  position: relative;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.image-upload-container:hover {
  border-color: #4299e1;
  background-color: rgba(66, 153, 225, 0.05);
}

.file-input {
  display: none;
}

.image-preview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
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
  background: #ff4444;
  color: white;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #666;
}

.upload-button i {
  font-size: 2.5em;
  color: #4299e1;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 8px;
  line-height: 1.4;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn,
.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
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
  transform: translateY(-1px);
}

.character-count {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: #718096;
  margin-top: 6px;
}

.character-count.error {
  color: #dc2626;
}

.submitting {
  opacity: 0.7;
  pointer-events: none;
}

/* Form layout for specific sections */
.content-section {
  grid-column: 1 / -1;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 0;
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .form-container {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .info-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .insert-news {
    padding: 16px;
  }

  .form-container {
    padding: 20px;
    border-radius: 8px;
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

/* Additional responsive styles for very small devices */
@media (max-width: 480px) {
  .insert-news {
    padding: 10px;
  }

  .form-container {
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    gap: 20px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  input[type='text'],
  input[type='date'],
  select,
  textarea {
    padding: 10px 12px;
    font-size: 0.95rem;
    border-radius: 6px;
    min-height: 42px;
  }

  .error-message,
  .character-count,
  .upload-hint {
    font-size: 0.8rem;
  }

  .image-upload-container {
    min-height: 180px;
    padding: 16px;
  }

  .preview-img {
    max-height: 160px;
  }
}

@media (max-width: 360px) {
  .insert-news {
    padding: 8px;
  }

  .form-container {
    padding: 12px;
    gap: 16px;
  }

  input[type='text'],
  input[type='date'],
  select,
  textarea {
    padding: 8px 10px;
    font-size: 0.9rem;
    min-height: 38px;
  }

  .form-group label {
    font-size: 0.85rem;
  }

  .image-upload-container {
    min-height: 160px;
    padding: 12px;
  }

  .cancel-btn,
  .submit-btn {
    padding: 10px 18px;
    font-size: 0.9rem;
  }

  .upload-button i {
    font-size: 2em;
  }
}
</style>
