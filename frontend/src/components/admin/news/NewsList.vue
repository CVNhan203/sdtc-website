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
            <!-- Correct Font Awesome icon class -->
            <i class="fas fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm theo tiêu đề..."
              @input="handleSearch"
            />
          </div>

          <select v-model="filterType" @change="handleFilter">
            <option value="">Tất cả loại</option>
            <option value="tin-tuc">Tin tức</option>
            <option value="su-kien">Sự kiện</option>
            <option value="thong-bao">Thông báo</option>
          </select>
        </div>
      </div>

      <!-- News Table -->
      <div class="table-container responsive-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th class="responsive-hide">Tóm tắt</th>
              <th>Loại</th>
              <th class="responsive-hide">Tác giả</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="news in filteredNews" :key="news._id">
              <td class="news-id">{{ news._id }}</td>
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
              <td class="content-cell responsive-hide">
                {{ formatDescription(news.summary) }}
              </td>
              <td class="type-cell">{{ formatType(news.type) }}</td>
              <td class="responsive-hide">{{ news.author }}</td>
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

      <!-- Add/Edit News Modal -->
      <div class="modal" v-if="showFormModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditing ? "Chỉnh sửa tin tức" : "Thêm tin tức mới" }}</h3>
            <button class="close-btn" @click="showFormModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
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
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                  />
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
    const news = ref([]);
    const searchQuery = ref("");
    const filterType = ref("");
    const showDetailsModal = ref(false);
    const showFormModal = ref(false);
    const showSoftDeleteModal = ref(false);
    const showRestoreModal = ref(false);
    const showPermanentDeleteModal = ref(false);
    const selectedNews = ref({});
    const formData = ref({
      title: "",
      summary: "",
      content: "",
      image: null,
      type: "",
      author: "",
      publishedDate: "",
      isDeleted: false,
    });
    const imagePreview = ref(null);
    const uploadProgress = ref(0);
    const loading = ref(false);
    const error = ref(null);
    const isEditing = ref(false);
    const baseImageUrl = ref("http://localhost:3000"); // Hardcode for now until .env is set up
    const imageLoadError = ref({});
    const router = useRouter();

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

    const handleSearch = () => {
      // Thực hiện tìm kiếm thông qua computed property
    };

    const handleFilter = () => {
      // Thực hiện lọc thông qua computed property
    };

    const showDetails = (item) => {
      selectedNews.value = item;
      showDetailsModal.value = true;
    };

    const openEditModal = (news) => {
      router.push(`/admin/tin-tuc/chinh-sua/${news._id}`);
    };

    const confirmSoftDelete = (item) => {
      selectedNews.value = item;
      showSoftDeleteModal.value = true;
    };

    const confirmRestore = (item) => {
      selectedNews.value = item;
      showRestoreModal.value = true;
    };

    const confirmPermanentDelete = (item) => {
      selectedNews.value = item;
      showPermanentDeleteModal.value = true;
    };

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

    const handleRestore = async () => {
      try {
        await newsService.restoreNews(selectedNews.value._id);
        await loadNews();
        showRestoreModal.value = false;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handlePermanentDelete = async () => {
      try {
        await newsService.permanentDeleteNews(selectedNews.value._id);
        await loadNews();
        showPermanentDeleteModal.value = false;
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        formData.value.image = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      if (imagePath.startsWith("http")) return imagePath;
      const cleanPath = imagePath.replace(/^[/\\]+/, "");
      return `${baseImageUrl.value}/${cleanPath}`;
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("vi-VN");
    };

    const formatType = (type) => {
      const types = {
        "tin-tuc": "Tin tức",
        "su-kien": "Sự kiện",
        "thong-bao": "Thông báo",
      };
      return types[type] || type;
    };

    const formatDescription = (text) => {
      return text?.length > 50 ? text.slice(0, 50) + "..." : text;
    };

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

    const handleImageError = (event, newsId) => {
      if (event) {
        event.target.src = ""; // Clear the broken image source
        event.target.style.display = "none"; // Hide the broken image
        const parent = event.target.parentElement;
        if (parent) {
          parent.classList.add("no-image");
          parent.innerHTML = '<i class="fas fa-image"></i>';
        }
      }
      imageLoadError.value[newsId] = true;
    };

    onMounted(() => {
      loadNews();
      // Listen for updates from TrashNews
      eventBus.on("update-deleted-news-count", () => {
        loadNews();
      });
      console.log("Base Image URL:", baseImageUrl.value);
    });

    onBeforeUnmount(() => {
      // Cleanup event listeners
      eventBus.off("update-deleted-news-count");
      // Cleanup image previews
      if (imagePreview.value) {
        URL.revokeObjectURL(imagePreview.value);
      }
    });

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
/* Import the admin styles */
@import "@/styles/admin.css";

/* Component specific overrides */
.news-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow-x: auto;
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

.detail-image {
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  margin-top: 0.5rem;
}

/* Table column widths */
table {
  table-layout: fixed;
  min-width: 1100px;
}

th:nth-child(1),
td:nth-child(1) {
  width: 100px; /* ID */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:nth-child(2),
td:nth-child(2) {
  width: 100px; /* Ảnh */
  min-width: 80px;
}

th:nth-child(3),
td:nth-child(3) {
  width: 180px; /* Tiêu đề */
}

th:nth-child(4),
td:nth-child(4) {
  width: 200px; /* Tóm tắt */
}

th:nth-child(5),
td:nth-child(5) {
  width: 200px; /* Nội dung */
}

th:nth-child(6),
td:nth-child(6) {
  width: 90px; /* Loại */
}

th:nth-child(7),
td:nth-child(7) {
  width: 100px; /* Tác giả */
}

th:nth-child(8),
td:nth-child(8) {
  width: 130px; /* Thao tác */
}

/* Single line content with ellipsis */
.content-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

td:nth-child(3) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.type-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
