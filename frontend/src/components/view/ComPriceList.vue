<template>
  <div class="price-list-container">
    <!-- Phần header cho bảng giá -->
    <div class="price-list-header">
      <h2 class="pricce-list">Bảng giá dịch vụ</h2>
      <!-- Tab chuyển đổi giữa các loại dịch vụ -->
      <div class="tab-buttons">
        <button :class="{ active: activeTab === 'Website' }" @click="switchTab('Website')">
          Website
        </button>
        <button :class="{ active: activeTab === 'App' }" @click="switchTab('App')">App</button>
        <button :class="{ active: activeTab === 'Agency' }" @click="switchTab('Agency')">
          Agency
        </button>
      </div>
    </div>

    <!-- Hiển thị card dịch vụ -->
    <div class="price-cards">
      <div v-for="(service, index) in filteredServices" :key="index" class="price-card">
        <!-- Icon dịch vụ -->
        <div class="card-icon">
          <img :src="service.icon" :alt="service.title" />
        </div>

        <!-- Header của card: tiêu đề và giá -->
        <div class="card-header">
          <h3>{{ service.title }}</h3>
          <div class="price">{{ service.price }}đ</div>
        </div>

        <button class="btn-detail" @click="startPayment(service._id)">Bắt đầu</button>

        <!-- Danh sách tính năng của dịch vụ -->
        <div class="features-container">
          <ul class="features">
            <li v-for="(feature, fIndex) in service.features" :key="fIndex">
              <div class="feature-icon-wrapper">
                <img :src="feature.icon" class="feature-icon" alt="Feature Icon" />
              </div>
              <div class="feature-content">
                <span class="feature-text">{{ feature.text }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceService from '@/api/services/serviceService'

// Icon mapping cho từng loại dịch vụ
const typeIconMap = {
  web: require('@/assets/sdtc-image/icon/website.svg'),
  app: require('@/assets/sdtc-image/icon/App.svg'),
  agency: require('@/assets/sdtc-image/icon/Agency.svg'),
}
// Icon mapping cho từng feature (theo thứ tự)
const featureIconList = [
  require('@/assets/sdtc-image/icon/ldea.svg'),
  require('@/assets/sdtc-image/icon/shake-hand.svg'),
  require('@/assets/sdtc-image/icon/Timing.svg'),
  require('@/assets/sdtc-image/icon/presentation.svg'),
  require('@/assets/sdtc-image/icon/human.svg'),
  require('@/assets/sdtc-image/icon/target.svg'),
]

export default {
  name: 'ComPriceList',
  data() {
    return {
      activeTab: 'Website',
      services: [],
      error: '',
    }
  },
  async mounted() {
    await this.fetchServices()
  },
  computed: {
    filteredServices() {
      return this.services
    },
  },
  methods: {
    async fetchServices() {
      try {
        const typeMap = { Website: 'web', App: 'app', Agency: 'agency' }
        const type = typeMap[this.activeTab]
        const response = await serviceService.getServices({ type, limit: 9 })
        const data = response.data
        this.services = data.map((s) => ({
          ...s,
          icon: s.image ? this.getImageUrl(s.image) : typeIconMap[s.type] || typeIconMap['web'],
          features:
            Array.isArray(s.description) && s.description.length
              ? s.description.map((text, idx) => ({
                  icon: featureIconList[idx % featureIconList.length],
                  text: text || 'Chưa có mô tả',
                }))
              : [{ icon: featureIconList[0], text: 'Chưa có mô tả' }],
          price: s.price ? s.price.toLocaleString('vi-VN') : 'Liên hệ',
          title: s.title || 'Chưa đặt tên',
        }))
      } catch (e) {
        this.error = 'Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.'
      }
    },
    async switchTab(tab) {
      this.activeTab = tab
      await this.fetchServices()
    },
    getImageUrl(image) {
      if (!image) return ''
      if (image.startsWith('http')) return image
      return `http://localhost:3000/${image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')}`
    },
    startPayment(serviceId) {
      this.$router.push(`/thanh-toan/${serviceId}`)
    },
  },
}
</script>

<style scoped>
/* ComPriceList */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
.pricce-list {
  color: #4da6ff;
  width: 445;
  height: 70;
  font-family: Roboto;
  font-weight: 700;
  font-size: 60px;

  line-height: 100%;
  letter-spacing: 0%;
}
.price-list-container {
  font-family: 'Roboto', sans-serif;
  padding: 40px 20px;
  max-width: auto;
  margin: 0 auto;
  background-color: #f7f8fa;
}

.price-list-header {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  margin-bottom: 40px;
}

.tab-buttons {
  font-family: 'Roboto', sans-serif;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  background: #ffffff;
  width: 280px;
  height: 44px;
  border-radius: 15px;
  padding: 4px;
  gap: 20px;
}

.tab-buttons button {
  border: none;
  border-radius: 22px;
  background: transparent;
  color: rgba(93, 187, 255, 1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 600;
  width: 110px;
  height: 20px;
  font-family: Roboto Slab;
  line-height: 100%;
  letter-spacing: 0.83px;
  text-align: center;
}

.tab-buttons button.active {
  background: rgba(13, 146, 244, 1);
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.price-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 20px;
  width: 1301;
  height: 1790;
  top: 424px;
  left: 337px;
  gap: 40px;
}

/* Điều chỉnh style cho card dịch vụ */
.price-card {
  width: 100%;
  height: auto;
  min-height: 570px;
  padding: 50px 24px 24px; /* Tăng padding hai bên */
  background: rgba(227, 242, 253, 1);
  border: 1px solid rgba(179, 229, 252, 1);
  border-radius: 37px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.price-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-icon img {
  width: 120px;
  height: 100px;
  top: 52.5px;
  left: 143.5px;
  object-fit: contain;
}

/* Điều chỉnh khoảng cách và size cho tiêu đề */
h3 {
  width: 100%;
  min-height: 35px;
  margin: 16px 0;
  font-size: 20px;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: rgba(0, 74, 173, 1);
  text-align: center;
}

.price {
  font-family: Roboto Slab;
  font-weight: 400px;
  font-size: 30px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;

  color: rgba(0, 123, 255, 1);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.btn-detail {
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  background: #007bff;
  color: white;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 40px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  display: block;
  margin: 0 auto 24px;
  width: fit-content;
}

/* Điều chỉnh style cho features */
.features {
  width: 100%;
  height: auto;
  border-radius: 15px;
  padding: 16px;
  background: rgba(203, 233, 255, 1);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.features li {
  display: flex;
  align-items: flex-start; /* Đổi từ center thành flex-start */
  gap: 12px;
  padding: 8px 0;
  margin: 0;
}

.feature-icon-wrapper {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.feature-content {
  flex: 1;
  min-width: 0; /* Quan trọng để text wrap đúng */
}

.feature-text {
  display: block;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
  font-size: 14px;
}

.page-indicator {
  text-align: center;
  margin: 20px 0;
  color: #666;
  font-size: 14px;
}

.page-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.tab-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 22px;
  background: transparent;
  color: #5dbbff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 600;
  min-width: 80px;
}

.tab-btn.active {
  background: #0d92f4;
  color: white;
}

@media (max-width: 768px) {
  .page-btn {
    width: 32px;
    height: 32px;
  }

  .page-info {
    font-size: 12px;
  }

  .price-card {
    width: 407;
    height: 570;
    gap: 36px;
    border-radius: 37px;
    border-width: 1px;
    padding-top: 50px;
    padding-right: 12px;
    padding-bottom: 18px;
    padding-left: 12px;
    background: rgba(227, 242, 253, 1);
    border: 1px solid rgba(179, 229, 252, 1);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .price-card:hover {
    transform: translateY(-5px);
  }

  .card-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-icon img {
    width: 120px;
    height: 100px;
    top: 52.5px;
    left: 143.5px;
    object-fit: contain;
  }
  h3 {
    width: 283;
    height: 35;
    gap: 10px;

    text-align: center;
    color: rgba(0, 74, 173, 1);
    font-size: 20px;
    font-weight: 600;
    margin: 16px 0 8px;
  }

  .price {
    font-family: Roboto Slab;
    font-weight: 400px;
    font-size: 30px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;

    color: rgba(0, 123, 255, 1);
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .btn-detail {
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    background: #007bff;
    color: white;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 40px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    display: block;
    margin: 0 auto 24px;
    width: fit-content;
  }

  .features {
    width: 383;
    height: 214;
    border-radius: 15px;
    padding: 10px;
    gap: 10px;
    background: rgba(203, 233, 255, 1);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .features li {
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #333;
    font-size: 14px;
  }

  .feature-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .page-indicator {
    text-align: center;
    margin: 20px 0;
    color: #666;
    font-size: 14px;
  }

  .page-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .tab-btn {
    padding: 8px 24px;
    border: none;
    border-radius: 22px;
    background: transparent;
    color: #5dbbff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 600;
    min-width: 80px;
  }

  .tab-btn.active {
    background: #0d92f4;
    color: white;
  }

  /* Responsive Styles */

  /* Large Desktop: <= 1200px */
  @media (max-width: 1200px) {
    .price-list-container {
      max-width: 960px;
      padding: 30px 15px;
    }

    .price-list-header {
      margin-bottom: 30px;
    }

    .pricce-list {
      font-size: 50px;
      width: auto;
      height: auto;
    }

    .tab-buttons {
      width: 240px;
      height: 40px;
      border-radius: 20px;
    }

    .tab-buttons button {
      font-size: 14px;
      min-width: 70px;
    }

    .tab-buttons button.active {
      font-size: 13px;
    }

    .price-cards {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      padding: 15px;
      width: 100%;
      height: auto;
      top: 0;
      left: 0;
    }

    .price-card {
      width: 100%;
      height: auto;
      padding: 40px 10px 15px;
      border-radius: 30px;
    }

    .card-icon img {
      width: 100px;
      height: 80px;
    }

    h3 {
      font-size: 18px;
      width: auto;
      height: auto;
    }

    .price {
      font-size: 22px;
    }

    .features {
      width: 100%;
      height: auto;
      padding: 8px;
      border-radius: 12px;
    }
  }

  /* Tablet: <= 1024px */
  @media (max-width: 1024px) {
    .price-list-container {
      max-width: 800px;
      padding: 25px 10px;
    }

    .pricce-list {
      font-size: 45px;
    }

    .tab-buttons {
      width: 220px;
      height: 38px;
      border-radius: 18px;
      gap: 6px;
    }

    .tab-buttons button {
      font-size: 13px;
      min-width: 65px;
    }

    .tab-buttons button.active {
      font-size: 12px;
    }

    .price-cards {
      gap: 25px;
      padding: 10px;
    }

    .price-card {
      padding: 35px 8px 12px;
      border-radius: 25px;
    }

    .card-icon {
      width: 70px;
      height: 70px;
    }

    .card-icon img {
      width: 90px;
      height: 75px;
    }

    h3 {
      font-size: 16px;
    }

    .price {
      font-size: 20px;
    }

    .btn-detail {
      padding: 7px 35px;
      font-size: 15px;
    }

    .features li {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .feature-icon {
      width: 18px;
      height: 18px;
    }
  }

  /* Mobile: <= 768px */
  @media (max-width: 768px) {
    .price-list-container {
      max-width: 100%;
      padding: 20px 10px;
    }

    .price-list-header {
      margin-bottom: 25px;
    }

    .pricce-list {
      font-size: 40px;
      text-align: center;
    }

    .tab-buttons {
      width: 100%;
      max-width: 300px;
      height: 36px;
      border-radius: 18px;
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 3px;
      gap: 5px;
    }

    .tab-buttons button {
      font-size: 12px;
      min-width: 80px;
      padding: 6px 12px;
    }

    .tab-buttons button.active {
      font-size: 11px;
    }

    .price-cards {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 10px;
    }

    .price-card {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      padding: 30px 10px 10px;
      border-radius: 20px;
    }

    .card-icon {
      width: 60px;
      height: 60px;
    }

    .card-icon img {
      width: 80px;
      height: 65px;
    }

    h3 {
      font-size: 15px;
    }

    .price {
      font-size: 18px;
    }

    .btn-detail {
      padding: 6px 30px;
      font-size: 14px;
      border-radius: 18px;
    }

    .features {
      padding: 6px;
      border-radius: 10px;
    }

    .features li {
      font-size: 12px;
      margin-bottom: 8px;
      gap: 6px;
    }

    .feature-icon {
      width: 16px;
      height: 16px;
    }
  }

  /* Small Mobile: <= 480px */
  @media (max-width: 480px) {
    .price-list-container {
      padding: 15px 8px;
    }

    .price-list-header {
      margin-bottom: 20px;
    }

    .pricce-list {
      font-size: 32px;
    }

    .tab-buttons {
      max-width: 280px;
      height: auto;
      padding: 2px;
      border-radius: 16px;
      gap: 4px;
    }

    .tab-buttons button {
      font-size: 11px;
      min-width: 70px;
      padding: 5px 10px;
      border-radius: 16px;
    }

    .tab-buttons button.active {
      font-size: 10px;
    }

    .price-cards {
      gap: 15px;
      padding: 8px;
    }

    .price-card {
      padding: 25px 8px 8px;
      border-radius: 18px;
    }

    .card-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 15px;
    }

    .card-icon img {
      width: 70px;
      height: 60px;
    }

    h3 {
      font-size: 14px;
      margin: 12px 0 6px;
    }

    .price {
      font-size: 16px;
      margin-bottom: 12px;
    }

    .btn-detail {
      padding: 5px 25px;
      font-size: 13px;
      border-radius: 16px;
    }

    .features {
      padding: 5px;
      border-radius: 8px;
    }

    .features li {
      font-size: 11px;
      margin-bottom: 6px;
      gap: 5px;
    }

    .feature-icon {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
