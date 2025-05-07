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

        <button class="btn-detail">Bắt đầu</button>

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
        const { data } = await serviceService.getServices({ type, limit: 9 })
        this.services = data.map((s) => ({
          ...s,
          icon: s.image ? this.getImageUrl(s.image) : typeIconMap[s.type] || typeIconMap['web'],
          features: Array.isArray(s.description)
            ? s.description.map((text, idx) => ({
                icon: featureIconList[idx % featureIconList.length],
                text,
              }))
            : [],
          price: s.price.toLocaleString('vi-VN'),
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
  max-width: 1200px;
  margin: 0 auto;
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
  background: rgba(255, 255, 255, 1);

  width: 280px;
  height: 44px;
  border-radius: 22px;
  padding: 4px;
  gap: 8px;
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

  min-width: 80px;
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

@media (max-width: 768px) {
  .page-btn {
    width: 32px;
    height: 32px;
  }

  .page-info {
    font-size: 12px;
  }
}
</style>
