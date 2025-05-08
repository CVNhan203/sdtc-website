<template>
  <div class="admin-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div>Đang tải dữ liệu...</div>
    </div>
    <div v-else-if="error" class="error-container">
      <div class="error-message">{{ error }}</div>
      <button class="retry-btn" @click="fetchBookings">Thử lại</button>
    </div>
    <div v-else-if="pendingBookings.length === 0" class="empty-state">
      <i class="fas fa-calendar-check"></i>
      <span>Không có đặt lịch nào đang chờ xử lý</span>
    </div>
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Họ tên</th>
            <!-- <th>Email</th> -->
            <th>Số điện thoại</th>
            <th>Dịch vụ</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in pendingBookings" :key="booking._id">
            <td>{{ booking.fullName }}</td>
            <!-- <td>{{ booking.email }}</td> -->
            <td>{{ booking.phone }}</td>
            <td>{{ booking.service }}</td>
            <td>{{ formatDate(booking.createdAt) }}</td>
            <td class="actions-cell">
              <div class="actions">
                <button @click="viewDetails(booking)" class="icon-btn info" title="Xem chi tiết">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="updateStatus(booking._id, 'completed')" class="icon-btn edit" title="Hoàn thành">
                  <i class="fas fa-check"></i>
                </button>
                <button @click="updateStatus(booking._id, 'cancelled')" class="icon-btn delete" title="Hủy">
                  <i class="fas fa-times"></i>
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
            <label>Số điện thoại:</label>
            <p>{{ selectedBooking.phone }}</p>
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
            <label>Ngày đặt:</label>
            <p>{{ formatDate(selectedBooking.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bookingService } from '@/api/services/bookingService';

export default {
  name: 'PendingBookings',
  data() {
    return {
      bookings: [],
      selectedBooking: null,
      loading: false,
      error: null
    };
  },
  computed: {
    pendingBookings() {
      return this.bookings.filter(booking => booking.status === 'processing');
    }
  },
  methods: {
    async fetchBookings() {
      try {
        this.loading = true;
        this.error = null;
        const response = await bookingService.getAllBookings();
        this.bookings = response.data || [];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        this.error = 'Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(id, status) {
      try {
        this.loading = true;
        await bookingService.updateBookingStatus(id, status);
        await this.fetchBookings();
        this.selectedBooking = null;
      } catch (error) {
        console.error('Error updating status:', error);
        this.error = 'Không thể cập nhật trạng thái. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    viewDetails(booking) {
      this.selectedBooking = booking;
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
    }
  },
  created() {
    this.fetchBookings();
  }
};
</script>

<style scoped>
.admin-container {
  padding: 2rem;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

th, td {
  padding: 1rem;
  text-align: center; /* căn giữa nội dung */
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

tr:hover {
  background-color: #f8f9fa;
}

/* căn giữa các nút thao tác */
.actions-cell {
  width: 150px;
  text-align: center; /* căn giữa cell */
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center; /* căn giữa các nút */
  align-items: center;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  transform: translateY(-1px);
}

.info {
  background-color: #e3f2fd;
  color: #1976d2;
}

.edit {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.delete {
  background-color: #ffebee;
  color: #c62828;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 95%;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: flex-start;
  transition: background-color 0.2s;
}

.detail-item:hover {
  background-color: #f8f9fa;
}

.detail-item label {
  font-weight: 600;
  color: #495057;
  width: 150px;
  flex-shrink: 0;
}

.detail-item p {
  margin: 0;
  color: #2c3e50;
  line-height: 1.6;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #343a40;
  background-color: #e9ecef;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background-color: #0056b3;
}
</style>