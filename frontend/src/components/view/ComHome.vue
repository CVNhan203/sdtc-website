<template>
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
    <div class="commit-timeline-container">
      <!-- Bên trái: Nội dung chữ -->
      <div class="commit-content">
        <p class="commit-label">Cam kết chất lượng</p>
        <h2 class="commit-title">Làm việc nhanh chóng là chất lượng của chúng tôi</h2>
        <p class="commit-desc">
          Chúng tôi cam kết hoàn thành công việc với tốc độ tối ưu mà không làm giảm chất lượng. Với
          quy trình hiệu quả và đội ngũ chuyên nghiệp, bạn luôn nhận được kết quả nhanh chóng và
          đáng tin cậy
        </p>
      </div>
      <!-- Bên phải: Bảng Timeline -->
      <div class="commit-timeline">
        <section class="timeline-section">
          <div class="timeline-header">
            <h2>Timeline</h2>
            <div class="timeline-legend">
              <span class="dot done"></span> Dự án hoàn thành
              <span class="dot progress"></span> Trong quá trình
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
              <div class="timeline-line blue"></div><!-- Đường xanh ở T14 -->
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
  </section>

  <!-- Sự tin tưởng của khách hàng -->
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
</template>

<script>
export default {
  name: 'ComHome',
}
</script>

<style scoped>

/* Phần đầu trang */
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
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
}

.trust-card {
  background: #fff;
  padding: 0.5rem;
  margin-top: 6.5rem;
  border-radius: 20px;
  width: 217px;
  height: 82px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.stats-card {
  background: #fff;
  padding: 1rem;
  margin-top: 4.2rem;
  border-radius: 20px;
  width: 213px;
  height: 152px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.stats-card h3,
.trust-card h3 {
  font-size: 14px;
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


/* Phần hợp tác */
/* Sếp bên trái */
.cooperation-section {
  padding: 2rem;
  margin-bottom: 2rem;
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

/* Khách hàng tin tưởng bên trái */
.cooperation-info {
  background: #F8F8F8;
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
  color: #5D5D5D;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}
.trust-description {
  color: #A7ABB6;
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
  color:#0041E8;
  font-weight: 900;
  margin-bottom: 0.2rem;
  letter-spacing: 1px;
}
.stat-item p {
  color: #A7ABB6;
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
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.start-btn:hover {
  background: #0041e8;
  box-shadow: 0 12px 36px rgba(21, 99, 255, 0.22);
  transform: translateY(-2px) scale(1.03);
}


/* Sectione bảng timeline */
.commit-timeline-section {
  width: 100%;
  margin: 0;
  padding: 0;
}

.commit-timeline-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  min-height: 340px;
  gap: 0;
}

.commit-content {
  flex: 1.0;
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
  color: #5D5D5D;
  margin-bottom: 1.2rem;
  line-height: 1.15;
}

.commit-desc {
  color: #A7ABB6;
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

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14rem;
  margin-bottom: 1.2rem;
}

.timeline-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #202020;
  margin: 0;
}

.timeline-legend {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.1rem;
  color: #202020;
  font-weight: 400;
}

.timeline-legend .dot {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
  border: 2.5px solid #2563eb;
}

.timeline-legend .done {
  background: #2563eb;
  border-color: #2563eb;
}
.timeline-legend .progress {
  background: #fff;
  border-color: #b0b4bb;
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
  color: #E7E7E7;
  font-size: 1rem;
  position: relative;
  z-index: 2;
  font-weight: 400;
}

.timeline-labels span {
  text-align: right;
  color: #E7E7E7;
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
  background: #4D7AEE1A;
  color: #4D7AEE;
  border-radius: 16px;
  padding: 0.2rem 1.1rem;
  margin-right: 0.7rem;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.10);
}

.timeline-task.done .percent {
  background: #4D7AEE;
  color: #fff;
  box-shadow: none;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.10);
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

/* Sự tin tưởng của khách hàng */
.customer-trust-section {
  width: 100%;
  margin: 0;
  padding: 0;
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
  background: #2563eb;
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

</style>
