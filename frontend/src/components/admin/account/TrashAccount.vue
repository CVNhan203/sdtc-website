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
          <i class="fas fa-trash-restore"></i>
          Khôi phục đã chọn
        </button>
        <button 
          v-if="selectedAccounts.length > 0" 
          class="bulk-action-btn delete" 
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash-alt"></i>
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
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Ngày xóa</th>
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in filteredAccounts" :key="account._id">
            <td>
              <input 
                type="checkbox" 
                :checked="isSelected(account._id)"
                @change="toggleSelect(account._id)"
              >
            </td>
            <td>{{ truncateId(account._id) }}</td>
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
                  <i class="fas fa-trash-restore"></i>
                </button>
                <button 
                  class="icon-btn delete" 
                  @click="confirmDelete(account)"
                  title="Xóa vĩnh viễn"
                >
                  <i class="fas fa-trash-alt"></i>
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
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn {{ selectedAccounts.length > 1 ? 'những' : '' }} tài khoản đã chọn không?</p>
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
import eventBus from '@/eventBus';
import accountService from '@/api/account/accountService';

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
        
        // Sử dụng accountService đã cập nhật
        const response = await accountService.getDeletedAccounts();
        
        if (response.success) {
          this.accounts = Array.isArray(response.data) ? response.data : [];
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
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  padding: 8px 8px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

.bulk-action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.bulk-action-btn.restore {
  background-color: #3b82f6;
  color: white;
}

.bulk-action-btn.delete {
  background-color: #ef4444;
  color: white;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  padding: 16px;
  background-color: #fee2e2;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-message {
  color: #b91c1c;
  margin-bottom: 10px;
}

.retry-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8fafc;
  font-weight: 500;
  color: #475569;
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.restore {
  background-color: #3b82f6;
  color: white;
}

.icon-btn.delete {
  background-color: #ef4444;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 16px;
  padding: 8px 16px;
  background-color: #fee2e2;
  border-radius: 4px;
  border-left: 4px solid #ef4444;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f9fafb;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  padding: 8px 16px;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  padding: 8px 16px;
  border: none;
  background-color: #ef4444;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
}

@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>