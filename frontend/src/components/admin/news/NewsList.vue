<template>
    <div class="news-list">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Đang tải danh sách tin tức...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button class="retry-btn" @click="loadNews">Thử lại</button>
      </div>

      <template v-else>
        <!-- Header Actions -->
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
            
            <div class="filter-box">
              <select v-model="filterType" @change="handleFilter">
                <option value="">Tất cả loại</option>
                <option value="tin-tuc">Tin tức</option>
                <option value="su-kien">Sự kiện</option>
                <option value="thong-bao">Thông báo</option>
              </select>
            </div>
          </div>
        </div>
    
        <!-- News Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Tóm tắt</th>
                <th>Nội dung</th>
                <th>Loại</th>
                <th>Tác giả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="news in filteredNews" :key="news._id">
                <td>{{ news._id }}</td>
                <td>
                  <div class="image-container">
                    <template v-if="news.image">
                      <img 
                        :src="getImageUrl(news.image)" 
                        :alt="news.title"
                        class="news-image"
                        @error="handleImageError($event, news._id)"
                        v-show="!imageLoadError[news._id]"
                      />
                      <div v-show="imageLoadError[news._id]" class="no-image">
                        <i class="fas fa-image"></i>
                      </div>
                    </template>
                    <div v-else class="no-image">
                      <i class="fas fa-image"></i>
                    </div>
                  </div>
                </td>
                <td>{{ news.title }}</td>
                <td class="content">{{ formatDescription(news.summary) }}</td>
                <td class="content">{{ formatDescription(news.content) }}</td>
                <td>{{ formatType(news.type) }}</td>
                <td>{{ news.author }}</td>
                <td class="actions-cell">
                  <div class="actions">
                    <button class="icon-btn info" @click="showDetails(news)">
                      <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="icon-btn edit" @click="openEditModal(news)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="!news.isDeleted"
                      class="icon-btn delete" 
                      @click="confirmSoftDelete(news)"
                      title="Chuyển vào thùng rác"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                    <button 
                      v-else
                      class="icon-btn restore" 
                      @click="confirmRestore(news)"
                      title="Khôi phục"
                    >
                      <i class="fas fa-trash-restore"></i>
                    </button>
                    <button 
                      v-if="news.isDeleted"
                      class="icon-btn permanent-delete" 
                      @click="confirmPermanentDelete(news)"
                      title="Xóa vĩnh viễn"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
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
                <label>ID:</label>
                <p>{{ selectedNews._id }}</p>
              </div>
              <div class="detail-item">
                <label>Ảnh:</label>
                <img 
                  v-if="selectedNews.image" 
                  :src="getImageUrl(selectedNews.image)" 
                  alt="News image" 
                  class="detail-image"
                />
                <span v-else class="no-image">No image</span>
              </div>
              <div class="detail-item">
                <label>Tiêu đề:</label>
                <p>{{ selectedNews.title }}</p>
              </div>
              <div class="detail-item">
                <label>Tóm tắt:</label>
                <p>{{ selectedNews.summary }}</p>
              </div>
              <div class="detail-item">
                <label>Nội dung:</label>
                <p>{{ selectedNews.content }}</p>
              </div>
              <div class="detail-item">
                <label>Loại:</label>
                <p>{{ formatType(selectedNews.type) }}</p>
              </div>
              <div class="detail-item">
                <label>Tác giả:</label>
                <p>{{ selectedNews.author }}</p>
              </div>
              <div class="detail-item">
                <label>Ngày đăng:</label>
                <p>{{ formatDate(selectedNews.publishedDate) }}</p>
              </div>
              <div class="detail-item">
                <label>Trạng thái:</label>
                <p>
                  <span :class="['status-badge', selectedNews.isDeleted ? 'inactive' : 'active']">
                    {{ selectedNews.isDeleted ? 'Đã xóa' : 'Đã đăng' }}
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
                  <label>Tóm tắt</label>
                  <textarea v-model="formData.summary" required rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>Nội dung chi tiết</label>
                  <textarea v-model="formData.content" required rows="6"></textarea>
                </div>
                <div class="form-group">
                  <label>Phân loại</label>
                  <select v-model="formData.type" required>
                    <option value="">Chọn phân loại</option>
                    <option value="tin-tuc">Tin tức</option>
                    <option value="su-kien">Sự kiện</option>
                    <option value="thong-bao">Thông báo</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Tác giả</label>
                  <input type="text" v-model="formData.author" required>
                </div>
                <div class="form-group">
                  <label>Ngày đăng</label>
                  <input type="date" v-model="formData.publishedDate" required>
                </div>
                <div class="form-group">
                  <label>Ảnh</label>
                  <div class="image-upload">
                    <input 
                      type="file" 
                      accept="image/*"
                      @change="handleImageUpload"
                    >
                    <div v-if="imagePreview" class="image-preview">
                      <img :src="imagePreview" alt="Preview">
                      <button type="button" class="remove-image" @click="imagePreview = null">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                      <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
                    </div>
                  </div>
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
        <div class="modal" v-if="showSoftDeleteModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Xác nhận chuyển vào thùng rác</h3>
              <button class="close-btn" @click="showSoftDeleteModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <p>Bạn có chắc chắn muốn chuyển tin tức "{{ selectedNews.title }}" vào thùng rác không?</p>
              <div class="form-actions">
                <button class="cancel-btn" @click="showSoftDeleteModal = false">Hủy</button>
                <button class="delete-btn" @click="handleSoftDelete">Chuyển vào thùng rác</button>
              </div>
            </div>
          </div>
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
              <p>Bạn có chắc chắn muốn khôi phục tin tức "{{ selectedNews.title }}" không?</p>
              <div class="form-actions">
                <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
                <button class="submit-btn" @click="handleRestore">Khôi phục</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Permanent Delete Confirmation Modal -->
        <div class="modal" v-if="showPermanentDeleteModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Xác nhận xóa vĩnh viễn</h3>
              <button class="close-btn" @click="showPermanentDeleteModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <p class="warning-text">Cảnh báo: Hành động này không thể hoàn tác!</p>
              <p>Bạn có chắc chắn muốn xóa vĩnh viễn tin tức "{{ selectedNews.title }}" không?</p>
              <div class="form-actions">
                <button class="cancel-btn" @click="showPermanentDeleteModal = false">Hủy</button>
                <button class="permanent-delete-btn" @click="handlePermanentDelete">Xóa vĩnh viễn</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
  import newsService from '@/api/news/newsService'
  import eventBus from '@/eventBus'
  import { useRouter } from 'vue-router'

  export default {
    name: 'NewsList',
    setup() {
      const news = ref([])
      const searchQuery = ref('')
      const filterType = ref('')
      const showDetailsModal = ref(false)
      const showFormModal = ref(false)
      const showSoftDeleteModal = ref(false)
      const showRestoreModal = ref(false)
      const showPermanentDeleteModal = ref(false)
      const selectedNews = ref({})
      const formData = ref({
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        author: '',
        publishedDate: '',
        isDeleted: false
      })
      const imagePreview = ref(null)
      const uploadProgress = ref(0)
      const loading = ref(false)
      const error = ref(null)
      const isEditing = ref(false)
      const baseImageUrl = ref('http://localhost:3000/api')
      const imageLoadError = ref({})
      const router = useRouter()

      const filteredNews = computed(() => {
        let filtered = [...news.value]
        
        // Lọc bỏ tin đã xóa
        filtered = filtered.filter(item => !item.isDeleted)
        
        // Tìm kiếm theo tiêu đề
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query)
          )
        }

        // Lọc theo loại
        if (filterType.value) {
          filtered = filtered.filter(item => 
            item.type === filterType.value
          )
        }

        return filtered
      })

      const loadNews = async () => {
        loading.value = true
        error.value = null
        
        try {
          const response = await newsService.getNews()
          // Lấy danh sách đã xóa từ localStorage
          const deletedNewsInfo = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]')
          const deletedIds = deletedNewsInfo.map(item => item._id)
          // Lọc bỏ các tin đã xóa và lấy data từ response.data.data
          news.value = response.data.data.filter(item => !deletedIds.includes(item._id))
        } catch (err) {
          console.error('Error loading news:', err)
          error.value = 'Không thể tải danh sách tin tức. Vui lòng thử lại sau.'
        } finally {
          loading.value = false
        }
      }

      const handleSearch = () => {
        // Thực hiện tìm kiếm thông qua computed property
      }

      const handleFilter = () => {
        // Thực hiện lọc thông qua computed property
      }

      const showDetails = (item) => {
        selectedNews.value = item
        showDetailsModal.value = true
      }

      const openEditModal = (news) => {
        router.push(`/admin/tin-tuc/chinh-sua/${news._id}`)
      }

      const confirmSoftDelete = (item) => {
        selectedNews.value = item
        showSoftDeleteModal.value = true
      }

      const confirmRestore = (item) => {
        selectedNews.value = item
        showRestoreModal.value = true
      }

      const confirmPermanentDelete = (item) => {
        selectedNews.value = item
        showPermanentDeleteModal.value = true
      }

      const handleSoftDelete = async () => {
        try {
          const newsToDelete = news.value.find(n => n._id === selectedNews.value._id)
          if (newsToDelete) {
            // Lưu vào thùng rác
            const deletedNewsInfo = {
              ...newsToDelete,
              isDeleted: true,
              deletedAt: new Date().toISOString()
            }
            const deletedNewsInfoList = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]')
            deletedNewsInfoList.push(deletedNewsInfo)
            localStorage.setItem('deletedNewsInfo', JSON.stringify(deletedNewsInfoList))

            // Xóa khỏi danh sách hiện tại
            news.value = news.value.filter(n => n._id !== selectedNews.value._id)

            showSoftDeleteModal.value = false
            eventBus.emit('update-deleted-news-count')
            
            eventBus.emit('show-toast', {
              type: 'success',
              message: 'Đã chuyển tin tức vào thùng rác'
            })
          }
        } catch (error) {
          console.error('Error:', error)
          eventBus.emit('show-toast', {
            type: 'error',
            message: 'Có lỗi xảy ra khi chuyển tin tức vào thùng rác'
          })
        }
      }

      const handleRestore = async () => {
        try {
          await newsService.restoreNews(selectedNews.value._id)
          await loadNews()
          showRestoreModal.value = false
        } catch (error) {
          console.error('Error:', error)
        }
      }

      const handlePermanentDelete = async () => {
        try {
          await newsService.permanentDeleteNews(selectedNews.value._id)
          await loadNews()
          showPermanentDeleteModal.value = false
        } catch (error) {
          console.error('Error:', error)
        }
      }

      const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
          formData.value.image = file
          imagePreview.value = URL.createObjectURL(file)
        }
      }

      const getImageUrl = (imagePath) => {
        if (!imagePath) {
          console.log('No image path provided')
          return null
        }
        // Kiểm tra xem path có phải là URL đầy đủ không
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
          console.log('Full URL:', imagePath)
          return imagePath
        }
        // Xử lý đường dẫn ảnh
        const cleanPath = imagePath.replace(/^[/\\]+/, '')
        const fullUrl = `${baseImageUrl.value}/news/images/${cleanPath}`
        console.log('Image path:', imagePath)
        console.log('Clean path:', cleanPath)
        console.log('Full URL:', fullUrl)
        return fullUrl
      }

      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN')
      }

      const formatType = (type) => {
        const types = {
          'tin-tuc': 'Tin tức',
          'su-kien': 'Sự kiện',
          'thong-bao': 'Thông báo'
        }
        return types[type] || type
      }

      const formatDescription = (text) => {
        return text?.length > 100 ? text.slice(0, 100) + '...' : text
      }

      const openAddModal = () => {
        isEditing.value = false
        formData.value = {
          title: '',
          summary: '',
          content: '',
          image: null,
          type: '',
          publishedDate: new Date().toISOString().split('T')[0],
          author: '',
          view: 0,
          like: 0,
          isDeleted: false
        }
        imagePreview.value = null
        uploadProgress.value = 0
        showFormModal.value = true
      }

      const handleSubmit = async () => {
        try {
          if (isEditing.value) {
            await newsService.updateNews(selectedNews.value._id, formData.value)
          } else {
            await newsService.createNews(formData.value)
          }
          await loadNews()
          showFormModal.value = false
          imagePreview.value = null
          uploadProgress.value = 0
        } catch (err) {
          console.error('Error:', err)
          error.value = isEditing.value 
            ? 'Không thể cập nhật tin tức. Vui lòng thử lại sau.'
            : 'Không thể tạo tin tức mới. Vui lòng thử lại sau.'
        }
      }

      const handleDelete = async () => {
        try {
          await newsService.deleteNews(selectedNews.value._id)
          await loadNews()
          showSoftDeleteModal.value = false
        } catch (err) {
          console.error('Error:', err)
          error.value = 'Không thể xóa tin tức. Vui lòng thử lại sau.'
        }
      }

      const handleImageError = (event, newsId) => {
        if (event) event.target.src = '' // Clear the broken image source
        imageLoadError.value[newsId] = true
      }

      onMounted(() => {
        loadNews()
        // Listen for updates from TrashNews
        eventBus.on('update-deleted-news-count', () => {
          loadNews()
        })
        console.log('Base Image URL:', baseImageUrl.value)
      })

      onBeforeUnmount(() => {
        // Cleanup event listeners
        eventBus.off('update-deleted-news-count')
        // Cleanup image previews
        if (imagePreview.value) {
          URL.revokeObjectURL(imagePreview.value)
        }
      })

      return {
        news,
        searchQuery,
        filterType,
        showDetailsModal,
        showFormModal,
        showSoftDeleteModal,
        showRestoreModal,
        showPermanentDeleteModal,
        selectedNews,
        formData,
        imagePreview,
        uploadProgress,
        loading,
        error,
        isEditing,
        filteredNews,
        handleSearch,
        handleFilter,
        showDetails,
        openEditModal,
        confirmSoftDelete,
        confirmRestore,
        confirmPermanentDelete,
        handleSoftDelete,
        handleRestore,
        handlePermanentDelete,
        handleImageUpload,
        getImageUrl,
        formatDate,
        formatType,
        formatDescription,
        openAddModal,
        handleSubmit,
        handleDelete,
        imageLoadError,
        handleImageError
      }
    }
  }
  </script>
  
  <style scoped>
  /* Import font Roboto */
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

  /* Apply Roboto font to all elements */
  *{
    font-family: 'Roboto', sans-serif
  }

  .news-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    overflow-x: auto;
  }

  .actions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .search-filter {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .search-box {
    position: relative;
    flex: 2;
  }

  .search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }

  .search-box input {
    width: 90%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .search-box input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .filter-box {
    flex: 1;
  }

  .filter-box select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    background-color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .filter-box select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .table-container {
    margin-top: 1rem;
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  td {
    font-size: 0.95rem;
    color: #1e293b;
  }

  .image-container {
    width: 60px;
    height: 60px;
    position: relative;
    margin: 0 auto;
  }

  .news-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    transition: transform 0.3s ease;
  }

  .news-image:hover {
    transform: scale(1.1);
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 8px;
    border: 2px dashed #e2e8f0;
    color: #94a3b8;
  }

  .no-image i {
    font-size: 1.5rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .icon-btn:hover {
    transform: translateY(-1px);
  }

  .icon-btn.info {
    background: #e0f2fe;
    color: #0369a1;
  }

  .icon-btn.info:hover {
    background: #bae6fd;
  }

  .icon-btn.edit {
    background: #f1f5f9;
    color: #475569;
  }

  .icon-btn.edit:hover {
    background: #e2e8f0;
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
    padding: 1rem;
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

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border-radius: 12px 12px 0 0;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1e293b;
    font-weight: 600;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    background: none;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
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
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-group textarea {
    min-height: 120px;
    resize: vertical;
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
    transition: all 0.3s ease;
    min-width: 100px;
  }

  .cancel-btn {
    background: #f1f5f9;
    color: #475569;
  }

  .cancel-btn:hover {
    background: #e2e8f0;
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

  .warning-text {
    color: #dc2626;
    background: #fee2e2;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
    border-left: 4px solid #dc2626;
  }

  .warning-text::before {
    content: '⚠️';
  }

  /* Loading & Error States */
  .loading-container,
  .error-container {
    text-align: center;
    padding: 2rem;
  }

  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .retry-btn {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    background: #2563eb;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .search-filter {
      flex-direction: column;
    }

    .search-box,
    .filter-box {
      flex: none;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .actions-header {
      flex-direction: column;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions button {
      width: 100%;
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 640px) {
    .news-list {
      padding: 1rem;
    }

    th, td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }

    .image-container {
      width: 50px;
      height: 50px;
    }

    .modal-content {
      margin: 0;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }

  /* Custom Scrollbar */
  .table-container::-webkit-scrollbar,
  .modal-content::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .table-container::-webkit-scrollbar-track,
  .modal-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .table-container::-webkit-scrollbar-thumb,
  .modal-content::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .table-container::-webkit-scrollbar-thumb:hover,
  .modal-content::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  </style>