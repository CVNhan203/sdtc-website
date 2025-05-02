<template>
  <div class="edit-service-container">
    <div class="form-wrapper">
      <h2>Chỉnh Sửa Dịch Vụ</h2>
      
      <!-- Error message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="service-form">
        <div class="form-group">
          <label for="serviceTitle">Tiêu đề</label>
          <input 
            type="text" 
            id="serviceTitle" 
            v-model="formData.title"
            placeholder="Nhập tiêu đề dịch vụ"
            required
            minlength="3"
            maxlength="100"
          >
        </div>

        <div class="form-group">
          <label for="serviceType">Loại dịch vụ</label>
          <select 
            id="serviceType" 
            v-model="formData.type"
            required
          >
            <option value="web">Website</option>
            <option value="app">Ứng dụng</option>
            <option value="agency">Agency</option>
          </select>
        </div>

        <div class="form-group">
          <label for="serviceImage">Ảnh</label>
          <div class="image-upload-container" @click="triggerFileInput">
            <input 
              type="file" 
              id="serviceImage" 
              class="file-input"
              @change="handleImageUpload"
              accept="image/*"
              ref="imageInput"
            >
            <div v-if="!imagePreview && !formData.image" class="upload-button">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
            </div>
            <div 
              v-if="imagePreview || formData.image" 
              class="image-preview"
            >
              <img 
                :src="imagePreview || getImageUrl(formData.image)" 
                alt="Preview"
                class="preview-img"
              />
              <button type="button" @click.stop="removeImage" class="remove-image">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="servicePrice">Giá</label>
          <input 
            type="number" 
            id="servicePrice" 
            v-model="formData.price"
            placeholder="Nhập giá dịch vụ"
            required
            min="0"
          >
        </div>

        <div class="form-group">
          <label for="serviceContent">Mô tả dịch vụ</label>
          <textarea 
            id="serviceContent" 
            v-model="formData.content"
            placeholder="Nhập mô tả chi tiết về dịch vụ"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="handleCancel">
            Hủy
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
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
      baseImageUrl: 'http://localhost:3000'
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
        this.formData.image = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    removeImage() {
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
      if (this.$refs.imageInput) {
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
.edit-service-container {
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
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.image-upload-container:hover {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.preview-img {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.remove-image:hover {
  background: #ff4444;
  color: white;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #666;
}

.upload-button i {
  font-size: 2.5em;
  color: #4CAF50;
}

.file-input {
  display: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.2s;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.submit-btn:hover {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.cancel-btn {
  background: #e5e7eb;
  color: #374151;
}

.cancel-btn:hover {
  background: #d1d5db;
}

@media (max-width: 640px) {
  .edit-service-container {
    padding: 1rem;
  }
  
  .form-wrapper {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
  }
}
</style>