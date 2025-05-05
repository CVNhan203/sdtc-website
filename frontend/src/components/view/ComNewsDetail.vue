<template>
  <div class="news-detail-container">
    <!-- Back button -->
    <div class="back-link" @click="$router.push('/news')">
      <div class="back-icon">
        <i class="fas fa-arrow-left"></i>
      </div>
      <span>Trở lại tin tức</span>
    </div>

    <div class="news-content-wrapper">
      <!-- Main Content -->
      <div class="main-content">
        <h1 class="news-title">{{ currentNews.title }}</h1>
        
        <div class="news-meta">
          <span>{{ currentNews.date }}</span>
          <span>By {{ currentNews.author }}</span>
          <span>{{ currentNews.views }} lượt xem</span>
          <span>{{ currentNews.shares }} chia sẻ</span>
        </div>

        <div class="news-image">
          <img :src="currentNews.image" :alt="currentNews.title">
        </div>

        <div class="news-content">
          <p class="content-paragraph">{{ currentNews.excerpt }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
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
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ComNewsDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchQuery = ref('')
    const currentNews = ref({})
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
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI'
        },
        {
          id: 5,
          title: 'FPT muốn tiên phong phát triển Data Center',
          date: '14/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.'
        },
        {
          id: 6,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          date: '13/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.'
        },
        {
          id: 7,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          date: '15/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI'
        },
        {
          id: 8,
          title: 'FPT muốn tiên phong phát triển Data Center',
          date: '14/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.'
        },
        {
          id: 9,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          date: '13/03/2024',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.'
        }
    ])

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

    const loadCurrentNews = () => {
      const id = Number(route.params.id)
      const found = allNews.value.find(news => news.id === id)
      if (found) {
        currentNews.value = found
      }
    }

    const goToNewsDetail = (news) => {
      router.push(`/tin-tuc/${news.id}`)
    }

    onMounted(() => {
      loadCurrentNews()
    })

    return {
      searchQuery,
      currentNews,
      filteredNews,
      goToNewsDetail
    }
  }
}
</script>

<style scoped>
.news-detail-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px;
}

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

.back-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #004AAD;
  border-radius: 50%;
}

.back-icon i {
  color: white;
  font-size: 12px;
}

.back-link:hover {
  color: #004AAD;
}

.back-link:hover .back-icon {
  background: #003380;
}

.news-content-wrapper {
  display: flex;
  gap: 40px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-bottom: 16px;
  line-height: 1.2;
}

.news-meta {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
}

.news-image {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 4px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.content-paragraph {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Sidebar Styles */
.sidebar {
  width: 360px;
  flex-shrink: 0;
  background-color: #fff;
}

.search-container {
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 44px 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #004AAD;
}

.search-button {
  position: absolute;
  right: 0;
  top: 0;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-posts {
  background-color: #fff;
}

.recent-posts h2 {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
  padding-left: 4px;
  border-left: 3px solid #004AAD;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

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

.post-image {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  flex: 1;
  min-width: 0;
}

.post-date {
  color: #004AAD;
  font-size: 14px;
  margin-bottom: 4px;
}

.post-excerpt {
  color: #333;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .news-content-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}

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
}
</style>