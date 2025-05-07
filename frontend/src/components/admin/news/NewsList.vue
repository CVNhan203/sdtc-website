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
      </div>

      <!-- Bảng danh sách tin tức -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th style="width: 5%">STT</th>
              <th style="width: 15%">Ảnh</th>
              <th style="width: 25%">Tiêu đề</th>
              <th style="width: 10%">Loại</th>
              <th style="width: 15%">Tác giả</th>
              <th style="width: 10%">Ngày đăng</th>
              <th style="width: 10%">Lượt xem</th>
              <th style="width: 10%">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <!-- Hiển thị từng dòng tin tức -->
            <tr v-for="(news, index) in filteredNews" :key="news._id">
              <td class="text-center">{{ index + 1 }}</td>
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
              <td class="truncate-text">{{ news.title }}</td>
              <td class="text-center">{{ formatType(news.type) }}</td>
              <td class="text-center">{{ news.author }}</td>
              <td class="text-center">{{ formatDate(news.publishedDate) }}</td>
              <td class="text-center">{{ news.view }}</td>
              <!-- Các nút thao tác trên từng tin tức -->
              <td class="actions-cell">
                <div class="actions">
                  <!-- Nút xem chi tiết -->
                  <button class="icon-btn info" @click="showDetails(news)" title="Xem chi tiết">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <!-- Nút chỉnh sửa -->
                  <button class="icon-btn edit" @click="openEditModal(news)" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  <!-- Nút xóa tạm thời (chuyển vào thùng rác) -->
                  <button
                    v-if="!news.isDeleted"
                    class="icon-btn delete"
                    @click="confirmSoftDelete(news)"
                    title="Chuyển vào thùng rác"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <!-- Nút khôi phục tin đã xóa -->
                  <button
                    v-else
                    class="icon-btn restore"
                    @click="confirmRestore(news)"
                    title="Khôi phục"
                  >
                    <i class="fas fa-trash-restore"></i>
                  </button>
                  <!-- Nút xóa vĩnh viễn (chỉ hiển thị với tin đã xóa) -->
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

      <!-- Modal xem chi tiết tin tức -->
      <div class="modal" v-if="showDetailsModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Chi tiết tin tức</h3>
            <button class="close-btn" @click="showDetailsModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <!-- Các trường thông tin chi tiết -->
            <div class="detail-item">
              <label>ID:</label>
              <p>{{ selectedNews._id }}</p>
            </div>
            <div class="detail-item">
              <label>Tiêu đề:</label>
              <p>{{ selectedNews.title }}</p>
            </div>
            <div class="detail-item">
              <label>Ảnh:</label>
              <div class="detail-image-container">
                <img
                  v-if="selectedNews.image"
                  :src="getImageUrl(selectedNews.image)"
                  alt="News image"
                  class="detail-image"
                />
                <div v-else class="no-image">
                  <i class="fas fa-image"></i>
                </div>
              </div>
            </div>
            <div class="detail-item">
              <label>Nội dung chi tiết:</label>
              <div class="content-wrapper">
                <p>{{ selectedNews.content }}</p>
              </div>
            </div>
            <div class="detail-item">
              <label>Tóm tắt:</label>
              <div class="summary-wrapper">
                <p>{{ selectedNews.summary }}</p>
              </div>
            </div>
            <div class="detail-item">
              <label>Phân loại:</label>
              <p>{{ formatType(selectedNews.type) }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày đăng:</label>
              <p>{{ formatDate(selectedNews.publishedDate) }}</p>
            </div>
            <div class="detail-item">
              <label>Tác giả:</label>
              <p>{{ selectedNews.author }}</p>
            </div>
            <div class="detail-item">
              <label>Lượt xem:</label>
              <p>{{ selectedNews.view }}</p>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Modal thêm/chỉnh sửa tin tức -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditing ? "Chỉnh sửa tin tức" : "Thêm tin tức mới" }}</h3>
            <button class="close-btn" @click="showFormModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="account-form" novalidate>
              <!-- Tiêu đề -->
              <div class="form-group">
                <label>Tiêu đề</label>
                <input 
                  type="text" 
                  v-model="formData.title"
                  placeholder="Nhập tiêu đề tin tức"
                />
              </div>

              <!-- Ảnh -->
              <div class="form-group">
                <label>Ảnh</label>
                <div class="image-upload-container" @click="$refs.imageInput.click()">
                  <input 
                    type="file"
                    ref="imageInput"
                    class="file-input"
                    @change="handleImageUpload"
                    accept="image/*"
                  />
                  <div v-if="!imagePreview" class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Click để tải ảnh lên</span>
                    <p class="upload-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
                  </div>
                  <div v-else class="image-preview">
                    <img :src="imagePreview" alt="Preview" />
                    <button type="button" class="remove-image" @click.stop="removeImage">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              

              <!-- Phân loại -->
              <div class="form-group">
                <label>Phân loại</label>
                <input 
                  type="text" 
                  v-model="formData.type"
                  placeholder="Nhập phân loại tin tức"
                />
              </div>

              <!-- Ngày đăng -->
              <div class="form-group">
                <label>Ngày đăng</label>
                <input 
                  type="date" 
                  v-model="formData.publishedDate"
                />
              </div>

              <!-- Mô tả ngắn -->
              <div class="form-group">
                <label>Tóm tắt</label>
                <textarea 
                  v-model="formData.summary"
                  rows="2"
                  placeholder="Nhập tóm tắt"
                ></textarea>
              </div>
              <!-- Nội dung -->
              <div class="form-group">
                <label>Nội dung</label>
                <textarea 
                  v-model="formData.content"
                  rows="6"
                  placeholder="Nhập nội dung tin tức"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showFormModal = false">
                  <i class="fas fa-times"></i> Hủy
                </button>
                <button type="submit" class="submit-btn">
                  <i class="fas fa-save"></i> {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận xóa tạm thời -->
      <div class="modal" v-if="showSoftDeleteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Xác nhận chuyển vào thùng rác</h3>
            <button class="close-btn" @click="showSoftDeleteModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn chuyển tin tức "{{ selectedNews.title }}"
              vào thùng rác không?
            </p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showSoftDeleteModal = false">
                Hủy
              </button>
              <button class="delete-btn" @click="handleSoftDelete">
                Chuyển vào thùng rác
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận khôi phục -->
      <div class="modal" v-if="showRestoreModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Xác nhận khôi phục</h3>
            <button class="close-btn" @click="showRestoreModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn khôi phục tin tức "{{ selectedNews.title }}"
              không?
            </p>
            <div class="form-actions">
              <button class="cancel-btn" @click="showRestoreModal = false">
                Hủy
              </button>
              <button class="submit-btn" @click="handleRestore">
                Khôi phục
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal xác nhận xóa vĩnh viễn -->
      <div class="modal" v-if="showPermanentDeleteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Xác nhận xóa vĩnh viễn</h3>
            <button class="close-btn" @click="showPermanentDeleteModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p class="warning-text">
              Cảnh báo: Hành động này không thể hoàn tác!
            </p>
            <p>
              Bạn có chắc chắn muốn xóa vĩnh viễn tin tức "{{
                selectedNews.title
              }}" không?
            </p>
            <div class="form-actions">
              <button
                class="cancel-btn"
                @click="showPermanentDeleteModal = false"
              >
                Hủy
              </button>
              <button
                class="permanent-delete-btn"
                @click="handlePermanentDelete"
              >
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
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import newsService from "@/api/services/newsService";
import eventBus from "@/eventBus";

export default {
  name: "NewsList",
  setup() {
    // Khai báo các biến phản ứng (reactive)
    const news = ref([]); // Dữ liệu tin tức
    const searchQuery = ref(""); // Chuỗi tìm kiếm
    const filterType = ref(""); // Loại tin cần lọc
    const showDetailsModal = ref(false); // Điều khiển hiển thị modal chi tiết
    const showFormModal = ref(false); // Điều khiển hiển thị modal form
    const showSoftDeleteModal = ref(false); // Điều khiển hiển thị modal xóa tạm thời
    const showRestoreModal = ref(false); // Điều khiển hiển thị modal khôi phục
    const showPermanentDeleteModal = ref(false); // Điều khiển hiển thị modal xóa vĩnh viễn
    const selectedNews = ref({}); // Tin tức được chọn để thao tác
    const formData = ref({
      _id: '',
      title: '',
      summary: '',
      content: '',
      image: null,
      type: '',
      publishedDate: new Date().toISOString().split('T')[0],
      isDeleted: false
    }); // Dữ liệu form
    const imagePreview = ref(null); // URL xem trước ảnh
    const uploadProgress = ref(0); // Tiến trình tải ảnh
    const loading = ref(false); // Trạng thái đang tải
    const error = ref(null); // Thông báo lỗi nếu có
    const isEditing = ref(false); // Trạng thái đang chỉnh sửa hay thêm mới
    const baseImageUrl = ref("http://localhost:3000"); // URL cơ sở cho hình ảnh
    const imageLoadError = ref({}); // Lưu các lỗi khi tải hình ảnh

    // Tính toán danh sách tin đã lọc
    const filteredNews = computed(() => {
      let filtered = [...news.value];

      // Lọc bỏ tin đã xóa
      filtered = filtered.filter((item) => !item.isDeleted);

      // Tìm kiếm theo tiêu đề
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((item) =>
          item.title.toLowerCase().includes(query)
        );
      }

      // Lọc theo loại
      if (filterType.value) {
        filtered = filtered.filter((item) => item.type === filterType.value);
      }

      return filtered;
    });

    // Tải danh sách tin tức từ API
    const loadNews = async () => {
      loading.value = true;
      error.value = null;

      try {
        const newsData = await newsService.getNews();
        const deletedNewsInfo = JSON.parse(
          localStorage.getItem("deletedNewsInfo") || "[]"
        );
        const deletedIds = deletedNewsInfo.map((item) => item._id);
        news.value = newsData.filter((item) => !deletedIds.includes(item._id));
      } catch (err) {
        console.error("Error loading news:", err);
        error.value = "Không thể tải danh sách tin tức. Vui lòng thử lại sau.";
      } finally {
        loading.value = false;
      }
    };

    // Xử lý sự kiện tìm kiếm
    const handleSearch = () => {
      // Thực hiện tìm kiếm thông qua computed property
    };

    // Xử lý sự kiện lọc
    const handleFilter = () => {
      // Thực hiện lọc thông qua computed property
    };

    // Hiển thị chi tiết tin tức
    const showDetails = (item) => {
      selectedNews.value = item;
      showDetailsModal.value = true;
    };

    // Mở modal chỉnh sửa tin tức (chuyển hướng đến trang chỉnh sửa)
    const openEditModal = (news) => {
      isEditing.value = true;
      formData.value = {
        _id: news._id,
        title: news.title,
        summary: news.summary,
        content: news.content,
        image: news.image,
        type: news.type,
        publishedDate: news.publishedDate ? new Date(news.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        isDeleted: news.isDeleted
      };
      imagePreview.value = getImageUrl(news.image);
      showFormModal.value = true;
    };

    // Hiển thị modal xác nhận xóa tạm thời
    const confirmSoftDelete = (item) => {
      selectedNews.value = item;
      showSoftDeleteModal.value = true;
    };

    // Hiển thị modal xác nhận khôi phục
    const confirmRestore = (item) => {
      selectedNews.value = item;
      showRestoreModal.value = true;
    };

    // Hiển thị modal xác nhận xóa vĩnh viễn
    const confirmPermanentDelete = (item) => {
      selectedNews.value = item;
      showPermanentDeleteModal.value = true;
    };

    // Xử lý xóa tạm thời tin tức (chuyển vào thùng rác)
    const handleSoftDelete = async () => {
      try {
        const newsToDelete = news.value.find(
          (n) => n._id === selectedNews.value._id
        );
        if (newsToDelete) {
          // Lưu vào thùng rác
          const deletedNewsInfo = {
            ...newsToDelete,
            isDeleted: true,
            deletedAt: new Date().toISOString(),
          };
          const deletedNewsInfoList = JSON.parse(
            localStorage.getItem("deletedNewsInfo") || "[]"
          );
          deletedNewsInfoList.push(deletedNewsInfo);
          localStorage.setItem(
            "deletedNewsInfo",
            JSON.stringify(deletedNewsInfoList)
          );

          // Xóa khỏi danh sách hiện tại
          news.value = news.value.filter(
            (n) => n._id !== selectedNews.value._id
          );

          showSoftDeleteModal.value = false;
          eventBus.emit("update-deleted-news-count");

          eventBus.emit("show-toast", {
            type: "success",
            message: "Đã chuyển tin tức vào thùng rác",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        eventBus.emit("show-toast", {
          type: "error",
          message: "Có lỗi xảy ra khi chuyển tin tức vào thùng rác",
        });
      }
    };

    // Xử lý khôi phục tin tức từ thùng rác
    const handleRestore = async () => {
      try {
        await newsService.restoreNews(selectedNews.value._id);
        await loadNews();
        showRestoreModal.value = false;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Xử lý xóa vĩnh viễn tin tức
    const handlePermanentDelete = async () => {
      try {
        await newsService.permanentDeleteNews(selectedNews.value._id);
        await loadNews();
        showPermanentDeleteModal.value = false;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Xử lý sự kiện tải ảnh lên
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Kiểm tra kích thước file (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Kích thước file không được vượt quá 5MB');
          if (this.$refs.imageInput) {
            this.$refs.imageInput.value = '';
          }
          return;
        }

        // Kiểm tra định dạng file
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          alert('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF');
          if (this.$refs.imageInput) {
            this.$refs.imageInput.value = '';
          }
          return;
        }

        formData.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    // Xử lý xóa ảnh
    const removeImage = () => {
      formData.value.image = null;
      imagePreview.value = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    };

    // Lấy URL đầy đủ của ảnh
    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      if (imagePath.startsWith("http")) return imagePath;
      const cleanPath = imagePath.replace(/^[/\\]+/, "");
      return `${baseImageUrl.value}/${cleanPath}`;
    };

    // Định dạng hiển thị ngày tháng
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("vi-VN");
    };

    // Định dạng hiển thị loại tin tức
    const formatType = (type) => {
      const types = {
        "tin-tuc": "Tin tức",
        "su-kien": "Sự kiện",
        "thong-bao": "Thông báo",
      };
      return types[type] || type;
    };

    // Rút gọn nội dung mô tả để hiển thị
    const formatDescription = (text) => {
      return text?.length > 50 ? text.slice(0, 50) + "..." : text;
    };

    // Mở modal thêm tin tức mới
    const openAddModal = () => {
      isEditing.value = false;
      formData.value = {
        _id: '',
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        publishedDate: new Date().toISOString().split('T')[0],
        isDeleted: false
      };
      imagePreview.value = null;
      uploadProgress.value = 0;
      showFormModal.value = true;
    };

    // Validate form data
    const validateForm = () => {
      const errors = {};
      let isValid = true;

      // Only check if required fields are filled
      if (!formData.value.title?.trim()) {
        errors.title = 'Tiêu đề không được để trống';
        isValid = false;
      }

      if (!formData.value.summary?.trim()) {
        errors.summary = 'Tóm tắt không được để trống';
        isValid = false;
      }

      if (!formData.value.type?.trim()) {
        errors.type = 'Phân loại không được để trống';
        isValid = false;
      }

      if (!formData.value.publishedDate) {
        errors.publishedDate = 'Ngày đăng không được để trống';
        isValid = false;
      }

      if (!formData.value.content?.trim()) {
        errors.content = 'Nội dung không được để trống';
        isValid = false;
      }

      // Validate image for new news
      if (!isEditing.value && !formData.value.image) {
        errors.image = 'Vui lòng chọn ảnh cho tin tức';
        isValid = false;
      }

      // If not valid, show error messages
      if (!isValid) {
        const errorMessages = Object.values(errors).join('\n');
        alert('Vui lòng kiểm tra lại các thông tin sau:\n' + errorMessages);
      }

      error.value = errors;
      return isValid;
    };

    const handleSubmit = async () => {
      // Basic trimming
      formData.value.title = formData.value.title?.trim() || '';
      formData.value.summary = formData.value.summary?.trim() || '';
      formData.value.content = formData.value.content?.trim() || '';
      formData.value.type = formData.value.type?.trim() || '';
      
      if (!validateForm()) {
        return;
      }

      try {
        let imageUrl = null;
        if (formData.value.image instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append('image', formData.value.image);
          
          try {
            const uploadResponse = await newsService.uploadImage(imageFormData);
            if (uploadResponse && uploadResponse.imagePath) {
              imageUrl = uploadResponse.imagePath;
            } else {
              throw new Error('Không nhận được đường dẫn ảnh');
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Lỗi khi tải ảnh lên: ' + (uploadError.message || 'Không xác định'));
            return;
          }
        }

        const newsData = {
          title: formData.value.title,
          summary: formData.value.summary,
          content: formData.value.content,
          type: formData.value.type,
          publishedDate: formData.value.publishedDate,
          isDeleted: formData.value.isDeleted
        };

        if (imageUrl) {
          newsData.image = imageUrl;
        } else if (formData.value.image) {
          newsData.image = formData.value.image;
        }

        if (isEditing.value) {
          await newsService.updateNews(formData.value._id, newsData);
          alert('Cập nhật tin tức thành công!');
        } else {
          await newsService.createNews(newsData);
          alert('Thêm tin tức mới thành công!');
        }

        await loadNews();
        showFormModal.value = false;
        resetForm();
      } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra: ' + (error.message || 'Không thể xử lý yêu cầu'));
      }
    };

    const resetForm = () => {
      formData.value = {
        _id: '',
        title: '',
        summary: '',
        content: '',
        image: null,
        type: '',
        publishedDate: new Date().toISOString().split('T')[0],
        isDeleted: false
      };
      imagePreview.value = null;
      error.value = null;
    };

    // Xử lý lỗi khi tải hình ảnh
    const handleImageError = (event, newsId) => {
      if (event) {
        event.target.src = ""; // Xóa nguồn ảnh bị lỗi
        event.target.style.display = "none"; // Ẩn ảnh bị lỗi
        const parent = event.target.parentElement;
        if (parent) {
          parent.classList.add("no-image");
          parent.innerHTML = '<i class="fas fa-image"></i>';
        }
      }
      imageLoadError.value[newsId] = true;
    };

    // Gọi khi component được tạo
    onMounted(() => {
      loadNews();
      // Lắng nghe sự kiện cập nhật từ TrashNews
      eventBus.on("update-deleted-news-count", () => {
        loadNews();
      });
      console.log("Base Image URL:", baseImageUrl.value);
    });

    // Dọn dẹp khi component bị hủy
    onBeforeUnmount(() => {
      // Dọn dẹp các event listener
      eventBus.off("update-deleted-news-count");
      // Dọn dẹp các URL xem trước ảnh
      if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
      }
    });

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
      removeImage,
      getImageUrl,
      formatDate,
      formatType,
      formatDescription,
      openAddModal,
      handleSubmit,
      imageLoadError,
      handleImageError,
    };
  },
};
</script>

<style scoped>
/* Nhập các styles chung từ file admin.css */
@import "@/styles/admin.css";

/* Tùy chỉnh kiểu dáng cho ảnh tin tức */

.image-container {
  width: 70px;
  height: 70px;
  position: relative;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--bg-secondary);
}

/* Kiểu dáng ảnh tin tức */
.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

/* Hiệu ứng hover trên ảnh */
.news-image:hover {
  transform: scale(1.1);
  border-color: var(--primary-color);
}

/* Hiển thị khi không có ảnh */
.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 2px dashed var(--border-color);
  color: var(--text-tertiary);
}

/* Icon hiển thị khi không có ảnh */
.no-image i {
  font-size: 1.5rem;
}

/* Kiểu dáng cho tiêu đề bị cắt ngắn */
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px; /* Giới hạn chiều rộng tối đa */
  padding: 0 10px;
}

/* Kiểu dáng ảnh trong phần xem chi tiết */
.detail-image {
  max-width: 300px;
  max-height: 200px;
  border-radius: var(--border-radius-md);
  object-fit: contain;
  border: 2px solid var(--border-color);
  margin-top: var(--spacing-sm);
}

/* Vùng xem trước ảnh trong form */
.image-preview {
  position: relative;
  max-width: 100%;
  width: 350px;
  height: 350px;
  margin: 0 auto;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 2px solid var(--border-color);
  background-color: #f8f9fa;
}

/* Ảnh xem trước trong form */
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

/* Nút xóa ảnh xem trước */
.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  width: 25px;
  height: 25px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Hiệu ứng hover trên nút xóa ảnh */
.remove-image:hover {
  background: var(--danger-color);
}

/* Thanh tiến trình tải ảnh */
.upload-progress {
  margin-top: var(--spacing-sm);
  width: 100%;
  height: 10px;
  background-color: var(--bg-secondary);
  border-radius: 5px;
  overflow: hidden;
}

/* Thanh tiến độ */
.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

/* Thêm styles cho detail view */
.detail-item {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.detail-item label {
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: block;
}

.detail-item p {
  margin: 0;
  color: var(--text-secondary);
}

.detail-image-container {
  width: 100%;
  max-width: 400px;
  margin: 1rem 0;
}

.detail-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-wrapper, .summary-wrapper {
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-top: 0.5rem;
}

.summary-wrapper {
  max-height: 150px;
  background: var(--bg-tertiary);
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

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
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
  font-weight: 600;
  color: #2d3748;
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
  color: #4a5568;
}

input[type="text"],
textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.image-upload-container {
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.image-upload-container:hover {
  border-color: #4299e1;
  background-color: rgba(66, 153, 225, 0.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
}

.upload-placeholder i {
  font-size: 2rem;
  color: #4299e1;
}

.upload-hint {
  font-size: 0.875rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

.image-preview {
  position: relative;
  max-width: 300px;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-image:hover {
  background: #e53e3e;
  border-color: #e53e3e;
  color: white;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.cancel-btn {
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.submit-btn {
  background: #4299e1;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn:hover {
  background: #3182ce;
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

.file-input {
  display: none;
}
</style>
