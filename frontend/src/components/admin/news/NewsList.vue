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
              <th>ID</th>
              <th>Ảnh</th>
              <th style="max-width: 250px;">Tiêu đề</th>
              <th>Loại</th>
              <th class="responsive-hide">Tác giả</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <!-- Hiển thị từng dòng tin tức -->
            <tr v-for="news in filteredNews" :key="news._id">
              <td class="news-id">{{ news._id }}</td>
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
              <td class="truncate-text" style="max-width: 250px;">{{ news.title }}</td>
              <td class="type-cell">{{ formatType(news.type) }}</td>
              <td class="responsive-hide">{{ news.author }}</td>
              <!-- Các nút thao tác trên từng tin tức -->
              <td class="actions-cell">
                <div class="actions">
                  <!-- Nút xem chi tiết -->
                  <button class="icon-btn info" @click="showDetails(news)">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <!-- Nút chỉnh sửa -->
                  <button class="icon-btn edit" @click="openEditModal(news)">
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
                <span
                  :class="[
                    'status-badge',
                    selectedNews.isDeleted ? 'inactive' : 'active',
                  ]"
                >
                  {{ selectedNews.isDeleted ? "Đã xóa" : "Đã đăng" }}
                </span>
              </p>
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
            <!-- Form nhập/sửa thông tin tin tức -->
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="formData.title" required />
              </div>
              <div class="form-group">
                <label>Tóm tắt</label>
                <textarea
                  v-model="formData.summary"
                  required
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Nội dung chi tiết</label>
                <textarea
                  v-model="formData.content"
                  required
                  rows="6"
                ></textarea>
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
                <input type="text" v-model="formData.author" required />
              </div>
              <div class="form-group">
                <label>Ngày đăng</label>
                <input type="date" v-model="formData.publishedDate" required />
              </div>
              <div class="form-group">
                <label>Ảnh</label>
                <div class="image-upload">
                  <!-- Input chọn file ảnh -->
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                  />
                  <!-- Hiển thị xem trước ảnh đã chọn -->
                  <div v-if="imagePreview" class="image-preview">
                    <img :src="imagePreview" alt="Preview" />
                    <button
                      type="button"
                      class="remove-image"
                      @click="imagePreview = null"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <!-- Hiển thị thanh tiến trình khi đang tải ảnh lên -->
                  <div
                    v-if="uploadProgress > 0 && uploadProgress < 100"
                    class="upload-progress"
                  >
                    <div
                      class="progress-bar"
                      :style="{ width: `${uploadProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <!-- Các nút hành động form -->
              <div class="form-actions">
                <button
                  type="button"
                  class="cancel-btn"
                  @click="showFormModal = false"
                >
                  Hủy
                </button>
                <button type="submit" class="submit-btn">
                  {{ isEditing ? "Cập nhật" : "Thêm mới" }}
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
import newsService from "@/api/news/newsService";
import eventBus from "@/eventBus";
import { useRouter } from "vue-router";

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
      title: "",
      summary: "",
      content: "",
      image: null,
      type: "",
      author: "",
      publishedDate: "",
      isDeleted: false,
    }); // Dữ liệu form
    const imagePreview = ref(null); // URL xem trước ảnh
    const uploadProgress = ref(0); // Tiến trình tải ảnh
    const loading = ref(false); // Trạng thái đang tải
    const error = ref(null); // Thông báo lỗi nếu có
    const isEditing = ref(false); // Trạng thái đang chỉnh sửa hay thêm mới
    const baseImageUrl = ref("http://localhost:3000"); // URL cơ sở cho hình ảnh
    const imageLoadError = ref({}); // Lưu các lỗi khi tải hình ảnh
    const router = useRouter(); // Router để điều hướng

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
      router.push(`/admin/tin-tuc/chinh-sua/${news._id}`);
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
        formData.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
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
        title: "",
        summary: "",
        content: "",
        image: null,
        type: "",
        publishedDate: new Date().toISOString().split("T")[0],
        author: "",
        view: 0,
        like: 0,
        isDeleted: false,
      };
      imagePreview.value = null;
      uploadProgress.value = 0;
      showFormModal.value = true;
    };

    // Xử lý gửi form thêm/chỉnh sửa tin tức
    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await newsService.updateNews(selectedNews.value._id, formData.value);
        } else {
          await newsService.createNews(formData.value);
        }
        await loadNews();
        showFormModal.value = false;
        imagePreview.value = null;
        uploadProgress.value = 0;
      } catch (err) {
        console.error("Error:", err);
        error.value = isEditing.value
          ? "Không thể cập nhật tin tức. Vui lòng thử lại sau."
          : "Không thể tạo tin tức mới. Vui lòng thử lại sau.";
      }
    };

    // Xử lý xóa tin tức
    const handleDelete = async () => {
      try {
        await newsService.deleteNews(selectedNews.value._id);
        await loadNews();
        showSoftDeleteModal.value = false;
      } catch (err) {
        console.error("Error:", err);
        error.value = "Không thể xóa tin tức. Vui lòng thử lại sau.";
      }
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
      getImageUrl,
      formatDate,
      formatType,
      formatDescription,
      openAddModal,
      handleSubmit,
      handleDelete,
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
  margin-top: var(--spacing-sm);
  position: relative;
  width: 200px;
  height: 150px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 2px solid var(--border-color);
}

/* Ảnh xem trước trong form */
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
</style>
