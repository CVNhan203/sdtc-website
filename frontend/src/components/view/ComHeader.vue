<template>
  <header class="main-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/"
          ><img :src="require('@/assets/sdtc-image/trang-chu/Logo/sdtc.png')" alt="Logo"
        /></router-link>
      </div>

      <!-- Thanh Điều Hướng -->
      <nav>
        <ul class="menu">
          <li><router-link to="/">Trang Chủ</router-link></li>
          <li><router-link to="/procedure">Quy Trình</router-link></li>
          <li><router-link to="/team">Đội Ngũ</router-link></li>
          <li><router-link to="/price-list">Bảng Giá</router-link></li>
          <li><router-link to="/news">Tin Tức</router-link></li>
        </ul>
      </nav>
      <!-- Nút đặc lịch tư vấn -->
      <div class="advise-btn">
        <router-link to="/advise" class="btn">Đặt lịch tư vấn</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ComHeader',
  data() {
    return {
      isMenuOpen: false,
    }
  },
}
</script>

<style scoped>
.main-header {
  background: #ffffff;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-container {
  width: 1440px;
  height: 74px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 50px;
  width: 131.71px;
}

.menu {
  display: flex;
  list-style: none;
  width: 539px;
  height: 23px;
  margin: 0;
  padding: 0;
  gap: 40px;
}

.menu li a {
  font-family: 'Roboto', sans-serif;
  text-decoration: none;
  color: #8fa0ad;
  font-weight: 400;
  font-size: 17px;
  transition: color 0.3s ease;
  line-height: 100%;
  letter-spacing: 0%;
}

.menu li a:hover {
  color: #000000;
}

.menu li a.router-link-active {
  color: #000000 !important;
  font-weight: 700 !important;
}

.advise-btn .btn {
  background-color: transparent;
  color: #2663ff;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #2663ff;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.advise-btn .btn:hover {
  background-color: #2663ff;
  color: white;
}

@media (max-width: 768px) {
  .menu {
    display: none;
  }

  .advise-btn {
    display: none;
  }
}
</style>