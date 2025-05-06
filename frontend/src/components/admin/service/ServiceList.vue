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
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Loại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in filteredServices" :key="service._id">
            <td class="service-id">{{ service._id }}</td>
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
            <label>Trạng thái:</label>
            <p>
              <span :class="['status-badge', selectedService.status ? 'active' : 'inactive']">
                {{ selectedService.status ? 'Đã đăng' : 'Đã xóa' }}
              </span>
            </p>
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
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>ID</label>
              <input type="text" v-model="formData._id" required />
            </div>
            <div class="form-group">
              <label>Ảnh</label>
              <input type="file" @change="handleImageUpload" accept="image/*" ref="imageInput" />
              <div v-if="imagePreview || formData.image" class="image-preview">
                <img :src="imagePreview || formData.image" alt="Preview" />
                <button type="button" @click="removeImage" class="remove-image">×</button>
              </div>
            </div>
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="formData.title" required />
            </div>
            <div class="form-group">
              <label>Giá</label>
              <input type="number" v-model="formData.price" required min="0" />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="formData.description" required></textarea>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="formData.status">
                <option :value="true">Đã đăng</option>
                <option :value="false">Đã xóa</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showFormModal = false">Hủy</button>
              <button type="submit" class="submit-btn">
                {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
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
      },
      imagePreview: null,
      isEditing: false,
      loading: false,
      error: null,
      baseImageUrl: 'http://localhost:3000',
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
      }
      this.imagePreview = null
      this.showFormModal = true
    },
    openEditModal(service) {
      this.$router.push(`/admin/dich-vu/chinh-sua/${service._id}`)
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
    async handleSubmit() {
      try {
        const formDataToSend = new FormData()
        formDataToSend.append('title', this.formData.title)
        formDataToSend.append('price', this.formData.price)
        formDataToSend.append('description', this.formData.description)
        formDataToSend.append('status', this.formData.status)

        if (this.formData.image instanceof File) {
          const uploadResponse = await serviceService.uploadImage(this.formData.image)
          formDataToSend.append('image', uploadResponse.imagePath)
        } else if (this.formData.image) {
          formDataToSend.append('image', this.formData.image)
        }

        if (this.isEditing) {
          await serviceService.updateService(this.formData._id, formDataToSend)
        } else {
          await serviceService.createService(formDataToSend)
        }

        await this.loadServices()
        this.showFormModal = false
      } catch (error) {
        console.error('Error:', error)
        // Thêm xử lý lỗi nếu cần
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
    async handleImageUpload(event) {
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
    getImageUrl(imagePath) {
      if (!imagePath) return null
      if (imagePath.startsWith('http')) return imagePath
      return `${this.baseImageUrl}/${imagePath}`
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
</style>
