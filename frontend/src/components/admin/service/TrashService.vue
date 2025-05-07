<template>
  <div class="trash-service">
    <div class="header-actions">
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
          
          <select v-model="filterType" @change="handleFilter">
            <option value="">Tất cả loại</option>
            <option value="web">Website</option>
            <option value="app">Ứng dụng</option>
            <option value="agency">Agency</option>
          </select>
        </div>
        
        <button 
          v-if="selectedServices.length > 0" 
          class="bulk-action-btn restore" 
          @click="confirmBulkRestore"
        >
          <i class="fas fa-trash-restore"></i>
          Khôi phục đã chọn
        </button>
        
        <button 
          v-if="selectedServices.length > 0" 
          class="bulk-action-btn delete" 
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash-alt"></i>
          Xóa vĩnh viễn đã chọn
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="50px">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
              >
            </th>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá</th>
            <th>Loại</th>
            <th>Ngày xóa</th>
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in filteredServices" :key="service._id">
            <td>
              <input 
                type="checkbox" 
                :checked="isSelected(service._id)"
                @change="toggleSelect(service._id)"
              >
            </td>
            <td>{{ index + 1 }}</td>
            <td>
              <div class="image-container">
                <img 
                  v-if="service.image" 
                  :src="getImageUrl(service.image)" 
                  alt="Service image" 
                  class="service-image"
                />
                <div v-else class="no-image">
                  <i class="fas fa-image"></i>
                </div>
              </div>
            </td>
            <td>{{ service.title }}</td>
            <td>{{ formatPrice(service.price) }}</td>
            <td>{{ formatType(service.type) }}</td>
            <td>{{ formatDate(service.deletedAt) }}</td>
            <td>
              <div class="actions">
                <button 
                  class="icon-btn restore" 
                  @click="confirmRestore(service)"
                  title="Khôi phục"
                >
                  <i class="fas fa-trash-restore"></i>
                </button>
                <button 
                  class="icon-btn delete" 
                  @click="confirmDelete(service)"
                  title="Xóa vĩnh viễn"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredServices.length === 0">
            <td colspan="8" class="empty-message">
              Không có dịch vụ nào trong thùng rác
            </td>
          </tr>
        </tbody>
      </table>
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
          <p>Bạn có chắc chắn muốn khôi phục {{ selectedServices.length > 1 ? 'các' : '' }} dịch vụ đã chọn không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
            <button class="submit-btn" @click="handleRestore">Khôi phục</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận xóa vĩnh viễn</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">Cảnh báo: Hành động này không thể hoàn tác!</p>
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn {{ selectedServices.length > 1 ? 'các' : '' }} dịch vụ đã chọn không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
            <button class="delete-btn" @click="handleDelete">Xóa vĩnh viễn</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService';
import eventBus from '@/eventBus';

export default {
  name: 'AdminTrashService',
  data() {
    return {
      services: [],
      searchQuery: '',
      selectedServices: [],
      showRestoreModal: false,
      showDeleteModal: false,
      loading: false,
      error: null,
      baseImageUrl: 'http://localhost:3000',
      filterType: ''
    }
  },
  computed: {
    filteredServices() {
      // Filter only deleted services
      let result = this.services.filter(service => service.isDeleted);
      
      // Apply text search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(service => 
          service.title.toLowerCase().includes(query)
        );
      }
      
      // Apply type filter
      if (this.filterType) {
        result = result.filter(service => service.type === this.filterType);
      }
      
      return result;
    },
    isAllSelected() {
      return this.filteredServices.length > 0 && 
             this.filteredServices.every(service => this.selectedServices.includes(service._id));
    }
  },
  methods: {
    async loadServices() {
      try {
        // Lấy thông tin service đã xóa từ localStorage
        const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]');
        this.services = deletedServicesInfo;
      } catch (error) {
        console.error('Error loading services:', error);
        this.error = 'Không thể tải danh sách dịch vụ';
      }
    },
    handleSearch() {
      // Implement debounce if needed
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    formatType(type) {
      const types = {
        'web': 'Website',
        'app': 'Ứng dụng',
        'agency': 'Agency'
      };
      return types[type] || type;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      return `${this.baseImageUrl}/${imagePath}`;
    },
    isSelected(id) {
      return this.selectedServices.includes(id);
    },
    toggleSelect(id) {
      const index = this.selectedServices.indexOf(id);
      if (index === -1) {
        this.selectedServices.push(id);
      } else {
        this.selectedServices.splice(index, 1);
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedServices = [];
      } else {
        this.selectedServices = this.filteredServices.map(service => service._id);
      }
    },
    confirmRestore(service) {
      this.selectedServices = [service._id];
      this.showRestoreModal = true;
    },
    confirmDelete(service) {
      this.selectedServices = [service._id];
      this.showDeleteModal = true;
    },
    confirmBulkRestore() {
      this.showRestoreModal = true;
    },
    confirmBulkDelete() {
      this.showDeleteModal = true;
    },
    async handleRestore() {
      try {
        for (const id of this.selectedServices) {
          // Xóa khỏi danh sách đã xóa trong localStorage
          const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]');
          const updatedDeletedServices = deletedServices.filter(serviceId => serviceId !== id);
          localStorage.setItem('deletedServices', JSON.stringify(updatedDeletedServices));

          // Xóa khỏi thông tin service đã xóa
          const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]');
          const updatedDeletedServicesInfo = deletedServicesInfo.filter(service => service._id !== id);
          localStorage.setItem('deletedServicesInfo', JSON.stringify(updatedDeletedServicesInfo));

          // Cập nhật danh sách hiện tại
          this.services = this.services.filter(service => service._id !== id);
        }
        this.selectedServices = [];
        this.showRestoreModal = false;
        eventBus.emit('update-deleted-services-count');
      } catch (error) {
        console.error('Error restoring services:', error);
      }
    },
    async handleDelete() {
      try {
        for (const id of this.selectedServices) {
          // Xóa vĩnh viễn từ backend
          await serviceService.deleteService(id);

          // Xóa khỏi localStorage
          const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]');
          const updatedDeletedServices = deletedServices.filter(serviceId => serviceId !== id);
          localStorage.setItem('deletedServices', JSON.stringify(updatedDeletedServices));

          const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]');
          const updatedDeletedServicesInfo = deletedServicesInfo.filter(service => service._id !== id);
          localStorage.setItem('deletedServicesInfo', JSON.stringify(updatedDeletedServicesInfo));

          // Cập nhật danh sách hiện tại
          this.services = this.services.filter(service => service._id !== id);
        }
        this.selectedServices = [];
        this.showDeleteModal = false;
        eventBus.emit('update-deleted-services-count');
      } catch (error) {
        console.error('Error deleting services:', error);
      }
    },
    handleFilter() {
      // Implement filter logic
    },
    truncateId(id) {
      if (!id) return '';
      // Hiển thị 25 ký tự đầu tiên của ID, vì cột có kích thước lớn hơn
      return id.length > 25 ? id.substring(0, 25) + '...' : id;
    }
  },
  async created() {
    await this.loadServices();
  }
}
</script>

<style scoped>
@import "@/styles/admin.css";

/* Component specific styles */
th:nth-child(1), 
td:nth-child(1) {
  width: 50px; /* Checkbox */
}

th:nth-child(2), 
td:nth-child(2) {
  width: 200px; /* ID */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(3), 
td:nth-child(3) {
  width: 100px; /* Ảnh */
}

th:nth-child(4), 
td:nth-child(4) {
  width: 150px; /* Tiêu đề */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(5), 
td:nth-child(5) {
  width: 120px; /* Giá */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(6), 
td:nth-child(6) {
  width: 100px; /* Loại */
}

th:nth-child(7), 
td:nth-child(7) {
  width: 150px; /* Ngày xóa */
}

th:nth-child(8), 
td:nth-child(8) {
  width: 100px; /* Thao tác */
  text-align: center;
}

.service-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin: 0 auto;
  display: block;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.no-image {
  color: var(--text-tertiary);
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bulk-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-action-btn.restore {
  background-color: var(--primary-color);
  color: white;
}

.bulk-action-btn.restore:hover {
  background-color: var(--primary-hover);
}

.bulk-action-btn.delete {
  background-color: var(--danger-color);
  color: white;
}

.bulk-action-btn.delete:hover {
  background-color: var(--danger-hover);
}

.icon-btn.restore {
  background-color: #dcfce7;
  color: #166534;
}

.icon-btn.restore:hover {
  background-color: #bbf7d0;
}

.icon-btn.delete {
  background-color: var(--danger-color);
  color: white;
}

.icon-btn.delete:hover {
  background-color: var(--danger-hover);
}

.empty-message {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--spacing-lg);
  font-style: italic;
}

.action-column {
  text-align: center;
}

th input[type="checkbox"],
td input[type="checkbox"] {
  margin: 0 auto;
  display: block;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .bulk-action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 