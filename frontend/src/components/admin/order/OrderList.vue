<template>
  <div class="order-list">
    <!-- Error state -->
    <div v-if="error" class="error-container">
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
            />
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th style="width: 5%">No.</th>
              <th style="width: 15%">Tên KH</th>
              <!-- <th style="width: 10%">SĐT</th>
              <th style="width: 15%">Email</th> -->
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
              <!-- <td>{{ order.phone }}</td>
              <td>{{ order.email }}</td> -->
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
                <div class="actions" style="height: 120px !important">
                  <button class="icon-btn info" @click="showDetails(order)" title="Xem chi tiết">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <button class="icon-btn edit" @click="openEditModal(order)" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
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
        <div class="modal-overlay" @click="showDetailsModal = false"></div>
        <div class="modal-content detail-modal" @click.stop>
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
        </div>
      </div>

      <!-- Edit Order Modal -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-overlay" @click="closeEditModal"></div>
        <div class="modal-content" @click.stop>
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
                <h4 class="section-title">
                  <i class="fas fa-info-circle"></i> Thông tin đơn hàng: {{ selectedOrder._id }}
                </h4>
                <div class="order-info">
                  <p><strong>Khách hàng:</strong> {{ selectedOrder.fullName }}</p>
                  <p><strong>Dịch vụ:</strong> {{ selectedOrder.serviceType }}</p>
                  <!-- <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
                  <p><strong>SĐT:</strong> {{ selectedOrder.phone }}</p> -->
                  <p>
                    <strong>Phương thức thanh toán:</strong>
                    {{ getPaymentMethodText(selectedOrder.paymentMethod) }}
                  </p>
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
                    :class="{ error: formErrors.orderStatus }"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang Triển Khai</option>
                    <option value="completed">Hoàn Thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                  <span class="error-message" v-if="formErrors.orderStatus">{{
                    formErrors.orderStatus
                  }}</span>
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
                    :class="{ error: formErrors.paymentStatus }"
                  >
                    <option value="">Chọn trạng thái thanh toán</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="failed">Thanh toán thất bại</option>
                  </select>
                  <span class="error-message" v-if="formErrors.paymentStatus">{{
                    formErrors.paymentStatus
                  }}</span>
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
                      :class="{ error: formErrors.paidAmount }"
                      :disabled="formData.paymentStatus !== 'paid'"
                    />
                    <span class="input-icon">VNĐ</span>
                  </div>
                  <span class="error-message" v-if="formErrors.paidAmount">{{
                    formErrors.paidAmount
                  }}</span>
                  <p class="help-text" v-if="formData.paymentStatus === 'paid'">
                    Vui lòng nhập số tiền khi trạng thái là "Đã thanh toán"
                  </p>
                  <p class="help-text" v-else>
                    Số tiền chỉ được nhập khi trạng thái là "Đã thanh toán"
                  </p>
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
        paidAmount: 0,
      },
      formErrors: {
        orderStatus: '',
        paymentStatus: '',
        paidAmount: '',
      },
      submitLoading: false,
      error: null,
    }
  },
  computed: {
    filteredOrders() {
      // Make sure orders is an array before trying to filter
      if (!this.orders || !Array.isArray(this.orders)) {
        return []
      }

      let result = [...this.orders]

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          (order) =>
            (order._id && order._id.toLowerCase().includes(query)) ||
            (order.fullName && order.fullName.toLowerCase().includes(query)) ||
            (order.phone && order.phone.includes(query)) ||
            (order.email && order.email.toLowerCase().includes(query))
        )
      }

      // Status filter
      if (this.statusFilter) {
        result = result.filter((order) => order.orderStatus === this.statusFilter)
      }

      // Payment status filter
      if (this.paymentFilter) {
        result = result.filter((order) => order.paymentStatus === this.paymentFilter)
      }

      return result
    },
    isFormValid() {
      // Implement form validation logic here
      return true // Placeholder, actual implementation needed
    },
  },
  methods: {
    applyFilters() {
      // This method exists to enable dynamic filtering on change events
      console.log('Filters applied: Status -', this.statusFilter, 'Payment -', this.paymentFilter)
    },

    formatOrderId(id) {
      if (!id) return ''
      // Display only the last 6 characters for better readability
      return id.length > 6 ? id.substring(id.length - 6) : id
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount)
    },

    formatDate(date) {
      if (!date) return ''
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj)) return ''
        // Định dạng: dd/MM/yyyy - HH:mm
        const datePart = dateObj.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        const timePart = dateObj.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })
        return `${datePart} - ${timePart}`
      } catch (error) {
        console.error('Error formatting date:', error)
        return ''
      }
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'Chờ xử lý',
        processing: 'Đang Triển Khai',
        completed: 'Hoàn Thành',
        cancelled: 'Đã hủy',
      }
      return statusMap[status] || status
    },

    getOrderStatusClass(status) {
      return status || 'pending'
    },

    getPaymentStatusText(status) {
      const statusMap = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        failed: 'Thanh toán thất bại',
      }
      return statusMap[status] || status
    },

    getPaymentStatusClass(status) {
      const classMap = {
        pending: 'warning',
        paid: 'success',
        failed: 'danger',
      }
      return classMap[status] || 'default'
    },

    getPaymentMethodText(method) {
      const methodMap = {
        VNPAY: 'VNPay',
        COD: 'Tiền mặt',
        BANK_TRANSFER: 'Chuyển khoản',
        MOMO: 'Ví MoMo',
      }
      return methodMap[method] || method
    },

    async loadOrders() {
      try {
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
          message: 'Không thể tải danh sách đơn hàng',
        })
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
          message: 'Không thể tải danh sách dịch vụ',
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
          paidAmount: order.paidAmount || 0,
        }

        this.showFormModal = true
      } catch (error) {
        console.error('Error opening edit modal:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi mở form chỉnh sửa',
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
        paidAmount: 0,
      }
      this.formErrors = {
        orderStatus: '',
        paymentStatus: '',
        paidAmount: '',
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
          message: 'Vui lòng kiểm tra lại thông tin nhập',
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
          paidAmount: this.formData.paymentStatus === 'paid' ? this.formData.paidAmount : 0,
        }

        await orderService.updateOrderStatus(this.selectedOrder._id, updateData)

        // Reload orders to get fresh data
        await this.loadOrders()
        this.showFormModal = false
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Cập nhật trạng thái đơn hàng thành công',
        })
      } catch (error) {
        console.error('Error updating order:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng',
        })
      } finally {
        this.submitLoading = false
      }
    },

    formatDatePart(date) {
      if (!date) return ''
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj)) return ''

        return dateObj.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      } catch (error) {
        console.error('Error formatting date part:', error)
        return ''
      }
    },

    formatTimePart(date) {
      if (!date) return ''
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj)) return ''

        return dateObj.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch (error) {
        console.error('Error formatting time part:', error)
        return ''
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
    },
  },
  async created() {
    try {
      await Promise.all([this.loadOrders(), this.loadServices()])
    } catch (error) {
      console.error('Error initializing component:', error)
    }
  },
}
</script>

<style scoped>
@import '@/styles/admin.css';

.order-list {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

/* Table Styles */
.table-container {
  background: #fff;
  border-radius: 8px;
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  background: #f8fafc;
  padding: 16px;
  font-weight: 600;
  color: #1e293b;
  text-align: center; /* căn giữa tiêu đề cột */
  border-bottom: 2px solid #e2e8f0;
}

td {
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
  text-align: center; /* căn giữa nội dung cột */
}

tr:hover td {
  background-color: #f8fafc;
}

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  width: 100%;
  max-width: 450px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  margin-left: 8px;
  font-size: 0.95rem;
}

.search-box i {
  color: #94a3b8;
}

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.processing {
  background-color: #e0f2fe;
  color: #0369a1;
}

.completed {
  background-color: #dcfce7;
  color: #166534;
}

.cancelled {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative; /* Thêm dòng này */
  z-index: 1; /* Thêm dòng này */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.modal-body {
  padding: 20px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e293b;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* Buttons */
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 4px;
}

.info {
  background: #3b82f6;
  color: white;
}

.edit {
  background: #10b981;
  color: white;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 120px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.submit-btn:hover {
  background: #2563eb;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

/* Action Buttons Styling */
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto !important; /* Remove fixed height */
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.info {
  background-color: #dbeafe;
  color: #2563eb;
}

.icon-btn.info:hover {
  background-color: #bfdbfe;
  transform: translateY(-1px);
}

.icon-btn.edit {
  background-color: #ecfdf5;
  color: #059669;
}

.icon-btn.edit:hover {
  background-color: #d1fae5;
  transform: translateY(-1px);
}

.icon-btn:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.icon-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.icon-btn i {
  font-size: 1rem;
}

/* Modal Details Styling */
.detail-item {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: start;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.detail-item label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  padding-top: 4px;
}

.detail-item p {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  padding: 4px 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 32px;
  display: flex;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  overflow: hidden;
}

.detail-item:has(.detail-image) {
  grid-template-columns: 120px 1fr;
}

.detail-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 8px;
}

/* Enhanced Modal Header */
.modal-header {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  background: linear-gradient(to right, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

/* Enhanced Form Styling */
.form-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.1rem;
  color: #1e293b;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #3b82f6;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #dc2626;
  margin-left: 4px;
}

.form-group input[type='text'],
.form-group input[type='number'],
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #fff;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-group .error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 14px;
}

.help-text {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

/* Order Info Styling */
.order-info {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.order-info p {
  margin: 8px 0;
  color: #374151;
  display: flex;
  gap: 8px;
  align-items: center;
}

.order-info strong {
  color: #1e293b;
  min-width: 140px;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 140px;
  justify-content: center;
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.close-btn {
  color: #6b7280;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

/* Status Badges Enhancement */
.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.amount-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.amount-badge.success {
  background-color: #dcfce7;
  color: #166534;
}

.amount-badge.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.amount-badge.danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Enhanced Modal Content */
.detail-modal .modal-content {
  max-width: 600px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* Thêm dòng này */
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .form-section {
    padding: 16px;
  }

  .order-info strong {
    min-width: 100px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
