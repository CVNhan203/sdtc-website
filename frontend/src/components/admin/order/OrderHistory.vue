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
            >
          </div>
        </div>
        <div class="filter-group">
          <select v-model="statusFilter">
            <option value="">Tất cả trạng thái</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <select v-model="paymentFilter">
            <option value="">Tất cả trạng thái thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="failed">Thanh toán thất bại</option>
          </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Trạng thái đơn hàng</th>
              <th>Trạng thái thanh toán</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in filteredOrders" :key="order._id">
              <td>{{ index + 1 }}</td>
              <td>{{ order._id }}</td>
              <td>{{ order.fullName }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.email }}</td>
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
              <td>{{ formatDate(order.createdAt) }}</td>
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
        <div class="modal-content">
          <div class="modal-header">
            <h3>Chi tiết đơn hàng</h3>
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
                <p>{{ formatDate(selectedOrder.createdAt) }}</p>
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
import orderService from '@/api/order/orderService'
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
      error: null
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders.filter(order => order.orderStatus !== 'pending')

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(order => 
          order._id.toLowerCase().includes(query) ||
          order.fullName.toLowerCase().includes(query) ||
          order.phone.includes(query)
        )
      }

      if (this.statusFilter) {
        filtered = filtered.filter(order => order.orderStatus === this.statusFilter)
      }

      if (this.paymentFilter) {
        filtered = filtered.filter(order => order.paymentStatus === this.paymentFilter)
      }

      return filtered
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
      }
      return statusMap[status] || status
    },

    getPaymentStatusText(status) {
      const statusMap = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        failed: 'Thanh toán thất bại'
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
          message: 'Không thể tải lịch sử đơn hàng'
        })
      } finally {
        this.loading = false
      }
    },

    showDetails(order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    }
  },
  created() {
    this.loadOrderHistory()
  }
}
</script>

<style scoped>
.order-history {
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
}

.search-filter {
  flex: 1;
  min-width: 300px;
}

.search-box {
  position: relative;
  width: 100%;
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

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #475569;
  background: white;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
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
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #e0f2fe;
  color: #0369a1;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.paid {
  background: #dcfce7;
  color: #166534;
}

.status-badge.failed {
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

.icon-btn:hover {
  opacity: 0.8;
}

.no-data {
  text-align: center;
  color: #64748b;
  font-style: italic;
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

.detail-item {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
}

@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
  }

  .search-filter {
    width: 100%;
  }

  .filter-group {
    width: 100%;
    flex-wrap: wrap;
  }

  .filter-group select {
    flex: 1;
    min-width: 200px;
  }

  .modal-content {
    margin: 1rem;
  }

  .detail-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style> 