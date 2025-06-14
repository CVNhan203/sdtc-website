<template>
  <div class="news-container">
    <!-- Header của trang tin tức với hình nền và tiêu đề -->
    <div class="news-header">
      <div class="wave-background"></div>
      <!-- Thanh tìm kiếm tin tức -->
      <div class="search-wrapper">
        <div class="search-bar">
          <i class="fas fa-search search-icon"></i>
          <input type="text" v-model="searchQuery" placeholder="Tin tức" @input="handleSearch" />
        </div>
      </div>
    </div>

    <!-- Hiển thị khi không có kết quả tìm kiếm -->
    <div v-if="filteredNews.length === 0" class="no-results">
      <!-- <p>Không tìm thấy tin tức nào phù hợp với từ khóa "{{ searchQuery }}"</p>
      <button @click="clearSearch" class="clear-search-btn">Xóa tìm kiếm</button> -->
    </div>

    <!-- Phần hiển thị lưới tin tức - Grid layout -->
    <div v-if="filteredNews.length > 0" class="news-grid">
      <div
        v-for="(news, index) in filteredNews"
        :key="index"
        class="news-card"
        @click="goToNewsDetail(news)"
      >
        <img
          :src="getImageUrl(news.image)"
          class="news-image"
          @error="handleImageError(null, news._id)"
        />
        <div class="news-content">
          <p class="news-category">{{ news.type || news.category || 'Không có danh mục' }}</p>
          <h3 class="news-card-title">{{ news.title }}</h3>

          <p class="news-excerpt">{{ news.summary }}</p>
        </div>
      </div>
    </div>

    <!-- Hiển thị khi không có kết quả tìm kiếm -->
    <div v-else class="no-results">
      <p>Không tìm thấy tin tức "{{ searchQuery }}"</p>
      <button @click="clearSearch" class="clear-search-btn">Xóa tìm kiếm</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import newsService from '@/api/services/newsService'
import { baseMediaUrl } from '@/api/config'

export default {
  name: 'ComNews',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      searchQuery: '',
      allNewsItems: [],
      error: '',
      baseMediaUrl,
    }
  },
  async mounted() {
    try {
      const response = await newsService.getNews()
      console.log('Mounted news data:', response.data)
      // Use the imageUrl provided by the API
      this.allNewsItems = response.data
    } catch (e) {
      this.error = 'Không thể tải danh sách tin tức. Vui lòng thử lại sau.'
    }
  },
  computed: {
    filteredNews() {
      if (!this.searchQuery) return this.allNewsItems
      const searchTerm = this.searchQuery.toLowerCase().trim()
      return this.allNewsItems.filter(
        (news) =>
          news.title.toLowerCase().includes(searchTerm) ||
          (news.summary && news.summary.toLowerCase().includes(searchTerm))
      )
    },
  },
  methods: {
    handleSearch() {},
    clearSearch() {
      this.searchQuery = ''
    },
    goToNewsDetail(news) {
      this.router.push({ path: `/tin-tuc/${news._id || news.id}` })
    },
    handleImageError(event, newsId) {
      // Khi ảnh không tải được, thay thế bằng ảnh mặc định
      if (event && event.target) {
        console.error('Failed to load image for news ID:', newsId)
        // Sử dụng ảnh có sẵn trên server với timestamp để tránh cache
        event.target.src = `${this.baseMediaUrl}/uploads/images/1746862099720.png?t=${new Date().getTime()}`
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath)
        return `${this.baseMediaUrl}/uploads/images/1746862099720.png?t=${new Date().getTime()}`

      // Nếu đã là URL đầy đủ, sử dụng trực tiếp
      if (imagePath.startsWith('http')) return `${imagePath}?t=${new Date().getTime()}`

      // Lấy tên file từ đường dẫn
      const filename = imagePath.split('/').pop().split('\\').pop()

      // Tạo đường dẫn tuyệt đối đến backend với timestamp để tránh cache
      return `${this.baseMediaUrl}/uploads/images/${filename}?t=${new Date().getTime()}`
    },
  },
}
</script>

<style scoped>
/* Import font Roboto từ Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

/* Container chính chứa toàn bộ nội dung trang */
.news-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px;
}

/* Header với hình nền và tiêu đề */
.news-header {
  position: relative;
  background: rgba(0, 123, 255, 1);
  width: 100%; /* Sửa lại width */
  height: 200px; /* Reduced height since we removed the title */
  top: 0; /* Sửa lại top */
  left: 0; /* Sửa lại left */
  border-radius: 20px;
  text-align: center;
  background-image: url('@/assets/sdtc-image/brsearch.png');
  background-size: cover;
  background-position: center;
  overflow: visible; /* Cho phép các phần tử con lấn ra ngoài */
  margin-bottom: 60px; /* Thêm margin bottom để tránh đè lên content */
}

/* Wrapper cho thanh tìm kiếm */
.search-wrapper {
  position: absolute;
  z-index: 2;
  max-width: 600px;
  width: 90%;
  left: 50%;
  bottom: -40px; /* Điều chỉnh vị trí */
  transform: translateX(-50%); /* Chỉ căn giữa theo chiều ngang */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); /* Thêm bóng đổ */
  border-radius: 20px; /* Thêm bo tròn góc */
}

/* Thanh tìm kiếm với hiệu ứng bóng đổ */
.search-bar {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0; /* Thêm viền */
}

/* Icon kính lúp trong thanh tìm kiếm */
.search-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* Ô input cho thanh tìm kiếm */
.search-bar input {
  border: none;
  font-size: 20px;
  outline: none;
  padding-left: 10px;
  font-family: Roboto;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  width: 100%;
}

/* Grid layout hiển thị các bài viết tin tức */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 80px;
}

/* Card hiển thị mỗi bài viết tin tức */
.news-card {
  width: 100%;
  height: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* Hiệu ứng hover cho card tin tức */
.news-card:hover {
  transform: translateY(-5px);
}

/* Hình ảnh trong card tin tức */
.news-image {
  width: 100%;
  height: 280px;
  border-radius: 20px;
  border-width: 0.2px;
  object-fit: cover;
}

/* Hiệu ứng khi hover vào hình ảnh */
.news-card:hover .news-image {
  filter: grayscale(70%) brightness(105%);
  opacity: 0.7;
}

.news-content {
  margin-left: 15px; 
  margin-top: 15px; 
}

/* Phân loại tin tức (category) */
.news-category {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  font-family: Roboto;
}

/* Tiêu đề bài viết trong card */
.news-card-title {
  color: #004aad;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
}

/* Ngày đăng bài viết */
.news-date {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

/* Đoạn mô tả tóm tắt bài viết với giới hạn 3 dòng */
.news-excerpt {
  color: #444;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styling for no results section */
.no-results {
  text-align: center;
  padding: 20px;
}

.no-results p {
  color: #666;
  font-size: 18px;
  margin-bottom: 20px;
}

.clear-search-btn {
  background: #004aad;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.clear-search-btn:hover {
  background: #003c8f;
}

/* Responsive Styles */
@media screen and (max-width: 1200px) {
  .news-container {
    max-width: 1140px;
    padding: 15px;
  }

  .news-header {
    width: 100%;
    height: 280px;
  }

  .news-title {
    font-size: 60px;
    line-height: 60px;
  }

  .search-wrapper {
    max-width: 500px;
  }

  .news-grid {
    gap: 25px;
    margin-top: 70px;
  }

  .news-card {
    width: 100%;
    height: auto;
  }

  .news-image {
    width: 100%;
    height: 250px;
  }
}

@media screen and (max-width: 1024px) {
  .news-container {
    max-width: 960px;
  }

  .news-header {
    height: 260px;
  }

  .news-title {
    font-size: 55px;
    line-height: 55px;
  }

  .search-wrapper {
    max-width: 450px;
  }

  .search-bar {
    padding: 25px 15px;
  }

  .search-bar input {
    font-size: 18px;
  }

  .news-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 60px;
  }

  .news-image {
    height: 220px;
  }

  .news-content {
    padding: 15px;
    max-width: initial;
  }
}

@media screen and (max-width: 768px) {
  .news-container {
    max-width: 720px;
    padding: 10px;
  }

  .news-header {
    height: 220px;
    border-radius: 15px;
  }

  .news-title {
    font-size: 45px;
    line-height: 45px;
  }

  .search-wrapper {
    max-width: 400px;
    transform: translate(-50%, 30%);
  }

  .search-bar {
    padding: 20px 12px;
  }

  .search-bar input {
    font-size: 16px;
  }

  .news-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 50px;
  }

  .news-card {
    width: 100%;
  }

  .news-image {
    height: 200px;
  }

  .news-card-title {
    font-size: 16px;
  }

  .news-excerpt {
    font-size: 13px;
  }
}

@media screen and (max-width: 480px) {
  .news-container {
    padding: 8px;
  }

  .news-header {
    height: 180px;
    border-radius: 10px;
  }

  .news-title {
    font-size: 35px;
    line-height: 35px;
  }

  .search-wrapper {
    max-width: 90%;
    transform: translate(-50%, 25%);
  }

  .search-bar {
    padding: 15px 10px;
  }

  .search-bar input {
    font-size: 14px;
  }

  .search-icon {
    width: 20px;
    height: 20px;
  }

  .news-grid {
    gap: 15px;
    margin-top: 40px;
  }

  .news-image {
    height: 180px;
    border-radius: 15px;
  }

  .news-content {
    padding: 12px;
  }

  .news-category {
    font-size: 12px;
  }

  .news-card-title {
    font-size: 15px;
    margin-bottom: 8px;
  }

  .news-date {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .news-excerpt {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 10px;
  }
}

/* Animation and Hover Effects */
.news-card {
  transition: all 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.news-image {
  transition: all 0.3s ease;
}

/* Improve touch targets for mobile */
@media screen and (max-width: 768px) {
  .news-card {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .news-card:active {
    transform: scale(0.98);
  }
}

/* Fix for long text content */
.news-card-title {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}

/* Add smooth scrolling for better UX */
.news-container {
  scroll-behavior: smooth;
}

/* Improve search bar accessibility */
.search-bar input {
  width: 100%;
  background: transparent;
}

.search-bar input::placeholder {
  color: #999;
  opacity: 0.8;
}

/* Add focus styles for better accessibility */
.search-bar input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}
</style>
