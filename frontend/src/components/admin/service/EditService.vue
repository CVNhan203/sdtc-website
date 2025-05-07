<template>
  <div class="edit-service">
    <div class="form-container">
      <form @submit.prevent="handleSubmit" :class="{ 'submitting': loading }">
        <!-- Tiêu đề -->
        <div class="form-group">
          <label>Tiêu đề <span class="required">*</span></label>
          <input 
            type="text" 
            v-model.trim="formData.title"
            :class="{ 'error': errors.title }"
            :disabled="loading"
            placeholder="Nhập tiêu đề dịch vụ"
            required
            minlength="3"
            maxlength="100"
          >
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ 'error': formData.title.length > 100 }">
            {{ formData.title.length }}/100
          </span>
        </div>

        <!-- Info section: Type and Price -->
        <div class="info-section">
          <!-- Loại dịch vụ -->
          <div class="form-group">
            <label>Loại dịch vụ <span class="required">*</span></label>
            <select 
              v-model="formData.type"
              :class="{ 'error': errors.type }"
              :disabled="loading"
              required
            >
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
              v-model="formData.price"
              :class="{ 'error': errors.price }"
              :disabled="loading"
              placeholder="Nhập giá dịch vụ"
              required
              min="0"
            >
            <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
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
              ref="imageInput"
              :disabled="loading"
            >
            <div v-if="!imagePreview && !formData.image" class="upload-button">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
              <p class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
            </div>
            <div 
              v-if="imagePreview || formData.image" 
              class="image-preview-container"
            >
              <img 
                :src="imagePreview || getImageUrl(formData.image)" 
                alt="Preview"
                class="preview-img"
              />
              <button type="button" @click.stop="removeImage" class="remove-image" :disabled="loading">
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
            v-model.trim="formData.content"
            :class="{ 'error': errors.content }"
            :disabled="loading"
            rows="6"
            placeholder="Nhập mô tả chi tiết về dịch vụ"
            required
            maxlength="2000"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ 'error': formData.content.length > 2000 }">
            {{ formData.content.length }}/2000
          </span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button 
            type="button" 
            class="cancel-btn" 
            @click="handleCancel"
            :disabled="loading"
          >
            <i class="fas fa-times"></i> Hủy
          </button>
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="loading || !isFormValid"
          >
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ loading ? 'Đang xử lý...' : 'Cập nhật' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService';

export default {
  name: 'EditService',
  data() {
    return {
      formData: {
        title: '',
        price: '',
        content: '',
        image: null,
        type: 'web'
      },
      imagePreview: null,
      loading: false,
      error: null,
      serviceId: null,
      baseImageUrl: 'http://localhost:3000',
      errors: {}
    }
  },
  computed: {
    isFormValid() {
      // Kiểm tra các trường bắt buộc có giá trị
      const hasRequiredFields = 
        this.formData.title?.trim() &&
        this.formData.type &&
        this.formData.price > 0 &&
        this.formData.content?.trim();

      // Kiểm tra độ dài các trường
      const isValidLength = 
        this.formData.title.length <= 100 &&
        this.formData.content.length <= 2000;

      // Form hợp lệ khi có đầy đủ thông tin và không có lỗi
      return hasRequiredFields && isValidLength && Object.keys(this.errors).length === 0;
    }
  },
  async created() {
    // Lấy ID từ route params
    this.serviceId = this.$route.params.id;
    if (this.serviceId) {
      await this.loadServiceData();
    }
  },
  methods: {
    validateForm() {
      const newErrors = {};

      if (!this.formData.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống';
      } else if (this.formData.title.length > 100) {
        newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
      }

      if (!this.formData.type) {
        newErrors.type = 'Vui lòng chọn loại dịch vụ';
      }

      if (!this.formData.price || this.formData.price <= 0) {
        newErrors.price = 'Giá dịch vụ phải lớn hơn 0';
      }

      if (!this.formData.content?.trim()) {
        newErrors.content = 'Mô tả không được để trống';
      } else if (this.formData.content.length > 2000) {
        newErrors.content = 'Mô tả không được vượt quá 2000 ký tự';
      }

      this.errors = newErrors;
      return Object.keys(newErrors).length === 0;
    },
    async loadServiceData() {
      try {
        const service = await serviceService.getServiceById(this.serviceId);
        this.formData = {
          title: service.title,
          price: service.price,
          content: Array.isArray(service.description) 
            ? service.description.join('\n')
            : service.description,
          image: service.image,
          type: service.type
        };
      } catch (error) {
        console.error('Error loading service:', error);
        this.error = 'Không thể tải thông tin dịch vụ';
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          this.errors.image = 'Kích thước ảnh không được vượt quá 5MB';
          return;
        }

        if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
          this.errors.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF';
          return;
        }

        this.formData.image = file;
        this.imagePreview = URL.createObjectURL(file);
        this.errors.image = null;
      }
    },
    removeImage(e) {
      if (e) e.stopPropagation();
      this.formData.image = null;
      this.imagePreview = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      // Clean the path by removing any leading slashes
      const cleanPath = imagePath.replace(/^[/\\]+/, '');
      return `${this.baseImageUrl}/${cleanPath}`;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      this.error = null;

      try {
        let imageUrl = this.formData.image;
        
        // Upload image if new file is selected
        if (this.formData.image instanceof File) {
          const uploadResponse = await serviceService.uploadImage(this.formData.image);
          imageUrl = uploadResponse.imagePath;
        }

        // Prepare service data
        const serviceData = {
          title: this.formData.title.trim(),
          description: this.formData.content
            .trim()
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.trim()),
          price: Number(this.formData.price),
          type: this.formData.type
        };

        if (imageUrl) {
          serviceData.image = imageUrl;
        }

        // Update service
        await serviceService.updateService(this.serviceId, serviceData);
        
        // Navigate back to list
        this.$router.push('/admin/dich-vu/danh-sach');
      } catch (error) {
        console.error('Error updating service:', error);
        this.error = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật dịch vụ. Vui lòng thử lại!';
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      this.$router.push('/admin/dich-vu/danh-sach');
    },
    triggerFileInput() {
      if (this.$refs.imageInput && !this.loading) {
        this.$refs.imageInput.click();
      }
    }
  },
  beforeUnmount() {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }
}
</script>

<style scoped>
.edit-service {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.05);
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

input[type="text"],
input[type="number"],
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

.image-preview-container {
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
  border: none;
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
  .edit-service {
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
  .edit-service {
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

  input[type="text"],
  input[type="number"],
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
  .edit-service {
    padding: 8px;
  }

  .form-container {
    padding: 12px;
    gap: 16px;
  }

  input[type="text"],
  input[type="number"],
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