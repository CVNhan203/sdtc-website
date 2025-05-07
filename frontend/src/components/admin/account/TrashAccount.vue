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
            <th>STT</th>
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
@import "@/styles/admin.css";

/* Component specific styles */
.bulk-action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.icon-btn.restore {
  background-color: #dcfce7;
  color: #166534;
}

.icon-btn.restore:hover {
  background-color: #bbf7d0;
}

.empty-message {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--spacing-lg);
  font-style: italic;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>