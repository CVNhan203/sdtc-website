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
          >
        </div>
        
        <div class="filter-box">
          <select v-model="filterType" @change="handleFilter">
            <option value="">Tất cả loại</option>
            <option value="web">Website</option>
            <option value="app">Ứng dụng</option>
            <option value="agency">Agency</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Service Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Loại</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in filteredServices" :key="service._id">
            <td>{{ service._id }}</td>
            <td>
              <img 
                v-if="service.image" 
                :src="getImageUrl(service.image)" 
                alt="Service image" 
                class="service-image"
              />
              <span v-else class="no-image">No image</span>
            </td>
            <td>{{ service.title }}</td>
            <td>{{ formatPrice(service.price) }}</td>
            <td>{{ formatType(service.type) }}</td>
            <td class="content">{{ formatDescription(service.description) }}</td>
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
              <input type="text" v-model="formData._id" required>
            </div>
            <div class="form-group">
              <label>Ảnh</label>
              <input 
                type="file" 
                @change="handleImageUpload" 
                accept="image/*"
                ref="imageInput"
              >
              <div v-if="imagePreview || formData.image" class="image-preview">
                <img :src="imagePreview || formData.image" alt="Preview">
                <button type="button" @click="removeImage" class="remove-image">×</button>
              </div>
            </div>
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="formData.title" required>
            </div>
            <div class="form-group">
              <label>Giá</label>
              <input type="number" v-model="formData.price" required min="0">
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
          <p>Bạn có chắc chắn muốn chuyển dịch vụ "{{ selectedService.title }}" vào thùng rác không?</p>
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
            <button class="permanent-delete-btn" @click="handlePermanentDelete">Xóa vĩnh viễn</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService';
import eventBus from '@/utils/eventBus';

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
        status: true
      },
      imagePreview: null,
      isEditing: false,
      loading: false,
      error: null,
      baseImageUrl: 'http://localhost:3000'
    }
  },
  computed: {
    filteredServices() {
      const services = Array.isArray(this.services) ? this.services : [];
      
      let result = services.filter(service => !service.isDeleted);
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(service => 
          service.title.toLowerCase().includes(query)
        )
      }
      
      if (this.filterType !== '') {
        result = result.filter(service => service.type === this.filterType)
      }
      
      return result
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    },
    formatType(type) {
      const types = {
        'web': 'Website',
        'app': 'Ứng dụng',
        'agency': 'Agency'
      };
      return types[type] || type;
    },
    formatDescription(description) {
      if (!description) return '';
      if (Array.isArray(description)) {
        return description.map(item => `• ${item}`).join('\n');
      }
      return `• ${description.toString()}`;
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
        status: true
      }
      this.imagePreview = null
      this.showFormModal = true
    },
    openEditModal(service) {
      this.$router.push(`/admin/dich-vu/chinh-sua/${service._id}`);
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
      this.loading = true;
      this.error = null;
      try {
        const response = await serviceService.getServices();
        // Lấy danh sách đã xóa từ localStorage
        const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]');
        // Lọc bỏ các service đã xóa
        this.services = Array.isArray(response) ? 
          response.filter(service => !deletedServices.includes(service._id)) : 
          [];
      } catch (error) {
        console.error('Error loading services:', error);
        this.error = 'Không thể tải danh sách dịch vụ';
        this.services = [];
      } finally {
        this.loading = false;
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
        const serviceIndex = this.services.findIndex(s => s._id === this.selectedService._id);
        if (serviceIndex !== -1) {
          // Lưu ID service đã xóa vào localStorage
          const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]');
          deletedServices.push(this.selectedService._id);
          localStorage.setItem('deletedServices', JSON.stringify(deletedServices));
          
          // Lưu thông tin service đã xóa
          const deletedServiceInfo = {
            ...this.services[serviceIndex],
            isDeleted: true,
            deletedAt: new Date()
          };
          const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]');
          deletedServicesInfo.push(deletedServiceInfo);
          localStorage.setItem('deletedServicesInfo', JSON.stringify(deletedServicesInfo));

          // Xóa khỏi danh sách hiện tại
          this.services.splice(serviceIndex, 1);
        }
        this.showSoftDeleteModal = false;
        eventBus.emit('update-deleted-services-count');
      } catch (error) {
        console.error('Error:', error);
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
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      return `${this.baseImageUrl}/${imagePath}`;
    }
  },
  created() {
    this.loadServices();
    // Listen for updates from TrashService
    eventBus.on('update-deleted-services-count', () => {
      this.loadServices();
    });
  },
  beforeUnmount() {
    // Cleanup event listeners
    eventBus.off('update-deleted-services-count');
    // Cleanup image previews
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }
}
</script>

<style scoped>
/* Import font Roboto */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

/* Apply Roboto font to all elements */
* {
  font-family: 'Roboto', sans-serif;
}

.service-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-x: auto;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  width: 100%;
}

.search-filter {
  display: flex;
  gap: 1rem;
  max-width: 1000px;
  width: 100%;
}

.search-box {
  position: relative;
  width: 50%;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 90%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.filter-box {
  width: 25%;
}

.filter-box select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  height: 72px;
}

th {
  background: #f8fafc;
  font-weight: 500;
  color: #475569;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

/* Định nghĩa độ rộng cố định cho các cột */
th:nth-child(1), td:nth-child(1) { width: 12%; } /* ID */
th:nth-child(2), td:nth-child(2) { width: 8%; } /* Ảnh */
th:nth-child(3), td:nth-child(3) { width: 15%; } /* Tiêu đề */
th:nth-child(4), td:nth-child(4) { width: 12%; } /* Giá */
th:nth-child(5), td:nth-child(5) { width: 10%; } /* Loại */
th:nth-child(6), td:nth-child(6) { width: 28%; } /* Mô tả */
th:nth-child(7), td:nth-child(7) { width: 15%; } /* Thao tác */

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

.no-image {
  color: #64748b;
  font-style: italic;
  font-size: 0.875rem;
}

.image-preview {
  position: relative;
  margin-top: 1rem;
  max-width: 200px;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.content {
  text-align: left;
  white-space: pre-line;
  line-height: 1.5;
  padding: 10px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 26px;
  width: 26px;
  min-width: 26px;
  flex-shrink: 0;
}

td.actions-cell {
  padding: 0.5rem !important;
  width: 130px !important;
  min-width: 130px !important;
}

.icon-btn.info {
  background: #e0f2fe;
  color: #0369a1;
}

.icon-btn.edit {
  background: #f1f5f9;
  color: #475569;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.restore {
  background: #e0f2fe;
  color: #0369a1;
}

.icon-btn.permanent-delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn:hover {
  opacity: 0.8;
}

/* Modal Styles */
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
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
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
  display: block;
  margin-bottom: 0.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.submit-btn,
.delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.submit-btn:hover {
  background: #2563eb;
}

.delete-btn:hover {
  background: #dc2626;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .search-filter {
    flex-direction: column;
  }

  .search-box,
  .filter-box {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .search-filter {
    flex-direction: column;
  }

  .search-box,
  .filter-box {
    width: 100%;
  }

  .actions {
    gap: 0.25rem;
  }
  
  .icon-btn {
    padding: 0.35rem;
  }
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-actions button {
    width: 100%;
  }

  th, td {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .service-image {
    width: 40px;
    height: 40px;
  }

  .actions {
    gap: 2px;
  }

  .icon-btn {
    height: 24px;
    width: 24px;
    min-width: 24px;
    padding: 0.2rem;
  }

  .actions-header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-filter {
    width: 100%;
  }

  .search-box,
  .filter-box {
    width: 100%;
  }

  .actions-cell {
    padding: 0.25rem !important;
  }
}

@media (max-width: 480px) {
  .service-list {
    padding: 0.75rem;
  }

  .search-box input,
  .filter-box select {
    font-size: 0.875rem;
  }

  .modal-content {
    margin: 0;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .modal-body {
    padding: 1rem;
  }

  .detail-item label {
    font-size: 0.9rem;
  }

  .status-badge {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
  }
}

/* Print styles */
@media print {
  .actions-header,
  .actions,
  .modal {
    display: none;
  }

  .service-list {
    box-shadow: none;
    padding: 0;
  }

  table {
    width: 100% !important;
    min-width: auto !important;
  }
}

/* Thêm style cho modal description */
.modal-body .detail-item p {
  white-space: pre-line;
  line-height: 1.5;
}

.warning-text {
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  border-left: 4px solid #dc2626;
}

.permanent-delete-btn {
  background: #dc2626;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.permanent-delete-btn:hover {
  background: #b91c1c;
}

.icon-btn.restore {
  background: #e0f2fe;
  color: #0369a1;
}

.icon-btn.restore:hover {
  background: #bae6fd;
}

.icon-btn.permanent-delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.permanent-delete:hover {
  background: #fecaca;
}

/* Thêm style cho thanh cuộn ngang */
.table-container::-webkit-scrollbar {
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 