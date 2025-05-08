<template>
  <div class="admin-container">
    <div class="actions-header">
      <div class="search-box">
        <input v-model="search" type="text" placeholder="Tìm kiếm theo tên, email, số điện thoại, dịch vụ..." />
        <i class="fas fa-search"></i>
      </div>
      <div class="filter-box">
        <select v-model="statusFilter">
          <option value="all">Tất cả trạng thái</option>
          <option value="completed">Đã hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
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
            <th>STT</th>
            <th>Họ tên</th>
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
                  <i class="fas fa-eye"></i>
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
import { bookingService } from '@/api/services/bookingService';

export default {
  name: 'BookingList',
  data() {
    return {
      bookings: [],
      selectedBooking: null,
      loading: false,
      error: null,
      search: '',
      statusFilter: 'all'
    };
  },
  computed: {
    filteredBookings() {
      let filtered = this.bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(b => b.status === this.statusFilter);
      }
      if (this.search) {
        const s = this.search.toLowerCase();
        filtered = filtered.filter(b =>
          (b.fullName && b.fullName.toLowerCase().includes(s)) ||
          (b.email && b.email.toLowerCase().includes(s)) ||
          (b.phone && b.phone.toLowerCase().includes(s)) ||
          (b.service && b.service.toLowerCase().includes(s))
        );
      }
      return filtered;
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
    viewDetails(booking) {
      this.selectedBooking = booking;
    },
    getStatusText(status) {
      const statusMap = {
        processing: 'Đang xử lý',
        completed: 'Đã hoàn thành',
        cancelled: 'Đã hủy'
      };
      return statusMap[status] || status;
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

select{
  padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    min-width: 160px;
}

.search-box {
  position: relative;
  width: 320px;
  max-width: 100%;
}
.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}
.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}
.filter-box {
  width: 180px;
  margin-left: 16px;
}
.filter-box select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}
</style>