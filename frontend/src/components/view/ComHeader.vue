<template>
  <header class="main-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/"
          ><img :src="require('@/assets/sdtc-image/trang-chu/Logo/sdtc.png')" alt="Logo"
        /></router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" @click="toggleMenu">
        <i class="fas" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </button>

      <!-- Thanh Điều Hướng -->
      <nav :class="{ 'menu-open': isMenuOpen }">
        <ul class="menu">
          <li><router-link to="/" @click="closeMenu">Trang Chủ</router-link></li>
          <li><router-link to="/procedure" @click="closeMenu">Quy Trình</router-link></li>
          <li><router-link to="/team" @click="closeMenu">Đội Ngũ</router-link></li>
          <li><router-link to="/price-list" @click="closeMenu">Bảng Giá</router-link></li>
          <li><router-link to="/news" @click="closeMenu">Tin Tức</router-link></li>
        </ul>
        <div v-if="isMenuOpen" class="advise-btn mobile">
          <router-link to="/advise" class="btn" @click="closeMenu">Đặt lịch tư vấn</router-link>
        </div>
      </nav>
      <!-- Nút đặt lịch tư vấn -->
      <div class="advise-btn">
        <router-link to="/advise" class="btn" @click="closeMenu">Đặt lịch tư vấn</router-link>
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
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  width: 100%;
  max-width: 1440px;
  height: 120px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo img {
  height: 100px;
  width: 260px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: #2663ff;
  cursor: pointer;
  padding: 10px;
}

.menu {
  display: flex;
  list-style: none;
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
  font-size: 20px;
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
  transition: all 0.3s ease;
}

.advise-btn .btn:hover {
  background-color: #2663ff;
  color: white;
}

/* Responsive Styles */
@media screen and (max-width: 1200px) {
  .header-container {
    padding: 0 15px;
  }

  .logo img {
    height: 80px;
    width: 220px;
  }

  .menu {
    gap: 30px;
  }

  .menu li a {
    font-size: 18px;
  }
}

@media screen and (max-width: 992px) {
  .header-container {
    height: 100px;
  }

  .logo img {
    height: 70px;
    width: 200px;
  }

  .menu {
    gap: 25px;
  }

  .menu li a {
    font-size: 16px;
  }

  .advise-btn .btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media screen and (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .header-container {
    height: 80px;
  }

  .logo img {
    height: 60px;
    width: 160px;
  }

  nav {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    height: 0;
    background: white;
    overflow: hidden;
    transition: height 0.3s ease;
  }

  nav.menu-open {
    height: calc(100vh - 70px);
  }

  .menu {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    height: auto;
  }

  .menu li a {
    font-size: 18px;
  }

  .advise-btn {
    display: none;
  }

  .advise-btn.mobile {
    display: block;
    width: 100%;
    text-align: center;
    padding: 20px;
  }

  .advise-btn.mobile .btn {
    width: 80%;
    max-width: 300px;
  }
}

@media screen and (max-width: 480px) {
  .header-container {
    height: 70px;
  }

  .logo img {
    height: 50px;
    width: 140px;
  }

  nav.menu-open {
    height: calc(100vh - 70px);
  }

  .menu {
    gap: 15px;
  }

  .menu li a {
    font-size: 16px;
  }
}
</style>