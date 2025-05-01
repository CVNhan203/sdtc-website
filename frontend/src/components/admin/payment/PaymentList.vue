<template>
  <div class="payment-list">
    <!-- Header Actions -->
    <div class="actions-header">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm phương thức thanh toán..."
            @input="handleSearch"
          >
        </div>
      </div>

      <button class="add-btn" @click="openAddModal">
        <i class="fas fa-plus"></i>
        Thêm phương thức thanh toán
      </button>
    </div>

    <!-- Payment Methods Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã phương thức</th>
            <th>Tên phương thức</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(method, index) in filteredPaymentMethods" :key="method.id">
            <td>{{ index + 1 }}</td>
            <td>{{ method.code }}</td>
            <td>{{ method.name }}</td>
            <td>
              <span :class="['status-badge', method.status]">
                {{ getStatusText(method.status) }}
              </span>
            </td>
            <td class="actions">
              <button class="icon-btn info" @click="showDetails(method)">
                <i class="fas fa-info-circle"></i>
              </button>
              <button class="icon-btn edit" @click="openEditModal(method)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="icon-btn delete" @click="confirmDelete(method)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Method Details Modal -->
    <div class="modal" v-if="showDetailsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chi tiết phương thức thanh toán</h3>
          <button class="close-btn" @click="showDetailsModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-item">
            <label>Mã phương thức:</label>
            <p>{{ selectedMethod.code }}</p>
          </div>
          <div class="detail-item">
            <label>Tên phương thức:</label>
            <p>{{ selectedMethod.name }}</p>
          </div>
          <div class="detail-item">
            <label>Mô tả:</label>
            <p>{{ selectedMethod.description }}</p>
          </div>
          <div class="detail-item">
            <label>Trạng thái:</label>
            <p>
              <span :class="['status-badge', selectedMethod.status]">
                {{ getStatusText(selectedMethod.status) }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Payment Method Modal -->
    <div class="modal" v-if="showFormModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán' }}</h3>
          <button class="close-btn" @click="showFormModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="payment-form">
            <div class="form-group">
              <label>Mã phương thức <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="formData.code"
                :disabled="isEditing"
                required
                placeholder="Nhập mã phương thức"
              >
            </div>
            <div class="form-group">
              <label>Tên phương thức <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="formData.name"
                required
                placeholder="Nhập tên phương thức"
              >
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea 
                v-model="formData.description"
                rows="4"
                placeholder="Nhập mô tả chi tiết"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="formData.status">
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
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

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa phương thức thanh toán "{{ selectedMethod.name }}" không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
            <button class="delete-btn" @click="handleDelete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentList',
  data() {
    return {
      paymentMethods: [
        {
          id: 1,
          code: 'CASH',
          name: 'Tiền mặt',
          description: 'Thanh toán bằng tiền mặt khi nhận hàng',
          status: 'active'
        },
        {
          id: 2,
          code: 'BANK_TRANSFER',
          name: 'Chuyển khoản ngân hàng',
          description: 'Thanh toán qua chuyển khoản ngân hàng',
          status: 'active'
        },
        {
          id: 3,
          code: 'MOMO',
          name: 'Ví MoMo',
          description: 'Thanh toán qua ví điện tử MoMo',
          status: 'inactive'
        }
      ],
      searchQuery: '',
      showDetailsModal: false,
      showFormModal: false,
      showDeleteModal: false,
      selectedMethod: {},
      formData: {
        code: '',
        name: '',
        description: '',
        status: 'active'
      },
      isEditing: false
    }
  },
  computed: {
    filteredPaymentMethods() {
      if (!this.searchQuery) return this.paymentMethods

      const query = this.searchQuery.toLowerCase()
      return this.paymentMethods.filter(method => 
        method.code.toLowerCase().includes(query) ||
        method.name.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        active: 'Hoạt động',
        inactive: 'Không hoạt động'
      }
      return statusMap[status] || status
    },
    handleSearch() {
      // Implement debounce if needed
    },
    showDetails(method) {
      this.selectedMethod = { ...method }
      this.showDetailsModal = true
    },
    openAddModal() {
      this.isEditing = false
      this.formData = {
        code: '',
        name: '',
        description: '',
        status: 'active'
      }
      this.showFormModal = true
    },
    openEditModal(method) {
      this.isEditing = true
      this.formData = { ...method }
      this.showFormModal = true
    },
    confirmDelete(method) {
      this.selectedMethod = method
      this.showDeleteModal = true
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          const index = this.paymentMethods.findIndex(m => m.id === this.formData.id)
          this.paymentMethods[index] = { ...this.formData }
        } else {
          const newMethod = {
            ...this.formData,
            id: this.paymentMethods.length + 1
          }
          this.paymentMethods.push(newMethod)
        }
        this.showFormModal = false
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async handleDelete() {
      try {
        const index = this.paymentMethods.findIndex(m => m.id === this.selectedMethod.id)
        this.paymentMethods.splice(index, 1)
        this.showDeleteModal = false
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>

<style scoped>
.payment-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.actions-header {
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
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #2563eb;
}

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
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
  gap: 0.5rem;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
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
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.form-group .required {
  color: #ef4444;
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
  resize: vertical;
}

.form-group input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
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

@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-filter {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style>
