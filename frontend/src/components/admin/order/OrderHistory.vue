<template>
  <div class="order-history">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải lịch sử đơn hàng...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadOrderHistory">Thử lại</button>
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
              <td>
                <span :class="['status-badge', order.orderStatus]">
                  {{ getStatusText(order.orderStatus) }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', order.paymentStatus]">
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
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="no-data">Không tìm thấy đơn hàng nào</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-content detail-modal">
          <div class="modal-header">
            <h3>Chi tiết đơn hàng #{{ selectedOrder._id }}</h3>
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
                  <span :class="['status-badge', selectedOrder.orderStatus]">
                    {{ getStatusText(selectedOrder.orderStatus) }}
                  </span>
                </p>
              </div>
              <div class="detail-item">
                <label>Trạng thái thanh toán:</label>
                <p>
                  <span :class="['status-badge', selectedOrder.paymentStatus]">
                    {{ getPaymentStatusText(selectedOrder.paymentStatus) }}
                  </span>
                </p>
              </div>
              <div class="detail-item">
                <label>Phương thức thanh toán:</label>
                <p>{{ selectedOrder.paymentMethod }}</p>
              </div>
            </div>
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
  name: 'OrderHistory',
  data() {
    return {
      orders: [],
      searchQuery: '',
      statusFilter: '',
      paymentFilter: '',
      selectedOrder: {},
      showDetailsModal: false,
      loading: false,
      error: null,
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders.filter((order) => order.orderStatus !== 'pending')

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (order) =>
            order._id.toLowerCase().includes(query) ||
            order.fullName.toLowerCase().includes(query) ||
            order.phone.includes(query)
        )
      }

      if (this.statusFilter) {
        filtered = filtered.filter((order) => order.orderStatus === this.statusFilter)
      }

      if (this.paymentFilter) {
        filtered = filtered.filter((order) => order.paymentStatus === this.paymentFilter)
      }

      return filtered
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    formatDatePart(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },

    formatTimePart(date) {
      return new Date(date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
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

    getPaymentStatusText(status) {
      const statusMap = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        failed: 'Thanh toán thất bại',
      }
      return statusMap[status] || status
    },

    async loadOrderHistory() {
      try {
        this.loading = true
        const response = await orderService.getOrders()
        this.orders = response.data
      } catch (error) {
        console.error('Error loading order history:', error)
        this.error = 'Không thể tải lịch sử đơn hàng'
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải lịch sử đơn hàng',
        })
      } finally {
        this.loading = false
      }
    },

    showDetails(order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    },

    formatOrderId(id) {
      if (!id) return ''
      // Display only the last 6 characters for better readability
      return id.length > 6 ? id.substring(id.length - 6) : id
    },

    applyFilters() {
      // Implementation of applyFilters method
    },
  },
  created() {
    this.loadOrderHistory()
  },
}
</script>

<style scoped>
/* Import the admin styles */
/* @import '@/styles/admin.css'; */

/* Component specific overrides */
.order-history {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
}

/* Order ID format */
.order-id {
  font-family: monospace;
  font-weight: 600;
}

/* Ensure proper width of filter selects */
.filter-group select {
  min-width: 160px;
}

/* Custom media queries for extreme mobile cases */
@media (max-width: 480px) {
  .order-history {
    padding: 1rem;
    border-radius: 8px;
  }

  .filter-group {
    margin-top: 0.75rem;
  }

  .search-box input {
    font-size: 0.875rem;
  }
}
</style>
