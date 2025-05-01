<template>
  <div class="insert-service-container">
    <div class="form-wrapper">
      
      <!-- Error message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="service-form">
        <div class="form-group">
          <label for="serviceTitle">Tiêu đề <span class="required">*</span></label>
          <input 
            type="text" 
            id="serviceTitle" 
            v-model="formData.title"
            placeholder="Nhập tiêu đề dịch vụ"
            :class="{ 'error': errors.title }"
            required
            minlength="3"
            maxlength="200"
          >
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ error: formData.title.length > 200 }">
            {{ formData.title.length }}/200
          </span>
        </div>

        <div class="form-group">
          <label for="serviceType">Loại dịch vụ <span class="required">*</span></label>
          <select 
            id="serviceType" 
            v-model="formData.type"
            :class="{ 'error': errors.type }"
            required
          >
            <option value="" disabled selected>Chọn loại dịch vụ</option>
            <option value="web">Website</option>
            <option value="app">Ứng dụng</option>
            <option value="agency">Agency</option>
          </select>
          <span class="error-message" v-if="errors.type">{{ errors.type }}</span>
        </div>

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
          <div class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</div>
          <span class="error-message" v-if="errors.image">{{ errors.image }}</span>
        </div>

        <div class="form-group">
          <label for="servicePrice">Giá <span class="required">*</span></label>
          <input 
            type="number" 
            id="servicePrice" 
            v-model="formData.price"
            placeholder="Nhập giá dịch vụ"
            :class="{ 'error': errors.price }"
            required
            min="0"
          >
          <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
        </div>

        <div class="form-group">
          <label for="serviceContent">Mô tả dịch vụ <span class="required">*</span></label>
          <textarea 
            id="serviceContent" 
            v-model="formData.content"
            placeholder="Nhập mô tả chi tiết về dịch vụ"
            :class="{ 'error': errors.content }"
            rows="6"
            required
            maxlength="2000"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ error: formData.content.length > 2000 }">
            {{ formData.content.length }}/2000
          </span>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$router.push('/admin/dich-vu/danh-sach')">
            <i class="fas fa-times"></i> Hủy
          </button>
          <button type="submit" class="submit-btn" :disabled="loading || !isFormValid">
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ loading ? 'Đang xử lý...' : 'Thêm dịch vụ' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService';

export default {
  name: 'InsertService',
  data() {
    return {
      formData: {
        title: '',
        price: '',
        content: '',
        image: null,
        type: ''
      },
      imagePreview: null,
      loading: false,
      error: null,
      maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
      errors: {} // Add errors object for validation
    }
  },
  computed: {
    isFormValid() {
      // Kiểm tra các trường bắt buộc có giá trị
      const hasRequiredFields = 
        this.formData.title?.trim() &&
        this.formData.type &&
        this.formData.price > 0 &&
        this.formData.content?.trim() &&
        (this.formData.image || this.imagePreview);

      // Kiểm tra độ dài các trường
      const isValidLength = 
        this.formData.title.length <= 200 &&
        this.formData.content.length <= 2000;

      // Form hợp lệ khi có đầy đủ thông tin và không có lỗi
      return hasRequiredFields && isValidLength && Object.keys(this.errors).length === 0;
    }
  },
  methods: {
    validateForm() {
      const newErrors = {};

      if (!this.formData.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống';
      } else if (this.formData.title.length > 200) {
        newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
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

      if (!this.formData.image && !this.imagePreview) {
        newErrors.image = 'Vui lòng chọn ảnh cho dịch vụ';
      }

      this.errors = newErrors;
      return Object.keys(newErrors).length === 0;
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > this.maxFileSize) {
          this.error = 'Kích thước file không được vượt quá 5MB';
          this.$refs.fileInput.value = '';
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          this.error = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF';
          this.$refs.fileInput.value = '';
          return;
        }

        this.formData.image = file;
        this.imagePreview = URL.createObjectURL(file);
        this.error = null;
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
      if (!this.validateForm()) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      this.error = null;

      try {
        let imageUrl = null;
        
        // Upload image if exists
        if (this.formData.image instanceof File) {
          const uploadResponse = await serviceService.uploadImage(this.formData.image);
          imageUrl = uploadResponse.imagePath;
        }

        // Prepare service data according to backend model
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

        // Create service
        const response = await serviceService.createService(serviceData);
        
        if (response.success) {
          // Reset form and navigate
          this.resetForm();
          this.$router.push('/admin/dich-vu/danh-sach');
        } else {
          throw new Error(response.message || 'Không thể tạo dịch vụ');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.error = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi thêm dịch vụ. Vui lòng thử lại!';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        price: '',
        content: '',
        image: null,
        type: ''
      }
      this.imagePreview = null;
      this.error = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
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
.insert-service-container {
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

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #374151;
}

.error-message {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

input[type="text"],
input[type="number"],
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: #fff;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.image-upload-container {
  border: 2px dashed #d1d5db;
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
  background: #ef4444;
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
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
  margin: 0;
}

.cancel-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.submit-btn {
  background: #4299e1;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: #edf2f7;
}

.submit-btn:hover:not(:disabled) {
  background: #4299e1;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #4299e1;
}

.character-count {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.5rem;
}

.error {
  color: #ef4444;
}

.has-error {
  border-color: #dc2626;
}

@media (max-width: 640px) {
  .insert-service-container {
    padding: 1rem;
  }
  
  .form-wrapper {
    padding: 1.5rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>


