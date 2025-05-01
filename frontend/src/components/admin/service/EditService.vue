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
          <div class="image-upload">
            <input 
              type="file" 
              id="serviceImage" 
              @change="handleImageUpload"
              accept="image/*"
              ref="imageInput"
            >
            <div class="image-preview" v-if="imagePreview || formData.image">
              <img :src="imagePreview || getImageUrl(formData.image)" alt="Preview">
              <button type="button" @click="removeImage" class="remove-image">×</button>
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

.image-upload {
  border: 2px dashed #d1d5db;
  padding: 1.5rem;
  border-radius: 0.375rem;
  background-color: #f9fafb;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-image {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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