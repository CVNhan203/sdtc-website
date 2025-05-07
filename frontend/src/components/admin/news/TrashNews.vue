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
            <th>STT</th>
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
          <tr v-for="(news, index) in filteredNews" :key="news._id">
            <!-- Checkbox chọn từng dòng -->
            <td>
              <input 
                type="checkbox" 
                :checked="isSelected(news._id)"
                @change="toggleSelect(news._id)"
              >
            </td>
            <td>{{ index + 1 }}</td>
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
@import "@/styles/admin.css";

/* Component specific styles */
th:nth-child(1), 
td:nth-child(1) {
  width: 50px; /* Checkbox */
}

th:nth-child(2), 
td:nth-child(2) {
  width: 200px; /* ID */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(3), 
td:nth-child(3) {
  width: 100px; /* Ảnh */
}

th:nth-child(4), 
td:nth-child(4) {
  width: 150px; /* Tiêu đề */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(5), 
td:nth-child(5) {
  width: 100px; /* Loại */
}

th:nth-child(6), 
td:nth-child(6) {
  width: 120px; /* Tác giả */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(7), 
td:nth-child(7) {
  width: 150px; /* Ngày xóa */
}

th:nth-child(8), 
td:nth-child(8) {
  width: 100px; /* Thao tác */
  text-align: center;
}

.news-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin: 0 auto;
  display: block;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.no-image {
  color: var(--text-tertiary);
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bulk-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-action-btn.restore {
  background-color: var(--primary-color);
  color: white;
}

.bulk-action-btn.restore:hover {
  background-color: var(--primary-hover);
}

.bulk-action-btn.delete {
  background-color: var(--danger-color);
  color: white;
}

.bulk-action-btn.delete:hover {
  background-color: var(--danger-hover);
}

.icon-btn.restore {
  background-color: #dcfce7;
  color: #166534;
}

.icon-btn.restore:hover {
  background-color: #bbf7d0;
}

.icon-btn.delete {
  background-color: var(--danger-color);
  color: white;
}

.icon-btn.delete:hover {
  background-color: var(--danger-hover);
}

.empty-message {
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--spacing-lg);
  font-style: italic;
}

.action-column {
  text-align: center;
}

th input[type="checkbox"],
td input[type="checkbox"] {
  margin: 0 auto;
  display: block;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

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
</style> 