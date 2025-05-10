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
            />
          </div>
        </div>

        <button
          v-if="selectedServices.length > 0"
          class="bulk-action-btn restore"
          @click="confirmBulkRestore"
        >
          <i class="fas fa-rotate-left"></i>
          Khôi phục đã chọn
        </button>

        <button
          v-if="selectedServices.length > 0"
          class="bulk-action-btn delete"
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash"></i>
          Xóa vĩnh viễn đã chọn
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="50px" style="text-align: center;">
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
            </th>
            <th style="width: 60px; text-align: center;">STT</th>
            <th style="width: 70px; text-align: center;">Ảnh</th>
            <th style="width: 30%; text-align: center;">Tiêu đề</th>
            <th style="width: 15%; text-align: center;">Giá</th>
            <th style="width: 10%; text-align: center;">Loại</th>
            <th style="width: 15%; text-align: center;">Ngày xóa</th>
            <th class="action-column" style="width: 15%; text-align: center;">Thao tác</th>
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
            <td class="center-cell">{{ index + 1 }}</td>
            <td class="center-cell">
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
            <td class="center-cell">{{ service.title }}</td>
            <td class="center-cell">{{ formatPrice(service.price) }}</td>
            <td class="center-cell">{{ formatType(service.type) }}</td>
            <td class="center-cell">{{ formatDate(service.deletedAt) }}</td>
            <td class="center-cell">
              <div class="actions">
                <button class="icon-btn restore" @click="confirmRestore(service)" title="Khôi phục">
                  <i class="fas fa-rotate-left"></i>
                </button>
                <button
                  class="icon-btn delete"
                  @click="confirmDelete(service)"
                  title="Xóa vĩnh viễn"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredServices.length === 0">
            <td colspan="8" class="empty-message">Không có dịch vụ nào trong thùng rác</td>
          </tr>
        </tbody>
      </table>
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
          <p>
            Bạn có chắc chắn muốn khôi phục {{ selectedServices.length > 1 ? 'các' : '' }} dịch vụ
            đã chọn không?
          </p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
            <button class="submit-btn" @click="handleRestore">Khôi phục</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-overlay" @click="showDeleteModal = false"></div>
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa vĩnh viễn</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">Cảnh báo: Hành động này không thể hoàn tác!</p>
          <p>
            Bạn có chắc chắn muốn xóa vĩnh viễn {{ selectedServices.length > 1 ? 'các' : '' }} dịch
            vụ đã chọn không?
          </p>
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
import serviceService from '@/api/services/serviceService'
import eventBus from '@/eventBus'

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
      filterType: '',
    }
  },
  computed: {
    filteredServices() {
      // Filter only deleted services
      let result = this.services.filter((service) => service.isDeleted)

      // Apply text search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter((service) => service.title.toLowerCase().includes(query))
      }

      // Apply type filter
      if (this.filterType) {
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
    async loadServices() {
      try {
        // Lấy thông tin service đã xóa từ localStorage
        const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]')
        this.services = deletedServicesInfo
      } catch (error) {
        console.error('Error loading services:', error)
        this.error = 'Không thể tải danh sách dịch vụ'
      }
    },
    handleSearch() {
      // Implement debounce if needed
    },
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
    formatDate(date) {
      const d = new Date(date)
      // Hiển thị ngày trước, giờ sau (dd/mm/yyyy, HH:MM)
      const day = d.getDate().toString().padStart(2, '0')
      const month = (d.getMonth() + 1).toString().padStart(2, '0')
      const year = d.getFullYear()
      const hour = d.getHours().toString().padStart(2, '0')
      const minute = d.getMinutes().toString().padStart(2, '0')
      return `${day}/${month}/${year}, ${hour}:${minute}`
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null
      if (imagePath.startsWith('http')) return imagePath
      return `${this.baseImageUrl}/${imagePath}`
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
    confirmRestore(service) {
      this.selectedServices = [service._id]
      this.showRestoreModal = true
    },
    confirmDelete(service) {
      this.selectedServices = [service._id]
      this.showDeleteModal = true
    },
    confirmBulkRestore() {
      this.showRestoreModal = true
    },
    confirmBulkDelete() {
      this.showDeleteModal = true
    },
    async handleRestore() {
      try {
        for (const id of this.selectedServices) {
          // Gọi API để khôi phục dịch vụ trong database
          await serviceService.restoreService(id);
          
          // Xóa khỏi danh sách đã xóa trong localStorage
          const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]')
          const updatedDeletedServices = deletedServices.filter((serviceId) => serviceId !== id)
          localStorage.setItem('deletedServices', JSON.stringify(updatedDeletedServices))

          // Xóa khỏi thông tin service đã xóa
          const deletedServicesInfo = JSON.parse(
            localStorage.getItem('deletedServicesInfo') || '[]'
          )
          const updatedDeletedServicesInfo = deletedServicesInfo.filter(
            (service) => service._id !== id
          )
          localStorage.setItem('deletedServicesInfo', JSON.stringify(updatedDeletedServicesInfo))

          // Cập nhật danh sách hiện tại
          this.services = this.services.filter((service) => service._id !== id)
        }
        this.selectedServices = []
        this.showRestoreModal = false
        eventBus.emit('update-deleted-services-count')
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Khôi phục dịch vụ thành công'
        })
      } catch (error) {
        console.error('Error restoring services:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi khôi phục dịch vụ'
        })
      }
    },
    async handleDelete() {
      try {
        for (const id of this.selectedServices) {
          // Call the API to permanently delete the service
          await serviceService.deleteService(id);

          // Remove from the deleted services list in localStorage
          const deletedServices = JSON.parse(localStorage.getItem('deletedServices') || '[]');
          const updatedDeletedServices = deletedServices.filter((serviceId) => serviceId !== id);
          localStorage.setItem('deletedServices', JSON.stringify(updatedDeletedServices));

          const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]');
          const updatedDeletedServicesInfo = deletedServicesInfo.filter((service) => service._id !== id);
          localStorage.setItem('deletedServicesInfo', JSON.stringify(updatedDeletedServicesInfo));

          // Update the current services list
          this.services = this.services.filter((service) => service._id !== id);
        }
        this.selectedServices = [];
        this.showDeleteModal = false;
        eventBus.emit('update-deleted-services-count');
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Xóa vĩnh viễn dịch vụ thành công'
        });
      } catch (error) {
        console.error('Error deleting services:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi xóa vĩnh viễn dịch vụ'
        });
      }
    },
    handleFilter() {
      // Implement filter logic
    },
    truncateId(id) {
      if (!id) return ''
      // Hiển thị 25 ký tự đầu tiên của ID, vì cột có kích thước lớn hơn
      return id.length > 25 ? id.substring(0, 25) + '...' : id
    },
  },
  async created() {
    await this.loadServices()
  },
}
</script>

<style scoped>

@import "@/styles/admin.css";

.trash-service {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header-actions {
  margin-bottom: 24px;
}

.actions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.search-filter {
  flex: 1;
  min-width: 280px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  outline: none;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  text-align: center;
  vertical-align: middle;
}

th {
  background: #f8fafc;
  padding: 20px;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

td {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background-color: #f8fafc;
}

.bulk-action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.bulk-action-btn.restore {
  background: #0ea5e9;
  color: white;
}

.bulk-action-btn.restore:hover {
  background: #0284c7;
}

.bulk-action-btn.delete {
  background: #ef4444;
  color: white;
}

.bulk-action-btn.delete:hover {
  background: #dc2626;
}

.icon-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.icon-btn i {
  font-size: 14px;
}

.icon-btn.restore {
  background: #dcfce7;
  color: #166534;
}

.icon-btn.restore:hover {
  background: #bbf7d0;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.delete:hover {
  background: #fecaca;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1; /* Thêm dòng này */
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 2; /* Thêm dòng này */
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
}

.modal-body {
  padding: 20px;
}

.actions {
  display: flex;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

.submit-btn, .delete-btn, .cancel-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.submit-btn {
  background: #0ea5e9;
  color: white;
}

.submit-btn:hover {
  background: #0284c7;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.cancel-btn {
  background: #e2e8f0;
  color: #475569;
}

.cancel-btn:hover {
  background: #cbd5e1;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 16px;
}

.empty-message {
  text-align: center;
  padding: 48px 0;
  color: #64748b;
  font-style: italic;
}

.service-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin: 0 auto;
  display: block;
  padding: 0;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.no-image {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  display: block;
  margin: 0 auto;
  text-align: center;
  padding: 0;
}

/* Custom checkbox styles */
input[type="checkbox"] {
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

input[type="checkbox"]:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

input[type="checkbox"]:checked::after {
  content: '✓';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  font-size: 24px;
  margin-left: auto;
  box-shadow: none;
  padding: 0;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #ef4444;
  box-shadow: 0 0 0 2px #ef444422;
}

.close-btn i {
  font-size: 24px;
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .trash-service {
    padding: 20px;
  }

  .actions-header {
    flex-direction: column;
  }

  .search-filter {
    width: 100%;
  }

  .bulk-action-btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    margin: 0 -16px;
    border-radius: 0;
  }
}
</style>
