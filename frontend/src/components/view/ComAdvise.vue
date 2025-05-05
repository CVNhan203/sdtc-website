<template>
  <div class="advise-background">
  <div class="contact-container">
    <div class="contact-info">
      <h2 class="section-title">LIÊN HỆ VỚI CHÚNG TÔI</h2>
      <div class="info-content">
        <p>Địa chỉ: 194 đường số 7, Khu dân cư Trung Sơn, xã Bình Hưng, huyện Bình Chánh, TPHCM.</p>
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
      <h2 class="section-title">LIÊN HỆ BÁO GIÁ</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <input type="text" v-model="form.name" placeholder="Danh xưng (*)" required />
        </div>
        <div class="form-group">
          <input type="tel" v-model="form.phone" placeholder="Số điện thoại (*)" required />
        </div>
        <div class="form-group">
          <input type="email" v-model="form.email" placeholder="Địa chỉ email" required />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="form.service"
            placeholder="Sản phẩm, dịch vụ cần marketing... (*)"
          />
        </div>
        <div class="form-group">
          <textarea v-model="form.notes" placeholder="Ghi chú" rows="4"></textarea>
        </div>
        <div class="form-group">
          <button type="submit" class="submit-btn">Xác nhận</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ComAdvise',
  data() {
    return {
      form: {
        name: '',
        phone: '',
        email: '',
        service: '',
        notes: '',
      },
    }
  },
  methods: {
    submitForm() {
      // Handle form submission here
      console.log('Form submitted:', this.form)
      // You can add API call here to send the form data to your backend
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
  padding: 2rem 0;
}

.contact-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-info,
.contact-form {
  flex: 1;
}

.section-title {
  color: #0066cc;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-content p {
  margin-bottom: 0.5rem;
}

.map-container {
  margin-top: 1rem;
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical;
}

.submit-btn {
  background-color: #4c70ba;
  color: white;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn:hover {
  background-color: #3557a0;
}

@media (max-width: 768px) {
  .contact-container {
    flex-direction: column;
  }
}
</style>