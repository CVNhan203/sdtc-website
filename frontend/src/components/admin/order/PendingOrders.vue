<template>
  <div class="pending-orders">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải danh sách đơn hàng chờ duyệt...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadPendingOrders">Thử lại</button>
    </div>

    <template v-else>
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
              <th>Phương thức thanh toán</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in pendingOrders" :key="order._id">
              <td>{{ index + 1 }}</td>
              <td>{{ order._id }}</td>
              <td>{{ order.fullName }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.email }}</td>
              <td>{{ order.paymentMethod }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td class="actions">
                <button class="icon-btn info" @click="showDetails(order)" title="Xem chi tiết">
                  <i class="fas fa-info-circle"></i>
                </button>
                <button class="icon-btn approve" @click="approveOrder(order)" title="Duyệt đơn">
                  <i class="fas fa-check"></i>
                </button>
                <button class="icon-btn reject" @click="rejectOrder(order)" title="Từ chối">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
            <tr v-if="pendingOrders.length === 0">
              <td colspan="8" class="no-data">Không có đơn hàng nào chờ duyệt</td>
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
                <label>Phương thức thanh toán:</label>
                <p>{{ selectedOrder.paymentMethod }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Action Modal -->
      <div class="modal" v-if="showConfirmModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ confirmAction === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối' }}</h3>
            <button class="close-btn" @click="showConfirmModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              {{ confirmAction === 'approve' 
                ? 'Bạn có chắc chắn muốn duyệt đơn hàng này?' 
                : 'Bạn có chắc chắn muốn từ chối đơn hàng này?' }}
            </p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showConfirmModal = false">Hủy</button>
              <button 
                :class="['submit-btn', confirmAction === 'approve' ? 'approve' : 'reject']"
                @click="handleConfirmAction"
                :disabled="loading"
              >
                {{ loading ? 'Đang xử lý...' : (confirmAction === 'approve' ? 'Duyệt' : 'Từ chối') }}
              </button>
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
  name: 'PendingOrders',
  data() {
    return {
      pendingOrders: [],
      selectedOrder: {},
      showDetailsModal: false,
      showConfirmModal: false,
      confirmAction: null,
      loading: false,
      error: null
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

    async loadPendingOrders() {
      try {
        this.loading = true
        const response = await orderService.getOrders()
        this.pendingOrders = response.data.filter(order => order.orderStatus === 'pending')
      } catch (error) {
        console.error('Error loading pending orders:', error)
        this.error = 'Không thể tải danh sách đơn hàng chờ duyệt'
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải danh sách đơn hàng chờ duyệt'
        })
      } finally {
        this.loading = false
      }
    },

    showDetails(order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    },

    approveOrder(order) {
      this.selectedOrder = order
      this.confirmAction = 'approve'
      this.showConfirmModal = true
    },

    rejectOrder(order) {
      this.selectedOrder = order
      this.confirmAction = 'reject'
      this.showConfirmModal = true
    },

    async handleConfirmAction() {
      try {
        this.loading = true
        await orderService.updateOrderStatus(this.selectedOrder._id, {
          orderStatus: this.confirmAction === 'approve' ? 'processing' : 'cancelled',
          paymentStatus: this.selectedOrder.paymentStatus
        })

        await this.loadPendingOrders()
        this.showConfirmModal = false
        eventBus.emit('show-toast', {
          type: 'success',
          message: this.confirmAction === 'approve' 
            ? 'Đã duyệt đơn hàng thành công'
            : 'Đã từ chối đơn hàng'
        })
      } catch (error) {
        console.error('Error:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi xử lý đơn hàng'
        })
      } finally {
        this.loading = false
      }
    }
  },
  created() {
    this.loadPendingOrders()
  }
}
</script>

<style scoped>
.pending-orders {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
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

.icon-btn.approve {
  background: #dcfce7;
  color: #166534;
}

.icon-btn.reject {
  background: #fee2e2;
  color: #991b1b;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.submit-btn {
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
  color: white;
}

.submit-btn.approve {
  background: #22c55e;
}

.submit-btn.reject {
  background: #ef4444;
}

.submit-btn:hover {
  opacity: 0.9;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
  }

  .detail-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style> 