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
            />
          </div>
        </div>

        <!-- Nút khôi phục hàng loạt - chỉ hiển thị khi có mục được chọn -->
        <button
          v-if="selectedNews.length > 0"
          class="bulk-action-btn restore"
          @click="confirmBulkRestore"
        >
          <i class="fas fa-rotate-left"></i>
          Khôi phục đã chọn
        </button>

        <!-- Nút xóa vĩnh viễn hàng loạt - chỉ hiển thị khi có mục được chọn -->
        <button
          v-if="selectedNews.length > 0"
          class="bulk-action-btn delete"
          @click="confirmBulkDelete"
        >
          <i class="fas fa-trash"></i>
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
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
            </th>
            <th>No.</th>
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
              />
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
            <td>{{ currentDate }}</td>
            <!-- Các nút thao tác cho từng dòng -->
            <td>
              <div class="actions">
                <button class="icon-btn restore" @click="confirmRestore(news)" title="Khôi phục">
                  <i class="fas fa-rotate-left"></i>
                </button>
                <button class="icon-btn delete" @click="confirmDelete(news)" title="Xóa vĩnh viễn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <!-- Hiển thị thông báo khi không có dữ liệu -->
          <tr v-if="filteredNews.length === 0">
            <td colspan="8" class="empty-message">Không có tin tức nào trong thùng rác</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xác nhận khôi phục tin tức -->
    <div class="modal" v-if="showRestoreModal">
      <div class="modal-overlay" @click="showRestoreModal = false"></div>
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận khôi phục</h3>
          <button class="close-btn" @click="showRestoreModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>
            Bạn có chắc chắn muốn khôi phục {{ selectedNews.length > 1 ? 'các' : '' }} tin tức đã
            chọn không?
          </p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
            <button class="submit-btn" @click="handleRestore">Khôi phục</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa vĩnh viễn tin tức -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-overlay" @click="showDeleteModal = false"></div>
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xác nhận xóa vĩnh viễn</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="warning-text">Cảnh báo: Hành động này không thể hoàn tác!</p>
          <p>
            Bạn có chắc chắn muốn xóa vĩnh viễn {{ selectedNews.length > 1 ? 'các' : '' }} tin tức
            đã chọn không?
          </p>
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
import eventBus from '@/eventBus'
import newsService from '@/api/services/newsService'

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
      filterType: '', // Lọc theo loại tin tức
    }
  },
  computed: {
    // Lọc tin tức dựa trên điều kiện tìm kiếm và lọc
    filteredNews() {
      // Danh sách tin đã được lọc từ API
      let result = this.news

      // Áp dụng bộ lọc tìm kiếm theo text
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter((news) => news.title.toLowerCase().includes(query))
      }

      // Áp dụng bộ lọc theo loại tin tức
      if (this.filterType) {
        result = result.filter((news) => news.type === this.filterType)
      }

      return result
    },
    // Kiểm tra xem tất cả các mục có đang được chọn không
    isAllSelected() {
      return (
        this.filteredNews.length > 0 &&
        this.filteredNews.every((news) => this.selectedNews.includes(news._id))
      )
    },
    // New computed property to get the current date
    currentDate() {
      const d = new Date(); // Get the current date
      const day = d.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
      const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Get month (0-indexed) and pad
      const year = d.getFullYear(); // Get full year
      const hour = d.getHours().toString().padStart(2, '0')
      const minute = d.getMinutes().toString().padStart(2, '0')
      return `${day}/${month}/${year} - ${hour}:${minute}`
    },
  },
  methods: {
    // Tải danh sách tin tức đã xóa từ localStorage
    async loadNews() {
      try {
        // Lấy danh sách tin từ API thay vì localStorage
        const response = await newsService.getNewsInTrash()
        if (response && response.data) {
          this.news = response.data
        } else {
          this.news = []
        }
      } catch (error) {
        console.error('Error loading news:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải danh sách tin tức đã xóa',
        })
        this.news = []
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
        'thong-bao': 'Thông báo',
      }
      return types[type] || type
    },
    // Định dạng hiển thị ngày tháng
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    // Lấy đường dẫn đầy đủ của hình ảnh
    getImageUrl(imagePath) {
      if (!imagePath) return null
      if (imagePath.startsWith('http')) return imagePath
      const cleanPath = imagePath.replace(/^[/\\]+/, '')
      return `${this.baseImageUrl}/${cleanPath}`
    },
    // Kiểm tra xem một tin tức có đang được chọn không
    isSelected(id) {
      return this.selectedNews.includes(id)
    },
    // Bật/tắt trạng thái chọn của một tin tức
    toggleSelect(id) {
      const index = this.selectedNews.indexOf(id)
      if (index === -1) {
        this.selectedNews.push(id)
      } else {
        this.selectedNews.splice(index, 1)
      }
    },
    // Bật/tắt trạng thái chọn tất cả các tin tức
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedNews = []
      } else {
        this.selectedNews = this.filteredNews.map((news) => news._id)
      }
    },
    // Hiển thị modal xác nhận khôi phục một tin tức
    confirmRestore(news) {
      if (news) {
        this.selectedNews = [news._id]
      }
      this.showRestoreModal = true
    },
    // Hiển thị modal xác nhận xóa một tin tức
    confirmDelete(news) {
      if (news) {
        this.selectedNews = [news._id]
      }
      this.showDeleteModal = true
    },
    // Hiển thị modal xác nhận khôi phục nhiều tin tức
    confirmBulkRestore() {
      this.showRestoreModal = true
    },
    // Hiển thị modal xác nhận xóa nhiều tin tức
    confirmBulkDelete() {
      this.showDeleteModal = true
    },
    // Xử lý khôi phục tin tức
    async handleRestore() {
      try {
        // Gọi API để khôi phục các tin tức đã chọn
        for (const id of this.selectedNews) {
          try {
            await newsService.restoreNews(id);
          } catch (err) {
            console.error('Error restoring news:', err);
          }
        }

        // Cập nhật danh sách
        await this.loadNews()

        // Reset selection
        this.selectedNews = []
        this.showRestoreModal = false

        // Thông báo thành công
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Khôi phục tin tức thành công',
        })
        eventBus.emit('update-deleted-news-count')
      } catch (error) {
        console.error('Error restoring news:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi khôi phục tin tức',
        })
      }
    },
    // Xử lý xóa vĩnh viễn tin tức
    async handleDelete() {
      try {
        // Gọi API xóa vĩnh viễn từng tin tức đã chọn
        for (const id of this.selectedNews) {
          try {
            await newsService.permanentDeleteNews(id)
          } catch (err) {
            // Nếu có lỗi khi xóa từng tin, vẫn tiếp tục xóa các tin khác
            console.error('Error deleting news:', err)
          }
        }
        
        // Cập nhật danh sách
        await this.loadNews()
        
        // Reset selection và đóng modal
        this.selectedNews = []
        this.showDeleteModal = false
        
        // Thông báo thành công
        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Xóa vĩnh viễn tin tức thành công',
        })
        eventBus.emit('update-deleted-news-count')
      } catch (error) {
        console.error('Error deleting news:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi xóa tin tức',
        })
      }
    },
    // Rút gọn ID để hiển thị
    truncateId(id) {
      if (!id) return ''
      // Hiển thị 25 ký tự đầu tiên của ID, vì cột có kích thước lớn hơn
      return id.length > 25 ? id.substring(0, 25) + '...' : id
    },
  },
  // Khởi tạo dữ liệu khi component được tạo
  created() {
    this.loadNews()
  },
  // Dọn dẹp khi component bị hủy
  beforeUnmount() {
    // Cleanup if needed
  },
}
</script>

<style scoped>

@import "@/styles/admin.css";

.trash-news {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header-actions {
  margin-bottom: 24px;
}

.actions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.search-filter {
  flex: 1;
  min-width: 280px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-box input {
  padding: 10px 16px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  outline: none;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

tr:last-child td {
  border-bottom: none;
}

.bulk-action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.bulk-action-btn.restore {
  background: #0ea5e9;
  color: white;
}

.bulk-action-btn.restore:hover {
  background: #0284c7;
}

.bulk-action-btn.delete {
  background: #ef4444;
  color: white;
}

.bulk-action-btn.delete:hover {
  background: #dc2626;
}

.icon-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  /* margin: 0 4px; */ /* Xóa margin này nếu muốn căn giữa đều */
}

.icon-btn.restore {
  background: #dcfce7;
  color: #166534;
}

.icon-btn.restore:hover {
  background: #bbf7d0;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn.delete:hover {
  background: #fecaca;
}

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
.modal-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}
.modal-content {
  position: relative;
  z-index: 2;
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
}

.modal-body {
  padding: 24px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.submit-btn, .delete-btn, .cancel-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  background: #0ea5e9;
  color: white;
}

.submit-btn:hover {
  background: #0284c7;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.cancel-btn {
  background: #e2e8f0;
  color: #475569;
}

.cancel-btn:hover {
  background: #cbd5e1;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
  margin-bottom: 16px;
}

.empty-message {
  text-align: center;
  padding: 48px 0;
  color: #64748b;
  font-style: italic;
}

/* Custom checkbox styles */
input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid #cbd5e1;
  position: relative;
  transition: all 0.2s;
}

input[type="checkbox"]:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  font-size: 24px;
  margin-left: auto;
  box-shadow: none;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #ef4444;
  box-shadow: 0 0 0 2px #ef444422;
}

.close-btn i {
  font-size: 24px;
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .trash-news {
    padding: 16px;
  }

  .actions-header {
    flex-direction: column;
  }

  .search-filter {
    width: 100%;
  }

  .bulk-action-btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    margin: 0 -16px;
    border-radius: 0;
  }
}

th,
td {

  text-align: center;
  vertical-align: middle;
}

/* Căn giữa nội dung trong từng dòng */
tr {
  text-align: center;
  vertical-align: middle;
}

/* Căn giữa hình ảnh trong bảng */
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  min-width: 80px;
  min-height: 80px;
  /* Đảm bảo giữ kích thước cố định cho cell ảnh */
  box-sizing: border-box;
}

/* Căn giữa checkbox */
td input[type="checkbox"],
th input[type="checkbox"] {
  display: block;
  margin: 0 auto;
}

/* Căn giữa nút thao tác */
.action-column,
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.news-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
  /* Đảm bảo không bị nhảy lung tung */
  box-sizing: border-box;
}

.no-image {
  width: 50px;
  height: 50px;
  background: #f1f5f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  margin: 0 auto;
  text-align: center;
  font-size: 22px;
  box-sizing: border-box;
}
</style>
