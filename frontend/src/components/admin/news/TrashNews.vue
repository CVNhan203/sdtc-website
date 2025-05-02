<template>
  <div class="trash-news">
    <div class="header-actions">
      <div class="actions-header">
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
          
          <select v-model="filterType" @change="handleFilter">
            <option value="">Tất cả loại</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="su-kien">Sự kiện</option>
            <option value="thong-bao">Thông báo</option>
          </select>
        </div>
        
        <button 
          v-if="selectedNews.length > 0" 
          class="bulk-action-btn restore" 
          @click="confirmBulkRestore"
        >
          <i class="fas fa-trash-restore"></i>
          Khôi phục đã chọn
        </button>
        
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

    <div class="table-container">
      <table>
        <thead>
          <tr>
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
          <tr v-for="news in filteredNews" :key="news._id">
            <td>
              <input 
                type="checkbox" 
                :checked="isSelected(news._id)"
                @change="toggleSelect(news._id)"
              >
            </td>
            <td :title="news._id">{{ truncateId(news._id) }}</td>
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
          <tr v-if="filteredNews.length === 0">
            <td colspan="8" class="empty-message">
              Không có tin tức nào trong thùng rác
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Restore Confirmation Modal -->
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

    <!-- Delete Confirmation Modal -->
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
      news: [],
      searchQuery: '',
      selectedNews: [],
      showRestoreModal: false,
      showDeleteModal: false,
      loading: false,
      error: null,
      baseImageUrl: 'http://localhost:3000',
      filterType: ''
    }
  },
  computed: {
    filteredNews() {
      // Filter only deleted news
      let result = this.news.filter(news => news.isDeleted);
      
      // Apply text search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(news => 
          news.title.toLowerCase().includes(query)
        );
      }
      
      // Apply type filter
      if (this.filterType) {
        result = result.filter(news => news.type === this.filterType);
      }
      
      return result;
    },
    isAllSelected() {
      return this.filteredNews.length > 0 && 
             this.filteredNews.every(news => this.selectedNews.includes(news._id));
    }
  },
  methods: {
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
    handleSearch() {
      // Implement debounce if needed
    },
    handleFilter() {
      // Filter handling is reactive with computed property
    },
    formatType(type) {
      const types = {
        'tin-tuc': 'Tin tức',
        'su-kien': 'Sự kiện',
        'thong-bao': 'Thông báo'
      };
      return types[type] || type;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.replace(/^[/\\]+/, '');
      return `${this.baseImageUrl}/${cleanPath}`;
    },
    isSelected(id) {
      return this.selectedNews.includes(id);
    },
    toggleSelect(id) {
      const index = this.selectedNews.indexOf(id);
      if (index === -1) {
        this.selectedNews.push(id);
      } else {
        this.selectedNews.splice(index, 1);
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedNews = [];
      } else {
        this.selectedNews = this.filteredNews.map(news => news._id);
      }
    },
    confirmRestore(news) {
      if (news) {
        this.selectedNews = [news._id];
      }
      this.showRestoreModal = true;
    },
    confirmDelete(news) {
      if (news) {
        this.selectedNews = [news._id];
      }
      this.showDeleteModal = true;
    },
    confirmBulkRestore() {
      this.showRestoreModal = true;
    },
    confirmBulkDelete() {
      this.showDeleteModal = true;
    },
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
    truncateId(id) {
      if (!id) return '';
      // Hiển thị 25 ký tự đầu tiên của ID, vì cột có kích thước lớn hơn
      return id.length > 25 ? id.substring(0, 25) + '...' : id;
    }
  },
  created() {
    this.loadNews();
  },
  beforeUnmount() {
    // Cleanup if needed
  }
}
</script>

<style scoped>
.trash-news {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.search-filter {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  min-width: 160px;
}

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

.bulk-action-btn.restore {
  background: #e0f2fe;
  color: #0369a1;
}

.bulk-action-btn.restore:hover {
  background: #bae6fd;
}

.bulk-action-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.bulk-action-btn.delete:hover {
  background: #fecaca;
}

.table-container {
  min-width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
  min-width: 950px;
}

th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

th {
  background: #f8fafc;
  font-weight: 500;
  color: #475569;
  text-align: center;
}

th:nth-child(1), 
td:nth-child(1) {
  width: 50px;
}

th:nth-child(2), 
td:nth-child(2) {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(3), 
td:nth-child(3) {
  width: 100px;
}

th:nth-child(4), 
td:nth-child(4) {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(5), 
td:nth-child(5) {
  width: 100px;
}

th:nth-child(6), 
td:nth-child(6) {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(7), 
td:nth-child(7) {
  width: 150px;
}

th:nth-child(8), 
td:nth-child(8) {
  width: 100px;
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
  color: #a0aec0;
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

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

.icon-btn.restore {
  background: #e0f2fe;
  color: #0369a1;
}

.icon-btn.restore:hover {
  background: #bae6fd;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.delete:hover {
  background: #fecaca;
}

.empty-message {
  text-align: center;
  color: #64748b;
  padding: 2rem;
  font-style: italic;
}

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

.warning-text::before {
  content: '⚠️';
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.submit-btn:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease;
}

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

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
  font-weight: 600;
}

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

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1.5rem;
  color: #4b5563;
  line-height: 1.5;
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
</style> 