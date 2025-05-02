<template>
  <div class="insert-news-container">
    <div class="form-wrapper">
      <!-- Error message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="news-form">
        <!-- Tiêu đề -->
        <div class="form-group">
          <label for="newsTitle">Tiêu đề <span class="required">*</span></label>
          <input 
            type="text" 
            id="newsTitle" 
            v-model="formData.title"
            placeholder="Nhập tiêu đề tin tức"
            :class="{ 'error': errors.title }"
            required
            maxlength="200"
          >
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ error: formData.title.length > 200 }">
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
              <button type="button" class="remove-image" @click="removeImage">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="upload-button" v-else>
              <input 
                type="file" 
                ref="fileInput"
                @change="handleImageUpload" 
                accept="image/jpeg,image/png,image/gif"
                class="file-input"
                required
              >
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
            </div>
          </div>
          <div class="upload-hint">Kích thước tối đa: 10MB. Định dạng: JPG, PNG, GIF</div>
          <span class="error-message" v-if="errors.image">{{ errors.image }}</span>
        </div>

        <!-- Tóm tắt -->
        <div class="form-group">
          <label for="newsSummary">Tóm tắt <span class="required">*</span></label>
          <textarea 
            id="newsSummary"
            v-model="formData.summary"
            placeholder="Nhập tóm tắt nội dung"
            :class="{ 'error': errors.summary }"
            rows="3"
            required
            maxlength="500"
          ></textarea>
          <span class="error-message" v-if="errors.summary">{{ errors.summary }}</span>
          <span class="character-count" :class="{ error: formData.summary.length > 500 }">
            {{ formData.summary.length }}/500
          </span>
        </div>

        <!-- Nội dung chi tiết -->
        <div class="form-group">
          <label for="newsContent">Nội dung chi tiết <span class="required">*</span></label>
          <textarea 
            id="newsContent"
            v-model="formData.content"
            placeholder="Nhập nội dung chi tiết"
            :class="{ 'error': errors.content }"
            rows="6"
            required
            maxlength="5000"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ error: formData.content.length > 5000 }">
            {{ formData.content.length }}/5000
          </span>
        </div>

        <!-- Phân loại -->
        <div class="form-group">
          <label for="newsType">Phân loại <span class="required">*</span></label>
          <select 
            id="newsType"
            v-model="formData.type"
            :class="{ 'error': errors.type }"
            required
          >
            <option value="" disabled selected>Chọn loại tin tức</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="su-kien">Sự kiện</option>
            <option value="thong-bao">Thông báo</option>
          </select>
          <span class="error-message" v-if="errors.type">{{ errors.type }}</span>
        </div>

        <!-- Tác giả -->
        <div class="form-group">
          <label for="newsAuthor">Tác giả <span class="required">*</span></label>
          <input 
            type="text" 
            id="newsAuthor"
            v-model="formData.author"
            placeholder="Nhập tên tác giả"
            :class="{ 'error': errors.author }"
            required
          >
          <span class="error-message" v-if="errors.author">{{ errors.author }}</span>
        </div>

        <!-- Ngày đăng -->
        <div class="form-group">
          <label for="newsDate">Ngày đăng <span class="required">*</span></label>
          <input 
            type="date" 
            id="newsDate"
            v-model="formData.publishedDate"
            :class="{ 'error': errors.publishedDate }"
            :min="minDate"
            required
          >
          <span class="error-message" v-if="errors.publishedDate">{{ errors.publishedDate }}</span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$router.push('/admin/tin-tuc/danh-sach')">
            <i class="fas fa-times"></i> Hủy
          </button>
          <button type="submit" class="submit-btn" :disabled="loading || !isFormValid">
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ loading ? 'Đang xử lý...' : 'Thêm tin tức' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import newsService from '@/api/news/newsService'

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
        isDeleted: false
      },
      imagePreview: null,
      loading: false,
      error: null,
      maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
      errors: {}
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },
    isFormValid() {
      // Kiểm tra các trường bắt buộc có giá trị
      const hasRequiredFields = 
        this.formData.title?.trim() &&
        this.formData.summary?.trim() &&
        this.formData.content?.trim() &&
        this.formData.type &&
        this.formData.author?.trim() &&
        this.formData.publishedDate &&
        (this.formData.image || this.imagePreview)

      // Kiểm tra độ dài các trường
      const isValidLength = 
        this.formData.title.length <= 200 &&
        this.formData.summary.length <= 500 &&
        this.formData.content.length <= 5000

      // Form hợp lệ khi có đầy đủ thông tin và không có lỗi
      return hasRequiredFields && isValidLength && Object.keys(this.errors).length === 0
    }
  },
  methods: {
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
          this.error = 'Kích thước file không được vượt quá 10MB'
          this.$refs.fileInput.value = ''
          return
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          this.error = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
          this.$refs.fileInput.value = ''
          return
        }

        this.formData.image = file
        this.imagePreview = URL.createObjectURL(file)
        this.error = null
      }
    },
    removeImage() {
      this.formData.image = null
      this.imagePreview = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
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
          const uploadResponse = await newsService.uploadImage(this.formData.image)
          if (!uploadResponse?.imagePath) {
            throw new Error('Không thể tải ảnh lên')
          }
          imageUrl = uploadResponse.imagePath
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
          image: imageUrl
        }

        // Tạo tin tức
        const response = await newsService.createNews(newsData)
        
        if (response.success) {
          this.$emit('show-toast', {
            type: 'success',
            message: 'Tin tức đã được tạo thành công'
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
          message: this.error
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
        isDeleted: false
      }
      this.imagePreview = null
      this.error = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    }
  },
  beforeUnmount() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview)
    }
  }
}
</script>

<style scoped>
/* Import the admin styles */
@import '@/styles/admin.css';

/* Component specific overrides */
.insert-news-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

/* Override admin.css to left-align labels */
.form-group label {
  text-align: left;
}

.detail-item label {
  text-align: left;
  justify-content: flex-start;
}

.character-count {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.5rem;
  text-align: right;
}

.character-count.error {
  color: #ef4444;
}

.required {
  color: #ef4444;
}

.error {
  border-color: #ef4444;
}

.has-error {
  border-color: #ef4444;
}

@media (max-width: 640px) {
  .insert-news-container {
    padding: 1rem;
  }
  
  .form-wrapper {
    padding: 1.5rem;
  }
}
</style>