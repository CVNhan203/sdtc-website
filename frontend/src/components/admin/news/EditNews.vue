<template>
  <div class="edit-news">
    <div class="form-container">
      <form @submit.prevent="handleSubmit" :class="{ 'submitting': isSubmitting }" novalidate>
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
      
        <!-- Trạng thái tải -->
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
            :class="{ 'error': errors.title }"
            :disabled="isSubmitting"
            placeholder="Nhập tiêu đề tin tức"
          >
          <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
          <span class="character-count" :class="{ 'error': formData.title.length > 200 || formData.title.length < 10 && formData.title.length > 0 }">
            {{ formData.title.length }}/200 (Tối thiểu 10 ký tự)
          </span>
        </div>

        <!-- Phân loại + Ngày -->
        <div class="info-section">
          <!-- Phân loại -->
          <div class="form-group">
            <label>Phân loại <span class="required">*</span></label>
            <input 
              type="text" 
              name="type"
              v-model.trim="formData.type"
              :class="{ 'error': errors.type }"
              :disabled="isSubmitting"
              placeholder="Nhập phân loại tin tức"
              maxlength="50"
            >
            <span class="error-message" v-if="errors.type">{{ errors.type }}</span>
            <span class="character-count" :class="{ 'error': formData.type.length > 50 }">
              {{ formData.type.length }}/50
            </span>
          </div>

          <!-- Ngày đăng -->
          <div class="form-group">
            <label>Ngày đăng <span class="required">*</span></label>
            <input 
              type="date" 
              name="publishedDate"
              v-model="formData.publishedDate"
              :class="{ 'error': errors.publishedDate }"
              :disabled="isSubmitting"
              :min="minDate"
            >
            <span class="error-message" v-if="errors.publishedDate">{{ errors.publishedDate }}</span>
          </div>
        </div>

        <!-- Ảnh -->
        <div class="form-group">
          <label>Ảnh <span class="required">*</span></label>
          <div class="image-upload-container" @click="triggerFileInput" :class="{ 'error-border': errors.image }">
            <input 
              type="file" 
              name="image"
              class="file-input"
              @change="handleImageChange" 
              accept="image/*"
              ref="fileInput"
              :disabled="isSubmitting"
            >
            <div v-if="!imagePreview && !formData.image" class="upload-button">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Tải ảnh lên</span>
              <p class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
              <p class="upload-hint">Kích thước tối thiểu: 300x200px, tối đa 2000x2000px</p>
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
              <button type="button" @click.stop="removeImage" class="remove-image" :disabled="isSubmitting">
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
            :class="{ 'error': errors.summary }"
            :disabled="isSubmitting"
            rows="3"
            placeholder="Nhập tóm tắt nội dung"
          ></textarea>
          <span class="error-message" v-if="errors.summary">{{ errors.summary }}</span>
          <span class="character-count" :class="{ 'error': formData.summary.length > 500 || formData.summary.length < 20 && formData.summary.length > 0 }">
            {{ formData.summary.length }}/500 (Tối thiểu 20 ký tự)
          </span>
        </div>

        <!-- Nội dung chi tiết -->
        <div class="form-group content-section">
          <label>Nội dung chi tiết <span class="required">*</span></label>
          <textarea 
            name="content"
            v-model.trim="formData.content"
            :class="{ 'error': errors.content }"
            :disabled="isSubmitting"
            rows="6"
            placeholder="Nhập nội dung chi tiết"
          ></textarea>
          <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
          <span class="character-count" :class="{ 'error': formData.content.length > 5000 || formData.content.length < 100 && formData.content.length > 0 }">
            {{ formData.content.length }}/5000 (Tối thiểu 100 ký tự)
          </span>
        </div>

        <!-- Tác giả -->
        <div class="form-group">
          <label>Tác giả</label>
          <input 
            type="text" 
            name="author"
            v-model.trim="formData.author"
            :class="{ 'error': errors.author }"
            :disabled="isSubmitting"
            placeholder="Nhập tên tác giả (mặc định: Admin)"
            maxlength="50"
          >
          <span class="error-message" v-if="errors.author">{{ errors.author }}</span>
          <span class="character-count" :class="{ 'error': formData.author.length > 50 || formData.author.length < 3 && formData.author.length > 0 }">
            {{ formData.author.length }}/50 (Tối thiểu 3 ký tự)
          </span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link 
            to="/admin/tin-tuc/danh-sach" 
            class="cancel-btn"
            :class="{ 'disabled': isSubmitting }"
            v-if="!hasChanges || !isSubmitting"
          >
            <i class="fas fa-times"></i>
            Hủy
          </router-link>
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting || !isFormValid"
          >
            <i class="fas" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-save'"></i>
            {{ isSubmitting ? 'Đang lưu...' : 'Cập nhật tin tức' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Confirm Modal -->
    <div class="modal" v-if="showConfirmModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận hủy</h3>
          <button class="close-btn" @click="showConfirmModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.</p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="showConfirmModal = false">
              <i class="fas fa-times"></i>
              Tiếp tục chỉnh sửa
            </button>
            <button class="confirm-btn" @click="confirmCancel">
              <i class="fas fa-check"></i>
              Xác nhận hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import newsService from '@/api/services/newsService'
import eventBus from '@/eventBus'

export default {
  name: 'EditNews',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const initialFormData = {
      title: '',
      summary: '',
      content: '',
      image: null,
      type: '',
      publishedDate: new Date().toISOString().split('T')[0],
      author: 'Admin',
      view: 0,
      like: 0,
      isDeleted: false
    }
    
    const formData = ref({ ...initialFormData })
    const imagePreview = ref(null)
    const errors = ref({})
    const fileInput = ref(null)
    const isSubmitting = ref(false)
    const showConfirmModal = ref(false)
    const originalData = ref(null)
    const newsId = ref(null)
    const error = ref(null)
    const successMessage = ref(null)
    const uploadStatus = ref('')

    // Computed properties
    const minDate = computed(() => {
      const today = new Date()
      today.setMonth(today.getMonth() - 1) // Allow setting dates up to 1 month in the past
      return today.toISOString().split('T')[0]
    })

    const hasChanges = computed(() => {
      if (!originalData.value) return false
      
      // Check if image has changed
      if (formData.value.image instanceof File) {
        return true // If a new file is selected, there are changes
      }
      
      // Check text fields
      return ['title', 'summary', 'content', 'type', 'publishedDate', 'author'].some(field => {
        return formData.value[field]?.toString() !== originalData.value[field]?.toString();
      });
    })

    const isFormValid = computed(() => {
      // Kiểm tra dữ liệu hợp lệ dựa trên model
      const hasRequiredFields = 
        formData.value.title?.trim().length >= 10 &&
        formData.value.title.trim().length <= 200 &&
        formData.value.summary?.trim().length >= 20 &&
        formData.value.summary.trim().length <= 500 &&
        formData.value.content?.trim().length >= 100 &&
        formData.value.content.trim().length <= 5000 &&
        formData.value.type?.trim() &&
        formData.value.publishedDate &&
        (formData.value.image || imagePreview.value);
      
      // Kiểm tra tác giả nếu được cung cấp  
      const authorValid = !formData.value.author || (
        formData.value.author.trim().length >= 3 &&
        formData.value.author.trim().length <= 50 &&
        /^[a-zA-ZÀ-ỹ\s]+$/.test(formData.value.author.trim())
      );
      
      // Form hợp lệ khi có đầy đủ thông tin và không có lỗi
      return hasRequiredFields && authorValid && Object.keys(errors.value).length === 0;
    })

    // Watch for route changes to reload data
    watch(() => route.params.id, (newId) => {
      if (newId && newId !== newsId.value) {
        newsId.value = newId;
        loadNews();
      }
    });

    // Methods
    const loadNews = async () => {
      try {
        console.log('Loading news data for ID:', route.params.id);
        newsId.value = route.params.id;
        const response = await newsService.getNewsById(route.params.id)
        console.log('News data loaded:', response);
        
        if (response && response.data) {
          const news = response.data
          
          // Initialize the form with the news data
          formData.value = {
            title: news.title || '',
            summary: news.summary || '',
            content: news.content || '',
            image: news.image || null,
            type: news.type || '',
            publishedDate: news.publishedDate 
              ? new Date(news.publishedDate).toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0],
            author: news.author || 'Admin',
            view: news.view || 0,
            like: news.like || 0,
            isDeleted: news.isDeleted || false
          }
          
          // Save original data for comparison
          originalData.value = { ...formData.value }
          console.log('Form data initialized:', formData.value);
          
          // Create image preview if needed
          if (news.image) {
            imagePreview.value = null // Reset preview first
            formData.value.image = news.image
          }
          
          // Clear any existing errors
          errors.value = {}
          error.value = null
          successMessage.value = null
        } else {
          throw new Error('Failed to load news data');
        }
      } catch (error) {
        console.error('Error loading news:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải thông tin tin tức. Vui lòng thử lại.'
        })
      }
    }

    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      
      // Clean the path by removing any leading slashes
      const cleanPath = imagePath.replace(/^[/\\]+/, '');
      console.log('Formatted image path:', `http://localhost:3000/${cleanPath}`);
      return `http://localhost:3000/${cleanPath}`;
    }

    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (!file) return;

      // Clear previous errors
      delete errors.value.image;
      
      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.value.image = 'Kích thước ảnh không được vượt quá 5MB';
        if (fileInput.value) {
          fileInput.value.value = '';
        }
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        errors.value.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF';
        if (fileInput.value) {
          fileInput.value.value = '';
        }
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        // Check min dimensions
        if (img.width < 300 || img.height < 200) {
          errors.value.image = 'Kích thước ảnh quá nhỏ (tối thiểu 300x200 pixels)';
          if (fileInput.value) {
            fileInput.value.value = '';
          }
          formData.value.image = null;
          imagePreview.value = null;
          return;
        }
        
        // Check max dimensions
        if (img.width > 2000 || img.height > 2000) {
          errors.value.image = 'Kích thước ảnh quá lớn (tối đa 2000x2000 pixels)';
          if (fileInput.value) {
            fileInput.value.value = '';
          }
          formData.value.image = null;
          imagePreview.value = null;
          return;
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        errors.value.image = 'File không phải là ảnh hợp lệ';
        if (fileInput.value) {
          fileInput.value.value = '';
        }
        formData.value.image = null;
        imagePreview.value = null;
      };
      
      img.src = URL.createObjectURL(file);

      // Set image data if passes validation
      formData.value.image = file;
      imagePreview.value = URL.createObjectURL(file);
      console.log('New image selected:', file.name, file.type, file.size);
    }

    const removeImage = (e) => {
      if (e) e.stopPropagation()
      formData.value.image = null
      imagePreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      errors.value.image = 'Vui lòng chọn ảnh cho tin tức'
    }

    const handleSubmit = async () => {
      error.value = null;
      successMessage.value = null;
      uploadStatus.value = '';
      
      if (!validateForm()) {
        // Focus on the first error field
        const firstErrorField = Object.keys(errors.value)[0];
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => element.focus(), 500);
        }
        
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Vui lòng kiểm tra lại thông tin nhập vào'
        });
        return;
      }

      try {
        isSubmitting.value = true;
        console.log('Submitting form with data:', formData.value);
        
        // Tạo đối tượng dữ liệu để gửi lên server
        const newsData = {
          title: formData.value.title.trim(),
          summary: formData.value.summary.trim(),
          content: formData.value.content.trim(),
          type: formData.value.type.trim(),
          publishedDate: new Date(formData.value.publishedDate).toISOString(),
          view: formData.value.view,
          like: formData.value.like,
          isDeleted: formData.value.isDeleted,
          author: formData.value.author.trim() || 'Admin'
        };
        
        // Xử lý ảnh
        let imageUrl = null;
        
        // Kiểm tra nếu có file ảnh mới
        if (formData.value.image instanceof File) {
          console.log('Uploading new image file:', formData.value.image.name);
          uploadStatus.value = 'Đang tải ảnh lên...';
          const imageFormData = new FormData();
          imageFormData.append('image', formData.value.image);
          
          try {
            const uploadResponse = await newsService.uploadImage(imageFormData);
            console.log('Image upload response:', uploadResponse);
            
            if (uploadResponse && uploadResponse.imagePath) {
              imageUrl = uploadResponse.imagePath;
              newsData.image = imageUrl;
              console.log('New image path:', imageUrl);
              uploadStatus.value = 'Ảnh đã được tải lên thành công';
            } else {
              throw new Error('Invalid image upload response structure');
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            eventBus.emit('show-toast', {
              type: 'error',
              message: 'Không thể tải lên hình ảnh. Vui lòng thử lại.'
            });
            error.value = 'Lỗi khi tải ảnh lên: ' + (uploadError.message || 'Không xác định');
            isSubmitting.value = false;
            return;
          }
        } 
        // Nếu là ảnh đã có sẵn
        else if (typeof formData.value.image === 'string' && formData.value.image) {
          console.log('Using existing image path:', formData.value.image);
          imageUrl = formData.value.image;
          newsData.image = imageUrl;
        }
        // Trường hợp không có ảnh
        else {
          console.log('No image provided');
          eventBus.emit('show-toast', {
            type: 'error',
            message: 'Vui lòng chọn ảnh cho tin tức'
          });
          error.value = 'Vui lòng chọn ảnh cho tin tức';
          isSubmitting.value = false;
          return;
        }
        
        console.log('Sending news data to update:', newsData);
        uploadStatus.value = 'Đang cập nhật tin tức...';
        
        try {
          // Gọi API cập nhật tin tức
          const response = await newsService.updateNews(route.params.id, newsData);
          console.log('Update response:', response);

          // Hiển thị thông báo thành công
          successMessage.value = 'Tin tức đã được cập nhật thành công';
          eventBus.emit('show-toast', {
            type: 'success',
            message: successMessage.value
          });
            
          // Chuyển về trang danh sách sau một khoảng thời gian ngắn
          setTimeout(() => {
            router.push('/admin/tin-tuc/danh-sach');
          }, 1500);
        } catch (updateError) {
          console.error('Error updating news:', updateError);
          
          // Xử lý lỗi validation từ server
          if (updateError.response?.data?.errors) {
            const serverErrors = updateError.response.data.errors;
            Object.keys(serverErrors).forEach(key => {
              errors.value[key] = serverErrors[key];
            });
            error.value = 'Vui lòng kiểm tra lại thông tin nhập vào';
          } else {
            error.value = updateError.response?.data?.message || updateError.message || 'Có lỗi xảy ra khi cập nhật tin tức. Vui lòng thử lại.';
          }
          
          eventBus.emit('show-toast', {
            type: 'error',
            message: error.value
          });
        }
      } catch (error) {
        console.error('Uncaught error in form submission:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
        });
      } finally {
        isSubmitting.value = false;
        uploadStatus.value = '';
      }
    }

    const confirmCancel = () => {
      showConfirmModal.value = false
      router.push('/admin/tin-tuc/danh-sach')
    }

    const validateForm = () => {
      console.log('Validating form data:', formData.value);
      const newErrors = {};

      // Validate tiêu đề (title)
      if (!formData.value.title?.trim()) {
        newErrors.title = 'Tiêu đề không được để trống';
      } else if (formData.value.title.trim().length < 10) {
        newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự';
      } else if (formData.value.title.trim().length > 200) {
        newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
      }

      // Validate tóm tắt (summary)
      if (!formData.value.summary?.trim()) {
        newErrors.summary = 'Tóm tắt không được để trống';
      } else if (formData.value.summary.trim().length < 20) {
        newErrors.summary = 'Tóm tắt phải có ít nhất 20 ký tự';
      } else if (formData.value.summary.trim().length > 500) {
        newErrors.summary = 'Tóm tắt không được vượt quá 500 ký tự';
      }

      // Validate nội dung (content)
      if (!formData.value.content?.trim()) {
        newErrors.content = 'Nội dung không được để trống';
      } else if (formData.value.content.trim().length < 100) {
        newErrors.content = 'Nội dung phải có ít nhất 100 ký tự';
      } else if (formData.value.content.trim().length > 5000) {
        newErrors.content = 'Nội dung không được vượt quá 5000 ký tự';
      }

      // Validate loại (type)
      if (!formData.value.type?.trim()) {
        newErrors.type = 'Phân loại không được để trống';
      } else if (formData.value.type.trim().length > 50) {
        newErrors.type = 'Phân loại không được vượt quá 50 ký tự';
      }

      // Validate ngày đăng (publishedDate)
      if (!formData.value.publishedDate) {
        newErrors.publishedDate = 'Vui lòng chọn ngày đăng';
      } else {
        const publishDate = new Date(formData.value.publishedDate);
        const minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 1);
        
        if (publishDate < minDate) {
          newErrors.publishedDate = 'Ngày đăng không được vượt quá 1 tháng trước';
        }
        
        const today = new Date();
        today.setMonth(today.getMonth() + 1);
        if (publishDate > today) {
          newErrors.publishedDate = 'Ngày đăng không được vượt quá 1 tháng tới';
        }
      }

      // Validate ảnh (image)
      if (!formData.value.image && !imagePreview.value) {
        newErrors.image = 'Vui lòng chọn ảnh cho tin tức';
      }

      // Validate tác giả (author) nếu có
      if (formData.value.author && formData.value.author.trim() !== '') {
        if (formData.value.author.trim().length < 3) {
          newErrors.author = 'Tên tác giả phải có ít nhất 3 ký tự';
        } else if (formData.value.author.trim().length > 50) {
          newErrors.author = 'Tên tác giả không được vượt quá 50 ký tự';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.value.author.trim())) {
          newErrors.author = 'Tên tác giả chỉ được chứa chữ cái và khoảng trắng';
        }
      }

      errors.value = newErrors;
      const isValid = Object.keys(newErrors).length === 0;
      console.log('Form validation result:', isValid, newErrors);
      return isValid;
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const triggerFileInput = () => {
      if (fileInput.value && !isSubmitting.value) {
        fileInput.value.click()
      }
    }

    // Load news data when component mounts
    onMounted(() => {
      console.log('EditNews component mounted - loading news with ID:', route.params.id);
      loadNews()
    })

    return {
      formData,
      imagePreview,
      errors,
      fileInput,
      isSubmitting,
      showConfirmModal,
      minDate,
      hasChanges,
      isFormValid,
      handleImageChange,
      removeImage,
      handleSubmit,
      confirmCancel,
      formatFileSize,
      getImageUrl,
      triggerFileInput,
      error,
      successMessage,
      uploadStatus
    }
  }
}
</script>

<style scoped>
@import "@/styles/admin.css";

/* Component-specific styles that aren't in admin.css */
.edit-news {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

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

.image-upload-container {
  border: 2px dashed var(--border-color);
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
  font-size: 2.5em;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 8px;
  line-height: 1.4;
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
  border-style: solid !important;
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

@media (max-width: 480px) {
  .image-upload-container {
    min-height: 180px;
    padding: 16px;
  }
  
  .preview-img {
    max-height: 160px;
  }
}
</style> 