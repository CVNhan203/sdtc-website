<template>
  <!-- Section đầu trang -->
  <section class="hero-section">
    <div class="home-container">
      <div class="content-wrapper">
        <!-- Nội dung bên trái -->
        <div class="stats-card">
          <h3>Tăng trưởng hàng tuần</h3>
          <div class="growth-chart">
            <svg viewBox="0 0 500 200" class="wave-svg">
              <path
                d="M0,100 
             C50,50 100,50 125,100 
             C150,150 200,150 225,100 
             C250,50 300,50 325,100 
             C350,150 400,150 450,100"
                class="wave-path"
              />
            </svg>
            <div class="stats-info">
              <span class="number">12345</span>
              <span class="percentage">2.4%</span>
            </div>
          </div>
        </div>

        <!-- Nội dung chính ở giữa  -->
        <div class="main-content">
          <p class="subtitle">Designing With Us</p>
          <h1>
            <span class="highlight">Sea Dragon Technology</span> - Đối tác thiết kế đáng tin cậy tại
            TP.HCM
          </h1>
          <p class="description">
            Cùng chúng tôi thực hiện hoá ước mơ xây dựng sản phẩm của bạn, cùng nhau nói "Có" với
            những thiết kế phi thường.
          </p>
        </div>

        <!-- Nội dung bên phải -->
        <div class="trust-card">
          <h3>Khách hàng tin tưởng</h3>
          <div class="avatar-group">
            <img
              class="avatar"
              src="@/assets/sdtc-image/trang-chu/people/image17.png"
              alt="avatar1"
            />
            <img
              class="avatar"
              src="@/assets/sdtc-image/trang-chu/people/image16.png"
              alt="avatar2"
            />
            <img
              class="avatar"
              src="@/assets/sdtc-image/trang-chu/people/image15.png"
              alt="avatar3"
            />
            <img
              class="avatar"
              src="@/assets/sdtc-image/trang-chu/people/image14.png"
              alt="avatar4"
            />
            <img
              class="avatar"
              src="@/assets/sdtc-image/trang-chu/people/image13.png"
              alt="avatar5"
            />
            <div class="rating">
              <span class="star">★</span>
              <span>1,234+</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dịch vụ -->
      <div class="wrapper">
        <div class="services">
          <span>UI/UX Design</span>
          <span>Prototype</span>
          <span>Web Design</span>
          <span>Landing Page</span>
          <span>Mobile Design</span>
          <span>Development</span>
        </div>
        <button class="cta-button">Bắt đầu dự án</button>
      </div>

      <div class="abc">
        <!-- Link mạng xã hội -->
        <div class="social-links">
          <a href="#" class="social-link"><i class="fab fa-tiktok"></i></a>
          <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
          <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
        </div>
        <!-- Logo đối tác -->
        <div class="partners">
          <h3>Đối tác tin cậy</h3>
          <div class="partner-logos">
            <img src="@/assets/sdtc-image/trang-chu/Logo/drTuanAnh.png" alt="Partner 1" />
            <img src="@/assets/sdtc-image/trang-chu/Logo/google.png" alt="Partner 2" />
            <img src="@/assets/sdtc-image/trang-chu/Logo/vnpay.png" alt="Partner 3" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Section Hợp tác -->
  <section class="cooperation-section">
    <div class="cooperation-container">
      <!-- Phần bên trái Sếp -->
      <div class="cooperation-banner">
        <div class="banner-content">
          <p class="subtitle-1">Hợp tác phát triển</p>
          <h1>Cùng nhau<br />vươn xa</h1>
          <p class="description-1">Chúng tôi đồng hành<br />cùng bạn để kiến tạo<br />giải pháp</p>
        </div>
        <img
          src="@/assets/sdtc-image/trang-chu/people/image - 14.png"
          alt="Banner"
          class="banner-image"
        />
      </div>
      <!-- Phần bên phải - khách hàng tin tưởng -->
      <div class="cooperation-info">
        <div class="trust-header">
          <h2>Khách hàng<br />tin tưởng</h2>
          <p class="trust-description">
            Sự tin tưởng của khách hàng là giá trị cốt lõi của chúng tôi
          </p>
        </div>

        <div class="stats-container">
          <div class="stat-item">
            <h3>100+</h3>
            <p>Hoàn thành dự án</p>
          </div>
          <div class="stat-item">
            <h3>1,230</h3>
            <p>Khách hàng tin tưởng</p>
          </div>
        </div>
        <button class="start-btn">Bắt đầu hợp tác</button>
      </div>
    </div>
  </section>

  <!-- Section Timeline -->
  <section class="commit-timeline-section">
    <div class="timeline-container">
      <div class="timeline-content">
        <div class="commit-content">
          <p class="commit-label">Cam kết chất lượng</p>
          <h2 class="commit-title">Làm việc nhanh chóng là chất lượng của chúng tôi</h2>
          <p class="commit-desc">
            Chúng tôi cam kết hoàn thành công việc với tốc độ tối ưu mà không làm giảm chất lượng.
            Với quy trình hiệu quả và đội ngũ chuyên nghiệp, bạn luôn nhận được kết quả nhanh chóng
            và đáng tin cậy
          </p>
        </div>
        <div class="commit-timeline">
          <section class="timeline-section">
            <div class="timeline-header">
              <h2>Timeline</h2>
              <div class="legend">
                <span class="dot completed"></span> Dự án hoàn thành
                <span class="dot in-progress"></span> Trong quá trình
              </div>
            </div>
            <div class="timeline-grid">
              <div class="timeline-labels">
                <span>S10</span><span>M11</span><span>T12</span><span>W13</span> <span>T14</span
                ><span>F15</span><span>S16</span><span>S17</span> <span>M18</span><span>T19</span
                ><span>W20</span><span>T21</span>
              </div>
              <div class="timeline-lines">
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line blue"></div>
                <!-- Đường xanh ở T14 -->
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
                <div class="timeline-line"></div>
              </div>
              <div class="timeline-tasks">
                <!-- Task 1 -->
                <div class="timeline-task done" style="grid-column: 2 / span 5">
                  <span class="percent">100%</span>
                  <span class="task-name">Thiết kế hệ thống</span>
                  <div class="avatars">
                    <img src="@/assets/sdtc-image/trang-chu/people/image17.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image16.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image15.png" />
                  </div>
                </div>
                <!-- Task 2 -->
                <div class="timeline-task progress" style="grid-column: 4 / span 6">
                  <span class="percent">80%</span>
                  <span class="task-name">Phát triển website</span>
                  <div class="avatars">
                    <img src="@/assets/sdtc-image/trang-chu/people/image13.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image14.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image15.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image16.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image16.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image16.png" />
                  </div>
                </div>
                <!-- Task 3 -->
                <div class="timeline-task progress" style="grid-column: 8 / span 4">
                  <span class="percent">40%</span>
                  <span class="task-name">Tối ưu website</span>
                  <div class="avatars">
                    <img src="@/assets/sdtc-image/trang-chu/people/image17.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image16.png" />
                    <img src="@/assets/sdtc-image/trang-chu/people/image16.png" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>

  <!-- Section Sự tin tưởng của khách hàng -->
  <section class="customer-trust-section">
    <div class="customer-trust-container">
      <!-- Left: Images & Badge -->
      <div class="customer-trust-visual">
        <div class="circle-group">
          <div class="circle circle-lg">
            <img src="@/assets/sdtc-image/trang-chu/people/image - 13.png" alt="Khách hàng" />
          </div>
          <div class="circle circle-md">
            <img src="@/assets/sdtc-image/trang-chu/people/image21.png" alt="Khách hàng" />
          </div>
          <div class="circle circle-sm">
            <img src="@/assets/sdtc-image/trang-chu/people/image20.png" alt="Khách hàng" />
          </div>
          <div class="circle-badge">
            <span>200+<br />Khách hàng<br />hài lòng</span>
          </div>
        </div>
      </div>
      <!-- Right: Text -->
      <div class="customer-trust-content">
        <p class="trust-label">Về chúng tôi</p>
        <h2 class="trust-title">Sự tin tưởng của khách hàng ngày càng vững chắc</h2>
        <p class="trust-desc">
          Chúng tôi không ngừng nỗ lực để mang đến giải pháp tốt nhất, được khách hàng tin tưởng
          theo thời gian.
        </p>
        <button class="trust-btn">Bắt đầu ngay</button>
      </div>
    </div>
  </section>

<!-- Section Thành công vượt bậc  -->
<section class="successfull">
  <div class="successfull-content">
    <p>Dự án</p>
    <h2>Thành công vượt bậc</h2>
    <p>
      Chúng tôi tự hào khi mỗi dự án hoàn thành không chỉ đáp ứng yêu cầu mà còn mang lại giá trị thực tế cho khách hàng. Thành công của dự án là sự kết hợp giữa sáng tạo, chất lượng và cam kết của chúng tôi.
    </p>
  </div>
  <div class="projects-group-grid">
    <div class="project-card large">
      <img src="@/assets/sdtc-image/trang-chu/project/project-1.png" alt="" class="project-img" />
      <div class="project-overlay">
        <h3>Website Thẩm mỹ</h3>
        <p>Giao diện sang trọng, tinh tế, tôn vinh vẻ đẹp và thương hiệu. Tối ưu trải nghiệm người dùng với hình ảnh chất lượng cao, bố cục hài hoà và màu sắc thu hút</p>
      </div>
    </div>

    <div class="project-card-group">
      <div class="project-card small">
        <img src="@/assets/sdtc-image/trang-chu/project/project-2.png" alt="" class="project-img" />
        <div class="project-overlay">
          <h3>Website bán hàng</h3>
          <p>Giao diện hiện đại, thu hút với bố cục tinh gọn, dễ sử dụng. Màu sắc hài hòa, tạo cảm giác tin cậy và thúc đẩy hành vi mua sắm. Tích hợp giỏ hàng thông minh, thanh toán nhanh chóng, giúp tối ưu doanh số.</p>
        </div>
      </div>
      
      <div class="project-card small">
        <img src="@/assets/sdtc-image/trang-chu/project/project-3.png" alt="" class="project-img" />
        <div class="project-overlay">
          <h3>Website phong thuỷ</h3>
          <p>Thiết kế trang nhã, cân bằng giữa yếu tố truyền thống và hiện đại. Gam màu xanh biển ấm tạo cảm giác bình yên, tin cậy, giúp khách hàng dễ tiếp cận những giá trị phong thuỷ sâu sắc</p>
        </div>
      </div>
    </div>
  </div>
    <button class="cta-button">Khám phá dự án của chúng tôi</button>
</section>

<!-- Section Nguồn cảm hứng -->
<section class="inspiration-section">
  <div class="inspiration-header">
    <div>
      <p class="inspiration-label">Nguồn cảm hứng</p>
      <h2 class="inspiration-title">Khám phá thiết kế Ui</h2>
      <p class="inspiration-desc">
        Chúng tôi mang đến những thiết kế UI vừa hiện đại, sáng tạo, vừa giữ được nét quen thuộc, giúp người dùng ở mọi lứa tuổi cảm thấy thoải mái và dễ dàng trải nghiệm. Kết hợp giữa công nghệ tiên tiến và giá trị truyền thống, mọi giao diện đều được tối ưu để tạo nên sự kết nối tự nhiên nhất.
      </p>
    </div>
    <button class="inspiration-btn">Xem dự án</button>
  </div>
  <div class="inspiration-carousel-group">
    <Carousel :itemsToShow="4" :wrapAround="true" :autoplay="5000" class="carousel-row">
      <Slide v-for="(img, idx) in inspirationImagesTop" :key="idx">
        <img :src="img" class="carousel-img" />
      </Slide>
    </Carousel>
    <Carousel :itemsToShow="4" :wrapAround="true" :autoplay="5000" :dir="'rtl'" class="carousel-row carousel-row-bottom">
      <Slide v-for="(img, idx) in inspirationImagesBottom" :key="idx">
        <img :src="img" class="carousel-img" />
      </Slide>
    </Carousel>
  </div>
</section>

<!-- Section Thành tựu nổi bật -->
<section class="achievements">
  <div class="achievements-header">
    <p class="achievements-label">Những gì khách hàng nhận xét</p>
    <h2 class="achievements-title">Thành tựu nổi bật</h2>
    <p class="achievements-desc">
      Những cột mốc quan trọng, khẳng định chất lượng và sự tin tưởng của khách hàng
    </p>
  </div>
  <div class="achievements-carousel-wrapper">
    <button class="achievements-arrow left" @click="prevAchievement">
      <span>&#8592;</span>
    </button>
    <Carousel
      ref="achievementsCarousel"
      :itemsToShow="1"
      :wrapAround="true"
      :mouseDrag="false"
      :touchDrag="false"
      :paginationEnabled="false"
      class="achievements-carousel"
    >
      <Slide v-for="(item, idx) in achievements" :key="idx">
        <div class="achievement-slide">
          <div class="achievement-quote-icon">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <text x="0" y="35" font-size="120" fill="#ededed" font-family="Arial">&#8220;</text>
            </svg>
          </div>
          <div class="achievement-logo">
            <img :src="item.logo" :alt="item.company" />
          </div>
          <p class="achievement-content">{{ item.content }}</p>
          <div class="achievement-author">
            <div class="author-name">{{ item.author }}</div>
            <div class="author-role">{{ item.role }}</div>
          </div>
        </div>
      </Slide>
    </Carousel>
    <button class="achievements-arrow right" @click="nextAchievement">
      <span>&#8594;</span>
    </button>
  </div>
</section>

<!-- Section bạn đồng hành -->
<section class="companion-section">
  <div class="companion-content">
    <div class="companion-text">
      <h2>Đồng Hành Cùng Sea Dragon Technology</h2>
      <p>
        Chúng tôi cam kết mang đến những giải pháp công nghệ tiên tiến, giúp bạn phát triển bền vững với chất lượng vượt trội và sự tin cậy tuyệt đối
      </p>
    </div>
    <button class="companion-btn">Đặt lịch tư vấn</button>
  </div>
</section>
</template>

<!-- đây là script -->
<script>
import { Carousel, Slide } from 'vue3-carousel'
export default {
  name: 'ComHome',
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      inspirationImagesTop: [],
      inspirationImagesBottom: [],
      
      achievements: [
        {
          logo: require('@/assets/sdtc-image/trang-chu/Logo/google.png'),
          company: 'Google',
          content:
            'Chúng tôi đã hợp tác với đội ngũ thiết kế website này trong dự án phát triển nền tảng thương mại điện tử của công ty. Điều làm tôi ấn tượng nhất là cách họ thấu hiểu nhu cầu và biến những yêu cầu phức tạp thành một giải pháp dễ sử dụng nhưng đầy hiệu quả. Từ giao diện mượt mà đến tốc độ xử lý nhanh chóng, website của chúng tôi giờ đây không chỉ thu hút khách hàng mà còn giúp tăng doanh thu đáng kể. Đội ngũ luôn sẵn sàng hỗ trợ và đảm bảo mọi thứ hoạt động ổn định. Tôi chắc chắn sẽ tiếp tục hợp tác trong các dự án tiếp theo!',
          author: 'Anh Minh',
          role: 'CEO Công ty Thương mại Điện tử',
        },
        {
          logo: require('@/assets/sdtc-image/trang-chu/Logo/drTuanAnh.png'),
          company: 'Viện Thẩm Mỹ Nguyễn Tuấn Anh',
          content:
            'Chúng tôi đã hợp tác với đội ngũ thiết kế website này trong dự án phát triển nền tảng thương mại điện tử của công ty. Điều làm tôi ấn tượng nhất là cách họ thấu hiểu nhu cầu và biến những yêu cầu phức tạp thành một giải pháp dễ sử dụng nhưng đầy hiệu quả. Từ giao diện mượt mà đến tốc độ xử lý nhanh chóng, website của chúng tôi giờ đây không chỉ thu hút khách hàng mà còn giúp tăng doanh thu đáng kể. Đội ngũ luôn sẵn sàng hỗ trợ và đảm bảo mọi thứ hoạt động ổn định. Tôi chắc chắn sẽ tiếp tục hợp tác trong các dự án tiếp theo!',
          author: 'Anh Tuấn Anh',
          role: 'Bác Sĩ Chuyên Khoa Viện Thẩm Mỹ Nguyễn Tuấn Anh',
        },
        {
          logo: require('@/assets/sdtc-image/trang-chu/Logo/vnpay.png'),
          company: 'VNPAY',
          content:
            'Chúng tôi đã hợp tác với đội ngũ thiết kế website này trong dự án phát triển nền tảng thương mại điện tử của công ty. Điều làm tôi ấn tượng nhất là cách họ thấu hiểu nhu cầu và biến những yêu cầu phức tạp thành một giải pháp dễ sử dụng nhưng đầy hiệu quả. Từ giao diện mượt mà đến tốc độ xử lý nhanh chóng, website của chúng tôi giờ đây không chỉ thu hút khách hàng mà còn giúp tăng doanh thu đáng kể. Đội ngũ luôn sẵn sàng hỗ trợ và đảm bảo mọi thứ hoạt động ổn định. Tôi chắc chắn sẽ tiếp tục hợp tác trong các dự án tiếp theo!',
          author: 'Anh Hào',
          role: 'CEO Công ty Thương mại Tiền Bạc',
        },
      ],
      
    }
  },
  mounted() {
    this.inspirationImagesTop = inspirationImagesTop
    this.inspirationImagesBottom = inspirationImagesBottom
  },
  methods: {
    nextAchievement() {
      this.$refs.achievementsCarousel.next()
    },
    prevAchievement() {
      this.$refs.achievementsCarousel.prev()
    },
  },
}
const inspirationImagesTop = [
  require('@/assets/sdtc-image/trang-chu/carousel/image.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-2.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-3.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-4.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-5.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-6.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-7.png'),
]

const inspirationImagesBottom = [
  require('@/assets/sdtc-image/trang-chu/carousel/image.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-2.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-3.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-4.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-5.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-6.png'),
  require('@/assets/sdtc-image/trang-chu/carousel/image-7.png'),
]
</script>

<style scoped>
/*-------------------------------------- Phần đầu trang --------------------------------------*/
.hero-section {
  width: 100%;
  background-color: #f8f7fa;
  padding: 2rem;
}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.content-wrapper {
  /* display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem; */
  display: flex;
  align-items: center;
  gap: 60px;
}

.trust-card {
  position: relative;
  align-items: center;
  background: #fff;
  /* padding: 0.5rem;
  margin-top: 6.5rem; */
  margin: 10px;;
  padding: 12px 14px 12px 14px;
  border-radius: 16px;
  width: 240px;
  height: 100px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  top: 28px;
  /* left: 30px; */
}
.stats-card {
  position: relative;
  top: 20px;
  background: #fff;
  padding: 1rem;
  border-radius: 20px;
  width: 240px;
  height: 160px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.stats-card h3,
.trust-card h3 {
  font-size: 16px;
}

.growth-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: sans-serif;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.chart {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.wave-svg {
  width: 100%;
  height: 80px;
}

.wave-path {
  fill: none; /* QUAN TRỌNG: không bị đen nữa */
  stroke: #5a8dee;
  stroke-width: 4;
  stroke-linecap: round;
}

.stats-info {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
}

.number {
  color: #ff6b6b;
}

.percentage {
  color: #5a8dee;
}

.main-content {
  text-align: center;
  padding: 2rem 0;
}

.subtitle {
  color: #516371;
  font-weight: 500;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.highlight {
  color: #5dbbff;
}

.description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.services {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.services span {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.9rem;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
}

.cta-button {
  width: 170px;
  height: 60px;
  background: #265ff3;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.avatar-group {
  display: flex;
  margin: 1rem 0;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e0e0e0;
  margin-right: -10px;
  border: 2px solid white;
}

.rating {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.star {
  width: 22px;
  height: 22px;
  color: #ff8933;
}

.abc {
  background: url('@/assets/sdtc-image/icon/Ellipse 38.svg');
  background-position: center;
  background-repeat: no-repeat;
  padding: 3.2rem;
  color: white;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 3rem 0;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4285f4;
  text-decoration: none;
  transition: transform 0.2s;
}

.social-link:hover {
  transform: translateY(-2px);
}

.partners {
  text-align: center;
  margin-top: 4rem;
  color: #a7abb6;
}

.partner-logos {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 2rem;
}

.partner-logos img {
  height: 40px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .stats-card,
  .trust-card {
    max-width: 400px;
    margin: 0 auto;
  }

  h1 {
    font-size: 2rem;
  }
}

/*-------------------------------------- Phần hợp tác --------------------------------------*/
/*-------------------------------------- Sếp bên trái --------------------------------------*/
.cooperation-section {
  padding: 2rem;
  background: #FFFFFF;
}

.cooperation-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 375px 1fr;
  gap: 0;
  overflow: hidden;
}

.cooperation-banner {
  background: #0041e8;
  color: white;
  padding: 2rem;
  position: relative;
  height: 308px;
  width: 364px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 2rem;
}

.banner-content {
  position: relative;
  z-index: 2;
  padding-top: 1rem;
}

.banner-content .subtitle-1 {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  font-weight: normal;
}

.banner-content h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.banner-content .description-1 {
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.9;
}

.banner-image {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12rem;
  height: auto;
  object-fit: cover;
  border-radius: 2rem;
}

/*-------------------------------------- Khách hàng tin tưởng bên phải --------------------------------------*/
.cooperation-info {
  background: #f8f8f8;
  border-radius: 2rem;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  min-height: 260px;
}

.trust-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.trust-header h2 {
  font-size: 1.875rem;
  color: #5d5d5d;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}
.trust-description {
  color: #a7abb6;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 0;
  max-width: 220px;
  line-height: 1.6;
}

.stats-container {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}
.stat-item h3 {
  font-size: 3rem;
  color: #0041e8;
  font-weight: 900;
  margin-bottom: 0.2rem;
  letter-spacing: 1px;
}
.stat-item p {
  color: #a7abb6;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.start-btn {
  background: #1563ff;
  color: #fff;
  border: none;
  padding: 0.9rem 2.2rem;
  border-radius: 999px;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(21, 99, 255, 0.15);
  transition:
    background 0.2s,
    box-shadow 0.2s,
    transform 0.15s;
}
.start-btn:hover {
  background: #0041e8;
  box-shadow: 0 12px 36px rgba(21, 99, 255, 0.22);
  transform: translateY(-2px) scale(1.03);
}

/*-------------------------------------- Sectione bảng timeline --------------------------------------*/
.commit-timeline-section {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
}

.commit-timeline-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto 0 auto;
  min-height: 340px;
  gap: 0;
}

.commit-content {
  flex: 1;
  padding: 56px 0 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.commit-label {
  color: #b0b4bb;
  font-size: 1rem;
  margin-bottom: 1.2rem;
  font-weight: 500;
}

.commit-title {
  font-size: 2rem;
  font-weight: 800;
  color: #5d5d5d;
  margin-bottom: 1.2rem;
  line-height: 1.15;
}

.commit-desc {
  color: #a7abb6;
  font-size: 1rem;
  line-height: 1.7;
  max-width: 415px;
  font-weight: 500;
}

.commit-timeline {
  flex: 1.2;
  min-width: 6%;
  padding: 48px 48px 48px 0;
  display: flex;
}

.timeline-section {
  width: 100%;
  background: transparent;
  box-shadow: none;
}

.timeline-content {
  display: flex;
  align-items: center;
}

.timeline-container {
  align-items: center;
}
.timeline-header {
  padding: 20px;
  display: flex;
  gap: 60px;
  /* margin-bottom: 1.2rem; */
}

.timeline-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  min-height: 220px;
}

.timeline-labels {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  color: #e7e7e7;
  font-size: 1rem;
  position: relative;
  z-index: 2;
  font-weight: 400;
}

.timeline-labels span {
  text-align: right;
  color: #e7e7e7;
}

.timeline-lines {
  position: absolute;
  top: 1.5rem;
  left: 0;
  width: 100%;
  height: calc(100% - 32px);
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  z-index: 1;
  pointer-events: none;
}
.timeline-container {
  font-family: sans-serif;
  padding: 20px;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.legend .dot {
  width: 18px;
  height: 18px;
  display: inline-block;
  border-radius: 50%;
  margin: 0 6px;
}

.completed {
  background-color: #1d4ed8;
}

.in-progress {
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  border: 2.5px solid #c2c2c2;
}

.timeline-line {
  border-right: 2px dashed #e5e7eb;
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

.timeline-line.blue {
  border-right: 3px solid #2563eb;
  background: none;
  z-index: 2;
}

.timeline-tasks {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  position: relative;
  min-height: 180px;
  z-index: 3;
}

.timeline-task {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  border-radius: 999px;
  padding: 0.7rem 2.2rem 0.7rem 1.2rem;
  position: absolute;
  height: 56px;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.08);
  font-size: 0.5rem;
  background: #f8faff;
  color: #222;
  top: 0;
  transition: box-shadow 0.2s;
}

.timeline-task.done {
  background: #2563eb;
  color: #fff;
  top: 0;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.18);
}

.timeline-task.progress {
  background: #fff;
  color: #222;
  top: 70px;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.08);
}

.timeline-task.progress:last-child {
  top: 140px;
}

.timeline-task .percent {
  background: #4d7aee1a;
  color: #4d7aee;
  border-radius: 16px;
  padding: 0.2rem 1.1rem;
  margin-right: 0.7rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.timeline-task.done .percent {
  background: #4d7aee;
  color: #fff;
  box-shadow: none;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.timeline-task .task-name {
  font-weight: 400;
  margin-right: 0.2rem;
  font-size: 0.7rem;
}

.timeline-task .avatars {
  display: flex;
  align-items: center;
  margin-left: 1.2rem;
}

.timeline-task .avatars img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2.5px solid #fff;
  margin-left: -18px;
  object-fit: cover;
  background: #e0e0e0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
}

/*-------------------------------------- Sự tin tưởng của khách hàng --------------------------------------*/
.customer-trust-section {
  width: 100%;
  margin: 0;
  padding: 0;
  background: #FFFFFF;
}

.customer-trust-container {
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-height: 348px;
}

.customer-trust-visual {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 480px;
  padding: 32px 0 32px 0;
}

.circle-group {
  position: relative;
  width: 440px;
  height: 347px;
}

.circle {
  position: absolute;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.circle-lg {
  width: 292px;
  height: 332px;
  left: 80px;
  top: 0;
  z-index: 2;
}
.circle-lg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-md {
  width: 210px;
  height: 218px;
  left: 0;
  top: 80px;
  z-index: 1;
  border: 4px solid #fff;
}
.circle-md img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-sm {
  width: 120px;
  height: 120px;
  left: 180px;
  top: 180px;
  z-index: 3;
  border: 4px solid #fff;
}
.circle-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circle-badge {
  position: absolute;
  left: 60px;
  top: 120px;
  width: 120px;
  height: 120px;
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  box-shadow: 0 4px 24px rgba(37, 99, 235, 0.12);
  border: 6px solid #fff;
  text-align: center;
}
.circle-badge span {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.5px;
  display: block;
}

.customer-trust-content {
  flex: 1.1;
  padding: 48px 0 48px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.trust-label {
  color: #a7abb6;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.trust-title {
  font-size: 2.1rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.trust-desc {
  color: #a7abb6;
  font-size: 1.08rem;
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 2rem;
}

.trust-btn {
  background: #265FF3;
  color: #fff;
  border: none;
  padding: 0.8rem 2.2rem;
  border-radius: 24px;
  font-size: 1.08rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.1);
  cursor: pointer;
  transition:
    background 0.2s,
    box-shadow 0.2s;
}
.trust-btn:hover {
  background: #1746a2;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.18);
} 

/*-------------------------------------- Section Thành công vượt bậc -------------------------------------- */
.successfull {
  width: 100%;
  background: #FFFFFF;
  padding: 48px 0 64px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.successfull-content {
  text-align: center;
  margin-bottom: 32px;
  max-width: 700px;
}

.successfull-content p {
  color: #a7abb6;
  margin-bottom: 8px;
}

.successfull-content h2 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #444;
}

.projects-group-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 32px auto;
}

.project-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
}

.project-card.large {
  min-height: 530px;
  min-width: 557px;
}

.project-card.small {
  min-height: 260px;
  margin-bottom: 2px;
}

.project-card-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1;
  filter: brightness(62%);
}

.project-overlay {
  position: relative;
  z-index: 2;
  padding: 32px 24px 24px 24px;
  color: #fff;
  width: 100%;
  border-radius: 0 0 24px 24px;
}

.project-overlay h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.project-overlay p {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color:#D1D4DC
}

/*-------------------------------------- Nguồn cảm hứng -------------------------------------- */
.inspiration-section {
  width: 100%;
  background: #fff;
  padding: 0;

  margin: 0;
}

.inspiration-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
  margin-bottom: 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.inspiration-label {
  color: #a7abb6;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.inspiration-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 12px;
}

.inspiration-desc {
  color: #a7abb6;
  font-size: 1.08rem;
  line-height: 1.7;
  max-width: 600px;
}

.inspiration-btn {
  background: #265FF3;
  color: #fff;
  border: none;
  padding: 0.9rem 2.2rem;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
   
  margin-top: 200px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}

.inspiration-btn:hover {
  background: #1746a2;
  box-shadow: 0 12px 36px rgba(37, 99, 235, 0.22);
  transform: translateY(-2px) scale(1.03);
}

.inspiration-carousel-group {
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
}


.carousel-row {
  width: 100%;
  margin-bottom: 0;
}

.carousel-row-bottom {
  margin-top: 8px;
}

.carousel-img {
  width: auto;
  /* height: 300px; */
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  background: #F2F2F2;
  margin: 8px 8px;
  image-rendering: auto;
}

/*-------------------------------------- Thành tựu nổi bật --------------------------------------*/
.achievements {
  width: 100%;
  background: #fff;
  padding: 64px 0 48px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.achievements-header {
  text-align: center;
  margin-bottom: 32px;
}

.achievements-label {
  color: #bfc2c9;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.achievements-title {
  font-size: 2.3rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 10px;
}

.achievements-desc {
  color: #bfc2c9;
  font-size: 1.08rem;
  margin-bottom: 0;
}

.achievements-carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}

.achievements-carousel {
  width: 100%;
  max-width: 900px;
}

.achievement-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
}

.achievement-quote-icon {
  margin-bottom: 12px;
  opacity: 0.25;
}

.achievement-logo img {
  height: 54px;
  margin-bottom: 18px;
  margin-top: 8px;
}

.achievement-content {
  font-size: 1.35rem;
  color: #555;
  text-align: center;
  margin-bottom: 24px;
  margin-top: 8px;
  line-height: 1.6;
  font-weight: 400;
  max-width: 900px;
}

.achievement-author {
  text-align: center;
}

.author-name {
  color: #3ba3ff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.author-role {
  color: #a7abb6;
  font-size: 1rem;
  margin-top: 0;
  color: #3ba3ff;
}

.achievements-arrow {
  background: #fff;
  border: 1.5px solid #2563eb;
  color: #2563eb;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 24px;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(37, 99, 235, 0.08);
  transition: background 0.18s, box-shadow 0.18s;
}

.achievements-arrow:hover {
  background: #f3f7ff;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.13);
}

.achievements-arrow.left {
  order: 0;
}

.achievements-arrow.right {
  order: 2;
}


/*-------------------------------------- Bạn đồng hành --------------------------------------*/
.companion-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px ;
  background: #FFFFFF;
}

.companion-content {
  background: #3976ff;
  border-radius: 2rem;
  width: 95%;
  max-width: 1600px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 48px;
  box-sizing: border-box;
}

.companion-text h2 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.companion-text p {
  color: #e6edff;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
}

.companion-btn {
  background: #fff;
  color: #2563eb;
  font-weight: 700;
  border: none;
  border-radius: 16px;
  padding: 18px 32px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  box-shadow: 0 4px 24px rgba(37, 99, 235, 0.08);
}

.companion-btn:hover {
  background: #e6edff;
  color: #1746a2;
}
</style>
