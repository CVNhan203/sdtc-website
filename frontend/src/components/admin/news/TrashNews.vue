<template>
  <div class="trash-news">
    <div class="header-actions">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tiêu đề..."
          @input="handleSearch"
        >
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

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th width="40px">
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
            <th>Thao tác</th>
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
            <td>{{ news._id }}</td>
            <td>
              <img 
                v-if="news.image" 
                :src="getImageUrl(news.image)" 
                alt="News image" 
                class="news-image"
              />
              <span v-else class="no-image">No image</span>
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
      baseImageUrl: 'http://localhost:3000'
    }
  },
  computed: {
    filteredNews() {
      return this.news.filter(news => {
        if (!news.isDeleted) return false;
        if (!this.searchQuery) return true;
        return news.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
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
        month: '2-digit',
        day: '2-digit',
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
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
}

.bulk-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bulk-action-btn.restore {
  background-color: #48bb78;
  color: white;
}

.bulk-action-btn.delete {
  background-color: #f56565;
  color: white;
}

.bulk-action-btn:hover {
  opacity: 0.9;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.news-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  color: #a0aec0;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-btn.restore {
  background-color: #48bb78;
  color: white;
}

.icon-btn.delete {
  background-color: #f56565;
  color: white;
}

.icon-btn:hover {
  opacity: 0.9;
}

.empty-message {
  text-align: center;
  color: #718096;
  padding: 24px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #718096;
}

.modal-body {
  padding: 16px;
}

.warning-text {
  color: #e53e3e;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background: #edf2f7;
  border: none;
  color: #4a5568;
}

.submit-btn {
  background: #48bb78;
  border: none;
  color: white;
}

.delete-btn {
  background: #f56565;
  border: none;
  color: white;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn:hover {
  background: #38a169;
}

.delete-btn:hover {
  background: #e53e3e;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  th:nth-child(2),
  td:nth-child(2) {
    display: none;
  }

  .bulk-action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 