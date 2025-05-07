<template>
  <div class="service-list">
    <!-- Header Actions -->
    <div class="actions-header">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tiêu đề..."
            @input="handleSearch"
          />
        </div>

        <select v-model="filterType" @change="handleFilter">
          <option value="">Tất cả loại</option>
          <option value="web">Website</option>
          <option value="app">Ứng dụng</option>
          <option value="agency">Agency</option>
        </select>
      </div>
    </div>

    <!-- Service Table -->
    <div class="table-container responsive-table">
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Loại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in filteredServices" :key="service._id">
            <td class="service-id">{{ index + 1 }}</td>
            <td>
              <img
                v-if="service.image"
                :src="getImageUrl(service.image)"
                alt="Service image"
                class="service-image"
              />
              <span v-else class="no-image">No image</span>
            </td>
            <td class="truncate-text">{{ service.title }}</td>
            <td>{{ formatPrice(service.price) }}</td>
            <td>{{ formatType(service.type) }}</td>

            <td class="actions-cell">
              <div class="actions">
                <button class="icon-btn info" @click="showDetails(service)">
                  <i class="fas fa-info-circle"></i>
                </button>
                <button class="icon-btn edit" @click="openEditModal(service)">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="!service.isDeleted"
                  class="icon-btn delete"
                  @click="confirmSoftDelete(service)"
                  title="Chuyển vào thùng rác"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <button
                  v-else
                  class="icon-btn restore"
                  @click="confirmRestore(service)"
                  title="Khôi phục"
                >
                  <i class="fas fa-trash-restore"></i>
                </button>
                <button
                  v-if="service.isDeleted"
                  class="icon-btn permanent-delete"
                  @click="confirmPermanentDelete(service)"
                  title="Xóa vĩnh viễn"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Service Details Modal -->
    <div class="modal" v-if="showDetailsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chi tiết dịch vụ</h3>
          <button class="close-btn" @click="showDetailsModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-item">
            <label>ID:</label>
            <p>{{ selectedService._id }}</p>
          </div>
          <div class="detail-item">
            <label>Ảnh:</label>
            <img
              v-if="selectedService.image"
              :src="getImageUrl(selectedService.image)"
              alt="Service image"
              class="detail-image"
            />
            <span v-else class="no-image">No image</span>
          </div>
          <div class="detail-item">
            <label>Tiêu đề:</label>
            <p>{{ selectedService.title }}</p>
          </div>
          <div class="detail-item">
            <label>Giá:</label>
            <p>{{ formatPrice(selectedService.price) }}</p>
          </div>
          <div class="detail-item">
            <label>Mô tả:</label>
            <p>{{ formatDescription(selectedService.description) }}</p>
          </div>
          <div class="detail-item">
            <label>Loại:</label>
            <p>{{ formatDescription(selectedService.type) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Service Modal -->
    <div class="modal" v-if="showFormModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới' }}</h3>
          <button class="close-btn" @click="showFormModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Success message -->
          <div v-if="successMessage" class="success-alert">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>
          
          <!-- Error message -->
          <div v-if="submitError" class="error-alert">
            <i class="fas fa-exclamation-circle"></i>
            {{ submitError }}
          </div>

          <!-- Upload status -->
          <div v-if="uploadStatus" class="status-alert">
            <i class="fas fa-spinner fa-spin" v-if="uploadStatus.includes('Đang')"></i>
            <i class="fas fa-check" v-else></i>
            {{ uploadStatus }}
          </div>
        
          <form @submit.prevent="handleSubmit" novalidate>
            <!-- Tiêu đề -->
            <div class="form-group">
              <label>Tiêu đề <span class="required">*</span></label>
              <input 
                type="text" 
                name="title"
                v-model="formData.title"
                :class="{ 'error': errors.title }"
                :disabled="submitLoading"
                placeholder="Nhập tiêu đề dịch vụ"
              />
              <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
              <span class="character-count" v-if="formData.title">
                {{ formData.title.length }}/100
              </span>
            </div>

            <!-- Info section: Type and Price -->
            <div class="info-section">
              <!-- Loại dịch vụ -->
              <div class="form-group">
                <label>Loại dịch vụ <span class="required">*</span></label>
                <select 
                  name="type"
                  v-model="formData.type"
                  :class="{ 'error': errors.type }"
                  :disabled="submitLoading"
                >
                  <option value="">Chọn loại dịch vụ</option>
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
                  name="price"
                  v-model="formData.price"
                  :class="{ 'error': errors.price }"
                  :disabled="submitLoading"
                  placeholder="Nhập giá dịch vụ"
                  min="0"
                />
                <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
              </div>
            </div>

            <!-- Ảnh -->
            <div class="form-group">
              <label>Ảnh <span v-if="!isEditing" class="required">*</span></label>
              <div class="image-upload-container" @click="$refs.imageInput.click()" :class="{ 'error-border': errors.image }">
                <input 
                  type="file"
                  name="image"
                  ref="imageInput"
                  class="file-input"
                  @change="handleImageUpload"
                  accept="image/*"
                  :disabled="submitLoading"
                />
                <div v-if="!imagePreview" class="upload-placeholder">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>Click để tải ảnh lên</span>
                  <p class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
                  <p class="upload-hint">Kích thước tối thiểu: 200x200px, tối đa 2000x2000px</p>
                </div>
                <div v-else class="image-preview">
                  <img :src="imagePreview" alt="Preview" />
                  <button type="button" class="remove-image" @click.stop="removeImage">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <span class="error-message" v-if="errors.image">{{ errors.image }}</span>
            </div>

            <!-- Mô tả -->
            <div class="form-group">
              <label>Mô tả <span class="required">*</span></label>
              <textarea 
                name="description"
                v-model="formData.description"
                :class="{ 'error': errors.description }"
                :disabled="submitLoading"
                rows="4"
                placeholder="Nhập mô tả dịch vụ"
              ></textarea>
              <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
              <small class="form-help-text">Mỗi dòng mô tả cần có ít nhất 10 ký tự và tối đa 500 ký tự.</small>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showFormModal = false" :disabled="submitLoading">
                <i class="fas fa-times"></i> Hủy
              </button>
              <button type="submit" class="submit-btn" :disabled="submitLoading">
                <i class="fas" :class="submitLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                {{ submitLoading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Soft Delete Confirmation Modal -->
    <div class="modal" v-if="showSoftDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận chuyển vào thùng rác</h3>
          <button class="close-btn" @click="showSoftDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>
            Bạn có chắc chắn muốn chuyển dịch vụ "{{ selectedService.title }}" vào thùng rác không?
          </p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showSoftDeleteModal = false">Hủy</button>
            <button class="delete-btn" @click="handleSoftDelete">Chuyển vào thùng rác</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Restore Confirmation Modal -->
    <div class="modal" v-if="showRestoreModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận khôi phục</h3>
          <button class="close-btn" @click="showRestoreModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn khôi phục dịch vụ "{{ selectedService.title }}" không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
            <button class="submit-btn" @click="handleRestore">Khôi phục</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Permanent Delete Confirmation Modal -->
    <div class="modal" v-if="showPermanentDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận xóa vĩnh viễn</h3>
          <button class="close-btn" @click="showPermanentDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">Cảnh báo: Hành động này không thể hoàn tác!</p>
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn dịch vụ "{{ selectedService.title }}" không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showPermanentDeleteModal = false">Hủy</button>
            <button class="permanent-delete-btn" @click="handlePermanentDelete">
              Xóa vĩnh viễn
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService'
import eventBus from '@/eventBus'

export default {
  name: 'ServiceList',
  data() {
    return {
      services: [],
      searchQuery: '',
      filterType: '',
      showDetailsModal: false,
      showFormModal: false,
      showSoftDeleteModal: false,
      showRestoreModal: false,
      showPermanentDeleteModal: false,
      selectedService: {},
      formData: {
        _id: '',
        image: null,
        title: '',
        price: 0,
        description: '',
        status: true,
        type: ''
      },
      imagePreview: null,
      isEditing: false,
      loading: false,
      error: null,
      baseImageUrl: 'http://localhost:3000',
      submitLoading: false,
      submitError: null,
      uploadStatus: '',
      successMessage: '',
      errors: {}
    }
  },
  computed: {
    filteredServices() {
      const services = Array.isArray(this.services) ? this.services : []

      let result = services.filter((service) => !service.isDeleted)

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter((service) => service.title.toLowerCase().includes(query))
      }

      if (this.filterType !== '') {
        result = result.filter((service) => service.type === this.filterType)
      }

      return result
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
    },
    formatType(type) {
      const types = {
        web: 'Website',
        app: 'Ứng dụng',
        agency: 'Agency',
      }
      return types[type] || type
    },
    formatDescription(description) {
      if (!description) return ''
      if (Array.isArray(description)) {
        return description.map((item) => `• ${item}`).join('\n')
      }
      return `• ${description.toString()}`
    },
    handleSearch() {
      // Implement debounce if needed
    },
    handleFilter() {
      // Additional filter logic if needed
    },
    showDetails(service) {
      this.selectedService = { ...service }
      this.showDetailsModal = true
    },
    openAddModal() {
      this.isEditing = false
      this.formData = {
        _id: '',
        image: null,
        title: '',
        price: 0,
        description: '',
        status: true,
        type: ''
      }
      this.imagePreview = null
      this.showFormModal = true
    },
    openEditModal(service) {
      this.isEditing = true;
      this.formData = {
        _id: service._id,
        title: service.title,
        price: service.price,
        description: Array.isArray(service.description) 
          ? service.description.join('\n')
          : service.description,
        image: service.image,
        status: !service.isDeleted,
        type: service.type
      };
      this.imagePreview = this.getImageUrl(service.image);
      this.showFormModal = true;
    },
    confirmSoftDelete(service) {
      this.selectedService = service
      this.showSoftDeleteModal = true
    },
    confirmRestore(service) {
      this.selectedService = service
      this.showRestoreModal = true
    },
    confirmPermanentDelete(service) {
      this.selectedService = service
      this.showPermanentDeleteModal = true
    },
    async loadServices() {
      this.loading = true
      this.error = null
      try {
        const response = await serviceService.getServices()
        // Lấy danh sách đã xóa từ localStorage
        const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]')
        // Lọc bỏ các service đã xóa
        this.services = Array.isArray(response)
          ? response.filter((service) => !deletedServices.includes(service._id))
          : []
      } catch (error) {
        console.error('Error loading services:', error)
        this.error = 'Không thể tải danh sách dịch vụ'
        this.services = []
      } finally {
        this.loading = false
      }
    },
    validateForm() {
      let isValid = true;
      let errors = {};

      // Tiêu đề validation
      if (!this.formData.title?.trim()) {
        errors.title = 'Tiêu đề không được để trống';
        isValid = false;
      } else if (this.formData.title.trim().length < 3) {
        errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        isValid = false;
      } else if (this.formData.title.trim().length > 100) {
        errors.title = 'Tiêu đề không được vượt quá 100 ký tự';
        isValid = false;
      } else if (!/^[a-zA-Z0-9\sÀ-ỹ[\]{}()!@#$%^&*,.?-]+$/.test(this.formData.title.trim())) {
        errors.title = 'Tiêu đề chứa ký tự không hợp lệ';
        isValid = false;
      }

      // Loại dịch vụ validation
      if (!this.formData.type) {
        errors.type = 'Vui lòng chọn loại dịch vụ';
        isValid = false;
      } else if (!['web', 'app', 'agency'].includes(this.formData.type)) {
        errors.type = 'Loại dịch vụ không hợp lệ';
        isValid = false;
      }

      // Giá validation
      if (this.formData.price === undefined || this.formData.price === null || this.formData.price === '') {
        errors.price = 'Giá dịch vụ không được để trống';
        isValid = false;
      } else {
        const priceValue = Number(this.formData.price);
        if (isNaN(priceValue)) {
          errors.price = 'Giá dịch vụ phải là một số';
          isValid = false;
        } else if (priceValue <= 0) {
          errors.price = 'Giá dịch vụ phải lớn hơn 0';
          isValid = false;
        } else if (priceValue > 1000000000) {
          errors.price = 'Giá dịch vụ quá lớn';
          isValid = false;
        }
      }

      // Mô tả validation
      const description = typeof this.formData.description === 'string' 
        ? this.formData.description 
        : Array.isArray(this.formData.description) 
          ? this.formData.description.join('\n') 
          : '';

      if (!description.trim()) {
        errors.description = 'Mô tả không được để trống';
        isValid = false;
      } else {
        const lines = description.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          errors.description = 'Mô tả không được để trống';
          isValid = false;
        } else {
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length < 10) {
              errors.description = `Dòng ${i + 1}: Mỗi dòng mô tả phải có ít nhất 10 ký tự`;
              isValid = false;
              break;
            } else if (line.length > 500) {
              errors.description = `Dòng ${i + 1}: Mỗi dòng mô tả không được vượt quá 500 ký tự`;
              isValid = false;
              break;
            }
          }
        }
      }

      // Ảnh validation - Chỉ kiểm tra khi thêm mới
      if (!this.isEditing && !this.formData.image && !this.imagePreview) {
        errors.image = 'Vui lòng tải lên ảnh cho dịch vụ';
        isValid = false;
      }

      this.errors = errors;
      
      if (!isValid) {
        // Display error message
        const errorMessages = Object.values(errors).join('\n');
        alert('Vui lòng sửa các lỗi sau:\n' + errorMessages);
      }

      return isValid;
    },
    async handleSubmit() {
      // Basic trimming
      if (typeof this.formData.title === 'string') {
        this.formData.title = this.formData.title.trim();
      }
      
      if (typeof this.formData.description === 'string') {
        this.formData.description = this.formData.description.trim();
      } else if (Array.isArray(this.formData.description)) {
        this.formData.description = this.formData.description.map(item => item.trim()).filter(item => item);
      }
      
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

      try {
        this.submitLoading = true;
        this.submitError = null;
        
        let imageUrl = null;
        if (this.formData.image instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append('image', this.formData.image);
          
          try {
            this.uploadStatus = 'Đang tải ảnh lên...';
            const uploadResponse = await serviceService.uploadImage(imageFormData);
            if (uploadResponse && uploadResponse.imagePath) {
              imageUrl = uploadResponse.imagePath;
              this.uploadStatus = 'Tải ảnh thành công!';
            } else {
              throw new Error('Không nhận được đường dẫn ảnh');
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            this.submitError = 'Lỗi khi tải ảnh lên: ' + (uploadError.message || 'Không xác định');
            this.submitLoading = false;
            return;
          }
        }

        // Prepare service data according to backend model
        this.uploadStatus = 'Đang xử lý...';
        const serviceData = {
          title: this.formData.title,
          description: Array.isArray(this.formData.description) 
            ? this.formData.description 
            : this.formData.description.split('\n').filter(line => line.trim()),
          price: Number(this.formData.price),
          status: this.formData.status,
          type: this.formData.type
        };

        if (imageUrl) {
          serviceData.image = imageUrl;
        } else if (this.formData.image && typeof this.formData.image === 'string') {
          serviceData.image = this.formData.image;
        }

        if (this.isEditing) {
          await serviceService.updateService(this.formData._id, serviceData);
          this.successMessage = 'Cập nhật dịch vụ thành công!';
        } else {
          await serviceService.createService(serviceData);
          this.successMessage = 'Thêm dịch vụ mới thành công!';
        }

        // Success handling
        setTimeout(() => {
          this.loadServices();
          this.showFormModal = false;
          this.resetForm();
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        
        // Handle validation errors from backend
        if (error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          
          // Map backend errors to form fields
          const errorMapping = {
            'title': 'title',
            'description': 'description', 
            'price': 'price',
            'type': 'type',
            'image': 'image'
          };
          
          // Reset all errors first
          this.errors = {};
          
          // Map backend errors to frontend error fields
          Object.entries(backendErrors).forEach(([field, message]) => {
            const frontendField = errorMapping[field] || field;
            this.errors[frontendField] = Array.isArray(message) ? message[0] : message;
          });
          
          // Show validation message
          this.submitError = 'Vui lòng kiểm tra lại thông tin nhập';
          
          // Scroll to the first error field
          this.$nextTick(() => {
            const errorFields = Object.keys(this.errors);
            if (errorFields.length > 0) {
              const firstErrorField = errorFields[0];
              const element = document.querySelector(`[name="${firstErrorField}"]`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => element.focus(), 500);
              }
            }
          });
        } else {
          // General error message
          this.submitError = error.response?.data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
        }
      } finally {
        this.submitLoading = false;
        this.uploadStatus = '';
      }
    },
    async handleSoftDelete() {
      try {
        const serviceIndex = this.services.findIndex((s) => s._id === this.selectedService._id)
        if (serviceIndex !== -1) {
          // Lưu ID service đã xóa vào localStorage
          const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]')
          deletedServices.push(this.selectedService._id)
          localStorage.setItem('deletedServices', JSON.stringify(deletedServices))

          // Lưu thông tin service đã xóa
          const deletedServiceInfo = {
            ...this.services[serviceIndex],
            isDeleted: true,
            deletedAt: new Date(),
          }
          const deletedServicesInfo = JSON.parse(
            localStorage.getItem('deletedServicesInfo') || '[]'
          )
          deletedServicesInfo.push(deletedServiceInfo)
          localStorage.setItem('deletedServicesInfo', JSON.stringify(deletedServicesInfo))

          // Xóa khỏi danh sách hiện tại
          this.services.splice(serviceIndex, 1)
        }
        this.showSoftDeleteModal = false
        eventBus.emit('update-deleted-services-count')
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async handleRestore() {
      try {
        await serviceService.restoreService(this.selectedService._id)
        await this.loadServices()
        this.showRestoreModal = false
        eventBus.emit('update-deleted-services-count')
      } catch (error) {
        console.error('Error:', error)
        // Thêm xử lý lỗi nếu cần
      }
    },
    async handlePermanentDelete() {
      try {
        await serviceService.permanentDeleteService(this.selectedService._id)
        await this.loadServices()
        this.showPermanentDeleteModal = false
        eventBus.emit('update-deleted-services-count')
      } catch (error) {
        console.error('Error:', error)
        // Thêm xử lý lỗi nếu cần
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Reset image error
      delete this.errors.image;
      
      // Check file size (5MB limit)
      const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxFileSize) {
        this.errors.image = `Kích thước file không được vượt quá 5MB`;
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = '';
        }
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.errors.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF';
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = '';
        }
        return;
      }

      // Check image dimensions (create a temporary image to check)
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        // Minimum dimensions check
        if (img.width < 200 || img.height < 200) {
          this.errors.image = 'Kích thước ảnh quá nhỏ (tối thiểu 200x200 pixels)';
          if (this.$refs.imageInput) {
            this.$refs.imageInput.value = '';
          }
          this.formData.image = null;
          this.imagePreview = null;
          return;
        }
        
        // Maximum dimensions check
        if (img.width > 2000 || img.height > 2000) {
          this.errors.image = 'Kích thước ảnh quá lớn (tối đa 2000x2000 pixels)';
          if (this.$refs.imageInput) {
            this.$refs.imageInput.value = '';
          }
          this.formData.image = null;
          this.imagePreview = null;
          return;
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        this.errors.image = 'File không phải là ảnh hợp lệ';
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = '';
        }
        this.formData.image = null;
        this.imagePreview = null;
      };
      
      img.src = URL.createObjectURL(file);
      
      // Set image preview and data
      this.formData.image = file;
      this.imagePreview = URL.createObjectURL(file);
    },
    removeImage() {
      this.formData.image = null;
      this.imagePreview = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null
      if (imagePath.startsWith('http')) return imagePath
      return `${this.baseImageUrl}/${imagePath}`
    },
    resetForm() {
      this.formData = {
        _id: '',
        image: null,
        title: '',
        price: 0,
        description: '',
        type: '',
        status: true
      };
      this.imagePreview = null;
      this.isEditing = false;
      this.errors = {};
      this.submitError = null;
      this.successMessage = '';
      this.uploadStatus = '';
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },
  },
  created() {
    this.loadServices()
    // Listen for updates from TrashService
    eventBus.on('update-deleted-services-count', () => {
      this.loadServices()
    })
  },
  beforeUnmount() {
    // Cleanup event listeners
    eventBus.off('update-deleted-services-count')
    // Cleanup image previews
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview)
    }
  },
}
</script>

<style scoped>
/* Import the admin styles */
@import "@/styles/admin.css";

select{
  padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    min-width: 160px;
}
/* Component specific overrides */
.service-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-x: auto;
}

.service-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.detail-image {
  max-width: 200px;
  height: auto;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.content {
  text-align: left;
  white-space: pre-line;
  line-height: 1.5;
  padding: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.required {
  color: #e53e3e;
  margin-left: 2px;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

input[type="text"],
input[type="number"],
select,
textarea {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.image-upload-container {
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.image-upload-container:hover {
  border-color: #4299e1;
  background-color: rgba(66, 153, 225, 0.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
}

.upload-placeholder i {
  font-size: 2rem;
  color: #4299e1;
}

.upload-hint {
  font-size: 0.875rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

.image-preview {
  position: relative;
  max-width: 300px;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-image:hover {
  background: #e53e3e;
  border-color: #e53e3e;
  color: white;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.cancel-btn {
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.submit-btn {
  background: #4299e1;
  color: white;
  border: none;
}

.cancel-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.submit-btn:hover:not(:disabled) {
  background: #3182ce;
}

.cancel-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Validation styles */
.error {
  border-color: #e53e3e !important;
}

.error-border {
  border-color: #e53e3e !important;
  border-style: solid !important;
}

.error-message {
  color: #e53e3e;
  font-size: 0.825rem;
  display: block;
  margin-top: 0.5rem;
}

.character-count {
  display: block;
  text-align: right;
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.25rem;
}

.form-help-text {
  display: block;
  color: #718096;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Alert styles */
.error-alert,
.success-alert,
.status-alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.error-alert {
  background-color: #ffe2e2;
  color: #e53e3e;
  border-left: 4px solid #e53e3e;
}

.success-alert {
  background-color: #e6ffec;
  color: #22c55e;
  border-left: 4px solid #22c55e;
}

.status-alert {
  background-color: #ebf5ff;
  color: #3b82f6;
  border-left: 4px solid #3b82f6;
}

.error-alert i,
.success-alert i,
.status-alert i {
  font-size: 1.1rem;
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .info-section {
    grid-template-columns: 1fr;
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

.file-input {
  display: none;
}
</style>
