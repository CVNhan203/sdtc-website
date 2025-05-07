<template>
  <div class="order-list">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải danh sách đơn hàng...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadOrders">Thử lại</button>
    </div>

    <template v-else>
      <!-- Header Actions -->
      <div class="actions-header">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
            >
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th style="width: 5%">STT</th>
              <th style="width: 15%">Tên KH</th>
              <th style="width: 10%">SĐT</th>
              <th style="width: 15%">Email</th>
              <th style="width: 15%">Loại dịch vụ</th>
              <th style="width: 15%">Số tiền đã thanh toán</th>
              <th style="width: 15%">Trạng thái</th>
              <th style="width: 10%">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in filteredOrders" :key="order._id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="truncate-text">{{ order.fullName }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.email }}</td>
              <td>{{ order.serviceType }}</td>
              <td class="text-center">
                <span :class="['amount-badge', getPaymentStatusClass(order.paymentStatus)]">
                  {{ getDisplayAmount(order) }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', getOrderStatusClass(order.orderStatus)]">
                  {{ getStatusText(order.orderStatus) }}
                </span>
              </td>
              <td class="actions">
                <button 
                  class="icon-btn info" 
                  @click="showDetails(order)"
                  title="Xem chi tiết"
                >
                  <i class="fas fa-info-circle"></i>
                </button>
                <button 
                  class="icon-btn edit" 
                  @click="openEditModal(order)"
                  title="Chỉnh sửa"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="7" class="no-data">Không có đơn hàng nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-content detail-modal">
          <div class="modal-header">
            <h3>Chi tiết đơn hàng</h3>
            <button class="close-btn" @click="showDetailsModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-section">
              <div class="detail-item">
                <label>ID:</label>
                <p>{{ selectedOrder._id }}</p>
              </div>
              <div class="detail-item">
                <label>Tên KH:</label>
                <p>{{ selectedOrder.fullName }}</p>
              </div>
              <div class="detail-item">
                <label>SĐT:</label>
                <p>{{ selectedOrder.phone }}</p>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <p>{{ selectedOrder.email }}</p>
              </div>
              <div class="detail-item">
                <label>Loại dịch vụ:</label>
                <p>{{ selectedOrder.serviceType }}</p>
              </div>
              <div class="detail-item">
                <label>Thanh toán:</label>
                <p>{{ getPaymentMethodText(selectedOrder.paymentMethod) }}</p>
              </div>
              <div class="detail-item">
                <label>Số tiền đã thanh toán:</label>
                <p>{{ formatCurrency(selectedOrder.paidAmount) }}</p>
              </div>
              <div class="detail-item">
                <label>Trạng thái:</label>
                <p>
                  <span :class="['status-badge', getOrderStatusClass(selectedOrder.orderStatus)]">
                    {{ getStatusText(selectedOrder.orderStatus) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" @click="showDetailsModal = false">Đóng</button>
            <button class="edit-btn" @click="openEditModal(selectedOrder)">
              <i class="fas fa-edit"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Order Modal -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cập nhật trạng thái đơn hàng</h3>
            <button class="close-btn" @click="closeEditModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="edit-form">
              <!-- Thông tin đơn hàng -->
              <div class="form-section">
                <h4 class="section-title"><i class="fas fa-info-circle"></i> Thông tin đơn hàng: {{ selectedOrder._id }}</h4>
                <div class="order-info">
                  <p><strong>Khách hàng:</strong> {{ selectedOrder.fullName }}</p>
                  <p><strong>Dịch vụ:</strong> {{ selectedOrder.serviceType }}</p>
                  <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
                  <p><strong>SĐT:</strong> {{ selectedOrder.phone }}</p>
                  <p><strong>Phương thức thanh toán:</strong> {{ getPaymentMethodText(selectedOrder.paymentMethod) }}</p>
                </div>
              </div>

              <!-- Trạng thái đơn hàng -->
              <div class="form-section">
                <h4 class="section-title"><i class="fas fa-tasks"></i> Cập nhật trạng thái</h4>
                <div class="form-group">
                  <label>Trạng thái đơn hàng: <span class="required">*</span></label>
                  <select 
                    v-model="formData.orderStatus" 
                    required
                    :class="{ 'error': formErrors.orderStatus }"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="pending">Trạng Thái</option>
                    <option value="processing">Đang Triển Khai</option>
                    <option value="completed">Hoàn Thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <span class="error-message" v-if="formErrors.orderStatus">{{ formErrors.orderStatus }}</span>
                </div>
              </div>

              <!-- Thông tin thanh toán -->
              <div class="form-section">
                <h4 class="section-title"><i class="fas fa-money-bill-wave"></i> Thanh toán</h4>
                <div class="form-group">
                  <label>Trạng thái thanh toán: <span class="required">*</span></label>
                  <select 
                    v-model="formData.paymentStatus" 
                    required
                    :class="{ 'error': formErrors.paymentStatus }"
                  >
                    <option value="">Chọn trạng thái thanh toán</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thanh toán thất bại</option>
                  </select>
                  <span class="error-message" v-if="formErrors.paymentStatus">{{ formErrors.paymentStatus }}</span>
                </div>

                <div class="form-group">
                  <label>Số tiền thanh toán:</label>
                  <div class="input-with-icon">
                    <input 
                      type="number" 
                      v-model="formData.paidAmount" 
                      placeholder="Nhập số tiền đã thanh toán"
                      min="0"
                      step="1000"
                      :class="{ 'error': formErrors.paidAmount }"
                      :disabled="formData.paymentStatus !== 'paid'"
                    />
                    <span class="input-icon">VNĐ</span>
                  </div>
                  <span class="error-message" v-if="formErrors.paidAmount">{{ formErrors.paidAmount }}</span>
                  <p class="help-text" v-if="formData.paymentStatus === 'paid'">Vui lòng nhập số tiền khi trạng thái là "Đã thanh toán"</p>
                  <p class="help-text" v-else>Số tiền chỉ được nhập khi trạng thái là "Đã thanh toán"</p>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="closeEditModal">
                  <i class="fas fa-times"></i> Hủy
                </button>
                <button 
                  type="submit" 
                  class="submit-btn" 
                  :disabled="submitLoading || !formData.orderStatus"
                >
                  <i class="fas" :class="submitLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i> 
                  {{ submitLoading ? 'Đang xử lý...' : 'Cập nhật trạng thái' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import orderService from '@/api/services/orderService'
import serviceService from '@/api/services/serviceService'
import eventBus from '@/eventBus'

export default {
  name: 'OrderList',
  data() {
    return {
      orders: [],
      services: [],
      searchQuery: '',
      statusFilter: '',
      paymentFilter: '',
      showDetailsModal: false,
      showFormModal: false,
      showDeleteModal: false,
      selectedOrder: {},
      formData: {
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paidAmount: 0
      },
      formErrors: {
        orderStatus: '',
        paymentStatus: '',
        paidAmount: ''
      },
      loading: false,
      submitLoading: false,
      error: null
    }
  },
  computed: {
    filteredOrders() {
      // Make sure orders is an array before trying to filter
      if (!this.orders || !Array.isArray(this.orders)) {
        return [];
      }
      
      let result = [...this.orders];
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(order => 
          (order._id && order._id.toLowerCase().includes(query)) ||
          (order.fullName && order.fullName.toLowerCase().includes(query)) ||
          (order.phone && order.phone.includes(query)) ||
          (order.email && order.email.toLowerCase().includes(query))
        );
      }
      
      // Status filter
      if (this.statusFilter) {
        result = result.filter(order => order.orderStatus === this.statusFilter);
      }
      
      // Payment status filter
      if (this.paymentFilter) {
        result = result.filter(order => order.paymentStatus === this.paymentFilter);
      }
      
      return result;
    },
    isFormValid() {
      // Implement form validation logic here
      return true; // Placeholder, actual implementation needed
    }
  },
  methods: {
    applyFilters() {
      // This method exists to enable dynamic filtering on change events
      console.log('Filters applied: Status -', this.statusFilter, 'Payment -', this.paymentFilter);
    },
    
    formatOrderId(id) {
      if (!id) return '';
      // Display only the last 6 characters for better readability
      return id.length > 6 ? id.substring(id.length - 6) : id;
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    },

    formatDate(date) {
      if (!date) return '';
      
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj)) return '';
        
        return dateObj.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/,/g, ' -'); // Replace comma with dash between date and time
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'Trạng Thái',
        processing: 'Đang Triển Khai',
        completed: 'Hoàn Thành',
        cancelled: 'Đã hủy'
      }
      return statusMap[status] || status
    },

    getOrderStatusClass(status) {
      return status || 'pending';
    },

    getPaymentStatusText(status) {
      const statusMap = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        failed: 'Thanh toán thất bại'
      }
      return statusMap[status] || status
    },
    
    getPaymentStatusClass(status) {
      const classMap = {
        pending: 'warning',
        paid: 'success',
        failed: 'danger'
      }
      return classMap[status] || 'default'
    },
    
    getPaymentMethodText(method) {
      const methodMap = {
        'VNPAY': 'VNPay',
        'COD': 'Tiền mặt',
        'BANK_TRANSFER': 'Chuyển khoản',
        'MOMO': 'Ví MoMo'
      }
      return methodMap[method] || method
    },

    async loadOrders() {
      try {
        this.loading = true
        const response = await orderService.getOrders()
        // orderService now ensures data is an array
        this.orders = response.data || []
        console.log('Loaded orders:', this.orders.length)
      } catch (error) {
        console.error('Error loading orders:', error)
        this.error = 'Không thể tải danh sách đơn hàng'
        this.orders = [] // Ensure orders is an array even after an error
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải danh sách đơn hàng'
        })
      } finally {
        this.loading = false
      }
    },

    showDetails(order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    },

    async loadServices() {
      try {
        const response = await serviceService.getServices()
        if (response && response.data) {
          this.services = response.data
        } else {
          this.services = []
          console.error('Invalid services data format')
        }
      } catch (error) {
        console.error('Error loading services:', error)
        this.services = []
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải danh sách dịch vụ'
        })
      }
    },

    async openEditModal(order) {
      try {
        this.selectedOrder = { ...order }
        this.loading = true

        this.formData = {
          orderStatus: order.orderStatus || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          paidAmount: order.paidAmount || 0
        }
        
        this.showFormModal = true
      } catch (error) {
        console.error('Error opening edit modal:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi mở form chỉnh sửa'
        })
      } finally {
        this.loading = false
      }
    },
    
    openEditModalFromDetails() {
      this.showDetailsModal = false
      this.openEditModal(this.selectedOrder)
    },

    closeEditModal() {
      this.showFormModal = false
      this.formData = {
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paidAmount: 0
      }
      this.formErrors = {
        orderStatus: '',
        paymentStatus: '',
        paidAmount: ''
      }
      this.submitLoading = false
    },

    validateForm() {
      let isValid = true
      this.formErrors = {}

      // Validate orderStatus
      if (!this.formData.orderStatus) {
        this.formErrors.orderStatus = 'Vui lòng chọn trạng thái đơn hàng'
        isValid = false
      }

      // Validate paymentStatus
      if (!this.formData.paymentStatus) {
        this.formErrors.paymentStatus = 'Vui lòng chọn trạng thái thanh toán'
        isValid = false
      }

      // Validate paidAmount
      if (this.formData.paymentStatus === 'paid') {
        if (!this.formData.paidAmount || this.formData.paidAmount <= 0) {
          this.formErrors.paidAmount = 'Vui lòng nhập số tiền thanh toán hợp lệ'
          isValid = false
        }
      }

      return isValid
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Vui lòng kiểm tra lại thông tin nhập'
        })
        return
      }

      // Xác nhận khi thay đổi trạng thái quan trọng
      if (this.selectedOrder.orderStatus !== this.formData.orderStatus) {
        const confirmMessage = `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ "${this.getStatusText(this.selectedOrder.orderStatus)}" thành "${this.getStatusText(this.formData.orderStatus)}"?`
        if (!confirm(confirmMessage)) {
          return
        }
      }

      try {
        this.submitLoading = true
        
        const updateData = {
          orderStatus: this.formData.orderStatus,
          paymentStatus: this.formData.paymentStatus,
          paidAmount: this.formData.paymentStatus === 'paid' ? this.formData.paidAmount : 0
        }
        
        await orderService.updateOrderStatus(this.selectedOrder._id, updateData)

        // Reload orders to get fresh data
        await this.loadOrders()
        this.showFormModal = false
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Cập nhật trạng thái đơn hàng thành công'
        })
      } catch (error) {
        console.error('Error updating order:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng'
        })
      } finally {
        this.submitLoading = false
      }
    },

    formatDatePart(date) {
      if (!date) return '';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj)) return '';
        
        return dateObj.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        console.error('Error formatting date part:', error);
        return '';
      }
    },

    formatTimePart(date) {
      if (!date) return '';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj)) return '';
        
        return dateObj.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        console.error('Error formatting time part:', error);
        return '';
      }
    },

    getDisplayAmount(order) {
      if (order.paymentStatus === 'paid') {
        return this.formatCurrency(order.paidAmount)
      } else if (order.paymentStatus === 'pending') {
        return 'Chưa thanh toán'
      } else {
        return 'Thanh toán thất bại'
      }
    },
  },
  watch: {
    'formData.paymentStatus'(newVal) {
      // Nếu trạng thái thanh toán không phải "đã thanh toán" thì reset số tiền về 0
      if (newVal !== 'paid') {
        this.formData.paidAmount = 0
      }
    }
  },
  async created() {
    try {
      this.loading = true
      await Promise.all([
        this.loadOrders(),
        this.loadServices()
      ])
    } catch (error) {
      console.error('Error initializing component:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
/* Import the admin styles */
@import '@/styles/admin.css';

/* Component specific overrides */
.order-list {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}

.filter-box {
  width: 180px;
}

/* Date cell styling */
.date-cell {
  min-width: 110px;
}

.date-time {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.date-part {
  font-weight: 500;
  color: var(--text-primary);
}

.time-part {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.date-time-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-time-detail .date-part {
  font-size: 1em;
}

.date-time-detail .time-part {
  font-size: 0.9em;
}

/* Order-specific styles */
.detail-section {
  margin-bottom: 2rem;
}

.detail-section h4 {
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.order-id {
  font-family: monospace;
  font-weight: bold;
}

.notes {
  white-space: pre-line;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}

.no-data {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--text-tertiary);
}

.detail-modal {
  max-width: 600px;
}

.detail-section {
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  margin-bottom: 1rem;
}

.detail-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.detail-item label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.detail-item p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--success-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background-color: var(--success-hover);
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #d1d5db;
}

.amount-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.success {
  background-color: #dcfce7;
  color: #166534;
}

.danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

.default {
  background-color: #e5e7eb;
  color: #374151;
}

.text-right {
  text-align: center;
}

.actions {
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn i {
  font-size: 1rem;
}

.icon-btn.info {
  background-color: #3b82f6;
  color: white;
}

.icon-btn.info:hover {
  background-color: #2563eb;
}

.icon-btn.edit {
  background-color: #10b981;
  color: white;
}

.icon-btn.edit:hover {
  background-color: #059669;
}

/* Thêm hiệu ứng khi hover */
.icon-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hiệu ứng khi click */
.icon-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #1e293b;
  background-color: white;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
  justify-content: center;
}

.submit-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-btn i {
  font-size: 1rem;
}

.edit-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.disabled-input {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

.required {
  color: #dc2626;
  margin-left: 2px;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #1e293b;
  resize: vertical;
  min-height: 100px;
}

.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc2626;
}

.form-group input.error:focus,
.form-group select.error:focus,
.form-group textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.modal-content {
  max-width: 800px;
  width: 90%;
}

/* Styles mới cho form chỉnh sửa đơn hàng */
.form-section {
  background-color: #f8fafc;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.section-title {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #3b82f6;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-weight: 500;
  font-size: 0.9rem;
  pointer-events: none;
}

.input-with-icon input {
  padding-right: 60px; /* Space for the icon/text */
}

.order-info {
  padding: 1rem;
  background-color: #edf2f7;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.order-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #4a5568;
}

.order-info strong {
  font-weight: 600;
  color: #2d3748;
}

.help-text {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>
