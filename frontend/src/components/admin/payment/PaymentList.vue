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
        
        <select v-model="statusFilter" @change="handleFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      <button class="add-btn" @click="openAddModal">
        <i class="fas fa-plus"></i>
        Thêm phương thức thanh toán
      </button>
    </div>

    <!-- Payment Methods Table -->
    <div class="table-container responsive-table">
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
            <td class="truncate-text">{{ method.code }}</td>
            <td class="truncate-text">{{ method.name }}</td>
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
      statusFilter: '',
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
      let result = [...this.paymentMethods];
      
      // Apply text search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(method => 
          method.code.toLowerCase().includes(query) ||
          method.name.toLowerCase().includes(query)
        );
      }
      
      // Apply status filter
      if (this.statusFilter) {
        result = result.filter(method => method.status === this.statusFilter);
      }
      
      return result;
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
    handleFilter() {
      // This method exists to handle filter changes, can be extended if needed
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
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.search-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
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

select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  min-width: 160px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

.add-btn i {
  font-size: 0.9rem;
}

.table-container {
  min-width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
  min-width: 750px;
}

th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

th {
  background: #f8fafc;
  font-weight: 500;
  color: #475569;
  text-align: center;
}

/* Column widths */
th:nth-child(1), 
td:nth-child(1) {
  width: 80px; /* STT */
}

th:nth-child(2), 
td:nth-child(2) {
  width: 180px; /* Mã phương thức */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(3), 
td:nth-child(3) {
  width: 220px; /* Tên phương thức */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(4), 
td:nth-child(4) {
  width: 150px; /* Trạng thái */
}

th:nth-child(5), 
td:nth-child(5) {
  width: 120px; /* Thao tác */
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn.info {
  background: #e0f2fe;
  color: #0369a1;
}

.icon-btn.info:hover {
  background: #bae6fd;
}

.icon-btn.edit {
  background: #e0f7fa;
  color: #0288d1;
}

.icon-btn.edit:hover {
  background: #b3e5fc;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.delete:hover {
  background: #fecaca;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.detail-item {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.detail-item label {
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-item p {
  margin: 0;
  color: #1f2937;
  word-break: break-word;
}

/* Form Styles */
.payment-form .form-group {
  margin-bottom: 1.25rem;
}

.payment-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.payment-form .required {
  color: #dc2626;
}

.payment-form input,
.payment-form select,
.payment-form textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.payment-form textarea {
  resize: vertical;
  min-height: 100px;
}

.payment-form input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}

/* Responsive table adjustments */
.responsive-table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .responsive-hide {
    display: none;
  }
}
</style>
