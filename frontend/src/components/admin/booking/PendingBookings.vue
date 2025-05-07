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
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Dịch vụ</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in pendingBookings" :key="booking._id">
            <td>{{ booking.fullName }}</td>
            <td>{{ booking.email }}</td>
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
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  created() {
    this.fetchBookings();
  }
};
</script>

<style scoped>
@import "@/styles/admin.css";
</style> 