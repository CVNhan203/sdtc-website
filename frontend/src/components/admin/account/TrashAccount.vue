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
              placeholder="Search by name..."
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
          Restore Selected
        </button>
        <button 
          v-if="selectedAccounts.length > 0" 
          class="bulk-action-btn delete" 
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash-alt"></i>
          Permanently Delete Selected
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
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Deleted Date</th>
            <th class="action-column">Actions</th>
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
            <td>{{ account._id }}</td>
            <td>{{ account.fullName }}</td>
            <td>{{ account.email }}</td>
            <td>{{ formatDate(account.deletedAt || account.updatedAt) }}</td>
            <td>
              <div class="actions">
                <button 
                  class="icon-btn restore" 
                  @click="confirmRestore(account)"
                  title="Restore"
                >
                  <i class="fas fa-trash-restore"></i>
                </button>
                <button 
                  class="icon-btn delete" 
                  @click="confirmDelete(account)"
                  title="Permanently Delete"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredAccounts.length === 0">
            <td colspan="6" class="empty-message">
              No accounts in trash
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Restore Confirmation Modal -->
    <div class="modal" v-if="showRestoreModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Restore</h3>
          <button class="close-btn" @click="showRestoreModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to restore the selected accounts?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false">Cancel</button>
            <button class="submit-btn" @click="handleRestore">Restore</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirm Permanent Delete</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">Warning: This action cannot be undone!</p>
          <p>Are you sure you want to permanently delete the selected accounts?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
            <button class="delete-btn" @click="handleDelete">Delete</button>
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
        const response = await accountService.getDeletedAccounts();
        console.log('API Response:', response); // Debug log
        if (response.success) {
          this.accounts = Array.isArray(response.data) ? response.data : [];
          console.log('Loaded accounts:', this.accounts);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('Error loading accounts:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Cannot load deleted accounts'
        });
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      // Method for search handling
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
            message: response.message
          });
          await this.loadAccounts();
          this.selectedAccounts = [];
          this.showRestoreModal = false;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Error restoring accounts'
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
            message: response.message
          });
          await this.loadAccounts();
          this.selectedAccounts = [];
          this.showDeleteModal = false;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.message || 'Error deleting accounts'
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
}

.table-container {
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.icon-btn.restore {
  background: #4CAF50;
  color: white;
}

.icon-btn.delete {
  background: #f44336;
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
}

.warning-text {
  color: #f44336;
  font-weight: bold;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style>