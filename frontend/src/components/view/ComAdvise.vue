<template>
  <div class="advise-background">
    <div class="contact-container">
      <div class="contact-info">
        <h2 class="section-title">LIÊN HỆ VỚI CHÚNG TÔI</h2>
        <div class="info-content">
          <p>
            Địa chỉ: 194 đường số 7, Khu dân cư Trung Sơn, xã Bình Hưng, huyện Bình Chánh, TPHCM.
          </p>
          <p>Điện thoại: 0931 494 389</p>
          <p>Email: congngherongbien@gmail.com</p>
          <p>Website: <a href="https://sdtc.vn" target="_blank">https://sdtc.vn</a></p>
          <div class="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3547.410174818486!2d106.68744887451673!3d10.733260859989516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fbaee249739%3A0x4485210532f2e667!2zMTk0IMSQLiBz4buRIDcsIEtodSBkw6JuIGPGsCBUcnVuZyBTxqFuLCBCw6xuaCBDaMOhbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1745833490448!5m2!1svi!2s"
              width="100%"
              height="300"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
            >
            </iframe>
          </div>
        </div>
      </div>

      <div class="contact-form">
        <h2 class="section-title">LIÊN HỆ TƯ VẤN</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <input type="text" v-model="form.fullName" placeholder="Họ tên (*)" />
          </div>
          <div class="form-group">
            <input type="tel" v-model="form.phone" placeholder="Số điện thoại (*)" />
          </div>
          <div class="form-group">
            <input type="email" v-model="form.email" placeholder="Địa chỉ email" />
          </div>
          <div class="form-group">
            <input type="text" v-model="form.service" placeholder="Dịch vụ cần tư vấn (*)" />
          </div>
          <div class="form-group">
            <textarea v-model="form.note" placeholder="Ghi chú" rows="4"></textarea>
          </div>
          <div class="form-group">
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading">Đang gửi...</span>
              <span v-else>Xác nhận</span>
            </button>
          </div>
        </form>
        <div v-if="success" class="success-message">{{ success }}</div>
        <div v-if="errorList.length" class="error-message">
          {{ errorList[0] }}
        </div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import bookingService from '@/api/services/bookingService'

export default {
  name: 'ComAdvise',
  data() {
    return {
      form: {
        fullName: '',
        phone: '',
        email: '',
        service: '',
        note: '',
      },
      success: '',
      error: '',
      errorList: [],
      loading: false,
    }
  },
  methods: {
    async submitForm() {
      this.loading = true
      this.error = ''
      this.success = ''
      this.errorList = []
      try {
        await bookingService.createBooking(this.form)
        this.success = 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.'
        this.form = { fullName: '', phone: '', email: '', service: '', note: '' }
        setTimeout(() => {
          this.success = ''
        }, 3000)
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          this.errorList = e.response.data.message
            .split(/,|\n|\r|\r\n|<br>|<br\s*\/?>/i)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
          setTimeout(() => {
            this.errorList = []
          }, 3000)
        } else {
          this.error = 'Gửi liên hệ thất bại. Vui lòng thử lại.'
          setTimeout(() => {
            this.error = ''
          }, 3000)
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.advise-background {
  background-image: url('@/assets/sdtc-image/bgr.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 3rem 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  scroll-behavior: smooth;
}

.contact-container {
  display: flex;
  gap: 2.5rem;
  padding: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.contact-info,
.contact-form {
  flex: 1;
  min-width: 0;
}

.section-title {
  color: #0066cc;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: left;
}

.info-content p {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

.info-content a {
  color: #0066cc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.info-content a:hover {
  color: #004c99;
}

.map-container {
  margin-top: 1.5rem;
  width: 100%;
  height: 350px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.form-group {
  margin-bottom: 1.25rem;
  position: relative;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  background: #fff;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4c70ba;
  box-shadow: 0 0 0 3px rgba(76, 112, 186, 0.2);
}

input::placeholder,
textarea::placeholder {
  color: #999;
  opacity: 0.8;
}

input:focus::placeholder,
textarea:focus::placeholder {
  opacity: 0.6;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background: linear-gradient(90deg, #4c70ba, #3557a0);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;
}

.submit-btn:hover {
  background: linear-gradient(90deg, #3557a0, #2a4682);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  transform: scale(0.98);
}

/* Responsive Styles */

/* Large Desktop: <= 1400px */
@media screen and (max-width: 1400px) {
  .contact-container {
    max-width: 1100px;
    padding: 2rem;
    gap: 2rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .map-container {
    height: 320px;
  }
}

/* Tablet: <= 1024px */
@media screen and (max-width: 1024px) {
  .advise-background {
    padding: 2rem 0;
  }

  .contact-container {
    max-width: 900px;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }

  .info-content p {
    font-size: 0.95rem;
  }

  .map-container {
    height: 280px;
  }

  input,
  textarea {
    padding: 0.65rem;
    font-size: 0.95rem;
  }

  .submit-btn {
    padding: 0.65rem 1.8rem;
    font-size: 0.95rem;
  }
}

/* Mobile: <= 768px */

@media screen and (max-width: 768px) {
  .advise-background {
    padding: 1.5rem 0;
  }

  .contact-container {
    flex-direction: column;
    padding: 1.2rem;
    gap: 2rem;
    max-width: 100%;
    border-radius: 0.75rem;
  }

  .contact-info,
  .contact-form {
    width: 100%;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .info-content {
    text-align: center;
  }

  .info-content p {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .map-container {
    height: 250px;
    margin-top: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  input,
  textarea {
    padding: 0.6rem;
    font-size: 0.9rem;
    border-radius: 5px;
  }

  textarea {
    min-height: 100px;
  }

  .submit-btn {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
}

/* Small Mobile: <= 480px */

@media screen and (max-width: 480px) {
  .advise-background {
    padding: 1rem 0;
  }

  .contact-container {
    padding: 1rem;
    gap: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .section-title {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .info-content p {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .map-container {
    height: 200px;
    margin-top: 0.8rem;
  }

  .form-group {
    margin-bottom: 0.8rem;
  }

  input,
  textarea {
    padding: 0.5rem;
    font-size: 0.85rem;
    border-radius: 4px;
  }

  textarea {
    min-height: 80px;
  }

  .submit-btn {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}

/* Accessibility and Touch Improvements */
input,
textarea,
.submit-btn {
  -webkit-tap-highlight-color: transparent;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input,
textarea {
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
}

.submit-btn:focus {
  outline: 2px solid #4c70ba;
  outline-offset: 2px;
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Improve form accessibility */
.form-group label {
  position: absolute;
  left: -9999px;
}

.success-message {
  color: #2ecc40;
  margin-top: 10px;
  font-weight: bold;
}
.error-message {
  color: #ff4136;
  font-size: 0.8rem;

  font-weight: bold;
}

.success-message {
  color: #2ecc40;
  margin-top: 10px;
  font-weight: bold;
}
.error-message {
  color: #ff4136;
  margin-top: 10px;
  font-weight: bold;
}
</style>
