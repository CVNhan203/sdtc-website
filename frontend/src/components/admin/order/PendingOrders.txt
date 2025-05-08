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
              <!-- <th>Mã đơn hàng</th> -->
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
              <!-- <td>{{ order._id }}</td> -->
              <td>{{ order.fullName }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.email }}</td>
              <td>{{ order.paymentMethod }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td class="actions" style="height: 120px !important">
                <div class="action-buttons">
                  <button class="icon-btn info" @click="showDetails(order)" title="Xem chi tiết">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <button class="icon-btn approve" @click="approveOrder(order)" title="Duyệt đơn">
                    <i class="fas fa-check"></i>
                  </button>
                  <button class="icon-btn reject" @click="rejectOrder(order)" title="Từ chối">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pendingOrders.length === 0">
              <td colspan="7" class="no-data">Không có đơn hàng nào chờ duyệt</td>
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
      <div class="modal" v-if="showConfirmModal" >
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ confirmAction === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối' }}</h3>
            <button class="close-btn" @click="showConfirmModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              {{
                confirmAction === 'approve'
                  ? 'Bạn có chắc chắn muốn duyệt đơn hàng này?'
                  : 'Bạn có chắc chắn muốn từ chối đơn hàng này?'
              }}
            </p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showConfirmModal = false">Hủy</button>
              <button
                :class="['submit-btn', confirmAction === 'approve' ? 'approve' : 'reject']"
                @click="handleConfirmAction"
                :disabled="loading"
              >
                {{ loading ? 'Đang xử lý...' : confirmAction === 'approve' ? 'Duyệt' : 'Từ chối' }}
              </button>
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
  name: 'PendingOrders',
  data() {
    return {
      pendingOrders: [],
      selectedOrder: {},
      showDetailsModal: false,
      showConfirmModal: false,
      confirmAction: null,
      loading: false,
      error: null,
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj)) return '';
        // Định dạng: dd/MM/yyyy - HH:mm
        const datePart = dateObj.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const timePart = dateObj.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        });
        return `${datePart} - ${timePart}`;
      } catch (error) {
        return '';
      }
    },

    async loadPendingOrders() {
      try {
        this.loading = true
        const response = await orderService.getOrders()
        this.pendingOrders = response.data.filter((order) => order.orderStatus === 'pending')
      } catch (error) {
        console.error('Error loading pending orders:', error)
        this.error = 'Không thể tải danh sách đơn hàng chờ duyệt'
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải danh sách đơn hàng chờ duyệt',
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
          paymentStatus: this.selectedOrder.paymentStatus,
        })

        await this.loadPendingOrders()
        this.showConfirmModal = false
        eventBus.emit('show-toast', {
          type: 'success',
          message:
            this.confirmAction === 'approve'
              ? 'Đã duyệt đơn hàng thành công'
              : 'Đã từ chối đơn hàng',
        })
      } catch (error) {
        console.error('Error:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi xử lý đơn hàng',
        })
      } finally {
        this.loading = false
      }
    },
  },
  created() {
    this.loadPendingOrders()
  },
}
</script>

<style scoped>
@import '@/styles/admin.css';

/* Component specific styles */
.pending-orders {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}

/* Column widths */
th:nth-child(1),
td:nth-child(1) {
  width: 60px; /* STT */
}

th:nth-child(2),
td:nth-child(2) {
  width: 200px; /* Mã đơn hàng */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(3),
td:nth-child(3) {
  width: 130px; /* Tên khách hàng */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(4),
td:nth-child(4) {
  width: 120px; /* Số điện thoại */
}

th:nth-child(5),
td:nth-child(5) {
  width: 150px; /* Email */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(6),
td:nth-child(6) {
  width: 150px; /* Phương thức thanh toán */
}

th:nth-child(7),
td:nth-child(7) {
  width: 180px; /* Ngày tạo */
}

th:nth-child(8),
td:nth-child(8) {
  width: 140px; /* Thao tác */
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
}

.icon-btn.approve {
  background: #dcfce7;
  color: #166534;
}

.icon-btn.approve:hover {
  background: #bbf7d0;
}

.icon-btn.reject {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.reject:hover {
  background: #fecaca;
}

.no-data {
  text-align: center;
  color: var(--text-tertiary);
  font-style: italic;
  padding: 2rem 0;
}

/* Modal specific overrides */
.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-section h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: 1rem;
}

.detail-item {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-item p {
  margin: 0;
  color: #1f2937;
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
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn.approve {
  background: var(--success-color);
  color: white;
}

.submit-btn.approve:hover {
  background: var(--success-hover);
}

.submit-btn.reject {
  background: var(--danger-color);
  color: white;
}

.submit-btn.reject:hover {
  background: var(--danger-hover);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
