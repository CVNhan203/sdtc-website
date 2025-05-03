<template>
  <div class="news-container">
    <div class="news-header">
      <div class="wave-background"></div>
      <h1 class="news-title">Tin tức</h1>
      <div class="search-wrapper">
        <div class="search-bar">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tin tức"
            @input="handleSearch"
          >
        </div>
      </div>
    </div>

    <!-- News grid section -->
    <div class="news-grid">
      <div v-for="(news, index) in newsItems" :key="index" class="news-card" @click="goToNewsDetail(news)">
        <img :src="news.image" :alt="news.title" class="news-image">
        <div class="news-content">
          <p class="news-category">Công nghệ</p>
          <h3 class="news-card-title">{{ news.title }}</h3>
          <p class="news-date">{{ news.date }}</p>
          <p class="news-excerpt">{{ news.excerpt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'ComNews',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      searchQuery: '',
      newsItems: [
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
      ]
    }
  },
  methods: {
    handleSearch() {
      // Implement search functionality here
      console.log('Searching for:', this.searchQuery)
    },
    goToNewsDetail(news) {
      this.router.push({
        path: `/tin-tuc/${news.id}`,
        query: {
          title: news.title,
          date: news.date,
          image: news.image,
          excerpt: news.excerpt,
          author: news.author,
          views: news.views,
          shares: news.shares
        }
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

.news-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px;
}

.news-header {
  position: relative;
  background: rgba(0, 123, 255, 1);
  width: 1240;
  height: 310px;
  top: 184;
  left: 356;
  border-radius: 20px;
  
  text-align: center;
  background-image: url('@/assets/sdtc-image/brsearch.png');
}
.news-title{
  color: rgba(255, 255, 255, 1);
  font-family: Roboto;
  font-weight: 190px;
  font-size: 70px;
  line-height: 70px; /* Adjust line-height to match the height for vertical centering */
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  width: 100%; /* Ensure it takes full width */
  height: 100%; /* Ensure it takes full height */
}
.search-wrapper {
  position: absolute;
  z-index: 2;
  max-width: 600px;
  width: 90%;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 35%);
}
    
.search-bar {
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    padding-top: 33px;
    padding-right: 17px;
    padding-bottom: 33px;
    padding-left: 17px;
    gap: 23px;

    display: flex;
    align-items: center;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.search-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
}

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

}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 80px;
}

.news-card {
  width: 392px;
  height: 501px;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-image {
  width: 392px;
  height: 280px;
  border-radius: 20px;
  border-width: 0.2px;
}

.news-card:hover .news-image {
  filter: grayscale(70%) brightness(105%);
  opacity: 0.7;
}

.news-content {
  padding: 20px;
}

.news-category {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  font-family: Roboto;
}

.news-card-title {
  color: #004AAD;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4;
}

.news-date {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

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

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .news-header {
    height: 250px;
  }
  
  .news-title {
    font-size: 50px;
  }
  
  .search-bar {
    padding: 20px 15px;
  }
  
  .search-bar input {
    font-size: 16px;
  }
}
</style>
