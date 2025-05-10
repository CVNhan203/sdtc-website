<template>
  <div class="account-list">
    <div class="header-actions">
      <div class="left-actions">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm theo tên hoặc email..."
              @input="handleSearch"
            />
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <router-link to="/admin/tai-khoan/them-moi" class="action-btn add">
          <i class="fas fa-plus"></i>
          Thêm mới
        </router-link>
        <router-link to="/admin/tai-khoan/thung-rac" class="action-btn trash">
          <i class="fas fa-trash"></i>
          Thùng rác
        </router-link>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải danh sách tài khoản...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadAccounts">Thử lại</button>
    </div>

    <!-- Content -->
    <div v-else class="table-container">
      <table class="accounts-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Họ tên</th>
            <th>Email</th>
            <!-- <th>Vai trò</th> -->
            <!-- <th>Trạng thái</th> -->
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(account, index) in filteredAccounts"
            :key="account._id"
            :class="{ deleted: account.isDeleted }"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ account.fullName }}</td>
            <td>{{ account.email }}</td>
            <!-- <td>
              <span :class="['role-badge', account.role]">
                {{ account.role === 'admin' ? 'Quản trị viên' : 'Nhân viên' }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', account.isDeleted ? 'deleted' : 'active']">
                {{ account.isDeleted ? 'Đã xóa' : 'Đang hoạt động' }}
              </span>
            </td> -->
            <td>
              <div class="actions">
                <template v-if="!account.isDeleted">
                  <!-- <router-link
                    :to="'/admin/accounts/edit/' + account._id"
                    class="icon-btn edit"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link> -->
                  <button class="icon-btn delete" title="Xóa" @click="confirmDelete(account)">
                    <i class="fas fa-trash"></i>
                  </button>
                </template>
                <template v-else>
                  <button
                    class="icon-btn restore"
                    title="Khôi phục"
                    @click="confirmRestore(account)"
                  >
                    <i class="fas fa-trash-restore"></i>
                  </button>
                  <button
                    class="icon-btn delete-permanent"
                    title="Xóa vĩnh viễn"
                    @click="confirmDeletePermanent(account)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-overlay" @click="showDeleteModal = false"></div>
      <div class="modal-content" @click.stop>
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
          <button class="confirm-btn" @click="handleDelete">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Restore Confirmation Modal -->
    <div class="modal" v-if="showRestoreModal">
      <div class="modal-overlay" @click="showRestoreModal = false"></div>
      <div class="modal-content" @click.stop>
        <h3>Xác nhận khôi phục</h3>
        <p>Bạn có chắc chắn muốn khôi phục tài khoản này?</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
          <button class="confirm-btn" @click="handleRestore">Khôi phục</button>
        </div>
      </div>
    </div>

    <!-- Permanent Delete Confirmation Modal -->
    <div class="modal" v-if="showDeletePermanentModal">
      <div class="modal-overlay" @click="showDeletePermanentModal = false"></div>
      <div class="modal-content" @click.stop>
        <h3>Xác nhận xóa vĩnh viễn</h3>
        <p class="warning">Cảnh báo: Hành động này không thể hoàn tác!</p>
        <p>Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này?</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeletePermanentModal = false">Hủy</button>
          <button class="delete-btn" @click="handleDeletePermanent">Xóa vĩnh viễn</button>
        </div>
      </div>
    </div>

    <!-- Modal sửa tài khoản -->
    <div class="modal" v-if="showEditModal">
      <div class="modal-overlay" @click="showEditModal = false"></div>
      <div class="modal-content" @click.stop>
        <h3>Chỉnh sửa tài khoản</h3>
        <form @submit.prevent="handleEditSubmit">
          <div v-if="editError" class="error-alert">{{ editError }}</div>
          <div v-if="editSuccess" class="success-alert">{{ editSuccess }}</div>
          <div class="form-group">
            <label>Họ tên <span class="required">*</span></label>
            <input type="text" v-model.trim="editFormData.fullName" :class="{ error: editErrors.fullName }" maxlength="50" />
            <span class="error-message" v-if="editErrors.fullName">{{ editErrors.fullName }}</span>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="editFormData.email" readonly />
          </div>
          <div class="form-group">
            <label>Vai trò <span class="required">*</span></label>
            <select v-model="editFormData.role" :class="{ error: editErrors.role }">
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
            </select>
            <span class="error-message" v-if="editErrors.role">{{ editErrors.role }}</span>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showEditModal = false">Hủy</button>
            <button type="submit" class="submit-btn" :disabled="editLoading">{{ editLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import accountService from '@/api/services/accountService'
import eventBus from '@/eventBus'

export default {
  name: 'AccountList',
  setup() {
    const router = useRouter()
    const accounts = ref([])
    const searchQuery = ref('')
    const filterRole = ref('')
    const filterStatus = ref('all')
    const loading = ref(true)
    const error = ref(null)
    const showDetailsModal = ref(false)
    const showDeleteModal = ref(false)
    const showRestoreModal = ref(false)
    const showDeletePermanentModal = ref(false)
    const selectedAccount = ref({})

    // Add these new ref variables
    const showEditModal = ref(false)
    const editFormData = ref({
      _id: '',
      fullName: '',
      email: '',
      role: ''
    })
    const editErrors = ref({})
    const editError = ref(null)
    const editSuccess = ref(null)
    const editLoading = ref(false)

    // Computed property for filtered accounts
    const filteredAccounts = computed(() => {
      let result = [...accounts.value]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (account) =>
            account.fullName.toLowerCase().includes(query) ||
            account.email.toLowerCase().includes(query)
        )
      }

      // Role filter
      if (filterRole.value) {
        result = result.filter((account) => account.role === filterRole.value)
      }

      // Status filter
      if (filterStatus.value !== 'all') {
        const isDeleted = filterStatus.value === 'deleted'
        result = result.filter((account) => account.isDeleted === isDeleted)
      }

      return result
    })

    // Load accounts
    const loadAccounts = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await accountService.getAccounts()
        if (response.success) {
          accounts.value = response.data || []
        } else {
          throw new Error(response.message || 'Không thể tải danh sách tài khoản')
        }
      } catch (err) {
        console.error('Error loading accounts:', err)
        error.value = err.message || 'Không thể tải danh sách tài khoản. Vui lòng thử lại sau.'
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.value,
        })
      } finally {
        loading.value = false
      }
    }

    // Format role display
    const formatRole = (role) => {
      const roles = {
        admin: 'Quản trị viên',
        staff: 'Nhân viên',
      }
      return roles[role] || role
    }

    // Format status display
    const formatStatus = (status) => {
      const statuses = {
        active: 'Đang hoạt động',
        inactive: 'Không hoạt động',
      }
      return statuses[status] || status
    }

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleString('vi-VN')
    }

    // Show account details
    const showDetails = (account) => {
      selectedAccount.value = account
      showDetailsModal.value = true
    }

    // Edit account
    const editAccount = (account) => {
      router.push(`/admin/tai-khoan/chinh-sua/${account._id}`)
    }

    // Toggle account status
    const toggleStatus = async (account) => {
      try {
        const newStatus = account.status === 'active' ? 'inactive' : 'active'
        const response = await accountService.updateAccountStatus(account._id, newStatus)

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: `Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`,
          })
          await loadAccounts()
        } else {
          throw new Error(response.message)
        }
      } catch (err) {
        console.error('Error toggling account status:', err)
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể cập nhật trạng thái tài khoản',
        })
      }
    }

    // Confirm delete
    const confirmDelete = (account) => {
      selectedAccount.value = account
      showDeleteModal.value = true
    }

    // Confirm restore
    const confirmRestore = (account) => {
      selectedAccount.value = account
      showRestoreModal.value = true
    }

    // Confirm permanent delete
    const confirmDeletePermanent = (account) => {
      selectedAccount.value = account
      showDeletePermanentModal.value = true
    }

    // Handle delete
    const handleDelete = async () => {
      try {
        const response = await accountService.deleteAccount(selectedAccount.value._id)

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Đã xóa tài khoản thành công',
          })
          showDeleteModal.value = false
          loadAccounts() // Reload the accounts list
        } else {
          throw new Error(response.message || 'Không thể xóa tài khoản')
        }
      } catch (err) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể xóa tài khoản. Vui lòng thử lại sau.',
        })
      }
    }

    // Handle restore
    const handleRestore = async () => {
      try {
        const response = await accountService.restoreAccount(selectedAccount.value._id)

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Đã khôi phục tài khoản thành công',
          })
          showRestoreModal.value = false
          loadAccounts() // Reload the accounts list
        } else {
          throw new Error(response.message || 'Không thể khôi phục tài khoản')
        }
      } catch (err) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể khôi phục tài khoản. Vui lòng thử lại sau.',
        })
      }
    }

    // Handle permanent delete
    const handleDeletePermanent = async () => {
      try {
        const response = await accountService.permanentDeleteAccount(selectedAccount.value._id)

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Đã xóa vĩnh viễn tài khoản thành công',
          })
          showDeletePermanentModal.value = false
          loadAccounts() // Reload the accounts list
        } else {
          throw new Error(response.message || 'Không thể xóa vĩnh viễn tài khoản')
        }
      } catch (err) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể xóa vĩnh viễn tài khoản. Vui lòng thử lại sau.',
        })
      }
    }

    // Search handler
    const handleSearch = () => {
      // Filtering is handled by computed property
    }

    // Filter handler
    const handleFilter = () => {
      // Filtering is handled by computed property
    }

    // Format ID
    const truncateId = (id) => {
      return id.length > 8 ? id.substring(0, 8) + '...' : id
    }

    // Mở modal sửa
    const openEditModal = (account) => {
      editFormData.value = {
        _id: account._id,
        fullName: account.fullName,
        email: account.email,
        role: account.role
      };
      editErrors.value = {};
      editError.value = null;
      editSuccess.value = null;
      showEditModal.value = true;
    };

    // Validate form sửa
    const validateEdit = () => {
      const errs = {};
      if (!editFormData.value.fullName.trim()) {
        errs.fullName = 'Họ tên không được để trống';
      } else if (editFormData.value.fullName.length < 3) {
        errs.fullName = 'Họ tên phải có ít nhất 3 ký tự';
      }
      if (!editFormData.value.role) {
        errs.role = 'Vui lòng chọn vai trò';
      }
      editErrors.value = errs;
      return Object.keys(errs).length === 0;
    };

    // Gửi form sửa
    const handleEditSubmit = async () => {
      editError.value = null;
      editSuccess.value = null;
      if (!validateEdit()) return;
      editLoading.value = true;
      try {
        const res = await accountService.updateAccount(editFormData.value._id, {
          fullName: editFormData.value.fullName,
          role: editFormData.value.role
        });
        if (res.success) {
          editSuccess.value = 'Cập nhật tài khoản thành công';
          eventBus.emit('show-toast', { type: 'success', message: editSuccess.value });
          showEditModal.value = false;
          await loadAccounts();
        } else {
          throw new Error(res.message || 'Không thể cập nhật tài khoản');
        }
      } catch (err) {
        editError.value = err.message || 'Có lỗi xảy ra khi cập nhật';
      } finally {
        editLoading.value = false;
      }
    };

    onMounted(() => {
      loadAccounts()
    })

    return {
      accounts,
      searchQuery,
      filterRole,
      filterStatus,
      loading,
      error,
      showDetailsModal,
      showDeleteModal,
      showRestoreModal,
      showDeletePermanentModal,
      selectedAccount,
      filteredAccounts,
      loadAccounts,
      formatRole,
      formatStatus,
      formatDate,
      showDetails,
      editAccount,
      toggleStatus,
      confirmDelete,
      confirmRestore,
      confirmDeletePermanent,
      handleDelete,
      handleRestore,
      handleDeletePermanent,
      handleSearch,
      handleFilter,
      truncateId,
      showEditModal,
      editFormData,
      editErrors,
      editError,
      editSuccess,
      editLoading,
      openEditModal,
      handleEditSubmit,
    }
  },
}
</script>

<style scoped>

@import "@/styles/admin.css";

/* Container */
.account-list {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Header Actions */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-box {
  position: relative;
  width: 320px;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-box input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.accounts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.accounts-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: center; /* căn giữa tiêu đề bảng */
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.accounts-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center; /* căn giữa nội dung bảng */
}

.accounts-table tr:hover {
  background-color: #f9fafb;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
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

.icon-btn.edit {
  background-color: #60a5fa;
  color: white;
}

.icon-btn.edit:hover {
  background-color: #3b82f6;
}

.icon-btn.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.icon-btn.delete:hover {
  background-color: #ef4444;
}

.icon-btn.restore {
  background-color: #34d399;
  color: white;
}

.icon-btn.restore:hover {
  background-color: #10b981;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25); /* nhẹ hơn */
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
  background: #fff;
  padding: 24px 28px 20px 28px;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  text-align: left;
  position: relative;
}

.modal-content h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 700;
  color: #222;
}

.modal-content p {
  margin: 0 0 18px 0;
  font-size: 15px;
  color: #222;
}

.modal-content .warning {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn,
.confirm-btn,
.delete-btn {
  min-width: 90px;
  padding: 8px 0;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #222;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  background: #fee2e2;
  color: #dc2626;
  font-weight: 600;
}

.confirm-btn:hover {
  background: #fecaca;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
  font-weight: 600;
}

.delete-btn:hover {
  background: #fecaca;
}

/* Đảm bảo modal nhỏ gọn, căn giữa */
@media (max-width: 500px) {
  .modal-content {
    max-width: 95vw;
    padding: 18px 8px 14px 8px;
  }
}

/* Loading and Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

.loading-spinner {
  border: 3px solid #f3f4f6;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .account-list {
    padding: 16px;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .actions {
    flex-wrap: wrap;
  }

  .table-container {
    margin: 0 -16px;
    border-radius: 0;
  }
}

/* Status and Role Badges */
.status-badge,
.role-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.deleted {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Custom Variables */
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --danger-color: #ef4444;
  --danger-hover: #dc2626;
  --success-color: #10b981;
  --success-hover: #059669;
}
</style>