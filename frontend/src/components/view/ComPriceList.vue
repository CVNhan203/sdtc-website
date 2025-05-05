<template>
    <div class="price-list-container">
      <!-- Phần header cho bảng giá -->
      <div class="price-list-header">
        <h2 class="pricce-list">Bảng giá dịch vụ</h2>
        <!-- Tab chuyển đổi giữa các loại dịch vụ -->
        <div class="tab-buttons">
          <button 
            :class="{ active: activeTab === 'Website' }"
            @click="switchTab('Website')"
          >
            Website
          </button>
          <button 
            :class="{ active: activeTab === 'App' }"
            @click="switchTab('App')"
          >
            App
          </button>
          <button 
            :class="{ active: activeTab === 'Agency' }"
            @click="switchTab('Agency')"
          >
            Agency
          </button>
        </div>
      </div>
      
      <!-- Hiển thị card dịch vụ -->
      <div class="price-cards">
        <div v-for="(service, index) in filteredServices" :key="index" class="price-card">
          <!-- Icon dịch vụ -->
          <div class="card-icon">
            <img :src="service.icon" :alt="service.title">
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
                  <img :src="feature.icon" class="feature-icon" alt="Feature Icon">
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
  export default {
    name: 'ComPriceList',
    data() {
      return {
        // Tab đang chọn, mặc định là Website
        activeTab: 'Website',
        // Danh sách dịch vụ phân loại theo type
        services: [
          // Website Services
          {
            type: 'Website',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Website',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          // App Services
          {
            type: 'App',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'App',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          // Agency Services
          {
            type: 'Agency',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế Agency',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/Agency.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế Website',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/website.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          {
            type: 'Agency',
            title: 'Gói Thiết Kế App',
            price: '2.500.000',
            icon: require('@/assets/sdtc-image/icon/App.svg'),
            features: [
              { icon: require('@/assets/sdtc-image/icon/ldea.svg'), text: 'Phong cách: Hiện đại, tối giản' },
              { icon: require('@/assets/sdtc-image/icon/shake-hand.svg'), text: 'Tư vấn thiết kế miễn phí' },
              { icon: require('@/assets/sdtc-image/icon/Timing.svg'), text: 'Thời gian triển khai: 10-20 ngày' },
              { icon: require('@/assets/sdtc-image/icon/presentation.svg'), text: 'Chỉnh sửa tối đa 3 lần' },
              { icon: require('@/assets/sdtc-image/icon/human.svg'), text: 'Kiến trúc sư 1-3 năm kinh nghiệm' },
              { icon: require('@/assets/sdtc-image/icon/target.svg'), text: 'Bàn giao: 3D + bản vẽ kỹ thuật' }
            ]
          },
          
        ]
      }
    },
    computed: {
      // Lọc dịch vụ theo tab đang chọn
      filteredServices() {
        return this.services.filter(service => service.type === this.activeTab)
      }
    },
    methods: {
      // Phương thức chuyển đổi tab
      switchTab(tab) {
        this.activeTab = tab;
      }
    }
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
    color:rgba(0, 74, 173, 1);
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
    color: #5DBBFF;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 600;
    min-width: 80px;
  }
  
  .tab-btn.active {
    background: #0D92F4;
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
