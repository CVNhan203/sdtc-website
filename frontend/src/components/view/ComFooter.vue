<template>
  <footer class="main-footer">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    />
    <div class="footer-container">
      <div class="footer-content">
        <!-- Logo và thông tin công ty -->
        <div class="company-info">
          <div class="logo">
            <router-link to="/"
              ><img :src="require('@/assets/sdtc-image/trang-chu/Logo/sdtc.png')" alt="Logo"
            /></router-link>
          </div>
          <p class="description">
            Chúng tôi luôn ưu tiên khách hàng với đội ngũ hỗ trợ tận tâm, sẵn sàng giải đáp mọi thắc
            mắc. Ý kiến của bạn là động lực để chúng tôi cải thiện từng ngày.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon tiktok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="#" class="social-icon youtube"><i class="fa-brands fa-youtube"></i></a>
            <a href="#" class="social-icon facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" class="social-icon instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
          <!-- Temporarily commenting out missing image
          <div class="dmca-badge">
            <img :src="require('@/assets/sdtc-image/trang-chu/Logo/DMCA.png')" alt="DMCA Badge" />
          </div>
          -->
        </div>

        <!-- Liên hệ -->
        <div class="contact-info">
          <h3>Liên hệ với chúng tôi</h3>
          <div class="contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <p>194 đường số 7, Khu dân cư Trung Sơn, xã Bình Hưng, huyện Bình Chánh, TPHCM.</p>
          </div>
          <div class="contact-item">
            <i class="fa-solid fa-envelope"></i>
            <p>Email: congngherongbien@gmail.com</p>
          </div>
          <div class="contact-item">
            <i class="fa-solid fa-phone"></i>
            <p>Hotline: 0931494389</p>
          </div>
        </div>

        <!-- Chính sách -->
        <div class="policy-info">
          <h3>Chính sách</h3>
          <ul>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Hướng dẫn sử dụng</a></li>
          </ul>
        </div>

        <!-- Bản đồ -->
        <div class="map-container">
          <h3>Liên hệ với chúng tôi</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3547.410174818486!2d106.68744887451673!3d10.733260859989516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fbaee249739%3A0x4485210532f2e667!2zMTk0IMSQLiBz4buRIDcsIEtodSBkw6JuIGPGsCBUcnVuZyBTxqFuLCBCw6xuaCBDaMOhbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1745833490448!5m2!1svi!2s"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          >
          </iframe>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'ComFooter',
}
</script>

<style scoped>
.main-footer {
  background: #f6fbff;
  padding: 60px 0;
  width: 100%;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 1.5fr; /*chia làm 4 cột*/
  gap: 40px;
}

/* Company Info Section */
.company-info {
  max-width: 360px;
}

.logo {
  margin-bottom: 24px;
}

.logo img {
  height: 50px;
  width: 131.7px;
}

.description {
  color: #5d5d5d;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 35px;
  margin-bottom: 24px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon.tiktok {
  background-color: #5dbbff;
}

.social-icon.youtube {
  background-color: #5dbbff;
}

.social-icon.facebook {
  background-color: #5dbbff;
}

.social-icon.instagram {
  background-color: #5dbbff;
}

.dmca-badge img {
  height: 57px;
  width: 113px;
}

/* Contact Info Section */
.contact-info h3,
.policy-info h3,
.map-container h3 {
  color: #5dbbff;
  font-size: 18px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  color: #5d5d5d;
}

.contact-item i {
  color: #5dbbff;
  font-size: 16px;
  margin-top: 4px;
}

.contact-item p {
  font-size: 15px;
  line-height: 1.6;
}

/* Policy Info Section */
.policy-info ul {
  list-style: none;
  padding: 0;
}

.policy-info li {
  margin-bottom: 16px;
}

.policy-info a {
  color: #5d5d5d;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s ease;
}

.policy-info a:hover {
  color: #5dbbff;
}

/* Map Container */
.map-container iframe {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}

@media (max-width: 1200px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .company-info {
    grid-column: 1 / -1;
    max-width: none;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .map-container iframe {
    height: 250px;
  }
}
</style>
