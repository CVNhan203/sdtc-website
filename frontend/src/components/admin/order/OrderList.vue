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
            />
          </div>

          <select v-model="statusFilter" @change="applyFilters">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <select v-model="paymentFilter" @change="applyFilters">
            <option value="">Tất cả TT thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="failed">Thanh toán thất bại</option>
          </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th class="responsive-hide">Số điện thoại</th>
              <th class="responsive-hide">Email</th>
              <th class="responsive-hide">Phương thức thanh toán</th>
              <th>Trạng thái đơn hàng</th>
              <th>Trạng thái thanh toán</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in filteredOrders" :key="order._id">
              <td>{{ index + 1 }}</td>
              <td class="order-id">{{ formatOrderId(order._id) }}</td>
              <td class="truncate-text">{{ order.fullName }}</td>
              <td class="responsive-hide">{{ order.phone }}</td>
              <td class="responsive-hide">{{ order.email }}</td>
              <td class="responsive-hide">{{ getPaymentMethodText(order.paymentMethod) }}</td>
              <td>
                <span :class="['status-badge', getOrderStatusClass(order.orderStatus)]">
                  {{ getStatusText(order.orderStatus) }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', getPaymentStatusClass(order.paymentStatus)]">
                  {{ getPaymentStatusText(order.paymentStatus) }}
                </span>
              </td>
              <td class="date-cell">
                <div class="date-time">
                  <div class="date-part">{{ formatDatePart(order.createdAt) }}</div>
                  <div class="time-part">{{ formatTimePart(order.createdAt) }}</div>
                </div>
              </td>
              <td class="actions">
                <button class="icon-btn info" @click="showDetails(order)" title="Xem chi tiết">
                  <i class="fas fa-info-circle"></i>
                </button>
                <button
                  class="icon-btn edit"
                  @click="openEditModal(order)"
                  title="Cập nhật trạng thái"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="10" class="no-data">Không có đơn hàng nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-content detail-modal">
          <div class="modal-header">
            <h3>Chi tiết đơn hàng #{{ formatOrderId(selectedOrder._id) }}</h3>
            <button class="close-btn" @click="showDetailsModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-section">
              <h4>Thông tin khách hàng</h4>
              <div class="detail-item">
                <label>Tên khách hàng:</label>
                <p>{{ selectedOrder.fullName }}</p>
              </div>
              <div class="detail-item">
                <label>Số điện thoại:</label>
                <p>{{ selectedOrder.phone }}</p>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <p>{{ selectedOrder.email }}</p>
              </div>
            </div>

            <div class="detail-section">
              <h4>Thông tin đơn hàng</h4>
              <div class="detail-item">
                <label>Mã đơn hàng:</label>
                <p>{{ selectedOrder._id }}</p>
              </div>
              <div class="detail-item">
                <label>Ngày đặt:</label>
                <p class="date-time-detail">
                  <span class="date-part">{{ formatDatePart(selectedOrder.createdAt) }}</span>
                  <span class="time-part">{{ formatTimePart(selectedOrder.createdAt) }}</span>
                </p>
              </div>
              <div class="detail-item">
                <label>Trạng thái đơn hàng:</label>
                <p>
                  <span :class="['status-badge', getOrderStatusClass(selectedOrder.orderStatus)]">
                    {{ getStatusText(selectedOrder.orderStatus) }}
                  </span>
                </p>
              </div>
              <div class="detail-item">
                <label>Trạng thái thanh toán:</label>
                <p>
                  <span
                    :class="['status-badge', getPaymentStatusClass(selectedOrder.paymentStatus)]"
                  >
                    {{ getPaymentStatusText(selectedOrder.paymentStatus) }}
                  </span>
                </p>
              </div>
              <div class="detail-item">
                <label>Phương thức thanh toán:</label>
                <p>{{ getPaymentMethodText(selectedOrder.paymentMethod) }}</p>
              </div>
            </div>

            <!-- Services (if available) -->
            <div class="detail-section" v-if="selectedOrder.serviceId">
              <h4>Dịch vụ đã đặt</h4>
              <div class="detail-item">
                <label>Mã dịch vụ:</label>
                <p>{{ selectedOrder.serviceId }}</p>
              </div>
              <!-- Add more service details if available -->
            </div>

            <!-- Notes -->
            <div class="detail-section" v-if="selectedOrder.notes">
              <h4>Ghi chú</h4>
              <div class="detail-item">
                <p class="notes">{{ selectedOrder.notes }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button class="cancel-btn" @click="showDetailsModal = false">Đóng</button>
              <button class="submit-btn" @click="openEditModalFromDetails">
                <i class="fas fa-edit"></i> Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Status Modal -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cập nhật trạng thái đơn hàng #{{ formatOrderId(selectedOrder._id) }}</h3>
            <button class="close-btn" @click="showFormModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Trạng thái đơn hàng</label>
                <select v-model="formData.orderStatus">
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div class="form-group">
                <label>Trạng thái thanh toán</label>
                <select v-model="formData.paymentStatus">
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="failed">Thanh toán thất bại</option>
                </select>
              </div>

              <div class="form-group">
                <label>Ghi chú cập nhật (tùy chọn)</label>
                <textarea
                  v-model="formData.notes"
                  rows="3"
                  placeholder="Nhập ghi chú cập nhật nếu có..."
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showFormModal = false">Hủy</button>
                <button type="submit" class="submit-btn" :disabled="submitLoading">
                  <i class="fas" :class="submitLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                  {{ submitLoading ? 'Đang cập nhật...' : 'Cập nhật' }}
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
import eventBus from '@/eventBus'

export default {
  name: 'OrderList',
  data() {
    return {
      orders: [],
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
        notes: '',
      },
      loading: false,
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

        return dateObj
          .toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(/,/g, ' -') // Replace comma with dash between date and time
      } catch (error) {
        console.error('Error formatting date:', error)
        return ''
      }
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        completed: 'Hoàn thành',
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
      return status || 'pending'
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
          message: 'Không thể tải danh sách đơn hàng',
        })
      } finally {
        this.loading = false
      }
    },

    showDetails(order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    },

    openEditModal(order) {
      this.formData = {
        orderStatus: order.orderStatus || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        notes: '',
      }
      this.selectedOrder = { ...order }
      this.showFormModal = true
    },

    openEditModalFromDetails() {
      this.showDetailsModal = false
      this.openEditModal(this.selectedOrder)
    },

    async handleSubmit() {
      try {
        this.submitLoading = true
        const updateData = {
          orderStatus: this.formData.orderStatus,
          paymentStatus: this.formData.paymentStatus,
        }

        // Only include notes if provided
        if (this.formData.notes.trim()) {
          updateData.notes = this.formData.notes.trim()
        }

        await orderService.updateOrderStatus(this.selectedOrder._id, updateData)

        // Reload orders to get fresh data
        await this.loadOrders()
        this.showFormModal = false
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Cập nhật đơn hàng thành công',
        })
      } catch (error) {
        console.error('Error updating order:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi cập nhật đơn hàng',
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
  },
  created() {
    this.loadOrders()
  },
}
</script>

<style scoped>
/* Import the admin styles */
/* @import '@/styles/admin.css'; */

/* Component specific overrides */
.order-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
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
  color: #1e293b;
}

.time-part {
  font-size: 0.85em;
  color: #64748b;
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
  color: #1e293b;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.order-id {
  font-family: monospace;
  font-weight: bold;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
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

.cancelled,
.failed {
  background-color: #fee2e2;
  color: #b91c1c;
}

.paid {
  background-color: #dcfce7;
  color: #166534;
}

.notes {
  white-space: pre-line;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.detail-modal {
  max-width: 600px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}
</style>
