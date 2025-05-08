<template>
  <div class="news-detail-container">
    <!-- Nút quay lại trang tin tức -->
    <div class="back-link" @click="$router.push('/tin-tuc')">
      <div class="back-icon">
        <i class="fas fa-arrow-left"></i>
      </div>
      <span>Trở lại tin tức</span>
    </div>

    <div class="news-content-wrapper">
      <!-- Nội dung chính của bài viết -->
      <div class="main-content">
        <h1 class="news-title">{{ currentNews.title }}</h1>

        <!-- Thông tin meta của bài viết: ngày đăng, tác giả, lượt xem, chia sẻ -->
        <div class="news-meta">
          <span class="meta-item"
            ><i class="far fa-calendar-alt"></i> {{ formatDate(currentNews.publishedDate) }}</span
          >
          <span class="meta-item"><i class="far fa-user"></i> {{ currentNews.author }}</span>
          <span class="meta-item"><i class="far fa-eye"></i> {{ currentNews.views }} lượt xem</span>
          <span class="meta-item"
            ><i class="far fa-share-square"></i> {{ currentNews.shares || 0 }} chia sẻ</span
          >
        </div>

        <!-- Hình ảnh bài viết -->
        <div class="news-image">
          <img :src="currentNews.imageUrl" :alt="currentNews.title" />
        </div>

        <!-- Nội dung văn bản của bài viết -->
        <div class="news-content">
          <p class="content-paragraph">{{ currentNews.summary }}</p>
          <div v-html="currentNews.content"></div>
        </div>
        <!-- Đưa post-navigation vào đây -->
        <div class="post-navigation">
          <button @click="goToPreviousPost" class="nav-button prev-button">
            <i class="fas fa-arrow-left"></i> Bài viết trước
          </button>
          <button @click="goToNextPost" class="nav-button next-button">
            Bài viết sau <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Thanh bên phải -->
      <div class="sidebar">
        <!-- Ô tìm kiếm bài viết -->
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Tìm kiếm bài viết"
            v-model="searchQuery"
          />
          <button class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <!-- Danh sách các bài viết gần đây -->
        <div class="recent-posts">
          <h2>Bài viết gần đây</h2>
          <div class="posts-list">
            <div
              v-for="(post, index) in filteredNews"
              :key="index"
              class="post-item"
              @click="goToNewsDetail(post)"
            >
              <div class="post-image">
                <img :src="post.imageUrl" :alt="post.title" />
              </div>
              <div class="post-info">
                <div class="post-date"><i class="far fa-calendar-alt"></i> {{ post.date }}</div>
                <div class="post-excerpt">{{ post.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import newsService from '@/api/services/newsService'

export default {
  name: 'ComNewsDetail',
  setup() {
    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const route = useRoute()
    const router = useRouter()
    const searchQuery = ref('')
    const currentNews = ref({})
    const allNews = ref([])
    const error = ref('')

    // Lọc danh sách tin tức dựa trên từ khóa tìm kiếm và loại bỏ bài viết hiện tại
    const filteredNews = computed(() => {
      const currentId = route.params.id
      const filtered = allNews.value.filter((news) => (news._id || news.id) != currentId)
      if (!searchQuery.value) return filtered
      const query = searchQuery.value.toLowerCase()
      return filtered.filter((news) => news.title.toLowerCase().includes(query))
    })

    // Tải dữ liệu động
    const loadData = async () => {
      try {
        // Lấy danh sách tin tức gần đây
        const { data } = await newsService.getNews()
        allNews.value = data.map(news => ({
          ...news,
          imageUrl: getImageUrl(news.image)
        }))
        // Lấy chi tiết tin tức
        const newsDetail = await newsService.getNewsById(route.params.id)
        currentNews.value = {
          ...newsDetail,
          imageUrl: getImageUrl(newsDetail.image)
        }
      } catch (e) {
        error.value = 'Không thể tải dữ liệu tin tức. Vui lòng thử lại sau.'
      }
    }

    const getImageUrl = (image) => {
      if (!image) return ''
      if (image.startsWith('http')) return image
      return `http://localhost:3000/${image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')}`
    }

    const goToNewsDetail = (news) => {
      router.push(`/tin-tuc/${news._id || news.id}`)
    }
    const goToPreviousPost = () => {
      const currentId = route.params.id
      const sortedNews = [...allNews.value].sort((a, b) => (a._id || a.id) - (b._id || b.id))
      const currentIndex = sortedNews.findIndex((news) => (news._id || news.id) == currentId)
      if (currentIndex > 0) {
        const prevNews = sortedNews[currentIndex - 1]
        router.push(`/tin-tuc/${prevNews._id || prevNews.id}`)
      }
    }
    const goToNextPost = () => {
      const currentId = route.params.id
      const sortedNews = [...allNews.value].sort((a, b) => (a._id || a.id) - (b._id || b.id))
      const currentIndex = sortedNews.findIndex((news) => (news._id || news.id) == currentId)
      if (currentIndex !== -1 && currentIndex < sortedNews.length - 1) {
        const nextNews = sortedNews[currentIndex + 1]
        router.push(`/tin-tuc/${nextNews._id || nextNews.id}`)
      }
    }

    onMounted(() => {
      loadData()
    })

    // Theo dõi sự thay đổi của route.params.id để load lại dữ liệu
    watch(() => route.params.id, () => {
      loadData()
    })

    return {
      currentNews,
      searchQuery,
      filteredNews,
      goToNewsDetail,
      goToPreviousPost,
      goToNextPost,
      error,
      formatDate,
    }
  }
}
</script>

<style scoped>
/* Container chính chứa toàn bộ trang chi tiết tin tức */
.news-detail-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px;
}

/* Nút trở lại trang tin tức */
.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 14px;
  margin-bottom: 24px;
  cursor: pointer;
  font-family: Roboto;
}

/* Icon hình tròn cho nút trở lại */
.back-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #000000;
}

/* Style cho icon mũi tên trở lại */
.back-icon i {
  color: #000000;
  font-size: 12px;
}

/* Hiệu ứng hover cho nút trở lại */
.back-link:hover {
  color: #000000;
}

.back-link:hover .back-icon {
  background: #004aad;
}

.back-link:hover .back-icon i {
  color: white;
}

/* Layout cho nội dung chính và thanh bên */
.news-content-wrapper {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

/* Style cho phần nội dung chính */
.main-content {
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 400px);
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Tiêu đề bài viết */
.news-title {
  font-size: 32px;
  font-weight: 700;
  color: #1F2B6C;
  margin-bottom: 16px;
  line-height: 1.2;
}

/* Thông tin meta của bài viết */
.news-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.meta-item i {
  color: #004aad;
}

/* Container cho ảnh bài viết */
.news-image {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Style cho ảnh bài viết */
.news-image img {
  max-width: 100%;
  max-height: 400px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 4px;
  background: #f5f5f5;
}

/* Style cho đoạn văn bản */
.content-paragraph {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: justify;
  word-break: break-word;
}

/* Nội dung văn bản của bài viết */
.news-content {
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* Post Navigation */
.post-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 50px;
  background-color: rgba(237, 246, 255, 1);
  color: rgba(0, 74, 173, 1);
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-button:hover {
  background-color: rgba(0, 74, 173, 0.1);
}

.prev-button {
  padding-left: 20px;
}

.next-button {
  padding-right: 20px;
}
.nav-button i {
  margin: 0 8px;
}
/* Sidebar Styles */
.sidebar {
  width: 360px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}

/* Container cho ô tìm kiếm */
.search-container {
  position: relative;
  margin-bottom: 24px;
}

/* Input tìm kiếm */
.search-input {
  width: 100%;
  height: 44px;
  padding: 0 44px 0 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  background: #4285f4;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

/* Placeholder cho ô tìm kiếm */
.search-input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

/* Focus style cho ô tìm kiếm */
.search-input:focus {
  outline: none;
  background: #3367d6;
}

/* Nút tìm kiếm với icon */
.search-button {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-posts {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.recent-posts h2 {
  font-size: 18px;
  font-weight: 600;
  color: #262f5a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

/* Danh sách các bài viết gần đây */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
}

/* Mỗi item bài viết trong danh sách */
.post-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.post-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Style cho item cuối cùng không có border dưới */
.post-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Container cho hình ảnh trong danh sách bài viết */
.post-image {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 5px;
  overflow: hidden;
}

/* Style cho ảnh trong danh sách bài viết */
.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Phần thông tin của mỗi bài viết trong danh sách */
.post-info {
  flex: 1;
  min-width: 0;
}

/* Style cho ngày đăng bài viết */
.post-date {
  color: #159eec;
  font-size: 12px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-date i {
  font-size: 12px;
}

/* Style cho phần tóm tắt bài viết trong danh sách */
.post-excerpt {
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive cho màn hình tablet */
@media (max-width: 1024px) {
  .news-content-wrapper {
    flex-direction: column;
  }

  .main-content {
    max-width: 100%;
  }

  .sidebar {
    width: 100%;
    position: static;
  }

  .navigation-container {
    width: 100%;
  }
}

/* Responsive cho màn hình điện thoại */
@media (max-width: 768px) {
  .news-detail-container {
    padding: 16px;
  }

  .news-title {
    font-size: 24px;
  }

  .post-image {
    width: 70px;
    height: 50px;
  }

  .news-meta {
    gap: 12px;
  }

  .nav-button {
    font-size: 14px;
    padding: 10px 16px;
  }
}
</style>
