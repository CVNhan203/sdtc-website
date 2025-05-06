<template>
  <!-- Thùng rác chứa các tin tức đã xóa tạm thời -->
  <div class="trash-news">
    <!-- Phần header với công cụ tìm kiếm và các nút hành động hàng loạt -->
    <div class="header-actions">
      <div class="actions-header">
        <!-- Khu vực tìm kiếm và lọc -->
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm theo tiêu đề..."
              @input="handleSearch"
            >
          </div>
          
          <!-- Lọc theo loại tin tức -->
          <select v-model="filterType" @change="handleFilter">
            <option value="">Tất cả loại</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="su-kien">Sự kiện</option>
            <option value="thong-bao">Thông báo</option>
          </select>
        </div>
        
        <!-- Nút khôi phục hàng loạt - chỉ hiển thị khi có mục được chọn -->
        <button 
          v-if="selectedNews.length > 0" 
          class="bulk-action-btn restore" 
          @click="confirmBulkRestore"
        >
          <i class="fas fa-trash-restore"></i>
          Khôi phục đã chọn
        </button>
        
        <!-- Nút xóa vĩnh viễn hàng loạt - chỉ hiển thị khi có mục được chọn -->
        <button 
          v-if="selectedNews.length > 0" 
          class="bulk-action-btn delete" 
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash-alt"></i>
          Xóa vĩnh viễn đã chọn
        </button>
      </div>
    </div>

    <!-- Bảng danh sách tin tức trong thùng rác -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <!-- Cột checkbox chọn tất cả -->
            <th width="50px">
              <input 
                type="checkbox" 
                :checked="isAllSelected"
                @change="toggleSelectAll"
              >
            </th>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Loại</th>
            <th>Tác giả</th>
            <th>Ngày xóa</th>
            <th class="action-column">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <!-- Hiển thị từng dòng tin tức -->
          <tr v-for="news in filteredNews" :key="news._id">
            <!-- Checkbox chọn từng dòng -->
            <td>
              <input 
                type="checkbox" 
                :checked="isSelected(news._id)"
                @change="toggleSelect(news._id)"
              >
            </td>
            <td :title="news._id">{{ truncateId(news._id) }}</td>
            <!-- Ảnh đại diện tin tức -->
            <td>
              <div class="image-container">
                <img 
                  v-if="news.image" 
                  :src="getImageUrl(news.image)" 
                  alt="News image" 
                  class="news-image"
                />
                <div v-else class="no-image">
                  <i class="fas fa-image"></i>
                </div>
              </div>
            </td>
            <td>{{ news.title }}</td>
            <td>{{ formatType(news.type) }}</td>
            <td>{{ news.author }}</td>
            <td>{{ formatDate(news.deletedAt) }}</td>
            <!-- Các nút thao tác cho từng dòng -->
            <td>
              <div class="actions">
                <button 
                  class="icon-btn restore" 
                  @click="confirmRestore(news)"
                  title="Khôi phục"
                >
                  <i class="fas fa-trash-restore"></i>
                </button>
                <button 
                  class="icon-btn delete" 
                  @click="confirmDelete(news)"
                  title="Xóa vĩnh viễn"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          <!-- Hiển thị thông báo khi không có dữ liệu -->
          <tr v-if="filteredNews.length === 0">
            <td colspan="8" class="empty-message">
              Không có tin tức nào trong thùng rác
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xác nhận khôi phục tin tức -->
    <div class="modal" v-if="showRestoreModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận khôi phục</h3>
          <button class="close-btn" @click="showRestoreModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn khôi phục {{ selectedNews.length > 1 ? 'các' : '' }} tin tức đã chọn không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
            <button class="submit-btn" @click="handleRestore">Khôi phục</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa vĩnh viễn tin tức -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận xóa vĩnh viễn</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">Cảnh báo: Hành động này không thể hoàn tác!</p>
          <p>Bạn có chắc chắn muốn xóa vĩnh viễn {{ selectedNews.length > 1 ? 'các' : '' }} tin tức đã chọn không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
            <button class="delete-btn" @click="handleDelete">Xóa vĩnh viễn</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/eventBus';

export default {
  name: 'AdminTrashNews',
  data() {
    return {
      news: [], // Danh sách tin tức đã xóa
      searchQuery: '', // Chuỗi tìm kiếm
      selectedNews: [], // Danh sách ID tin tức đã chọn
      showRestoreModal: false, // Điều khiển hiển thị modal khôi phục
      showDeleteModal: false, // Điều khiển hiển thị modal xóa
      loading: false, // Trạng thái đang tải
      error: null, // Lưu thông tin lỗi nếu có
      baseImageUrl: 'http://localhost:3000', // URL cơ sở để hiển thị hình ảnh
      filterType: '' // Lọc theo loại tin tức
    }
  },
  computed: {
    // Lọc tin tức dựa trên điều kiện tìm kiếm và lọc
    filteredNews() {
      // Lọc chỉ những tin đã xóa
      let result = this.news.filter(news => news.isDeleted);
      
      // Áp dụng bộ lọc tìm kiếm theo text
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(news => 
          news.title.toLowerCase().includes(query)
        );
      }
      
      // Áp dụng bộ lọc theo loại tin tức
      if (this.filterType) {
        result = result.filter(news => news.type === this.filterType);
      }
      
      return result;
    },
    // Kiểm tra xem tất cả các mục có đang được chọn không
    isAllSelected() {
      return this.filteredNews.length > 0 && 
             this.filteredNews.every(news => this.selectedNews.includes(news._id));
    }
  },
  methods: {
    // Tải danh sách tin tức đã xóa từ localStorage
    async loadNews() {
      try {
        // Lấy thông tin tin tức đã xóa từ localStorage
        const deletedNewsInfo = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]');
        this.news = deletedNewsInfo;
      } catch (error) {
        console.error('Error loading news:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải danh sách tin tức đã xóa'
        });
      }
    },
    // Xử lý sự kiện tìm kiếm
    handleSearch() {
      // Triển khai debounce nếu cần
    },
    // Xử lý sự kiện lọc
    handleFilter() {
      // Việc lọc được xử lý tự động qua computed property
    },
    // Định dạng hiển thị loại tin tức
    formatType(type) {
      const types = {
        'tin-tuc': 'Tin tức',
        'su-kien': 'Sự kiện',
        'thong-bao': 'Thông báo'
      };
      return types[type] || type;
    },
    // Định dạng hiển thị ngày tháng
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    // Lấy đường dẫn đầy đủ của hình ảnh
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.replace(/^[/\\]+/, '');
      return `${this.baseImageUrl}/${cleanPath}`;
    },
    // Kiểm tra xem một tin tức có đang được chọn không
    isSelected(id) {
      return this.selectedNews.includes(id);
    },
    // Bật/tắt trạng thái chọn của một tin tức
    toggleSelect(id) {
      const index = this.selectedNews.indexOf(id);
      if (index === -1) {
        this.selectedNews.push(id);
      } else {
        this.selectedNews.splice(index, 1);
      }
    },
    // Bật/tắt trạng thái chọn tất cả các tin tức
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedNews = [];
      } else {
        this.selectedNews = this.filteredNews.map(news => news._id);
      }
    },
    // Hiển thị modal xác nhận khôi phục một tin tức
    confirmRestore(news) {
      if (news) {
        this.selectedNews = [news._id];
      }
      this.showRestoreModal = true;
    },
    // Hiển thị modal xác nhận xóa một tin tức
    confirmDelete(news) {
      if (news) {
        this.selectedNews = [news._id];
      }
      this.showDeleteModal = true;
    },
    // Hiển thị modal xác nhận khôi phục nhiều tin tức
    confirmBulkRestore() {
      this.showRestoreModal = true;
    },
    // Hiển thị modal xác nhận xóa nhiều tin tức
    confirmBulkDelete() {
      this.showDeleteModal = true;
    },
    // Xử lý khôi phục tin tức
    async handleRestore() {
      try {
        // Khôi phục các tin tức đã chọn
        const deletedNewsInfoList = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]');
        const remainingNews = deletedNewsInfoList.filter(
          news => !this.selectedNews.includes(news._id)
        );
        localStorage.setItem('deletedNewsInfo', JSON.stringify(remainingNews));
        
        // Cập nhật danh sách hiện tại
        this.news = remainingNews;
        
        // Reset selection
        this.selectedNews = [];
        this.showRestoreModal = false;
        
        // Thông báo thành công
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Khôi phục tin tức thành công'
        });
        eventBus.emit('update-deleted-news-count');
      } catch (error) {
        console.error('Error restoring news:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi khôi phục tin tức'
        });
      }
    },
    // Xử lý xóa vĩnh viễn tin tức
    async handleDelete() {
      try {
        // Xóa vĩnh viễn các tin tức đã chọn
        const deletedNewsInfoList = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]');
        const remainingNews = deletedNewsInfoList.filter(
          news => !this.selectedNews.includes(news._id)
        );
        localStorage.setItem('deletedNewsInfo', JSON.stringify(remainingNews));
        
        // Cập nhật danh sách hiện tại
        this.news = remainingNews;
        
        // Reset selection
        this.selectedNews = [];
        this.showDeleteModal = false;
        
        // Thông báo thành công
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Xóa vĩnh viễn tin tức thành công'
        });
        eventBus.emit('update-deleted-news-count');
      } catch (error) {
        console.error('Error deleting news:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi xóa tin tức'
        });
      }
    },
    // Rút gọn ID để hiển thị
    truncateId(id) {
      if (!id) return '';
      // Hiển thị 25 ký tự đầu tiên của ID, vì cột có kích thước lớn hơn
      return id.length > 25 ? id.substring(0, 25) + '...' : id;
    }
  },
  // Khởi tạo dữ liệu khi component được tạo
  created() {
    this.loadNews();
  },
  // Dọn dẹp khi component bị hủy
  beforeUnmount() {
    // Cleanup if needed
  }
}
</script>

<style scoped>
/* Container chính cho thùng rác */
.trash-news {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

/* Khu vực header chứa các công cụ */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Các hành động ở phần header */
.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

/* Khu vực tìm kiếm và lọc */
.search-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Hộp tìm kiếm */
.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

/* Icon trong hộp tìm kiếm */
.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

/* Input tìm kiếm */
.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

/* Dropdown select */
select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  min-width: 160px;
}

/* Nút hành động hàng loạt */
.bulk-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

/* Nút khôi phục hàng loạt */
.bulk-action-btn.restore {
  background: #e0f2fe;
  color: #0369a1;
}

/* Hiệu ứng hover cho nút khôi phục */
.bulk-action-btn.restore:hover {
  background: #bae6fd;
}

/* Nút xóa hàng loạt */
.bulk-action-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

/* Hiệu ứng hover cho nút xóa */
.bulk-action-btn.delete:hover {
  background: #fecaca;
}

/* Container bảng dữ liệu */
.table-container {
  min-width: 100%;
  overflow-x: auto;
}

/* Bảng dữ liệu */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
  min-width: 950px;
}

/* Ô và header trong bảng */
th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

/* Header của bảng */
th {
  background: #f8fafc;
  font-weight: 500;
  color: #475569;
  text-align: center;
}

/* Cột checkbox */
th:nth-child(1), 
td:nth-child(1) {
  width: 50px;
}

/* Cột ID */
th:nth-child(2), 
td:nth-child(2) {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Cột ảnh */
th:nth-child(3), 
td:nth-child(3) {
  width: 100px;
}

/* Cột tiêu đề */
th:nth-child(4), 
td:nth-child(4) {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Cột loại */
th:nth-child(5), 
td:nth-child(5) {
  width: 100px;
}

/* Cột tác giả */
th:nth-child(6), 
td:nth-child(6) {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Cột ngày xóa */
th:nth-child(7), 
td:nth-child(7) {
  width: 150px;
}

/* Cột hành động */
th:nth-child(8), 
td:nth-child(8) {
  width: 100px;
  text-align: center;
}

/* Hình ảnh tin tức */
.news-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin: 0 auto;
  display: block;
}

/* Container chứa hình ảnh */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Kiểu hiển thị khi không có ảnh */
.no-image {
  color: #a0aec0;
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Khu vực chứa các nút hành động */
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Nút icon */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

/* Nút khôi phục */
.icon-btn.restore {
  background: #e0f2fe;
  color: #0369a1;
}

/* Hiệu ứng hover cho nút khôi phục */
.icon-btn.restore:hover {
  background: #bae6fd;
}

/* Nút xóa */
.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

/* Hiệu ứng hover cho nút xóa */
.icon-btn.delete:hover {
  background: #fecaca;
}

/* Thông báo khi không có dữ liệu */
.empty-message {
  text-align: center;
  color: #64748b;
  padding: 2rem;
  font-style: italic;
}

/* Văn bản cảnh báo */
.warning-text {
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 8px;
  border-left: 4px solid #dc2626;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Icon cảnh báo */
.warning-text::before {
  content: '⚠️';
}

/* Khu vực nút trong form */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* Các nút trong form */
.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

/* Nút hủy */
.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
}

/* Hiệu ứng hover cho nút hủy */
.cancel-btn:hover {
  background: #e5e7eb;
}

/* Nút xác nhận/gửi */
.submit-btn {
  background: #3b82f6;
  color: white;
}

/* Hiệu ứng hover cho nút xác nhận */
.submit-btn:hover {
  background: #2563eb;
}

/* Nút xóa */
.delete-btn {
  background: #ef4444;
  color: white;
}

/* Hiệu ứng hover cho nút xóa */
.delete-btn:hover {
  background: #dc2626;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .bulk-action-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Kiểu dáng Modal */
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

/* Nội dung của modal */
.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease;
}

/* Hiệu ứng hiện modal */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Phần header của modal */
.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Tiêu đề của modal */
.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
  font-weight: 600;
}

/* Nút đóng modal */
.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

/* Hiệu ứng hover cho nút đóng */
.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

/* Phần body của modal */
.modal-body {
  padding: 1.5rem;
}

/* Đoạn văn bản trong modal */
.modal-body p {
  margin: 0 0 1.5rem;
  color: #4b5563;
  line-height: 1.5;
}

/* Cột chứa các hành động */
.action-column {
  text-align: center;
}

/* Checkbox trong bảng */
th input[type="checkbox"],
td input[type="checkbox"] {
  margin: 0 auto;
  display: block;
  cursor: pointer;
  width: 18px;
  height: 18px;
}
</style> 