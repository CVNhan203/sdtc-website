<template>
  <div class="account-list">
    <!-- Header actions -->
    <div class="header-actions">
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
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account, index) in filteredAccounts" :key="account._id" :class="{ 'deleted': account.isDeleted }">
            <td>{{ index + 1 }}</td>
            <td>{{ account.fullName }}</td>
            <td>{{ account.email }}</td>
            <td>
              <span :class="['role-badge', account.role]">
                {{ account.role === 'admin' ? 'Quản trị viên' : 'Nhân viên' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button 
                  class="icon-btn edit" 
                  title="Chỉnh sửa"
                  @click="openEditModal(account)"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
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
      <div class="modal-content">
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
      <div class="modal-content">
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
      <div class="modal-content">
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import accountService from '@/api/services/accountService';
import eventBus from '@/eventBus';

export default {
  name: 'AccountList',
  setup() {
    const router = useRouter();
    const accounts = ref([]);
    const searchQuery = ref('');
    const filterRole = ref('');
    const filterStatus = ref('all');
    const loading = ref(true);
    const error = ref(null);
    const showDetailsModal = ref(false);
    const showDeleteModal = ref(false);
    const showRestoreModal = ref(false);
    const showDeletePermanentModal = ref(false);
    const selectedAccount = ref({});
    const showEditModal = ref(false);
    const editFormData = ref({
      _id: '',
      fullName: '',
      email: '',
      role: 'staff'
    });
    const editErrors = ref({});
    const editLoading = ref(false);
    const editError = ref(null);
    const editSuccess = ref(null);

    // Computed property for filtered accounts
    const filteredAccounts = computed(() => {
      let result = [...accounts.value];

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(account => 
          account.fullName.toLowerCase().includes(query) ||
          account.email.toLowerCase().includes(query)
        );
      }

      // Role filter
      if (filterRole.value) {
        result = result.filter(account => account.role === filterRole.value);
      }

      // Status filter
      if (filterStatus.value !== 'all') {
        const isDeleted = filterStatus.value === 'deleted';
        result = result.filter(account => account.isDeleted === isDeleted);
      }

      return result;
    });

    // Load accounts
    const loadAccounts = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await accountService.getAccounts();
        if (response.success) {
          accounts.value = response.data || [];
        } else {
          throw new Error(response.message || 'Không thể tải danh sách tài khoản');
        }
      } catch (err) {
        console.error('Error loading accounts:', err);
        error.value = err.message || 'Không thể tải danh sách tài khoản. Vui lòng thử lại sau.';
        eventBus.emit('show-toast', {
          type: 'error',
          message: error.value
        });
      } finally {
        loading.value = false;
      }
    };

    // Format role display
    const formatRole = (role) => {
      const roles = {
        'admin': 'Quản trị viên',
        'staff': 'Nhân viên'
      };
      return roles[role] || role;
    };

    // Format status display
    const formatStatus = (status) => {
      const statuses = {
        'active': 'Đang hoạt động',
        'inactive': 'Không hoạt động'
      };
      return statuses[status] || status;
    };

    // Format date
    const formatDate = (date) => {
      return new Date(date).toLocaleString('vi-VN');
    };

    // Show account details
    const showDetails = (account) => {
      selectedAccount.value = account;
      showDetailsModal.value = true;
    };

    // Edit account
    const editAccount = (account) => {
      router.push(`/admin/tai-khoan/chinh-sua/${account._id}`);
    };

    // Toggle account status
    const toggleStatus = async (account) => {
      try {
        const newStatus = account.status === 'active' ? 'inactive' : 'active';
        const response = await accountService.updateAccountStatus(account._id, newStatus);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: `Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`
          });
          await loadAccounts();
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        console.error('Error toggling account status:', err);
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể cập nhật trạng thái tài khoản'
        });
      }
    };

    // Confirm delete
    const confirmDelete = (account) => {
      selectedAccount.value = account;
      showDeleteModal.value = true;
    };

    // Confirm restore
    const confirmRestore = (account) => {
      selectedAccount.value = account;
      showRestoreModal.value = true;
    };

    // Confirm permanent delete
    const confirmDeletePermanent = (account) => {
      selectedAccount.value = account;
      showDeletePermanentModal.value = true;
    };

    // Handle delete
    const handleDelete = async () => {
      try {
        const response = await accountService.deleteAccount(selectedAccount.value._id);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Đã xóa tài khoản thành công'
          });
          showDeleteModal.value = false;
          loadAccounts(); // Reload the accounts list
        } else {
          throw new Error(response.message || 'Không thể xóa tài khoản');
        }
      } catch (err) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể xóa tài khoản. Vui lòng thử lại sau.'
        });
      }
    };

    // Handle restore
    const handleRestore = async () => {
      try {
        const response = await accountService.restoreAccount(selectedAccount.value._id);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Đã khôi phục tài khoản thành công'
          });
          showRestoreModal.value = false;
          loadAccounts(); // Reload the accounts list
        } else {
          throw new Error(response.message || 'Không thể khôi phục tài khoản');
        }
      } catch (err) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể khôi phục tài khoản. Vui lòng thử lại sau.'
        });
      }
    };

    // Handle permanent delete
    const handleDeletePermanent = async () => {
      try {
        const response = await accountService.permanentDeleteAccount(selectedAccount.value._id);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Đã xóa vĩnh viễn tài khoản thành công'
          });
          showDeletePermanentModal.value = false;
          loadAccounts(); // Reload the accounts list
        } else {
          throw new Error(response.message || 'Không thể xóa vĩnh viễn tài khoản');
        }
      } catch (err) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể xóa vĩnh viễn tài khoản. Vui lòng thử lại sau.'
        });
      }
    };

    // Search handler
    const handleSearch = () => {
      // Filtering is handled by computed property
    };

    // Filter handler
    const handleFilter = () => {
      // Filtering is handled by computed property
    };

    // Format ID
    const truncateId = (id) => {
      return id.length > 8 ? id.substring(0, 8) + '...' : id;
    };

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
      loadAccounts();
    });

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
      editLoading,
      editError,
      editSuccess,
      openEditModal,
      validateEdit,
      handleEditSubmit
    };
  }
};
</script>

<style scoped>
@import "@/styles/admin.css";

/* Chỉ giữ lại các style đặc biệt nếu cần, xóa style modal-content, form-group, form-actions, submit-btn, cancel-btn... để dùng style từ admin.css */

.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #e0f2fe;
  color: #0369a1;
}

.role-badge.staff {
  background-color: #f3e8ff;
  color: #7e22ce;
}

.icon-btn.activate {
  background-color: #10b981;
  color: white;
}

.icon-btn.activate:hover {
  background-color: #059669;
}

.icon-btn.deactivate {
  background-color: #ef4444;
  color: white;
}

.icon-btn.deactivate:hover {
  background-color: #dc2626;
}

@media (max-width: 600px) {
  .modal-content {
    padding: 8px 2px !important;
    max-width: 98vw;
  }
}
</style>