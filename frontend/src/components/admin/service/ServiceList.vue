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

      <div class="action-buttons">
        <router-link to="/admin/dich-vu/them-moi" class="action-btn add">
          <i class="fas fa-plus"></i>
          Thêm dịch vụ
        </router-link>
        <router-link to="/admin/dich-vu/thung-rac" class="action-btn trash">
          <i class="fas fa-trash-alt"></i>
          Thùng rác
          <span v-if="deletedServicesCount" class="badge">{{ deletedServicesCount }}</span>
        </router-link>
      </div>
    </div>
    <div v-if="loading" class="loading-container">
      <!-- <div class="loading-spinner"></div> -->
      <p>Đang tải danh sách tin tức...</p>
    </div>
    <!-- Service Table -->
    <div class="table-container responsive-table">
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center">
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
            </th>
            <th style="width: 60px; text-align: center">No.</th>
            <th style="width: 70px; text-align: center">Ảnh</th>
            <th style="width: 30%; text-align: center">Tiêu đề</th>
            <th style="width: 15%; text-align: center">Giá</th>
            <th style="width: 15%; text-align: center">Loại</th>
            <th style="width: 20%; text-align: center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in filteredServices" :key="service._id">
            <td class="center-cell">
              <input
                type="checkbox"
                :checked="isSelected(service._id)"
                @change="toggleSelect(service._id)"
              />
            </td>
            <td class="service-id center-cell">{{ index + 1 }}</td>
            <td class="center-cell">
              <img
                v-if="service.image"
                :src="getImageUrl(service.image)"
                alt="Service image"
                class="service-image"
              />
              <span v-else class="no-image">No image</span>
            </td>
            <td class="truncate-text center-cell">{{ service.title }}</td>
            <td class="center-cell">{{ formatPrice(service.price) }}</td>
            <td class="center-cell">{{ formatType(service.type) }}</td>

            <td class="actions-cell center-cell">
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
      <div class="modal-overlay" @click="showDetailsModal = false"></div>
      <div class="modal-content" @click.stop>
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
            <p style="white-space: pre-line">
              {{ formatDescriptionNoBullet(selectedService.description) }}
            </p>
          </div>
          <div class="detail-item">
            <label>Loại:</label>
            <p>{{ formatTypeNoBullet(selectedService.type) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Service Modal -->
    <div class="modal" v-if="showFormModal">
      <div class="modal-overlay" @click="showFormModal = false"></div>
      <div class="modal-content" @click.stop>
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
                :class="{ error: errors.title }"
                :disabled="submitLoading"
                placeholder="Nhập tiêu đề dịch vụ"
                maxlength="100"
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
                  :class="{ error: errors.type }"
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
                  :class="{ error: errors.price }"
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
              <div
                class="image-upload-container"
                @click="$refs.imageInput.click()"
                :class="{ 'error-border': errors.image }"
              >
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
                  <p class="upload-hint">Định dạng: JPG, PNG, GIF</p>
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
                :class="{ error: errors.description }"
                :disabled="submitLoading"
                rows="4"
                placeholder="Nhập mô tả dịch vụ"
                maxlength="1000"
              ></textarea>
              <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
              <span class="character-count" v-if="formData.description">
                {{ formData.description.length }}/1000
              </span>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="cancel-btn"
                @click="showFormModal = false"
                :disabled="submitLoading"
              >
                <i class="fas fa-times"></i> Hủy
              </button>
              <button type="submit" class="submit-btn" :disabled="submitLoading">
                <i class="fas" :class="submitLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                {{ submitLoading ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Soft Delete Confirmation Modal -->
    <div class="modal" v-if="showSoftDeleteModal">
      <div class="modal-overlay" @click="showSoftDeleteModal = false"></div>
      <div class="modal-content" @click.stop>
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
      <div class="modal-overlay" @click="showRestoreModal = false"></div>
      <div class="modal-content" @click.stop>
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
      <div class="modal-overlay" @click="showPermanentDeleteModal = false"></div>
      <div class="modal-content" @click.stop>
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
        type: '',
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
      errors: {},
      selectedServices: [],
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
    isAllSelected() {
      return (
        this.filteredServices.length > 0 &&
        this.filteredServices.every((service) => this.selectedServices.includes(service._id))
      )
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
    formatDescriptionNoBullet(description) {
      if (!description) return ''
      if (Array.isArray(description)) {
        return description.join('\n')
      }
      return description.toString()
    },
    formatTypeNoBullet(type) {
      // Hiển thị loại không có dấu đầu dòng, dùng tên tiếng Việt
      const types = {
        web: 'Website',
        app: 'Ứng dụng',
        agency: 'Agency',
      }
      return types[type] || type
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
        type: '',
      }
      this.imagePreview = null
      this.showFormModal = true
    },
    openEditModal(service) {
      this.isEditing = true
      this.formData = {
        _id: service._id,
        title: service.title,
        price: service.price,
        description: Array.isArray(service.description)
          ? service.description.join('\n')
          : service.description,
        image: service.image,
        status: !service.isDeleted,
        type: service.type,
      }
      this.imagePreview = this.getImageUrl(service.image)
      this.showFormModal = true
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
        // Gọi API mà không có giới hạn limit để lấy tất cả dịch vụ
        const response = await serviceService.getServices({ limit: 0 })
        // Lấy danh sách đã xóa từ localStorage
        const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]')
        // Lấy mảng dịch vụ từ response.data
        const servicesArr = Array.isArray(response.data) ? response.data : []
        // Lọc bỏ các service đã xóa
        this.services = servicesArr.filter((service) => !deletedServices.includes(service._id))
        console.log('Loaded all services for admin:', this.services.length, 'services')
      } catch (error) {
        console.error('Error loading services:', error)
        this.error = 'Không thể tải danh sách dịch vụ'
        this.services = []
      } finally {
        this.loading = false
      }
    },
    validateForm() {
      let isValid = true
      let newErrors = {}

      // Validate title
      const titleField = this.formData.title.trim()
      if (!titleField) {
        newErrors.title = 'Tiêu đề không được để trống'
        isValid = false
      } else if (titleField.length < 3) {
        newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự'
        isValid = false
      } else if (titleField.length > 200) {
        newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
        isValid = false
      }

      // Validate description
      const contentField = this.formData.description.trim()
      if (!contentField) {
        newErrors.description = 'Mô tả không được để trống'
        isValid = false
      } else if (contentField.length < 10) {
        newErrors.description = 'Mô tả phải có ít nhất 10 ký tự'
        isValid = false
      } else if (contentField.length > 1000) {
        newErrors.description = 'Mô tả không được vượt quá 1000 ký tự'
        isValid = false
      }

      // Validate type
      if (!this.formData.type) {
        newErrors.type = 'Loại dịch vụ không được để trống'
        isValid = false
      }

      // Validate price
      const priceValue = Number(this.formData.price)
      if (isNaN(priceValue) || priceValue <= 0 || priceValue > 1000000000) {
        newErrors.price = 'Giá dịch vụ phải là một số không âm và không vượt quá 1 tỷ'
        isValid = false
      }

      this.errors = newErrors
      return isValid
    },
    async handleSubmit() {
      // Basic trimming and data preparation
      this.formData.title = this.formData.title.trim()

      // Validate the form before proceeding with the update
      if (!this.validateForm()) {
        // Focus on the first field with an error
        const errorFields = Object.keys(this.errors)
        if (errorFields.length > 0) {
          const firstErrorField = errorFields[0]
          const element = document.querySelector(`[name="${firstErrorField}"]`)
          if (element) {
            element.focus()
          }
        }
        return // Stop the update process if validation fails
      }

      try {
        this.submitLoading = true
        this.submitError = null

        let imageUrl = null
        if (this.formData.image instanceof File) {
          const imageFormData = new FormData()
          imageFormData.append('image', this.formData.image)

          try {
            this.uploadStatus = 'Đang tải ảnh lên...'
            const uploadResponse = await serviceService.uploadImage(imageFormData)
            if (uploadResponse && uploadResponse.imagePath) {
              imageUrl = uploadResponse.imagePath
              this.uploadStatus = 'Tải ảnh thành công!'
            } else {
              throw new Error('Không nhận được đường dẫn ảnh')
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError)
            this.submitError = 'Lỗi khi tải ảnh lên: ' + (uploadError.message || 'Không xác định')
            this.submitLoading = false
            return
          }
        }

        // Prepare the service data for the update
        const serviceData = {
          title: this.formData.title,
          description: this.formData.description,
          price: this.formData.price,
          type: this.formData.type,
          // Include imageUrl if it was uploaded
          ...(imageUrl && { image: imageUrl }),
        }

        // Call the update service API
        await serviceService.updateService(this.formData._id, serviceData)
        this.successMessage = 'Cập nhật dịch vụ thành công!'

        // Reset form and reload services
        setTimeout(() => {
          this.loadServices()
          this.showFormModal = false
          this.resetForm()
        }, 1000)
      } catch (error) {
        console.error('Error updating service:', error)
        this.submitError = 'Có lỗi xảy ra khi cập nhật dịch vụ. Vui lòng thử lại!'
      } finally {
        this.submitLoading = false
      }
    },
    async handleSoftDelete() {
      try {
        // Gọi API để cập nhật trạng thái isDeleted trong database
        await serviceService.deleteService(this.selectedService._id)

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
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi xóa dịch vụ',
        })
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
      const file = event.target.files[0]
      if (!file) return

      // Reset image error
      delete this.errors.image

      // Check file size (5MB limit)
      const maxFileSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxFileSize) {
        this.errors.image = `Kích thước file không được vượt quá 5MB`
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = ''
        }
        return
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        this.errors.image = 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = ''
        }
        return
      }

      // Check image dimensions (create a temporary image to check)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)

        // Minimum dimensions check
        if (img.width < 200 || img.height < 200) {
          this.errors.image = 'Kích thước ảnh quá nhỏ (tối thiểu 200x200 pixels)'
          if (this.$refs.imageInput) {
            this.$refs.imageInput.value = ''
          }
          this.formData.image = null
          this.imagePreview = null
          return
        }

        // Maximum dimensions check
        if (img.width > 2000 || img.height > 2000) {
          this.errors.image = 'Kích thước ảnh quá lớn (tối đa 2000x2000 pixels)'
          if (this.$refs.imageInput) {
            this.$refs.imageInput.value = ''
          }
          this.formData.image = null
          this.imagePreview = null
          return
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        this.errors.image = 'File không phải là ảnh hợp lệ'
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = ''
        }
        this.formData.image = null
        this.imagePreview = null
      }

      img.src = URL.createObjectURL(file)

      // Set image preview and data
      this.formData.image = file
      this.imagePreview = URL.createObjectURL(file)
    },
    removeImage() {
      this.formData.image = null
      this.imagePreview = null
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
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
        status: true,
      }
      this.imagePreview = null
      this.isEditing = false
      this.errors = {}
      this.submitError = null
      this.successMessage = ''
      this.uploadStatus = ''
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
      }
    },
    isSelected(id) {
      return this.selectedServices.includes(id)
    },
    toggleSelect(id) {
      const index = this.selectedServices.indexOf(id)
      if (index === -1) {
        this.selectedServices.push(id)
      } else {
        this.selectedServices.splice(index, 1)
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedServices = []
      } else {
        this.selectedServices = this.filteredServices.map((service) => service._id)
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
@import '@/styles/admin.css';

.service-list {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  /* Đảm bảo có thể cuộn ngang toàn bộ bảng */
  overflow-x: auto;
}

/* Header Actions */
.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.search-filter {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

select {
  padding: 10px 32px 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn.add {
  background-color: #3b82f6;
  color: white;
}

.action-btn.add:hover {
  background-color: #2563eb;
}

.action-btn.trash {
  background-color: #f3f4f6;
  color: #4b5563;
}

.action-btn.trash:hover {
  background-color: #e5e7eb;
}

/* Table Styles */
.table-container {
  margin-top: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  /* Sửa lại để luôn có thể cuộn ngang khi tràn */
  overflow-x: auto;
  /* Xóa overflow: hidden nếu có */
}

table {
  width: 100%;
  min-width: 900px; /* hoặc giá trị phù hợp với số cột */
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  text-align: center;
  vertical-align: middle;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background-color: #f9fafb;
}

.service-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.truncate-text {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.center-cell {
  text-align: center !important;
  vertical-align: middle !important;
}

.actions-cell {
  text-align: center !important;
  vertical-align: middle !important;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

/* Action Buttons in Table */
.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.icon-btn.info {
  background-color: #dbeafe;
  color: #3b82f6;
}

.icon-btn.edit {
  background-color: #d1fae5;
  color: #059669;
}

.icon-btn.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.icon-btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.95);
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px 16px 0 0;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: -0.5px;
}

.close-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    color 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #ef4444;
}

.modal-body {
  padding: 20px;
  font-size: 1rem;
  color: #222;
}

.modal-body p {
  margin-bottom: 0;
}

.warning-text {
  color: #ef4444;
  font-weight: 600;
  margin-bottom: 12px;
}

.cancel-btn {
  background: #f3f4f6;
  color: #475569;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.delete-btn,
.permanent-delete-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 1rem;
  transition:
    background 0.2s,
    color 0.2s;
}

.delete-btn:hover:not(:disabled),
.permanent-delete-btn:hover:not(:disabled) {
  background: #fecaca;
  color: #b91c1c;
}

.submit-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

/* Responsive modal */
@media (max-width: 600px) {
  .modal-content {
    max-width: 98vw;
    padding: 0;
  }
  .modal-header,
  .modal-body {
    padding-left: 12px;
    padding-right: 12px;
  }
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative; /* Thêm dòng này */
  z-index: 1; /* Thêm dòng này */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filter {
    flex-direction: column;
  }

  .search-box {
    max-width: none;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .table-container {
    /* Đảm bảo vẫn có thể cuộn ngang trên mobile */
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }
}

/* Form Specific Styles */
.form-group {
  margin-bottom: 20px;
  padding: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* Alert Messages */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-success {
  background-color: #dcfce7;
  color: #059669;
  border: 1px solid #6ee7b7;
}

.alert-error {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

/* Badge Styles */
.badge {
  background: #ef4444;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 6px;
}

/* Service Details Modal Styles */
.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.modal-header h3 {
  font-size: 20px;
  color: #1e293b;
  font-weight: 600;
}

.modal-body {
  padding: 20px;
}

.detail-item {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: start;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.detail-item label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  padding-top: 4px;
}

.detail-item p {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 32px;
  display: flex;
  align-items: center;
  /* Thêm xử lý tràn nội dung */
  overflow-x: auto;
  word-break: break-word;
  white-space: pre-line;
  max-width: 100%;
}

.detail-item:has(.detail-image) {
  grid-template-columns: 120px 1fr;
}

.detail-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 8px;
}

.no-image {
  display: inline-block;
  padding: 32px 48px;
  background-color: #f1f5f9;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  text-align: center;
}

.detail-item:has(.detail-image) {
  align-items: flex-start;
}

/* Scroll styling for modal content */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

/* Close button styling */
.modal-header .close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  color: #64748b;
  transition: all 0.2s ease;
}

.modal-header .close-btn:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

/* Modal Details Styling */
.detail-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.detail-item label {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.detail-item p {
  color: #111827;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.detail-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #15803d;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Modal Header */
.modal-header {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  color: #6b7280;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #111827;
}

.modal-body {
  padding: 20px;
  background: #fff;
}

/* Form Styling */
.form-group {
  margin-bottom: 24px;
  padding: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #dc2626;
  margin-left: 4px;
}

.form-group input[type='text'],
.form-group input[type='number'],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #fff;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-group .error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.character-count {
  color: #6b7280;
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

/* Image upload styling */
.image-upload-container {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.image-upload-container:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.image-upload-container .file-input {
  display: none;
}

.upload-placeholder {
  color: #6b7280;
}

.upload-placeholder i {
  font-size: 24px;
  margin-bottom: 8px;
  color: #9ca3af;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-image:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

/* Alert messages */
.success-alert,
.error-alert,
.status-alert {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-alert {
  background-color: #dcfce7;
  color: #059669;
  border: 1px solid #6ee7b7;
}

.error-alert {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.status-alert {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

/* Disabled state */
.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* Thêm dòng này */
}
/* Responsive adjustments */
@media (max-width: 640px) {
  .info-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
    padding: 20px;
  }
}

input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid #cbd5e1;
  position: relative;
  transition: all 0.2s;
  appearance: none;
  background: white;
}

input[type='checkbox']:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

input[type='checkbox']:checked::after {
  content: '✓';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

/* Responsive fix cho modal chi tiết */
@media (max-width: 900px) {
  .modal-content {
    max-width: 98vw;
    min-width: 0;
    padding: 20px;
  }
  .detail-item p {
    font-size: 0.95rem;
    padding: 20px;
    max-width: 100vw;
  }
}

@media (max-width: 600px) {
  .modal-content {
    max-width: 100vw;
    min-width: 0;
    padding: 20px;
  }
  .detail-item {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 8px;
  }
  .detail-item p {
    font-size: 0.92rem;
    padding: 20px;
    max-width: 100vw;
  }
}
</style>
