<template>
  <div class="admin-container">
    <div class="actions-header">
      <div class="search-section">
        <div class="filter-box">
          <select v-model="statusFilter">
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div class="search-box">
          <input
            v-model="search"
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại, dịch vụ..."
          />
          <i class="fas fa-search"></i>
        </div>
      </div>
      <div class="right-section">
        <router-link to="/admin/dat-lich/cho-xu-ly" class="pending-btn">
          <i class="fas fa-clock"></i>
          Đặt lịch chờ xử lý
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div>Đang tải dữ liệu...</div>
    </div>
    <div v-else-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button class="retry-btn" @click="fetchBookings">Thử lại</button>
    </div>
    <div v-else-if="filteredBookings.length === 0" class="empty-state">
      <i class="fas fa-calendar-times"></i>
      <span>Không có đặt lịch nào phù hợp</span>
    </div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Họ tên</th>
            <!-- <th>Email</th> -->
            <!-- <th>Số điện thoại</th> -->
            <th>Dịch vụ</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in filteredBookings" :key="booking._id">
            <td>{{ index + 1 }}</td>
            <td>{{ booking.fullName }}</td>
            <!-- <td>{{ booking.email }}</td> -->
            <!-- <td>{{ booking.phone }}</td> -->
            <td>{{ booking.service }}</td>
            <td>
              <span :class="['status-badge', booking.status]">
                {{ getStatusText(booking.status) }}
              </span>
            </td>
            <td>{{ formatDate(booking.createdAt) }}</td>
            <td class="actions-cell">
              <div class="actions">
                <button @click="viewDetails(booking)" class="icon-btn info" title="Xem chi tiết">
                  <i class="fas fa-info-circle"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal chi tiết -->
    <div v-if="selectedBooking" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chi tiết đặt lịch</h3>
          <button @click="selectedBooking = null" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-item">
            <label>Họ tên:</label>
            <p>{{ selectedBooking.fullName }}</p>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <p>{{ selectedBooking.email }}</p>
          </div>
          <div class="detail-item">
            <label>Dịch vụ:</label>
            <p>{{ selectedBooking.service }}</p>
          </div>
          <div class="detail-item">
            <label>Ghi chú:</label>
            <p>{{ selectedBooking.note || 'Không có' }}</p>
          </div>
          <div class="detail-item">
            <label>Trạng thái:</label>
            <span :class="['status-badge', selectedBooking.status]">
              {{ getStatusText(selectedBooking.status) }}
            </span>
          </div>
          <div class="detail-item">
            <label>Ngày đặt:</label>
            <p>{{ formatDate(selectedBooking.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bookingService } from '@/api/services/bookingService'

export default {
  name: 'BookingList',
  data() {
    return {
      bookings: [],
      selectedBooking: null,
      loading: false,
      error: null,
      search: '',
      statusFilter: 'all',
    }
  },
  computed: {
    filteredBookings() {
      let filtered = this.bookings.filter(
        (b) => b.status === 'completed' || b.status === 'cancelled'
      )
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter((b) => b.status === this.statusFilter)
      }
      if (this.search) {
        const s = this.search.toLowerCase()
        filtered = filtered.filter(
          (b) =>
            (b.fullName && b.fullName.toLowerCase().includes(s)) ||
            (b.email && b.email.toLowerCase().includes(s)) ||
            (b.phone && b.phone.toLowerCase().includes(s)) ||
            (b.service && b.service.toLowerCase().includes(s))
        )
      }
      return filtered
    },
  },
  methods: {
    async fetchBookings() {
      try {
        this.loading = true
        this.error = null
        const response = await bookingService.getAllBookings()
        this.bookings = response.data || []
      } catch (error) {
        console.error('Error fetching bookings:', error)
        this.error = 'Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.'
      } finally {
        this.loading = false
      }
    },
    viewDetails(booking) {
      this.selectedBooking = booking
    },
    getStatusText(status) {
      const statusMap = {
        processing: 'Đang xử lý',
        completed: 'Đã hoàn thành',
        cancelled: 'Đã hủy',
      }
      return statusMap[status] || status
    },
    formatDate(date) {
      const dateObj = new Date(date)
      const dateString = dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      const timeString = dateObj.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `${dateString} - ${timeString}`
    },
  },
  created() {
    this.fetchBookings()
  },
}
</script>

<style scoped>
.admin-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-direction: row-reverse; /* Reverse the order of search and filter */
}

.right-section {
  display: flex;
  align-items: center;
}

.search-box {
  position: relative;
  width: 360px;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.filter-box {
  width: 200px;
}

.filter-box select {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-box select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.pending-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.pending-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 16px;
  text-align: center; /* căn giữa nội dung */
  border-bottom: 1px solid #e2e8f0;
}

/* căn giữa các nút thao tác */
.actions-cell {
  width: 100px;
  text-align: center; /* căn giữa cell */
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center; /* căn giữa các nút */
  align-items: center;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

td {
  color: #1e293b;
  font-size: 14px;
}

tr:hover {
  background-color: #f9fafb;
}

.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.completed {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background-color: #fee2e2;
  color: #991b1b;
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

.icon-btn:hover {
  background-color: #f1f5f9;
}

/* Modal and Details Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-header {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.modal-body {
  padding: 24px;
}

.detail-item {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: start;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  width: 100%;
  overflow: hidden; /* Ngăn nội dung lấn ra ngoài */
}

.detail-item p {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 32px;
  display: block;
  word-break: break-word; /* Thay đổi từ word-wrap sang word-break */
  white-space: pre-wrap;
  max-width: 100%;
  height: auto;
  overflow-x: hidden; /* Ngăn cuộn ngang */
  width: 100%; /* Đảm bảo chiều rộng 100% trong container */
  box-sizing: border-box; /* Tính padding vào width */
}

.close-btn {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  transform: rotate(90deg);
}

select{
    padding: 10px 32px 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
    min-width: 160px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url(data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e);
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.loading-container {
  text-align: center;
  padding: 48px;
  color: #64748b;
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.error-container {
  text-align: center;
  padding: 48px;
  color: #ef4444;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #64748b;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
