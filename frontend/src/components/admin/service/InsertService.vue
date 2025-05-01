<template>
  <div class="insert-service-container">
    <div class="form-wrapper">
      <h2>Thêm Dịch Vụ Mới</h2>
      
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
            <div class="image-preview" v-if="imagePreview">
              <img :src="imagePreview" alt="Preview">
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

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : 'Thêm dịch vụ' }}
        </button>
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
        type: 'web'
      },
      imagePreview: null,
      loading: false,
      error: null
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.formData.image = file
        this.imagePreview = URL.createObjectURL(file)
      }
    },
    removeImage() {
      this.formData.image = null
      this.imagePreview = null
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
      }
    },
    async handleSubmit() {
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
        type: 'web'
      }
      this.imagePreview = null;
      this.error = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
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

.submit-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .insert-service-container {
    padding: 1rem;
  }
  
  .form-wrapper {
    padding: 1.5rem;
  }
}
</style>


