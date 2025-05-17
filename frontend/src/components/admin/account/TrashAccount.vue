<template>
  <div class="trash-accounts">
    <!-- Thêm chỉ báo tải -->
    <div class="loading-overlay" v-if="loading">
      <div class="spinner"></div>
    </div>

    <div class="header-actions">
      <div class="current-date">
        Ngày hiện tại: {{ currentDate }}
      </div>
      <div class="actions-header">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm theo tên hoặc email..."
              @input="handleSearch"
            >
          </div>
        </div>
        <button 
          v-if="selectedAccounts.length > 0" 
          class="bulk-action-btn restore" 
          @click="confirmBulkRestore"
        >
          <i class="fas fa-rotate-left"></i>
          Khôi phục đã chọn
        </button>
        <button 
          v-if="selectedAccounts.length > 0" 
          class="bulk-action-btn delete" 
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash"></i>
          Xóa vĩnh viễn đã chọn
        </button>
      </div>
    </div>

    <!-- Hiển thị lỗi -->
    <div v-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadAccounts">Thử lại</button>
    </div>

    <div class="table-container" v-else>
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
            <th>No.</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Ngày xóa</th>
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account, index) in filteredAccounts" :key="account._id">
            <td>
              <input 
                type="checkbox" 
                :checked="isSelected(account._id)"
                @change="toggleSelect(account._id)"
              >
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ account.fullName }}</td>
            <td>{{ account.email }}</td>
            <td>{{ currentDate }}</td>
            <!-- <td>{{ formatDate(account.deletedAt || account.updatedAt) }}</td> -->
            <td>
              <div class="actions">
                <button 
                  class="icon-btn restore" 
                  @click="confirmRestore(account)"
                  title="Khôi phục"
                >
                  <i class="fas fa-rotate-left"></i>
                </button>
                <button 
                  class="icon-btn delete" 
                  @click="confirmDelete(account)"
                  title="Xóa vĩnh viễn"
                >
                  <i class="fas fa-trash"></i>
                </button>                
              </div>
            </td>
          </tr>
          <tr v-if="filteredAccounts.length === 0">
            <td colspan="6" class="empty-message">
              Không có tài khoản nào trong thùng rác
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xác nhận khôi phục -->
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
          <p>Bạn có chắc chắn muốn khôi phục {{ selectedAccounts.length > 1 ? 'những' : '' }} tài khoản đã chọn không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false" :disabled="loading">Hủy</button>
            <button class="submit-btn" @click="handleRestore" :disabled="loading">
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              Khôi phục
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
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
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn {{ selectedAccounts.length > 1 ? 'những' : '' }} tài khoản đã chọn không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteModal = false" :disabled="loading">Hủy</button>
            <button class="delete-btn" @click="handleDelete" :disabled="loading">
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              Xóa vĩnh viễn
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal dịch vụ -->
    <div class="modal" v-if="showServiceModal">
      <div class="modal-overlay" @click="showServiceModal = false"></div>
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Dịch vụ của tài khoản</h3>
          <button class="close-btn" @click="showServiceModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="serviceLoading" style="text-align:center;padding:24px;">
            <i class="fas fa-spinner fa-spin"></i> Đang tải dịch vụ...
          </div>
          <div v-else-if="serviceError" class="error-message">{{ serviceError }}</div>
          <div v-else-if="services.length === 0" class="empty-message">
            Không có dịch vụ nào cho tài khoản này.
          </div>
          <ul v-else>
            <li v-for="service in services" :key="service._id">
              <strong>{{ service.name || service.title }}</strong>
              <span v-if="service.status">({{ service.status }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/eventBus';
import accountService from '@/api/services/accountService';
import serviceService from '@/api/services/serviceService';

export default {
  name: 'AdminTrashAccounts',
  data() {
    return {
      accounts: [], // Danh sách tài khoản đã xóa
      searchQuery: '', // Chuỗi tìm kiếm
      selectedAccounts: [], // Danh sách tài khoản được chọn
      showRestoreModal: false, // Trạng thái hiển thị modal khôi phục
      showDeleteModal: false, // Trạng thái hiển thị modal xóa
      loading: false, // Trạng thái tải
      error: null, // Thông báo lỗi
      // Trạng thái modal dịch vụ
      showServiceModal: false, // Trạng thái hiển thị modal dịch vụ
      services: [], // Danh sách dịch vụ
      serviceLoading: false, // Trạng thái tải dịch vụ
      serviceError: null, // Thông báo lỗi dịch vụ
    }
  },
  computed: {
    filteredAccounts() {
      if (!this.searchQuery) return this.accounts; // Nếu không có tìm kiếm, trả về tất cả tài khoản
      
      const query = this.searchQuery.toLowerCase(); // Chuyển chuỗi tìm kiếm thành chữ thường
      return this.accounts.filter(account => 
        (account.fullName?.toLowerCase().includes(query) || 
         account.email?.toLowerCase().includes(query)) // Lọc tài khoản theo tên hoặc email
      );
    },
    isAllSelected() {
      return this.filteredAccounts.length > 0 && 
             this.filteredAccounts.every(account => this.selectedAccounts.includes(account._id)); // Kiểm tra xem tất cả tài khoản đã chọn
    },
    currentDate() {
      return new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
  methods: {
    async loadAccounts() {
      try {
        this.loading = true; // Bắt đầu tải
        this.error = null; // Đặt lại trạng thái lỗi
        
        // Sử dụng phương thức có sẵn để lấy tài khoản đã xóa
        const response = await accountService.getDeletedAccounts();
        
        if (response.success) {
          // Gán trực tiếp dữ liệu đã được lọc từ service
          this.accounts = response.data || []; // Gán danh sách tài khoản đã xóa
          console.log('Tài khoản đã xóa:', this.accounts);
        } else {
          throw new Error(response.message || 'Không thể tải danh sách tài khoản đã xóa');
        }
      } catch (error) {
        console.error('Lỗi khi tải tài khoản đã xóa:', error);
        this.error = error.message || 'Không thể tải danh sách tài khoản đã xóa'; // Ghi lại lỗi
        eventBus.emit('show-toast', {
          type: 'error',
          message: this.error
        });
      } finally {
        this.loading = false; // Kết thúc tải
      }
    },
    
    handleSearch() {
      // Xử lý tìm kiếm, đã được xử lý qua computed property
    },
    
    formatDate(date) {
      if (!date) return ''; // Nếu không có ngày, trả về chuỗi rỗng
      return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }); // Định dạng ngày theo kiểu Việt Nam
    },
    
    truncateId(id) {
      if (!id) return ''; // Nếu không có id, trả về chuỗi rỗng
      return id.length > 8 ? id.substring(0, 8) + '...' : id; // Cắt ngắn id nếu dài hơn 8 ký tự
    },
    
    isSelected(id) {
      return this.selectedAccounts.includes(id); // Kiểm tra xem tài khoản đã được chọn hay chưa
    },
    
    toggleSelect(id) {
      const index = this.selectedAccounts.indexOf(id);
      if (index === -1) {
        this.selectedAccounts.push(id); // Thêm tài khoản vào danh sách đã chọn
      } else {
        this.selectedAccounts.splice(index, 1); // Xóa tài khoản khỏi danh sách đã chọn
      }
    },
    
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedAccounts = []; // Bỏ chọn tất cả
      } else {
        this.selectedAccounts = this.filteredAccounts.map(account => account._id); // Chọn tất cả tài khoản
      }
    },
    
    async handleRestore() {
      try {
        this.loading = true; // Bắt đầu tải
        const response = await accountService.restoreAccounts(this.selectedAccounts); // Khôi phục tài khoản
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: response.message || 'Khôi phục tài khoản thành công'
          });
          
          // Tải lại danh sách sau khi khôi phục
          await this.loadAccounts();
          this.selectedAccounts = []; // Đặt lại danh sách đã chọn
          this.showRestoreModal = false; // Đóng modal khôi phục
        } else {
          throw new Error(response.message || 'Không thể khôi phục tài khoản');
        }
      } catch (error) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Không thể khôi phục tài khoản'
        });
      } finally {
        this.loading = false; // Kết thúc tải
      }
    },
    
    async handleDelete() {
      try {
        this.loading = true; // Bắt đầu tải
        
        // Hiển thị thông báo xác nhận nếu xóa nhiều tài khoản
        if (this.selectedAccounts.length > 1) {
          const confirmed = confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${this.selectedAccounts.length} tài khoản đã chọn không? Hành động này không thể hoàn tác!`);
          if (!confirmed) {
            this.loading = false; // Kết thúc tải
            this.showDeleteModal = false; // Đóng modal xóa
            return;
          }
        }
        
        const response = await accountService.permanentDeleteAccounts(this.selectedAccounts); // Xóa tài khoản vĩnh viễn
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: response.message || 'Xóa vĩnh viễn tài khoản thành công'
          });
          
          // Tải lại danh sách sau khi xóa
          await this.loadAccounts();
          this.selectedAccounts = []; // Đặt lại danh sách đã chọn
          this.showDeleteModal = false; // Đóng modal xóa
        } else {
          throw new Error(response.message || 'Không thể xóa vĩnh viễn tài khoản');
        }
      } catch (error) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Không thể xóa vĩnh viễn tài khoản'
        });
      } finally {
        this.loading = false; // Kết thúc tải
      }
    },
    
    confirmRestore(account) {
      if (account) {
        this.selectedAccounts = [account._id]; // Đặt tài khoản được chọn để khôi phục
      }
      this.showRestoreModal = true; // Hiển thị modal khôi phục
    },
    
    confirmDelete(account) {
      if (account) {
        this.selectedAccounts = [account._id]; // Đặt tài khoản được chọn để xóa
      }
      this.showDeleteModal = true; // Hiển thị modal xóa
    },
    
    confirmBulkRestore() {
      this.showRestoreModal = true; // Hiển thị modal khôi phục cho nhiều tài khoản
    },
    
    confirmBulkDelete() {
      this.showDeleteModal = true; // Hiển thị modal xóa cho nhiều tài khoản
    },

    async viewServices(account) {
      this.showServiceModal = true; // Hiển thị modal dịch vụ
      this.services = []; // Đặt lại danh sách dịch vụ
      this.serviceLoading = true; // Bắt đầu tải dịch vụ
      this.serviceError = null; // Đặt lại trạng thái lỗi dịch vụ
      try {
        // Giả sử serviceService có hàm getServicesByAccountId
        const res = await serviceService.getServicesByAccountId(account._id); // Lấy dịch vụ theo id tài khoản
        if (res && res.success) {
          this.services = res.data || []; // Gán danh sách dịch vụ
        } else {
          this.serviceError = res.message || 'Không thể tải dịch vụ'; // Ghi lại lỗi
        }
      } catch (err) {
        this.serviceError = err.message || 'Không thể tải dịch vụ'; // Ghi lại lỗi
      } finally {
        this.serviceLoading = false; // Kết thúc tải dịch vụ
      }
    }
  },
  created() {
    this.loadAccounts(); // Tải danh sách tài khoản khi component được tạo
  }
};
</script>

<style scoped>
/* Các kiểu CSS cho component */
@import "@/styles/admin.css";

.trash-accounts {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: relative;
}

/* Các kiểu cho chỉ báo tải */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Các kiểu cho phần tiêu đề và hành động */
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

/* Các kiểu cho thông báo lỗi */
.error-container {
  text-align: center;
  padding: 48px 0;
}

.error-message {
  color: #ef4444;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}

/* Các kiểu cho bảng */
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

th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: center; /* căn giữa tiêu đề bảng */
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  text-align: center; /* căn giữa nội dung bảng */
}

tr:hover {
  background-color: #f8fafc;
}

tr:last-child td {
  border-bottom: none;
}

/* Các kiểu cho nút hành động hàng loạt */
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

/* Các kiểu cho nút icon */
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

/* Các kiểu cho modal */
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
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}
.modal-content {
  position: relative;
  z-index: 2;
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 24px;
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

.modal-body {
  padding: 24px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.submit-btn, .delete-btn, .cancel-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn {
  background: #0ea5e9;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #0284c7;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #dc2626;
}

.cancel-btn {
  background: #e2e8f0;
  color: #475569;
}

.cancel-btn:hover:not(:disabled) {
  background: #cbd5e1;
}

[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
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

/* Các kiểu cho checkbox tùy chỉnh */
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

/* Thiết kế responsive */
@media (max-width: 768px) {
  .trash-accounts {
    padding: 16px;
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