<template>
  <footer class="main-footer">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    />
    <div class="footer-container">
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
      </div>

      <!-- Liên hệ -->
      <div class="contact-info">
        <h3>Liên hệ với chúng tôi</h3>
        <div class="contact-item">
          <i class="fa-solid fa-location-dot"></i>
          <a
            href="https://www.google.com/maps/search/?api=1&query=194+đường+số+7,+Khu+dân+cư+Trung+Sơn,+xã+Bình+Hưng,+huyện+Bình+Chánh,+TPHCM"
            target="_blank"
          >
            194 đường số 7, Khu dân cư Trung Sơn, xã Bình Hưng, huyện Bình Chánh, TPHCM
          </a>
        </div>
        <div class="contact-item">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:congngherongbien@gmail.com"> Email: congngherongbien@gmail.com </a>
        </div>
        <div class="contact-item">
          <i class="fa-solid fa-phone"></i>
          <a href="tel:0931494389"> Hotline: 0931494389</a>
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
      <div class="dmca-badge">
      <img :src="require('@/assets/sdtc-image/trang-chu/Logo/DMCA.png')" alt="DMCA Badge" />
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
  background: #f4faff;
  padding: 40px 20px;
  width:100%;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1700px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  text-align: left;
}

/* Company Info Section */
.company-info {
  flex: 1;
  min-width: 250px;
  max-width: 350px;
}
.dmca-badge {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0; 
}
.dmca-badge img {
  width: 100px;
  margin-top: 0;
}

.logo {
  margin-bottom: 10px;
}

.logo img {
  width: 250px;
  /* margin-bottom: 10px; */
}

.description {
  margin-bottom: 30px;
  color: #5d5d5d;
  font-size: 20px;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 35px;
  /* margin-bottom: 24px; */
  margin-top: 10px;
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
  margin-top: 15px;
  width: 100px;
}

/* Contact Info Section */
.contact-info h3,
.policy-info h3,
.map-container h3 {
  color: #5dbbff;
  font-size: 25px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 24px;
}

.contact-info {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}
.contact-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  color: #5d5d5d;
}

.contact-item i {
  color: #5DBBFF;
  font-size: 24px;
  margin-top: 6px;
}

.contact-item a {
  text-decoration: none;
  line-height: 1.9;
  color: #333;
}

/* Policy Info Section */
.policy-info {
  flex: 1 1 160px;
  max-width: 200px;
}
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
  font-size: 20px;
  transition: color 0.3s ease;
}

.policy-info a:hover {
  color: #5dbbff;
}

/* Map Container */
.map-container {
  flex: 1 1 300px;
  max-width: 640px;
}
.map-container h3 {
  color: #5DBBFF;
  margin-bottom: 12px;
}
.map-container iframe {
  width: 100%;
  height: 200px;
  border: 0;
  border-radius: 8px;
}

/* Responsive Styles */
@media screen and (max-width: 1200px) {
  .footer-container {
    gap: 30px;
    padding: 0 20px;
  }

  .description,
  .contact-item a,
  .policy-info a {
    font-size: 0.95rem;
  }

  .contact-info h3,
  .policy-info h3,
  .map-container h3 {
    font-size: 1.1rem;
  }

  .social-icon {
    font-size: 1.2rem;
  }

  .contact-item i {
    font-size: 0.95rem;
  }
}

@media screen and (max-width: 992px) {
  .footer-container {
    gap: 20px;
  }

  .company-info,
  .contact-info,
  .policy-info,
  .map-container {
    flex: 1 1 45%;
    min-width: 300px;
  }

  .description,
  .contact-item a,
  .policy-info a {
    font-size: 0.9rem;
  }

  .contact-info h3,
  .policy-info h3,
  .map-container h3 {
    font-size: 1.05rem;
  }

  .social-links {
    gap: 25px;
  }

  .social-icon {
    width: 35px;
    height: 35px;
    font-size: 1.15rem;
  }

  .contact-item i {
    font-size: 0.9rem;

  }
}

@media screen and (max-width: 768px) {
  .main-footer {
    padding: 30px 15px;
  }

  .footer-container {
    gap: 15px;
  }

  .company-info,
  .contact-info,
  .policy-info,
  .map-container {
    flex: 1 1 100%;
    min-width: 100%;
  }

  .logo img {
    width: 120px;
  }
  
  .description,
  .contact-item a,
  .policy-info a {
    font-size: 0.85rem;
  }

  .contact-info h3,
  .policy-info h3,
  .map-container h3 {
    font-size: 1rem;
  }

  .contact-item {
    margin-bottom: 12px;
  }

  .contact-item i {
    font-size: 0.85rem;
  }

  .social-icon {
    font-size: 1.1rem;
  }

  .map-container iframe {
    height: 180px;
  }
}

@media screen and (max-width: 480px) {
  .main-footer {
    padding: 20px 10px;
  }

  .footer-container {
    gap: 10px;
  }

  .logo img {
    width: 100px;
  }

  .description,
  .contact-item a,
  .policy-info a {
    font-size: 0.8rem;
  }

  .contact-info h3,
  .policy-info h3,
  .map-container h3 {
    font-size: 0.95rem;
  }

  .contact-item {
    margin-bottom: 10px;
  }

  .contact-item i {
    font-size: 0.8rem;
  }

  .social-links {
    gap: 20px;
  }

  .social-icon {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }

  .map-container iframe {
    height: 160px;
  }
}
@media screen and (width: 1024px) {
  .map-container {
    flex: 1 1 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
  }
  .map-container h3 {
    margin-left: 8px;
    margin-bottom: 12px;
  }
  .map-container iframe {
    width: 100%;
    min-width: 0;
    height: 220px;
    border-radius: 12px;
    display: block;
  }
}
@media screen and (width: 1440px) {
  .footer-container {
    max-width: 1440px;
    gap: 20px;
  }
  .contact-info{
    min-width: 260px;
    max-width: 390px;
  }
  .policy-info{
    min-width: 130px;
    max-width: 200px;
  }
  .company-info,
  .map-container {
    min-width: 250px;
    max-width: 300px;
  }
  .description {
    font-size: 1.1rem;
  }
  .contact-info {
    font-size: 1.1rem;
  }
  .policy-info a {
    font-size: 1.1rem;
  }
  .map-container iframe {
    height: 210px;
  }
  .dmca-badge img {
    margin-left: 65px;
    width: 100px;
  }
}
</style>