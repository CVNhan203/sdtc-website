<template>
  <!-- Container chính quản lý danh sách tin tức -->
  <div class="news-list">
    <!-- Hiển thị trạng thái đang tải -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải danh sách tin tức...</p>
    </div>

    <!-- Hiển thị khi có lỗi -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="loadNews">Thử lại</button>
    </div>

    <!-- Nội dung chính - hiển thị khi không có lỗi và đã tải xong -->
    <template v-else>
      <!-- Thanh công cụ tìm kiếm và lọc -->
      <div class="actions-header">
        <div class="actions-left">
          <div class="search-filter">
            <div class="search-box">
              <!-- Icon tìm kiếm -->
              <i class="fas fa-search"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm theo tiêu đề..."
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- New buttons for Insert and Trash -->
          <div class="action-buttons">
            <button class="action-btn add" @click="$router.push('/admin/tin-tuc/them-moi')">
              <i class="fas fa-plus"></i>
              Thêm tin tức
            </button>
            <button class="action-btn trash" @click="$router.push('/admin/tin-tuc/thung-rac')">
              <i class="fas fa-trash-alt"></i>
              Thùng rác
            </button>
          </div>
        </div>
      </div>

      <!-- Bảng danh sách tin tức -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th style="width: 70px;">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  style="cursor:pointer"
                />
              </th>
              <th style="width:6%;">No.</th>
              <th>Ảnh</th>
              <th style="max-width: 250px">Tiêu đề</th>
              <th>Loại</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <!-- Hiển thị từng dòng tin tức -->
            <tr v-for="(news, index) in filteredNews" :key="news._id">
              <td>
                <input
                  type="checkbox"
                  :checked="isSelected(news._id)"
                  @change="toggleSelect(news._id)"
                  style="cursor:pointer"
                />
              </td>
              <td class="news-id">{{ index + 1 }}</td>
              <!-- Ảnh đại diện tin tức -->
              <td>
                <div class="image-container">
                  <img
                    v-if="news.image"
                    :src="getImageUrl(news.image)"
                    alt="News image"
                    class="news-image"
                    @error="handleImageError($event, news._id)"
                  />
                  <div v-else class="no-image">
                    <i class="fas fa-image"></i>
                  </div>
                </div>
              </td>
              <td class="truncate-text" style="max-width: 250px">{{ news.title }}</td>
              <td class="type-cell">{{ news.type }}</td>
              <td class="actions-cell" style="height: 120px !important;">
                <div class="actions">
                  <!-- Nút xem chi tiết -->
                  <button class="icon-btn info" @click="showDetails(news)">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <!-- Nút chỉnh sửa - kiểm tra quyền sửa dựa vào tác giả -->
                  <button 
                    class="icon-btn edit" 
                    @click="canEditNews(news) ? openEditModal(news) : showPermissionError('sửa')"
                    :class="{ 'disabled': !canEditNews(news) }"
                    :title="canEditNews(news) ? 'Chỉnh sửa' : 'Bạn không có quyền sửa bài viết này'"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <!-- Nút xóa tạm thời (chuyển vào thùng rác) - kiểm tra quyền xóa -->
                  <button
                    v-if="!news.isDeleted"
                    class="icon-btn delete"
                    @click="canDeleteNews(news) ? confirmSoftDelete(news) : showPermissionError('xóa')"
                    :class="{ 'disabled': !canDeleteNews(news) }"
                    :title="canDeleteNews(news) ? 'Chuyển vào thùng rác' : 'Bạn không có quyền xóa bài viết này'"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <!-- Nút khôi phục tin đã xóa - kiểm tra quyền khôi phục -->
                  <button
                    v-else
                    class="icon-btn restore"
                    @click="canEditNews(news) ? confirmRestore(news) : showPermissionError('khôi phục')"
                    :class="{ 'disabled': !canEditNews(news) }"
                    :title="canEditNews(news) ? 'Khôi phục' : 'Bạn không có quyền khôi phục bài viết này'"
                  >
                    <i class="fas fa-trash-restore"></i>
                  </button>
                  <!-- Nút xóa vĩnh viễn (chỉ hiển thị với tin đã xóa) -->
                  <button
                    v-if="news.isDeleted"
                    class="icon-btn permanent-delete"
                    @click="canDeleteNews(news) ? confirmPermanentDelete(news) : showPermissionError('xóa vĩnh viễn')"
                    :class="{ 'disabled': !canDeleteNews(news) }"
                    :title="canDeleteNews(news) ? 'Xóa vĩnh viễn' : 'Bạn không có quyền xóa bài viết này'"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal xem chi tiết tin tức -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-overlay" @click="showDetailsModal = false"></div>
        <div class="modal-content" @click.stop>
          <div class="modal-header" style="display: flex; align-items: center; justify-content: space-between;">
            <h3>Chi tiết tin tức</h3>
            <div class="modal-actions" style="margin-left: auto;">
              <button class="close-btn" @click="showDetailsModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="modal-body">
            <!-- Các trường thông tin chi tiết -->
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
              <p>{{ selectedNews.type }}</p>
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

      <!-- Modal thêm/chỉnh sửa tin tức -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-overlay" @click="closeFormModal"></div>
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ isEditing ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới' }}</h3>
            <button class="close-btn" @click="closeFormModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <!-- Form nhập/sửa thông tin tin tức -->
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="formData.title" required />
              </div>
              <div class="form-group">
                <label>Phân loại</label>
                <input 
                  type="text" 
                  v-model="formData.type" 
                  placeholder="Nhập phân loại tin tức"
                  maxlength="50"
                  required 
                />
                <span class="character-count" v-if="formData.type">
                  {{ formData.type.length }}/50
                </span>
              </div>
              <div class="form-group">
                <label>Ảnh</label>
                <div class="image-upload">
                  <!-- Input chọn file ảnh -->
                  <input type="file" accept="image/*" @change="handleImageUpload" />
                  <!-- Hiển thị xem trước ảnh đã chọn -->
                  <div v-if="imagePreview" class="image-preview">
                    <img :src="imagePreview" alt="Preview" />
                    <button type="button" class="remove-image" @click="imagePreview = null">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <!-- Hiển thị thanh tiến trình khi đang tải ảnh lên -->
                  <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                    <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Tóm tắt</label>
                <textarea v-model="formData.summary" required rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Nội dung chi tiết</label>
                <textarea v-model="formData.content" required rows="6"></textarea>
              </div>
              <!-- Các nút hành động form -->
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="closeFormModal">
                  <i class="fas fa-times"></i>
                  Hủy
                </button>
                <button type="submit" class="submit-btn">
                  <i class="fas fa-save"></i>
                  {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận xóa tạm thời -->
      <div class="modal" v-if="showSoftDeleteModal">
        <div class="modal-overlay" @click="showSoftDeleteModal = false"></div>
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Xác nhận chuyển vào thùng rác</h3>
            <button class="close-btn" @click="showSoftDeleteModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn chuyển tin tức "{{ selectedNews.title }}" vào thùng rác không?
            </p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showSoftDeleteModal = false">Hủy</button>
              <button class="delete-btn" @click="handleSoftDelete">Chuyển vào thùng rác</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận khôi phục -->
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
            <p>Bạn có chắc chắn muốn khôi phục tin tức "{{ selectedNews.title }}" không?</p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showRestoreModal = false">Hủy</button>
              <button class="submit-btn" @click="handleRestore">Khôi phục</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận xóa vĩnh viễn -->
      <div class="modal" v-if="showPermanentDeleteModal">
        <div class="modal-overlay" @click="showPermanentDeleteModal = false"></div>
        <div class="modal-content" @click.stop>
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
              <button class="permanent-delete-btn" @click="handlePermanentDelete">
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import newsService from '@/api/services/newsService'
import eventBus from '@/eventBus'

export default {
  name: 'NewsList',
  setup() {
    // Khai báo các biến phản ứng (reactive)
    const news = ref([]) // Dữ liệu tin tức
    const searchQuery = ref('') // Chuỗi tìm kiếm
    const filterType = ref('') // Loại tin cần lọc
    const showDetailsModal = ref(false) // Điều khiển hiển thị modal chi tiết
    const showFormModal = ref(false) // Điều khiển hiển thị modal form
    const showSoftDeleteModal = ref(false) // Điều khiển hiển thị modal xóa tạm thời
    const showRestoreModal = ref(false) // Điều khiển hiển thị modal khôi phục
    const showPermanentDeleteModal = ref(false) // Điều khiển hiển thị modal xóa vĩnh viễn
    const selectedNews = ref({}) // Tin tức được chọn để thao tác
    const formData = ref({
      title: '',
      summary: '',
      content: '',
      image: null,
      type: '',
      isDeleted: false,
    }) // Dữ liệu form
    const imagePreview = ref(null) // URL xem trước ảnh
    const uploadProgress = ref(0) // Tiến trình tải ảnh
    const loading = ref(false) // Trạng thái đang tải
    const error = ref(null) // Thông báo lỗi nếu có
    const isEditing = ref(false) // Trạng thái đang chỉnh sửa hay thêm mới
    const baseImageUrl = ref('http://localhost:3000') // URL cơ sở cho hình ảnh
    const imageLoadError = ref({}) // Lưu các lỗi khi tải hình ảnh
    const selectedNewsIds = ref([]) // Danh sách ID tin tức được chọn

    // Tính toán danh sách tin đã lọc
    const filteredNews = computed(() => {
      let filtered = [...news.value]

      // Lọc bỏ tin đã xóa
      filtered = filtered.filter((item) => !item.isDeleted)

      // Tìm kiếm theo tiêu đề
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter((item) => item.title.toLowerCase().includes(query))
      }

      // Lọc theo loại
      if (filterType.value) {
        filtered = filtered.filter((item) => item.type === filterType.value)
      }

      return filtered
    })

    // Chọn tất cả
    const isAllSelected = computed(() =>
      filteredNews.value.length > 0 &&
      filteredNews.value.every(news => selectedNewsIds.value.includes(news._id))
    )
    const isSelected = id => selectedNewsIds.value.includes(id)
    const toggleSelect = id => {
      const idx = selectedNewsIds.value.indexOf(id)
      if (idx === -1) selectedNewsIds.value.push(id)
      else selectedNewsIds.value.splice(idx, 1)
    }
    const toggleSelectAll = () => {
      if (isAllSelected.value) selectedNewsIds.value = []
      else selectedNewsIds.value = filteredNews.value.map(news => news._id)
    }

    // Tải danh sách tin tức từ API
    const loadNews = async () => {
      loading.value = true
      error.value = null

      try {
        console.log('Đang gọi API getNews...')
        const response = await newsService.getNews()
        console.log('Kết quả API:', response)

        // Kiểm tra cấu trúc dữ liệu trả về
        if (!response || !response.data) {
          throw new Error('Dữ liệu trả về không hợp lệ')
        }

        // Sử dụng dữ liệu từ API trực tiếp, không lọc qua localStorage
        news.value = response.data
        console.log('Filtered news:', news.value)
      } catch (err) {
        console.error('Error loading news:', err)
        error.value = 'Không thể tải danh sách tin tức. Vui lòng thử lại sau.'
      } finally {
        loading.value = false
      }
    }

    // Kiểm tra xem người dùng có quyền chỉnh sửa bài viết không
    const canEditNews = (news) => {
      // Lấy thông tin người dùng từ localStorage
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      
      // Kiểm tra xem người dùng có phải là admin không (admin có thể sửa mọi bài viết)
      if (adminInfo.role === 'admin') {
        return true;
      }
      
      // Staff chỉ có thể sửa bài viết của chính mình
      if (adminInfo.role === 'staff' && news.author === adminInfo.fullName) {
        return true;
      }
      
      // Không có quyền sửa
      return false;
    }
    
    // Kiểm tra xem người dùng có quyền xóa bài viết không
    const canDeleteNews = (news) => {
      // Xử lý tương tự như canEditNews
      return canEditNews(news);
    }
    
    // Hiển thị thông báo lỗi khi không có quyền
    const showPermissionError = (action) => {
      eventBus.emit('show-toast', {
        type: 'error',
        message: `Bạn không có quyền ${action} bài viết này.`
      });
    }

    // Xử lý sự kiện tìm kiếm
    const handleSearch = () => {
      // Thực hiện tìm kiếm thông qua computed property
    }

    // Xử lý sự kiện lọc
    const handleFilter = () => {
      // Thực hiện lọc thông qua computed property
    }

    // Hiển thị chi tiết tin tức
    const showDetails = (item) => {
      selectedNews.value = item
      showDetailsModal.value = true
    }

    // Mở modal chỉnh sửa tin tức
    const openEditModal = async (news) => {
      try {
        const newsDetail = await newsService.getNewsById(news._id)
        if (newsDetail) {
          selectedNews.value = newsDetail
          formData.value = {
            title: newsDetail.title || '',
            summary: newsDetail.summary || '',
            content: newsDetail.content || '',
            type: newsDetail.type || '',
            image: newsDetail.image || null,
            isDeleted: newsDetail.isDeleted || false
          }
          
          if (newsDetail.image) {
            imagePreview.value = getImageUrl(newsDetail.image)
          } else {
            imagePreview.value = null
          }
          
          isEditing.value = true
          showFormModal.value = true
          // Không cần hiệu ứng khi sửa
          setTimeout(() => {
            const modal = document.querySelector('.modal-content')
            if (modal) modal.classList.add('no-animation')
          }, 0)
        }
      } catch (error) {
        console.error('Error fetching news details:', error)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Không thể tải thông tin tin tức. Vui lòng thử lại sau.'
        })
      }
    }

    // Hiển thị modal xác nhận xóa tạm thởi
    const confirmSoftDelete = (item) => {
      selectedNews.value = item
      showSoftDeleteModal.value = true
    }

    // Hiển thị modal xác nhận khôi phục
    const confirmRestore = (item) => {
      selectedNews.value = item
      showRestoreModal.value = true
    }

    // Hiển thị modal xác nhận xóa vĩnh viễn
    const confirmPermanentDelete = (item) => {
      selectedNews.value = item
      showPermanentDeleteModal.value = true
    }

    // Xử lý xóa tạm thời tin tức (chuyển vào thùng rác)
    const handleSoftDelete = async () => {
      try {
        // Gọi API để cập nhật trạng thái isDeleted thành true trong database
        await newsService.deleteNews(selectedNews.value._id);
        
        // Làm mới danh sách tin tức sau khi xóa
        await loadNews();
        
        showSoftDeleteModal.value = false;
        eventBus.emit('update-deleted-news-count');

        eventBus.emit('show-toast', {
          type: 'success',
          message: 'Đã chuyển tin tức vào thùng rác',
        });
      } catch (error) {
        console.error('Error:', error);
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Có lỗi xảy ra khi chuyển tin tức vào thùng rác',
        });
      }
    };

    // Xử lý khôi phục tin tức từ thùng rác
    const handleRestore = async () => {
      try {
        await newsService.restoreNews(selectedNews.value._id)
        await loadNews()
        showRestoreModal.value = false
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // Xử lý xóa vĩnh viễn tin tức
    const handlePermanentDelete = async () => {
      try {
        await newsService.permanentDeleteNews(selectedNews.value._id)
        await loadNews()
        showPermanentDeleteModal.value = false
      } catch (error) {
        console.error('Error:', error)
      }
    }

    // Xử lý sự kiện tải ảnh lên
    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // Kiểm tra kích thước file (10MB limit)
      const maxFileSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxFileSize) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: `Kích thước file không được vượt quá 10MB`
        })
        event.target.value = ''
        return
      }
      
      // Kiểm tra loại file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF'
        })
        event.target.value = ''
        return
      }
      
      // Kiểm tra kích thước ảnh
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        
        // Kiểm tra kích thước tối thiểu
        if (img.width < 300 || img.height < 200) {
          eventBus.emit('show-toast', {
            type: 'error',
            message: 'Kích thước ảnh quá nhỏ (tối thiểu 300x200 pixels)'
          })
          event.target.value = ''
          formData.value.image = null
          imagePreview.value = null
          return
        }
        
        // Kiểm tra kích thước tối đa
        if (img.width > 2000 || img.height > 2000) {
          eventBus.emit('show-toast', {
            type: 'error',
            message: 'Kích thước ảnh quá lớn (tối đa 2000x2000 pixels)'
          })
          event.target.value = ''
          formData.value.image = null
          imagePreview.value = null
          return
        }
        
        // Lưu ảnh vào form data
        formData.value.image = file
        if (imagePreview.value) {
          URL.revokeObjectURL(imagePreview.value)
        }
        imagePreview.value = URL.createObjectURL(file)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'File không phải là ảnh hợp lệ'
        })
        event.target.value = ''
        formData.value.image = null
        imagePreview.value = null
      }
      
      img.src = URL.createObjectURL(file)
    }

    // Lấy URL đầy đủ của ảnh
    const getImageUrl = (imagePath) => {
      if (!imagePath) return null
      if (imagePath.startsWith('http')) return imagePath
      const cleanPath = imagePath.replace(/^[/\\]+/, '')
      return `${baseImageUrl.value}/${cleanPath}`
    }

    // Định dạng hiển thị ngày tháng
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    // Rút gọn nội dung mô tả để hiển thị
    const formatDescription = (text) => {
      return text?.length > 50 ? text.slice(0, 50) + '...' : text
    }

    // Mở modal thêm tin tức mới
    const openAddModal = () => {
      isEditing.value = false
      formData.value = {
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        view: 0,
        like: 0,
        isDeleted: false,
      }
      imagePreview.value = null
      uploadProgress.value = 0
      showFormModal.value = true
    }

    // Xử lý gửi form thêm/chỉnh sửa tin tức
    const handleSubmit = async () => {
      try {
        // Chuẩn bị dữ liệu để gửi lên server
        const newsData = {
          title: (formData.value.title || '').trim(),
          summary: (formData.value.summary || '').trim(),
          content: (formData.value.content || '').trim(),
          type: (formData.value.type || '').trim(),
          // Không gửi publishedDate nếu không có giá trị hợp lệ
          // Không gửi các trường không cần thiết
        };

        // Xử lý ảnh
        if (formData.value.image instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append('image', formData.value.image);

          try {
            const uploadResponse = await newsService.uploadImage(imageFormData);
            if (uploadResponse && uploadResponse.imagePath) {
              newsData.image = uploadResponse.imagePath;
            } else {
              throw new Error('Không nhận được đường dẫn ảnh sau khi upload');
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            eventBus.emit('show-toast', {
              type: 'error',
              message: 'Lỗi khi tải ảnh lên. Vui lòng thử lại.'
            });
            return;
          }
        } else if (typeof formData.value.image === 'string') {
          newsData.image = formData.value.image;
        }

        // Thêm author nếu backend yêu cầu (lấy từ localStorage hoặc mặc định)
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
        newsData.author = adminInfo.fullName || 'Admin';

        // Gửi dữ liệu lên server
        if (isEditing.value) {
          await newsService.updateNews(selectedNews.value._id, newsData);
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Cập nhật tin tức thành công!'
          });
        } else {
          await newsService.createNews(newsData);
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Tạo tin tức mới thành công!'
          });
        }

        await loadNews();
        showFormModal.value = false;
        imagePreview.value = null;
        uploadProgress.value = 0;
      } catch (err) {
        console.error('Error:', err);
        eventBus.emit('show-toast', {
          type: 'error',
          message: isEditing.value
            ? 'Không thể cập nhật tin tức. Vui lòng thử lại sau.'
            : 'Không thể tạo tin tức mới. Vui lòng thử lại sau.'
        });
      }
    }

    // Xử lý xóa tin tức
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

    // Xử lý lỗi khi tải hình ảnh
    const handleImageError = (event, newsId) => {
      if (event) {
        event.target.src = '' // Xóa nguồn ảnh bị lỗi
        event.target.style.display = 'none' // Ẩn ảnh bị lỗi
        const parent = event.target.parentElement
        if (parent) {
          parent.classList.add('no-image')
          parent.innerHTML = '<i class="fas fa-image"></i>'
        }
      }
      imageLoadError.value[newsId] = true
    }

    const openEditFromDetails = () => {
      if (!canEditNews(selectedNews.value)) {
        showPermissionError('sửa');
        return;
      }
      showDetailsModal.value = false;
      openEditModal(selectedNews.value);
    }

    // Khi đóng modal form, bỏ class no-animation để lần sau thêm mới có hiệu ứng
    const closeFormModal = () => {
      showFormModal.value = false
      setTimeout(() => {
        const modal = document.querySelector('.modal-content')
        if (modal) modal.classList.remove('no-animation')
      }, 300)
    }

    // Gọi khi component được tạo
    onMounted(() => {
      loadNews()
      // Lắng nghe sự kiện cập nhật từ TrashNews
      eventBus.on('update-deleted-news-count', () => {
        loadNews()
      })
      console.log('Base Image URL:', baseImageUrl.value)
    })

    // Dọn dẹp khi component bị hủy
    onBeforeUnmount(() => {
      // Dọn dẹp các event listener
      eventBus.off('update-deleted-news-count')
      // Dọn dẹp các URL xem trước ảnh
      if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value)
      }
    })

    // Trả về các biến và phương thức sử dụng trong template
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
      formatDescription,
      openAddModal,
      handleSubmit,
      handleDelete,
      imageLoadError,
      handleImageError,
      canEditNews,
      canDeleteNews,
      showPermissionError,
      openEditFromDetails,
      selectedNewsIds,
      isAllSelected,
      isSelected,
      toggleSelect,
      toggleSelectAll,
      closeFormModal,
    }
  },
}
</script>

<style scoped>

@import "@/styles/admin.css";

.news-list {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Header Actions */
.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.actions-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  width: 400px;
  max-width: 400px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  margin-left: 8px;
  font-size: 0.95rem;
}

.search-box i {
  color: #94a3b8;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-left: auto; /* Đẩy các nút sang phải */
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.add {
  background-color: #3b82f6;
  color: white;
}

.action-btn.add:hover {
  background-color: #4338ca;
}

.action-btn.trash {
  background-color: #f3f4f6;
  color: #4b5563;
}

.action-btn.trash:hover {
  background-color: #e5e7eb;
}

/* Table Styling */
.table-container {
  overflow-x: auto;
  margin-top: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th, td {
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
  height: 100%; /* Đảm bảo chiều cao 100% cho cell */
      border-bottom: 1px solid #e2e8f0;
}

tr {
  min-height: 80px; /* Đảm bảo chiều cao tối thiểu cho dòng */
}

.actions-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Nếu cần, có thể thêm min-height cho cell này */
}

/* Căn giữa toàn bộ nội dung bảng */
th, td {
  padding: 1rem;
  text-align: center;
  vertical-align: middle; /* Đảm bảo căn giữa theo chiều dọc */
}

/* Căn giữa hình ảnh trong bảng */
.image-container {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto; /* Căn giữa container ảnh trong ô */
}

/* Căn giữa các nút thao tác */
.actions-cell,
.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

tr:hover {
  background-color: #f9fafb;
}

/* Image Styling */
.news-image {
  display: block;
  margin: 0 auto; /* Căn giữa ảnh trong container */
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.news-image:hover {
  transform: scale(1.05);
}

.no-image {
  color: #9ca3af;
  font-size: 1.5rem;
}

/* Action Buttons in Table */
.icon-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn.info {
  background-color: #dbeafe;
  color: #2563eb;
}

.icon-btn.edit {
  background-color: #ecfdf5;
  color: #059669;
}

.icon-btn.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.icon-btn:hover {
  transform: translateY(-1px);
}

.icon-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Styling */
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: auto; /* Thêm dòng này để cho phép cuộn ngang nếu cần */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Thêm xử lý tràn ngang cho modal-body */
.modal-body {
  padding: 1.5rem;
  overflow-x: auto; /* Cho phép cuộn ngang nếu nội dung quá dài */
}

/* Đảm bảo nội dung chi tiết không bị tràn ra ngoài */
.detail-item {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: start;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  word-break: break-word; /* Thêm dòng này */
  overflow-wrap: anywhere; /* Thêm dòng này */
}

.detail-item p {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  padding: 4px 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 32px;
  display: flex;
  align-items: center;
  word-break: break-word; /* Thêm dòng này */
  overflow-wrap: anywhere; /* Thêm dòng này */
  max-width: 100%; /* Đảm bảo không vượt quá khung */
  overflow-x: auto; /* Cho phép cuộn ngang nếu vẫn tràn */
}

/* Form Styling */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #dc2626;
  margin-left: 4px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background-color: #fff;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group .error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.character-count {
  color: #6b7280;
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
}

/* Image upload styling */
.image-upload {
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.image-upload:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.image-upload input[type="file"] {
  display: none;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-top: 16px;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-image:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

.upload-progress {
  margin-top: 12px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 4px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.submit-btn,
.cancel-btn,
.delete-btn,
.permanent-delete-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.delete-btn {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.delete-btn:hover:not(:disabled) {
  background-color: #fecaca;
  transform: translateY(-1px);
}

.permanent-delete-btn {
  background-color: #dc2626;
  color: white;
  border: none;
}

.permanent-delete-btn:hover:not(:disabled) {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

/* Warning text */
.warning-text {
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 16px;
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #059669;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Loading and Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #4f46e5;
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
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: #4338ca;
}

/* Responsive Design */
@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
  }
  
  .actions-left {
    width: 100%;
  }

  .actions-left {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-box {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}

/* Modal Details Styling */
.detail-item {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  align-items: start;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.detail-item label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  padding-top: 4px;
}

.detail-item p {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  padding: 4px 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 32px;
  display: flex;
  align-items: center;
}

.detail-item:has(.detail-image) {
  grid-template-columns: 120px 1fr;
}

.detail-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 8px;
}

/* Modal Header Enhancement */
.modal-header {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Đưa các phần tử về hai phía */
}

.modal-header h3 {
  font-size: 1.5rem;
  background: linear-gradient(to right, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.close-btn {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto; /* Đẩy nút đóng sang phải */
}

.close-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  transform: rotate(90deg);
}

.modal-body {
  padding: 20px;
  background: white;
}

/* Animation Enhancements */
.modal {
  animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
}

.modal-content {
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

/* Không hiệu ứng khi là modal form chỉnh sửa */
.modal-content.no-animation {
  animation: none !important;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Content Formatting */
.detail-item p.truncate-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive Modal Content */
@media (max-width: 640px) {
  .detail-item label {
    font-size: 0.875rem;
  }

  .detail-item p {
    font-size: 0.9375rem;
  }

  .detail-image {
    max-width: 100%;
  }

  .modal-header h3 {
    font-size: 1.25rem;
  }
}

/* Modal Animation */
.modal {
  animation: modalFadeIn 0.3s ease;
}

.modal-content {
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

th input[type="checkbox"],
td input[type="checkbox"] {
  display: block;
  margin: 0 auto;
  width: 18px;
  height: 18px;
}
</style>
