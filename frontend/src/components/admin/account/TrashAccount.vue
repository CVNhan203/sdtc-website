<template>
  <div class="trash-accounts">
    <!-- Add loading indicator -->
    <div class="loading-overlay" v-if="loading">
      <div class="spinner"></div>
    </div>

    <div class="header-actions">
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
            <td>{{ formatDate(account.deletedAt || account.updatedAt) }}</td>
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
  </div>
</template>

<script>
import eventBus from '@/eventBus';
import accountService from '@/api/services/accountService';

export default {
  name: 'AdminTrashAccounts',
  data() {
    return {
      accounts: [],
      searchQuery: '',
      selectedAccounts: [],
      showRestoreModal: false,
      showDeleteModal: false,
      loading: false,
      error: null,
    }
  },
  computed: {
    filteredAccounts() {
      if (!this.searchQuery) return this.accounts;
      
      const query = this.searchQuery.toLowerCase();
      return this.accounts.filter(account => 
        (account.fullName?.toLowerCase().includes(query) || 
         account.email?.toLowerCase().includes(query))
      );
    },
    isAllSelected() {
      return this.filteredAccounts.length > 0 && 
             this.filteredAccounts.every(account => this.selectedAccounts.includes(account._id));
    }
  },
  methods: {
    async loadAccounts() {
      try {
        this.loading = true;
        this.error = null; // Reset error state
        
        // Sử dụng phương thức có sẵn để lấy tài khoản đã xóa
        const response = await accountService.getDeletedAccounts();
        
        if (response.success) {
          // Gán trực tiếp dữ liệu đã được lọc từ service
          this.accounts = response.data || [];
          console.log('Tài khoản đã xóa:', this.accounts);
        } else {
          throw new Error(response.message || 'Không thể tải danh sách tài khoản đã xóa');
        }
      } catch (error) {
        console.error('Lỗi khi tải tài khoản đã xóa:', error);
        this.error = error.message || 'Không thể tải danh sách tài khoản đã xóa';
        eventBus.emit('show-toast', {
          type: 'error',
          message: this.error
        });
      } finally {
        this.loading = false;
      }
    },
    
    handleSearch() {
      // Xử lý tìm kiếm, đã được xử lý qua computed property
    },
    
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    truncateId(id) {
      if (!id) return '';
      return id.length > 8 ? id.substring(0, 8) + '...' : id;
    },
    
    isSelected(id) {
      return this.selectedAccounts.includes(id);
    },
    
    toggleSelect(id) {
      const index = this.selectedAccounts.indexOf(id);
      if (index === -1) {
        this.selectedAccounts.push(id);
      } else {
        this.selectedAccounts.splice(index, 1);
      }
    },
    
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedAccounts = [];
      } else {
        this.selectedAccounts = this.filteredAccounts.map(account => account._id);
      }
    },
    
    async handleRestore() {
      try {
        this.loading = true;
        const response = await accountService.restoreAccounts(this.selectedAccounts);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: response.message || 'Khôi phục tài khoản thành công'
          });
          
          // Tải lại danh sách sau khi khôi phục
          await this.loadAccounts();
          this.selectedAccounts = [];
          this.showRestoreModal = false;
        } else {
          throw new Error(response.message || 'Không thể khôi phục tài khoản');
        }
      } catch (error) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Không thể khôi phục tài khoản'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async handleDelete() {
      try {
        this.loading = true;
        
        // Hiển thị thông báo xác nhận nếu xóa nhiều tài khoản
        if (this.selectedAccounts.length > 1) {
          const confirmed = confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${this.selectedAccounts.length} tài khoản đã chọn không? Hành động này không thể hoàn tác!`);
          if (!confirmed) {
            this.loading = false;
            this.showDeleteModal = false;
            return;
          }
        }
        
        const response = await accountService.permanentDeleteAccounts(this.selectedAccounts);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: response.message || 'Xóa vĩnh viễn tài khoản thành công'
          });
          
          // Tải lại danh sách sau khi xóa
          await this.loadAccounts();
          this.selectedAccounts = [];
          this.showDeleteModal = false;
        } else {
          throw new Error(response.message || 'Không thể xóa vĩnh viễn tài khoản');
        }
      } catch (error) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Không thể xóa vĩnh viễn tài khoản'
        });
      } finally {
        this.loading = false;
      }
    },
    
    confirmRestore(account) {
      if (account) {
        this.selectedAccounts = [account._id];
      }
      this.showRestoreModal = true;
    },
    
    confirmDelete(account) {
      if (account) {
        this.selectedAccounts = [account._id];
      }
      this.showDeleteModal = true;
    },
    
    confirmBulkRestore() {
      this.showRestoreModal = true;
    },
    
    confirmBulkDelete() {
      this.showDeleteModal = true;
    }
  },
  created() {
    this.loadAccounts();
  }
};
</script>

<style scoped>
.trash-accounts {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  position: relative;
}

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

.modal-content {
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
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
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

/* Responsive design */
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