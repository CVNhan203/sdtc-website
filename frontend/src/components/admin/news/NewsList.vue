`<template>
    <div class="news-list">
      <!-- Header Actions -->
      <div class="actions-header">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm tin tức..."
              @input="handleSearch"
            >
          </div>
        </div>
  
        <button class="add-btn" @click="openAddModal">
          <i class="fas fa-plus"></i>
          Thêm tin tức mới
        </button>
      </div>
  
      <!-- News Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Ngày đăng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(news, index) in filteredNews" :key="news.id">
              <td>{{ index + 1 }}</td>
              <td>{{ news.title }}</td>
              <td class="content">{{ news.content }}</td>
              <td>{{ formatDate(news.publishDate) }}</td>
              <td>
                <span :class="['status-badge', news.status]">
                  {{ getStatusText(news.status) }}
                </span>
              </td>
              <td class="actions">
                <button class="icon-btn info" @click="showDetails(news)">
                  <i class="fas fa-info-circle"></i>
                </button>
                <button class="icon-btn edit" @click="openEditModal(news)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" @click="confirmDelete(news)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- News Details Modal -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Chi tiết tin tức</h3>
            <button class="close-btn" @click="showDetailsModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-item">
              <label>Tiêu đề:</label>
              <p>{{ selectedNews.title }}</p>
            </div>
            <div class="detail-item">
              <label>Nội dung:</label>
              <p>{{ selectedNews.content }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày đăng:</label>
              <p>{{ formatDate(selectedNews.publishDate) }}</p>
            </div>
            <div class="detail-item">
              <label>Trạng thái:</label>
              <p>
                <span :class="['status-badge', selectedNews.status]">
                  {{ getStatusText(selectedNews.status) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit News Modal -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới' }}</h3>
            <button class="close-btn" @click="showFormModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="formData.title" required>
              </div>
              <div class="form-group">
                <label>Nội dung</label>
                <textarea v-model="formData.content" required rows="6"></textarea>
              </div>
              <div class="form-group">
                <label>Ngày đăng</label>
                <input type="date" v-model="formData.publishDate" required>
              </div>
              <div class="form-group">
                <label>Trạng thái</label>
                <select v-model="formData.status">
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showFormModal = false">Hủy</button>
                <button type="submit" class="submit-btn">
                  {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div class="modal" v-if="showDeleteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Xác nhận xóa</h3>
            <button class="close-btn" @click="showDeleteModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa tin tức "{{ selectedNews.title }}" không?</p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
              <button class="delete-btn" @click="handleDelete">Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NewsList',
    data() {
      return {
        news: [
          {
            id: 1,
            title: 'Tin tức mẫu 1',
            content: 'Nội dung chi tiết của tin tức 1...',
            publishDate: '2024-03-15',
            status: 'published'
          },
          // Thêm dữ liệu mẫu khác...
        ],
        searchQuery: '',
        showDetailsModal: false,
        showFormModal: false,
        showDeleteModal: false,
        selectedNews: {},
        formData: {
          title: '',
          content: '',
          publishDate: '',
          status: 'draft'
        },
        isEditing: false
      }
    },
    computed: {
      filteredNews() {
        if (!this.searchQuery) return this.news
  
        const query = this.searchQuery.toLowerCase()
        return this.news.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        )
      }
    },
    methods: {
      formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN')
      },
      getStatusText(status) {
        const statusMap = {
          draft: 'Bản nháp',
          published: 'Đã xuất bản',
          archived: 'Đã lưu trữ'
        }
        return statusMap[status] || status
      },
      handleSearch() {
        // Implement debounce if needed
      },
      showDetails(news) {
        this.selectedNews = { ...news }
        this.showDetailsModal = true
      },
      openAddModal() {
        this.isEditing = false
        this.formData = {
          title: '',
          content: '',
          publishDate: new Date().toISOString().split('T')[0],
          status: 'draft'
        }
        this.showFormModal = true
      },
      openEditModal(news) {
        this.isEditing = true
        this.formData = { ...news }
        this.showFormModal = true
      },
      confirmDelete(news) {
        this.selectedNews = news
        this.showDeleteModal = true
      },
      async handleSubmit() {
        try {
          if (this.isEditing) {
            const index = this.news.findIndex(n => n.id === this.formData.id)
            this.news[index] = { ...this.formData }
          } else {
            const newNews = {
              ...this.formData,
              id: this.news.length + 1
            }
            this.news.push(newNews)
          }
          this.showFormModal = false
        } catch (error) {
          console.error('Error:', error)
        }
      },
      async handleDelete() {
        try {
          const index = this.news.findIndex(n => n.id === this.selectedNews.id)
          this.news.splice(index, 1)
          this.showDeleteModal = false
        } catch (error) {
          console.error('Error:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .news-list {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
  
  .actions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .search-filter {
    display: flex;
    gap: 1rem;
  }
  
  .search-box {
    position: relative;
    width: 300px;
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
  
  .add-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .add-btn:hover {
    background: #2563eb;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }
  
  .content {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .status-badge.draft {
    background: #f1f5f9;
    color: #475569;
  }
  
  .status-badge.published {
    background: #dcfce7;
    color: #166534;
  }
  
  .status-badge.archived {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .icon-btn {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .icon-btn.info {
    background: #e0f2fe;
    color: #0369a1;
  }
  
  .icon-btn.edit {
    background: #f1f5f9;
    color: #475569;
  }
  
  .icon-btn.delete {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .icon-btn:hover {
    opacity: 0.8;
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
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1e293b;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #64748b;
    cursor: pointer;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .detail-item {
    margin-bottom: 1rem;
  }
  
  .detail-item label {
    font-weight: 500;
    color: #64748b;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #475569;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
  }
  
  .form-group textarea {
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .cancel-btn,
  .submit-btn,
  .delete-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cancel-btn {
    background: #f1f5f9;
    color: #475569;
  }
  
  .submit-btn {
    background: #3b82f6;
    color: white;
  }
  
  .delete-btn {
    background: #ef4444;
    color: white;
  }
  
  .submit-btn:hover {
    background: #2563eb;
  }
  
  .delete-btn:hover {
    background: #dc2626;
  }
  
  .cancel-btn:hover {
    background: #e2e8f0;
  }
  
  @media (max-width: 768px) {
    .actions-header {
      flex-direction: column;
      gap: 1rem;
    }
  
    .search-filter {
      width: 100%;
    }
  
    .search-box {
      width: 100%;
    }
  
    .add-btn {
      width: 100%;
      justify-content: center;
    }
  
    .modal-content {
      margin: 1rem;
    }
  }
  </style>`