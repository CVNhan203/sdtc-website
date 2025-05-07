<template>
  <div class="payment-list">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải danh sách thanh toán...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadPayments">Thử lại</button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Search and filter toolbar -->
      <div class="actions-header">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm theo ID đơn hàng..."
              @input="handleSearch"
            />
          </div>

          <!-- Filter by payment method -->
          <select v-model="filterMethod" @change="handleFilter">
            <option value="">Tất cả phương thức</option>
            <option value="MOMO">MOMO</option>
            <option value="VNPAY">VNPAY</option>
            <option value="BANK_TRANSFER">Chuyển khoản</option>
          </select>

          <!-- Filter by status -->
          <select v-model="filterStatus" @change="handleFilter">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
      </div>

      <!-- Payments table -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th>ID Thanh toán</th>
              <th>ID Đơn hàng</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="payment in filteredPayments" :key="payment._id">
              <td>{{ payment._id }}</td>
              <td>
                <a href="#" @click.prevent="viewOrder(payment.orderId)">
                  {{ payment.orderId }}
                </a>
              </td>
              <td>{{ formatMethod(payment.method) }}</td>
              <td>
                <span :class="['status-badge', payment.status]">
                  {{ formatStatus(payment.status) }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="actions">
                  <!-- View details button -->
                  <button class="icon-btn info" @click="showDetails(payment)">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <!-- Confirm payment button (only for pending payments) -->
                  <button
                    v-if="payment.status === 'pending'"
                    class="icon-btn confirm"
                    @click="confirmPayment(payment)"
                    title="Xác nhận thanh toán"
                  >
                    <i class="fas fa-check-circle"></i>
                  </button>
                  <!-- Mark as failed button (only for pending payments) -->
                  <button
                    v-if="payment.status === 'pending'"
                    class="icon-btn reject"
                    @click="markAsFailed(payment)"
                    title="Đánh dấu thất bại"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment details modal -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Chi tiết thanh toán</h3>
            <button class="close-btn" @click="showDetailsModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-item">
              <label>ID Thanh toán:</label>
              <p>{{ selectedPayment._id }}</p>
            </div>
            <div class="detail-item">
              <label>ID Đơn hàng:</label>
              <p>{{ selectedPayment.orderId }}</p>
            </div>
            <div class="detail-item">
              <label>Phương thức:</label>
              <p>{{ formatMethod(selectedPayment.method) }}</p>
            </div>
            <div class="detail-item">
              <label>Trạng thái:</label>
              <p>
                <span :class="['status-badge', selectedPayment.status]">
                  {{ formatStatus(selectedPayment.status) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm payment modal -->
      <div class="modal" v-if="showConfirmModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Xác nhận thanh toán</h3>
            <button class="close-btn" @click="showConfirmModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng "{{ selectedPayment.orderId }}"
              không?
            </p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showConfirmModal = false">Hủy</button>
              <button class="confirm-btn" @click="handleConfirmPayment">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mark as failed modal -->
      <div class="modal" v-if="showFailedModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Đánh dấu thanh toán thất bại</h3>
            <button class="close-btn" @click="showFailedModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn đánh dấu thanh toán này là thất bại không?</p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showFailedModal = false">Hủy</button>
              <button class="reject-btn" @click="handleMarkAsFailed">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import paymentService from '@/api/services/paymentService'
import eventBus from '@/eventBus'

export default {
  name: 'PaymentList',
  setup() {
    const router = useRouter()
    const payments = ref([])
    const searchQuery = ref('')
    const filterMethod = ref('')
    const filterStatus = ref('')
    const loading = ref(false)
    const error = ref(null)
    const showDetailsModal = ref(false)
    const showConfirmModal = ref(false)
    const showFailedModal = ref(false)
    const selectedPayment = ref({})

    // Computed property for filtered payments
    const filteredPayments = computed(() => {
      let result = [...payments.value]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((payment) => payment.orderId.toLowerCase().includes(query))
      }

      // Method filter
      if (filterMethod.value) {
        result = result.filter((payment) => payment.method === filterMethod.value)
      }

      // Status filter
      if (filterStatus.value) {
        result = result.filter((payment) => payment.status === filterStatus.value)
      }

      return result
    })

    // Load payments
    const loadPayments = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await paymentService.getPayments()
        // Kiểm tra và xử lý dữ liệu trả về
        if (response.success) {
          payments.value = response.data || []
          if (payments.value.length === 0) {
            error.value = 'Không có dữ liệu thanh toán.'
          }
        } else {
          error.value = response.message || 'Có lỗi xảy ra khi tải dữ liệu.'
        }
      } catch (err) {
        console.error('Error loading payments:', err)
        error.value = 'Không thể tải danh sách thanh toán. Vui lòng thử lại sau.'
      } finally {
        loading.value = false
      }
    }

    // Format payment method
    const formatMethod = (method) => {
      const methods = {
        MOMO: 'MOMO',
        VNPAY: 'VNPAY',
        BANK_TRANSFER: 'Chuyển khoản',
      }
      return methods[method] || method
    }

    // Format payment status
    const formatStatus = (status) => {
      const statuses = {
        pending: 'Chờ thanh toán',
        paid: 'Đã thanh toán',
        failed: 'Thất bại',
      }
      return statuses[status] || status
    }

    // Show payment details
    const showDetails = (payment) => {
      selectedPayment.value = payment
      showDetailsModal.value = true
    }

    // View order details
    const viewOrder = (orderId) => {
      router.push(`/admin/don-hang/${orderId}`)
    }

    // Confirm payment
    const confirmPayment = (payment) => {
      selectedPayment.value = payment
      showConfirmModal.value = true
    }

    // Handle confirm payment
    const handleConfirmPayment = async () => {
      try {
        const response = await paymentService.confirmPayment({
          orderId: selectedPayment.value.orderId,
          method: selectedPayment.value.method,
          status: 'paid',
        })

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: response.message || 'Xác nhận thanh toán thành công',
          })
          await loadPayments()
          showConfirmModal.value = false
        } else {
          throw new Error(response.message || 'Không thể xác nhận thanh toán')
        }
      } catch (err) {
        console.error('Error confirming payment:', err)
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể xác nhận thanh toán. Vui lòng thử lại.',
        })
      }
    }

    // Mark payment as failed
    const markAsFailed = (payment) => {
      selectedPayment.value = payment
      showFailedModal.value = true
    }

    // Handle mark as failed
    const handleMarkAsFailed = async () => {
      try {
        const response = await paymentService.confirmPayment({
          orderId: selectedPayment.value.orderId,
          method: selectedPayment.value.method,
          status: 'failed',
        })

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: response.message || 'Đã đánh dấu thanh toán thất bại',
          })
          await loadPayments()
          showFailedModal.value = false
        } else {
          throw new Error(response.message || 'Không thể cập nhật trạng thái thanh toán')
        }
      } catch (err) {
        console.error('Error marking payment as failed:', err)
        eventBus.emit('show-toast', {
          type: 'error',
          message: err.message || 'Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.',
        })
      }
    }

    // Search handler
    const handleSearch = () => {
      // Filtering is handled by computed property
    }

    // Filter handler
    const handleFilter = () => {
      // Filtering is handled by computed property
    }

    onMounted(() => {
      loadPayments()
    })

    return {
      payments,
      searchQuery,
      filterMethod,
      filterStatus,
      loading,
      error,
      showDetailsModal,
      showConfirmModal,
      showFailedModal,
      selectedPayment,
      filteredPayments,
      loadPayments,
      formatMethod,
      formatStatus,
      showDetails,
      viewOrder,
      confirmPayment,
      handleConfirmPayment,
      markAsFailed,
      handleMarkAsFailed,
      handleSearch,
      handleFilter,
    }
  },
}
</script>

<style scoped>
@import '@/styles/admin.css';

/* Additional styles specific to payment list */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.pending {
  background-color: #fff8e6;
  color: #b7791f;
}

.status-badge.paid {
  background-color: #e6ffec;
  color: #1f9d55;
}

.status-badge.failed {
  background-color: #fee2e2;
  color: #dc2626;
}

.icon-btn.confirm {
  background-color: #10b981;
  color: white;
}

.icon-btn.confirm:hover {
  background-color: #059669;
}

.icon-btn.reject {
  background-color: #ef4444;
  color: white;
}

.icon-btn.reject:hover {
  background-color: #dc2626;
}

.confirm-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.confirm-btn:hover {
  background-color: #059669;
}

.reject-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.reject-btn:hover {
  background-color: #dc2626;
}

/* Responsive styles */
@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
    gap: 12px;
  }

  .search-filter select {
    width: 100%;
  }
}
</style>
