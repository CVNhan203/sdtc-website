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
          <span class="meta-item"><i class="far fa-calendar-alt"></i> {{ currentNews.date }}</span>
          <span class="meta-item"><i class="far fa-user"></i> {{ currentNews.author }}</span>
          <span class="meta-item"><i class="far fa-eye"></i> {{ currentNews.views }} lượt xem</span>
          <span class="meta-item"><i class="far fa-share-square"></i> {{ currentNews.shares }} chia sẻ</span>
        </div>

        <!-- Hình ảnh bài viết -->
        <div class="news-image">
          <img :src="currentNews.image" :alt="currentNews.title">
        </div>

        <!-- Nội dung văn bản của bài viết -->
        <div class="news-content">
          <p class="content-paragraph">{{ currentNews.excerpt }}</p>
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
          >
          <button class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <!-- Danh sách các bài viết gần đây -->
        <div class="recent-posts">
          <h2>Bài viết gần đây</h2>
          <div class="posts-list">
            <div v-for="(post, index) in filteredNews" 
                 :key="index"
                 class="post-item"
                 @click="goToNewsDetail(post)">
              <div class="post-image">
                <img :src="post.image" :alt="post.title">
              </div>
              <div class="post-info">
                <div class="post-date">{{ post.date }}</div>
                <div class="post-excerpt">{{ post.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nút điều hướng giữa các bài viết -->
    <div class="post-navigation">
      <div class="navigation-container">
        <button @click="goToPreviousPost" class="nav-button prev-button">
          <i class="fas fa-arrow-left"></i> Bài viết trước
        </button>
        <button @click="goToNextPost" class="nav-button next-button">
          Bài viết sau <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ComNewsDetail',
  setup() {
    // Sử dụng Vue Router để lấy thông tin route và điều hướng
    const route = useRoute()
    const router = useRouter()
    
    // Biến lưu từ khóa tìm kiếm
    const searchQuery = ref('')
    
    // Biến lưu thông tin bài viết hiện tại
    const currentNews = ref({})
    
    // Danh sách các bài viết (dữ liệu mẫu)
    const allNews = ref([
    {
          id: 1,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          date: '15/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 2,
          title: 'FPT muốn tiên phong phát triển Data Center',
          date: '14/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 3,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          date: '13/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.',
          author: 'Admin',
          views: 68,
          shares: 85
        
        },
        {
          id: 4,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          date: '15/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 5,
          title: 'FPT muốn tiên phong phát triển Data Center',
          date: '14/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 6,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          date: '13/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 7,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          date: '15/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 8,
          title: 'FPT muốn tiên phong phát triển Data Center',
          date: '14/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.',
          author: 'Admin',
          views: 68,
          shares: 85
        },
        {
          id: 9,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          date: '13/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.',
          author: 'Admin',
          views: 68,
          shares: 85
        }
    ])

    // Lọc danh sách tin tức dựa trên từ khóa tìm kiếm và loại bỏ bài viết hiện tại
    const filteredNews = computed(() => {
      const currentId = Number(route.params.id)
      const filtered = allNews.value.filter(news => news.id !== currentId)
      if (!searchQuery.value) return filtered
      const query = searchQuery.value.toLowerCase()
      return filtered.filter(news => 
        news.title.toLowerCase().includes(query) ||
        news.date.toLowerCase().includes(query)
      )
    })

    // Hàm tải thông tin bài viết hiện tại từ URL params
    const loadCurrentNews = () => {
      const id = Number(route.params.id)
      const found = allNews.value.find(news => news.id === id)
      if (found) {
        currentNews.value = found
      }
    }

    // Hàm điều hướng đến trang chi tiết bài viết khi click vào một bài viết
    const goToNewsDetail = (news) => {
      router.push(`/tin-tuc/${news.id}`)
    }

    // Hàm chuyển đến bài viết trước đó
    const goToPreviousPost = () => {
      const currentId = Number(route.params.id)
      const sortedNews = [...allNews.value].sort((a, b) => a.id - b.id)
      const currentIndex = sortedNews.findIndex(news => news.id === currentId)
      
      if (currentIndex > 0) {
        // Có bài viết trước
        const prevNews = sortedNews[currentIndex - 1]
        router.push(`/tin-tuc/${prevNews.id}`)
      }
    }

    // Hàm chuyển đến bài viết tiếp theo
    const goToNextPost = () => {
      const currentId = Number(route.params.id)
      const sortedNews = [...allNews.value].sort((a, b) => a.id - b.id)
      const currentIndex = sortedNews.findIndex(news => news.id === currentId)
      
      if (currentIndex !== -1 && currentIndex < sortedNews.length - 1) {
        // Có bài viết sau
        const nextNews = sortedNews[currentIndex + 1]
        router.push(`/tin-tuc/${nextNews.id}`)
      }
    }

    // Khi component được tạo, tải thông tin bài viết hiện tại
    onMounted(() => {
      loadCurrentNews()
    })

    // Trả về các biến và hàm để sử dụng trong template
    return {
      searchQuery,
      currentNews,
      filteredNews,
      goToNewsDetail,
      goToPreviousPost,
      goToNextPost
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
  background: #004AAD;
}

.back-link:hover .back-icon i {
  color: white;
}

/* Layout cho nội dung chính và thanh bên */
.news-content-wrapper {
  display: flex;
  gap: 40px;
}

/* Style cho phần nội dung chính */
.main-content {
  flex: 1;
  min-width: 0;
}

/* Tiêu đề bài viết */
.news-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
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

/* Mỗi mục trong thông tin meta */
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Icon trong thông tin meta */
.meta-item i {
  color: #004AAD;
}

/* Container cho ảnh bài viết */
.news-image {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 4px;
  overflow: hidden;
}

/* Style cho ảnh bài viết */
.news-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Style cho đoạn văn bản */
.content-paragraph {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Phần điều hướng giữa các bài viết */
.post-navigation {
  margin-bottom: 30px;
  padding-top: 20px;
  width: 100%;
}

/* Container cho các nút điều hướng */
.navigation-container {
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  width: calc(100% - 400px);
}

/* Style cho nút điều hướng */
.nav-button {
  display: flex;
  align-items: center;
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

/* Hiệu ứng hover cho nút điều hướng */
.nav-button:hover {
  background-color: rgba(0, 74, 173, 0.1);
}

/* Nút bài viết trước */
.prev-button {
  padding-left: 20px;
  margin-right: auto;
}

/* Nút bài viết sau */
.next-button {
  padding-right: 20px;
  margin-left: auto;
}

/* Icon trong nút điều hướng */
.nav-button i {
  margin: 0 8px;
}

/* Style cho thanh bên phải */
.sidebar {
  width: 360px;
  flex-shrink: 0;
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
  background: #4184F7;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* Container cho phần bài viết gần đây */
.recent-posts {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

/* Tiêu đề của phần bài viết gần đây */
.recent-posts h2 {
  font-size: 18px;
  font-weight: 700px;
  color: #262f5a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  color: rgba(31, 43, 108, 1);
  ;
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
}

/* Style cho item cuối cùng không có border dưới */
.post-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Container cho hình ảnh trong danh sách bài viết */
.post-image {
  width: 90px;
  height: 60px;
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
  font-size: 16px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Icon trong ngày đăng */
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

  .sidebar {
    width: 100%;
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