<template>
  <div class="admin-container">
    <div class="account-list">
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
      <div v-else>
        <div class="table-container">
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
      </div>

      <!-- Modal chi tiết -->
      <div v-if="selectedBooking" class="modal">
        <div class="modal-overlay" @click="selectedBooking = null"></div>
        <div class="modal-content" @click.stop>
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
  </div>
</template>

<script>
import { bookingService } from '@/api/services/bookingService'

export default {
  name: 'BookingList',
  data() {
    return {
      bookings: [], // Danh sách đặt lịch
      selectedBooking: null, // Đặt lịch được chọn để xem chi tiết
      loading: false, // Trạng thái tải dữ liệu
      error: null, // Thông báo lỗi nếu có
      search: '', // Giá trị tìm kiếm
      statusFilter: 'all', // Bộ lọc trạng thái
    }
  },
  computed: {
    filteredBookings() {
      let filtered = this.bookings.filter(
        (b) => b.status === 'completed' || b.status === 'cancelled' // Lọc các đặt lịch đã hoàn thành hoặc đã hủy
      )
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter((b) => b.status === this.statusFilter) // Lọc theo trạng thái nếu không phải 'all'
      }
      if (this.search) {
        const s = this.search.toLowerCase() // Chuyển giá trị tìm kiếm thành chữ thường
        filtered = filtered.filter(
          (b) =>
            (b.fullName && b.fullName.toLowerCase().includes(s)) || // Lọc theo họ tên
            (b.email && b.email.toLowerCase().includes(s)) || // Lọc theo email
            (b.phone && b.phone.toLowerCase().includes(s)) || // Lọc theo số điện thoại
            (b.service && b.service.toLowerCase().includes(s)) // Lọc theo dịch vụ
        )
      }
      return filtered // Trả về danh sách đã lọc
    },
  },
  methods: {
    async fetchBookings() {
      try {
        this.loading = true // Bắt đầu tải dữ liệu
        this.error = null // Đặt lại thông báo lỗi
        const response = await bookingService.getAllBookings() // Gọi dịch vụ để lấy danh sách đặt lịch
        this.bookings = response.data || [] // Cập nhật danh sách đặt lịch
      } catch (error) {
        console.error('Error fetching bookings:', error) // Ghi log lỗi
        this.error = 'Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.' // Cập nhật thông báo lỗi
      } finally {
        this.loading = false // Kết thúc quá trình tải dữ liệu
      }
    },
    viewDetails(booking) {
      this.selectedBooking = booking // Đặt lịch được chọn để xem chi tiết
    },
    getStatusText(status) {
      const statusMap = {
        processing: 'Đang xử lý', // Trạng thái đang xử lý
        completed: 'Đã hoàn thành', // Trạng thái đã hoàn thành
        cancelled: 'Đã hủy', // Trạng thái đã hủy
      }
      return statusMap[status] || status // Trả về văn bản trạng thái tương ứng
    },
    formatDate(date) {
      const dateObj = new Date(date) // Chuyển đổi chuỗi ngày thành đối tượng Date
      const dateString = dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) // Định dạng ngày
      const timeString = dateObj.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      }) // Định dạng giờ
      return `${dateString} - ${timeString}` // Trả về chuỗi ngày và giờ
    },
  },
  created() {
    this.fetchBookings() // Gọi hàm để tải danh sách đặt lịch khi component được tạo
  },
}
</script>

<style scoped>
/* Các kiểu dáng cho component */
@import "@/styles/admin.css";

.admin-container {
  background: #fff;
  min-height: 100vh; /* Chiều cao tối thiểu của container */
}

/* Các kiểu dáng cho header của danh sách đặt lịch */
.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap; /* Cho phép xuống dòng khi thiếu không gian */
}

/* Các kiểu dáng cho phần tìm kiếm */
.search-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-direction: row-reverse; /* Đảo ngược thứ tự của tìm kiếm và bộ lọc */
  flex-wrap: wrap; /* Cho phép xuống dòng khi không đủ chỗ */
}

/* Các kiểu dáng cho phần bên phải của header */
.right-section {
  display: flex;
  align-items: center;
  flex-shrink: 0; /* Ngăn không cho phần này co lại */
  min-width: 180px; /* Chiều rộng tối thiểu */
  margin-top: 12px;
}

/* Các kiểu dáng cho responsive */
@media (max-width: 900px) {
  .actions-header {
    flex-direction: column; /* Đặt các phần theo chiều dọc */
    align-items: stretch;
    gap: 12px;
  }
  .search-section {
    width: 100%; /* Chiều rộng 100% */
    justify-content: flex-start;
    gap: 10px;
  }
  .right-section {
    margin-top: 0;
    justify-content: flex-end;
    width: 100%;
  }
}

/* Các kiểu dáng cho responsive trên màn hình nhỏ hơn 600px */
@media (max-width: 600px) {
  .search-box {
    width: 100%; /* Chiều rộng 100% */
    min-width: 0;
  }
  .filter-box {
    width: 100%; /* Chiều rộng 100% */
    min-width: 0;
  }
  .right-section {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Các kiểu dáng cho ô tìm kiếm */
.search-box {
  position: relative;
  width: 360px; /* Chiều rộng của ô tìm kiếm */
}

.search-box input {
  width: 100%; /* Chiều rộng 100% */
  padding: 12px 16px 12px 40px; /* Padding cho ô nhập */
  border: 1px solid #e2e8f0; /* Đường viền */
  border-radius: 8px; /* Bo tròn góc */
  font-size: 14px; /* Kích thước chữ */
  transition: all 0.3s ease; /* Hiệu ứng chuyển tiếp */
}

.search-box input:focus {
  outline: none; /* Không có viền khi ô nhập được chọn */
  border-color: #3b82f6; /* Đổi màu viền khi chọn */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); /* Hiệu ứng bóng */
}

.search-box i {
  position: absolute;
  left: 14px; /* Vị trí biểu tượng tìm kiếm */
  top: 50%;
  transform: translateY(-50%); /* Căn giữa biểu tượng */
  color: #64748b; /* Màu sắc biểu tượng */
}

/* Các kiểu dáng cho bộ lọc */
.filter-box {
  width: 200px; /* Chiều rộng của bộ lọc */
}

.filter-box select {
    padding: 10px 32px 10px 12px; /* Padding cho ô chọn */
    border: 1px solid #e5e7eb; /* Đường viền */
    border-radius: 8px; /* Bo tròn góc */
    font-size: 14px; /* Kích thước chữ */
    background-color: white; /* Màu nền */
    cursor: pointer; /* Con trỏ khi di chuột */
    -webkit-appearance: none; /* Ẩn kiểu mặc định của trình duyệt */
    -moz-appearance: none; /* Ẩn kiểu mặc định của trình duyệt */
    appearance: none; /* Ẩn kiểu mặc định của trình duyệt */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); /* Biểu tượng mũi tên */
    background-repeat: no-repeat; /* Không lặp lại biểu tượng */
    background-position: right 8px center; /* Vị trí biểu tượng */
    background-size: 16px; /* Kích thước biểu tượng */
}

.filter-box select:focus {
  outline: none; /* Không có viền khi ô chọn được chọn */
  border-color: #3b82f6; /* Đổi màu viền khi chọn */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); /* Hiệu ứng bóng */
}

/* Các kiểu dáng cho nút chờ xử lý */
.pending-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px; /* Khoảng cách giữa biểu tượng và chữ */
  padding: 12px 20px; /* Padding cho nút */
  background-color: #3b82f6; /* Màu nền */
  color: white; /* Màu chữ */
  border: none; /* Không có đường viền */
  border-radius: 8px; /* Bo tròn góc */
  font-size: 14px; /* Kích thước chữ */
  font-weight: 500; /* Độ đậm của chữ */
  cursor: pointer; /* Con trỏ khi di chuột */
  transition: all 0.3s ease; /* Hiệu ứng chuyển tiếp */
  text-decoration: none; /* Không có gạch chân */
}

.pending-btn:hover {
  background-color: #2563eb; /* Đổi màu nền khi di chuột */
  transform: translateY(-1px); /* Hiệu ứng nhấc lên khi di chuột */
}

/* Các kiểu dáng cho bảng */
.table-container {
  background: white; /* Màu nền của bảng */
  border-radius: 12px; /* Bo tròn góc */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng */
  overflow: hidden; /* Ẩn phần tràn ra ngoài */
}

table {
  width: 100%; /* Chiều rộng 100% */
  border-collapse: collapse; /* Gộp các đường viền */
}

th, td {
  padding: 16px; /* Padding cho ô */
  text-align: center; /* Căn giữa nội dung */
  border-bottom: 1px solid #e2e8f0; /* Đường viền dưới */
}

th {
  background-color: #f9fafb; /* Màu nền của tiêu đề */
  font-weight: 600; /* Độ đậm của chữ */
  padding: 12px 16px; /* Padding cho tiêu đề */
  border-bottom: 1px solid #e5e7eb; /* Đường viền dưới tiêu đề */
}

/* Căn giữa các nút thao tác */
.actions-cell {
  width: 100px; /* Chiều rộng của ô thao tác */
  text-align: center; /* Căn giữa cell */
}

.actions {
  display: flex;
  gap: 0.5rem; /* Khoảng cách giữa các nút */
  justify-content: center; /* Căn giữa các nút */
  align-items: center; /* Căn giữa theo chiều dọc */
}

tr:hover {
  background-color: #f9fafb; /* Đổi màu nền khi di chuột qua hàng */
}

/* Các kiểu dáng cho nhãn trạng thái */
.status-badge {
  display: inline-flex;
  padding: 6px 12px; /* Padding cho nhãn */
  border-radius: 999px; /* Bo tròn hoàn toàn */
  font-size: 13px; /* Kích thước chữ */
  font-weight: 500; /* Độ đậm của chữ */
}

.status-badge.completed {
  background-color: #dcfce7; /* Màu nền cho trạng thái đã hoàn thành */
  color: #166534; /* Màu chữ cho trạng thái đã hoàn thành */
}

.status-badge.cancelled {
  background-color: #fee2e2; /* Màu nền cho trạng thái đã hủy */
  color: #991b1b; /* Màu chữ cho trạng thái đã hủy */
}

/* Các kiểu dáng cho nút biểu tượng */
.icon-btn {
  padding: 0.5rem; /* Padding cho nút */
  border: none; /* Không có đường viền */
  border-radius: 6px; /* Bo tròn góc */
  cursor: pointer; /* Con trỏ khi di chuột */
  transition: all 0.2s ease; /* Hiệu ứng chuyển tiếp */
  width: 36px; /* Chiều rộng của nút */
  height: 36px; /* Chiều cao của nút */
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
}

.icon-btn.info {
  background-color: #dbeafe; /* Màu nền cho nút thông tin */
  color: #2563eb; /* Màu chữ cho nút thông tin */
}

.icon-btn:hover {
  background-color: #f1f5f9; /* Đổi màu nền khi di chuột */
}

/* Các kiểu dáng cho modal và chi tiết */
.modal {
  position: fixed; /* Đặt modal ở vị trí cố định */
  top: 0;
  left: 0;
  width: 100%; /* Chiều rộng 100% */
  height: 100%; /* Chiều cao 100% */
  background: rgba(0, 0, 0, 0.5); /* Nền mờ */
  display: flex; /* Hiển thị dưới dạng flex */
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  z-index: 1000; /* Đặt z-index cao để hiển thị trên các phần khác */
  padding: 24px; /* Padding cho modal */
  animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Hiệu ứng xuất hiện */
  backdrop-filter: blur(4px); /* Làm mờ nền phía sau modal */
}
.modal-overlay {
  position: absolute; /* Đặt overlay ở vị trí tuyệt đối */
  top: 0; left: 0; right: 0; bottom: 0; /* Đặt overlay phủ toàn bộ modal */
  background: rgba(0,0,0,0.5); /* Nền mờ cho overlay */
  z-index: 1; /* Đặt z-index cho overlay */
}
.modal-content {
  position: relative; /* Đặt nội dung modal ở vị trí tương đối */
  z-index: 2; /* Đặt z-index cho nội dung modal */
  background: white; /* Màu nền trắng cho nội dung modal */
  border-radius: 16px; /* Bo tròn góc */
  width: 100%; /* Chiều rộng 100% */
  max-width: 700px; /* Chiều rộng tối đa */
  max-height: 90vh; /* Chiều cao tối đa */
  overflow-y: auto; /* Cuộn dọc nếu nội dung vượt quá chiều cao */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Hiệu ứng bóng */
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Hiệu ứng trượt vào */
}

.modal-header {
  background: linear-gradient(to right, #f8fafc, #f1f5f9); /* Nền gradient cho header */
  border-bottom: 1px solid #e2e8f0; /* Đường viền dưới */
  padding: 1.5rem 2rem; /* Padding cho header */
  display: flex; /* Hiển thị dưới dạng flex */
  justify-content: space-between; /* Căn giữa các phần tử */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.modal-header h3 {
  font-size: 1.5rem; /* Kích thước chữ cho tiêu đề */
  background: linear-gradient(to right, #1e293b, #334155); /* Nền gradient cho chữ */
  -webkit-background-clip: text; /* Cắt nền cho chữ */
  -webkit-text-fill-color: transparent; /* Làm cho chữ trong suốt */
  font-weight: 700; /* Độ đậm của chữ */
  margin: 0; /* Không có margin */
  letter-spacing: -0.025em; /* Khoảng cách giữa các chữ */
}

.modal-body {
  padding: 20px; /* Padding cho nội dung modal */
}

.detail-item {
  margin-bottom: 24px; /* Khoảng cách dưới mỗi mục chi tiết */
  display: grid; /* Hiển thị dưới dạng lưới */
  grid-template-columns: 120px 1fr; /* Định nghĩa lưới với 2 cột */
  gap: 16px; /* Khoảng cách giữa các cột */
  align-items: start; /* Căn trên cho các mục */
  padding: 12px; /* Padding cho mục chi tiết */
  background-color: #f8fafc; /* Nền cho mục chi tiết */
  border-radius: 8px; /* Bo tròn góc */
  width: 100%; /* Chiều rộng 100% */
  overflow: hidden; /* Ẩn phần tràn ra ngoài */
}

.detail-item p {
  font-size: 15px; /* Kích thước chữ cho nội dung */
  color: #334155; /* Màu chữ cho nội dung */
  line-height: 1.6; /* Khoảng cách dòng */
  margin: 0; /* Không có margin */
  padding: 12px 16px; /* Padding cho nội dung */
  background: white; /* Nền trắng cho nội dung */
  border-radius: 6px; /* Bo tròn góc */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Hiệu ứng bóng */
  min-height: 32px; /* Chiều cao tối thiểu */
  display: block; /* Hiển thị dưới dạng khối */
  word-break: break-word; /* Ngăn từ bị cắt */
  white-space: pre-wrap; /* Giữ nguyên khoảng trắng */
  max-width: 100%; /* Chiều rộng tối đa */
  height: auto; /* Chiều cao tự động */
  overflow-x: hidden; /* Ngăn cuộn ngang */
  width: 100%; /* Đảm bảo chiều rộng 100% trong container */
  box-sizing: border-box; /* Tính padding vào width */
}

.close-btn {
  background: white; /* Nền trắng cho nút đóng */
  border: 1px solid #e2e8f0; /* Đường viền */
  color: #64748b; /* Màu chữ */
  width: 36px; /* Chiều rộng của nút */
  height: 36px; /* Chiều cao của nút */
  border-radius: 50%; /* Bo tròn hoàn toàn */
  display: flex; /* Hiển thị dưới dạng flex */
  align-items: center; /* Căn giữa theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều ngang */
  cursor: pointer; /* Con trỏ khi di chuột */
  transition: all 0.2s ease; /* Hiệu ứng chuyển tiếp */
}

.close-btn:hover {
  background: #ef4444; /* Đổi màu nền khi di chuột */
  color: white; /* Đổi màu chữ khi di chuột */
  border-color: #ef4444; /* Đổi màu viền khi di chuột */
  transform: rotate(90deg); /* Hiệu ứng xoay khi di chuột */
}

/* Hiệu ứng cho modal */
@keyframes modalFadeIn {
  from {
    opacity: 0; /* Bắt đầu với độ mờ 0 */
    backdrop-filter: blur(0); /* Bắt đầu với nền không mờ */
  }
  to {
    opacity: 1; /* Kết thúc với độ mờ 1 */
    backdrop-filter: blur(4px); /* Kết thúc với nền mờ */
  }
}

/* Hiệu ứng trượt cho modal */
@keyframes modalSlideIn {
  from {
    transform: translateY(-50px) scale(0.95); /* Bắt đầu từ vị trí trên và nhỏ lại */
    opacity: 0; /* Bắt đầu với độ mờ 0 */
  }
  to {
    transform: translateY(0) scale(1); /* Kết thúc ở vị trí ban đầu và kích thước bình thường */
    opacity: 1; /* Kết thúc với độ mờ 1 */
  }
}

/* Các kiểu dáng cho phần tải dữ liệu */
.loading-container {
  text-align: center; /* Căn giữa nội dung */
  padding: 48px; /* Padding cho phần tải */
  color: #64748b; /* Màu chữ */
}

/* Hiệu ứng cho vòng quay tải */
.loading-spinner {
  border: 3px solid #f3f3f3; /* Đường viền cho vòng quay */
  border-top: 3px solid #3b82f6; /* Đường viền trên màu khác */
  border-radius: 50%; /* Bo tròn hoàn toàn */
  width: 40px; /* Chiều rộng của vòng quay */
  height: 40px; /* Chiều cao của vòng quay */
  animation: spin 1s linear infinite; /* Hiệu ứng quay */
  margin: 0 auto 16px; /* Căn giữa và khoảng cách dưới */
}

/* Các kiểu dáng cho thông báo lỗi */
.error-container {
  text-align: center; /* Căn giữa nội dung */
  padding: 48px; /* Padding cho phần lỗi */
  color: #ef4444; /* Màu chữ cho thông báo lỗi */
}

/* Các kiểu dáng cho nút thử lại */
.retry-btn {
  margin-top: 16px; /* Khoảng cách trên */
  padding: 8px 16px; /* Padding cho nút */
  background-color: #ef4444; /* Màu nền cho nút */
  color: white; /* Màu chữ cho nút */
  border: none; /* Không có đường viền */
  border-radius: 6px; /* Bo tròn góc */
  cursor: pointer; /* Con trỏ khi di chuột */
  transition: all 0.3s ease; /* Hiệu ứng chuyển tiếp */
}

.retry-btn:hover {
  background-color: #dc2626; /* Đổi màu nền khi di chuột */
}

/* Các kiểu dáng cho trạng thái không có dữ liệu */
.empty-state {
  text-align: center; /* Căn giữa nội dung */
  padding: 48px; /* Padding cho phần không có dữ liệu */
  color: #64748b; /* Màu chữ */
}

.empty-state i {
  font-size: 48px; /* Kích thước biểu tượng */
  margin-bottom: 16px; /* Khoảng cách dưới biểu tượng */
  display: block; /* Hiển thị dưới dạng khối */
}

/* Hiệu ứng quay */
@keyframes spin {
  0% { transform: rotate(0deg); } /* Bắt đầu từ 0 độ */
  100% { transform: rotate(360deg); } /* Kết thúc ở 360 độ */
}

/* Các kiểu dáng cho danh sách tài khoản */
.account-list {
    padding: 20px; /* Padding cho danh sách tài khoản */
    background: #fff; /* Màu nền trắng */
    border-radius: 12px; /* Bo tròn góc */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Hiệu ứng bóng */
}
</style>