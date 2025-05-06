<template>
  <div class="news-container">
    <!-- Header của trang tin tức với hình nền và tiêu đề -->
    <div class="news-header">
      <div class="wave-background"></div>
      <h1 class="news-title">Tin tức</h1>
      <!-- Thanh tìm kiếm tin tức -->
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

    <!-- Hiển thị khi không có kết quả tìm kiếm -->
    <div v-if="filteredNews.length === 0" class="no-results">
      <p>Không tìm thấy tin tức nào phù hợp với từ khóa "{{ searchQuery }}"</p>
      <button @click="clearSearch" class="clear-search-btn">Xóa tìm kiếm</button>
    </div>

    <!-- Phần hiển thị lưới tin tức - Grid layout -->
    <div v-else class="news-grid">
      <div v-for="(news, index) in filteredNews" :key="index" class="news-card" @click="goToNewsDetail(news)">
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
    // Sử dụng router để điều hướng đến trang chi tiết tin tức
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      // Biến lưu từ khóa tìm kiếm
      searchQuery: '',
      // Mảng chứa tất cả các tin tức có sẵn
      // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
      allNewsItems: [
        {
          id: 1,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI',
        
        },
        {
          id: 2,
          title: 'FPT muốn tiên phong phát triển Data Center',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.',
       
        },
        {
          id: 3,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.',
       
        
        },
        {
          id: 4,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI'
        },
        {
          id: 5,
          title: 'FPT muốn tiên phong phát triển Data Center',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.'
        },
        {
          id: 6,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.'
        },
        {
          id: 7,
          title: 'Coca-Cola lợi phần ứng vì quảng cáo tạo bằng AI',
          image: require('@/assets/sdtc-image/tin-tuc/image1.png'),
          excerpt: 'Coca-Cola đang đối mặt làn sóng phản đối trên mạng xã hội vì video quảng cáo Giáng sinh "vô hồn, thiếu tính sáng tạo" do dùng AI'
        },
        {
          id: 8,
          title: 'FPT muốn tiên phong phát triển Data Center',
          image: require('@/assets/sdtc-image/tin-tuc/image2.png'),
          excerpt: 'FPT đặt mục tiêu đi đầu trong lĩnh vực trung tâm dữ liệu (Data Center), nhằm hỗ trợ doanh nghiệp tối ưu vận hành, tăng khả năng cạnh tranh.'
        },
        {
          id: 9,
          title: 'Trải nghiệm iPad Mini 7: Khó tìm tablet cỡ nhỏ tốt hơn',
          image: require('@/assets/sdtc-image/tin-tuc/image3.png'),
          excerpt: 'Cấu hình không xuất sắc nhưng thiết kế gọn nhẹ, trải nghiệm mượt, hỗ trợ bút và Apple Intelligence khiến iPad Mini 7 là lựa chọn tablet cỡ nhỏ hàng đầu hiện tại.'
        }
      ]
    }
  },
  computed: {
    // Thuộc tính tính toán để lọc tin tức theo từ khóa tìm kiếm
    filteredNews() {
      // Nếu không có từ khóa tìm kiếm, trả về tất cả tin tức
      if (!this.searchQuery) {
        return this.allNewsItems;
      }
      
      // Chuyển từ khóa tìm kiếm thành chữ thường và loại bỏ khoảng trắng thừa
      const searchTerm = this.searchQuery.toLowerCase().trim();
      // Lọc tin tức dựa trên tiêu đề hoặc mô tả chứa từ khóa tìm kiếm
      return this.allNewsItems.filter(news => {
        return news.title.toLowerCase().includes(searchTerm) || 
               news.excerpt.toLowerCase().includes(searchTerm);
      });
    }
  },
  methods: {
    // Xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
    handleSearch() {
      // Chức năng tìm kiếm đã được triển khai qua computed property filteredNews
      console.log('Đang tìm kiếm:', this.searchQuery);
    },
    
    // Xóa từ khóa tìm kiếm, hiển thị lại tất cả tin tức
    clearSearch() {
      this.searchQuery = '';
    },
    
    // Chuyển hướng đến trang chi tiết tin tức khi người dùng click vào một bài viết
    goToNewsDetail(news) {
      this.router.push({
        path: `/tin-tuc/${news.id}`,
        query: {
          title: news.title,
          // Các thông tin khác có thể được truyền qua query params
          // date: news.date,
          // image: news.image,
          // excerpt: news.excerpt,
          // author: news.author,
          // views: news.views,
          // shares: news.shares
        }
      })
    }
  }
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
  width: 1240;
  height: 310px;
  top: 184;
  left: 356;
  border-radius: 20px;
  
  text-align: center;
  background-image: url('@/assets/sdtc-image/brsearch.png');
}

/* Tiêu đề "Tin tức" hiển thị trên header */
.news-title{
  color: rgba(255, 255, 255, 1);
  font-family: Roboto;
  font-weight: 190px;
  font-size: 70px;
  line-height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Wrapper cho thanh tìm kiếm */
.search-wrapper {
  position: absolute;
  z-index: 2;
  max-width: 600px;
  width: 90%;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 35%);
}
    
/* Thanh tìm kiếm với hiệu ứng bóng đổ */
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 80px;
}

/* Card hiển thị mỗi bài viết tin tức */
.news-card {
  width: 392px;
  height: 501px;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* Hiệu ứng hover cho card tin tức */
.news-card:hover {
  transform: translateY(-5px);
}

/* Hình ảnh trong card tin tức */
.news-image {
  width: 392px;
  height: 280px;
  border-radius: 20px;
  border-width: 0.2px;
}

/* Hiệu ứng khi hover vào hình ảnh */
.news-card:hover .news-image {
  filter: grayscale(70%) brightness(105%);
  opacity: 0.7;
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
  color: #004AAD;
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

  .news-card {
    height: auto;
  }

  .news-image {
    height: 220px;
  }

  .news-content {
    padding: 15px;
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