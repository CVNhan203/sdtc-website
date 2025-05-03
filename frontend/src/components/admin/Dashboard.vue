<template>
  <div
    class="dashboard-container"
    :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'sidebar-open': isSidebarOpen }"
  >
    <!-- Mobile Overlay -->
    <div class="mobile-overlay" @click="closeMobileMenu"></div>

    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>SDTC Admin</h2>
      </div>
      <!-- Tổng quan Dashboard -->
      <div class="nav-group">
        <div class="nav-item" :class="{ active: isDashboardActive }">
          <router-link to="/admin/dashboard" class="nav-item-content">
            <i class="fas fa-tachometer-alt"></i>
            <span>Tổng quan</span>
          </router-link>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-item" :class="{ active: isServiceMenuActive }" @click="toggleServiceMenu">
          <div class="nav-item-content">
            <i class="fas fa-cogs"></i>
            <span>Quản lý Dịch vụ</span>
          </div>
          <i class="fas" :class="isServiceMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </div>

        <div class="submenu" v-show="isServiceMenuOpen">
          <router-link to="/admin/dich-vu/danh-sach" class="submenu-item" active-class="active">
            <i class="fas fa-list"></i>
            <span>Danh sách dịch vụ</span>
          </router-link>
          <router-link to="/admin/dich-vu/them-moi" class="submenu-item" active-class="active">
            <i class="fas fa-plus"></i>
            <span>Thêm dịch vụ mới</span>
          </router-link>
          <router-link to="/admin/dich-vu/thung-rac" class="submenu-item" active-class="active">
            <i class="fas fa-trash-alt"></i>
            <span>Thùng rác</span>
            <span v-if="deletedServicesCount" class="badge">{{ deletedServicesCount }}</span>
          </router-link>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-item" :class="{ active: isNewsMenuActive }" @click="toggleNewsMenu">
          <div class="nav-item-content">
            <i class="fas fa-newspaper"></i>
            <span>Quản lý Tin tức</span>
          </div>
          <i class="fas" :class="isNewsMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </div>

        <div class="submenu" v-show="isNewsMenuOpen">
          <router-link to="/admin/tin-tuc/danh-sach" class="submenu-item" active-class="active">
            <i class="fas fa-list"></i>
            <span>Danh sách tin tức</span>
          </router-link>
          <router-link to="/admin/tin-tuc/them-moi" class="submenu-item" active-class="active">
            <i class="fas fa-plus"></i>
            <span>Thêm tin tức mới</span>
          </router-link>
          <router-link to="/admin/tin-tuc/thung-rac" class="submenu-item" active-class="active">
            <i class="fas fa-trash-alt"></i>
            <span>Thùng rác</span>
            <span v-if="deletedNewsCount" class="badge">{{ deletedNewsCount }}</span>
          </router-link>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-item" :class="{ active: isOrderMenuActive }" @click="toggleOrderMenu">
          <div class="nav-item-content">
            <i class="fas fa-shopping-cart"></i>
            <span>Quản lý Đơn hàng</span>
          </div>
          <i class="fas" :class="isOrderMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </div>

        <div class="submenu" v-show="isOrderMenuOpen">
          <router-link to="/admin/don-hang/danh-sach" class="submenu-item" active-class="active">
            <i class="fas fa-list"></i>
            <span>Danh sách đơn hàng</span>
          </router-link>
          <router-link to="/admin/don-hang/cho-duyet" class="submenu-item" active-class="active">
            <i class="fas fa-clock"></i>
            <span>Đơn hàng chờ duyệt</span>
          </router-link>
          <router-link to="/admin/don-hang/lich-su" class="submenu-item" active-class="active">
            <i class="fas fa-history"></i>
            <span>Lịch sử đơn hàng</span>
          </router-link>
        </div>
      </div>

      <div class="nav-group">
        <div class="nav-item" :class="{ active: isPaymentMenuActive }" @click="togglePaymentMenu">
          <div class="nav-item-content">
            <i class="fas fa-credit-card"></i>
            <span>Quản lý Thanh toán</span>
          </div>
          <i class="fas" :class="isPaymentMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </div>

        <div class="submenu" v-show="isPaymentMenuOpen">
          <router-link to="/admin/thanh-toan/danh-sach" class="submenu-item" active-class="active">
            <i class="fas fa-list"></i>
            <span>Danh sách thanh toán</span>
          </router-link>
          <router-link
            to="/admin/thanh-toan/phuong-thuc"
            class="submenu-item"
            active-class="active"
          >
            <i class="fas fa-money-bill"></i>
            <span>Phương thức thanh toán</span>
          </router-link>
          <router-link to="/admin/thanh-toan/lich-su" class="submenu-item" active-class="active">
            <i class="fas fa-history"></i>
            <span>Lịch sử thanh toán</span>
          </router-link>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
        </div>

        <!-- <div class="header-right">
          <div class="admin-profile">
            <img src="@/assets/avatar-placeholder.png" alt="Admin" class="avatar" />
            <span class="admin-name">Admin</span>
          </div>
        </div> -->
      </header>

      <main class="content-area">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import authService from '@/api/services/authService'
import emitter from '@/eventBus'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      isSidebarCollapsed: false,
      isSidebarOpen: false,
      isServiceMenuOpen: false,
      isNewsMenuOpen: false,
      isOrderMenuOpen: false,
      isPaymentMenuOpen: false,
      deletedServicesCount: 0,
      deletedNewsCount: 0,
    }
  },
  async created() {
    // Kiểm tra xác thực khi component được tạo
    if (!authService.isAuthenticated()) {
      this.$router.push('/admin')
      return
    }

    // Load số lượng dịch vụ và tin tức đã xóa
    await this.loadDeletedServicesCount()
    await this.loadDeletedNewsCount()

    // Listen for updates to deleted items count using mitt
    emitter.on('update-deleted-services-count', this.loadDeletedServicesCount)
    emitter.on('update-deleted-news-count', this.loadDeletedNewsCount)

    // Handle screen resize
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  beforeUnmount() {
    // Remove event listeners
    emitter.off('update-deleted-services-count', this.loadDeletedServicesCount)
    emitter.off('update-deleted-news-count', this.loadDeletedNewsCount)
    // Remove resize event listener
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    currentPageTitle() {
      const routeMap = {
        'danh-sach': 'Danh sách dịch vụ',
        'them-moi': 'Thêm dịch vụ mới',
        'tin-tuc': 'Quản lý Tin tức',
        'don-hang': 'Quản lý Đơn hàng',
        'thanh-toan': 'Quản lý Thanh toán',
        'cho-duyet': 'Đơn hàng chờ duyệt',
        'lich-su': 'Lịch sử',
        'phuong-thuc': 'Phương thức thanh toán',
      }
      const path = this.$route.path.split('/').pop()
      return routeMap[path] || 'Dashboard'
    },
    isServiceMenuActive() {
      return this.$route.path.includes('/admin/dich-vu')
    },
    isNewsMenuActive() {
      return this.$route.path.includes('/admin/tin-tuc')
    },
    isOrderMenuActive() {
      return this.$route.path.includes('/admin/don-hang')
    },
    isPaymentMenuActive() {
      return this.$route.path.includes('/admin/thanh-toan')
    },
  },
  methods: {
    toggleSidebar() {
      if (window.innerWidth <= 768) {
        // On mobile, toggle open/close
        this.isSidebarOpen = !this.isSidebarOpen
      } else {
        // On desktop, toggle collapsed state
        this.isSidebarCollapsed = !this.isSidebarCollapsed
      }
    },
    toggleServiceMenu() {
      this.isServiceMenuOpen = !this.isServiceMenuOpen
    },
    toggleNewsMenu() {
      this.isNewsMenuOpen = !this.isNewsMenuOpen
    },
    toggleOrderMenu() {
      this.isOrderMenuOpen = !this.isOrderMenuOpen
    },
    togglePaymentMenu() {
      this.isPaymentMenuOpen = !this.isPaymentMenuOpen
    },
    async handleLogout() {
      try {
        // Xóa thông tin đăng nhập
        authService.logout()

        // Chuyển về trang đăng nhập
        await this.$router.push('/admin')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    async loadDeletedServicesCount() {
      try {
        const deletedServicesInfo = JSON.parse(localStorage.getItem('deletedServicesInfo') || '[]')
        this.deletedServicesCount = deletedServicesInfo.filter(
          (service) => service.isDeleted
        ).length
      } catch (error) {
        console.error('Error loading deleted services count:', error)
      }
    },
    async loadDeletedNewsCount() {
      try {
        const deletedNewsInfo = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]')
        this.deletedNewsCount = deletedNewsInfo.filter((news) => news.isDeleted).length
      } catch (error) {
        console.error('Error loading deleted news count:', error)
      }
    },
    handleResize() {
      // Set appropriate sidebar state based on screen size
      if (window.innerWidth <= 768) {
        // On mobile, keep sidebar visible
        this.isSidebarCollapsed = false
        this.isSidebarOpen = false
      } else {
        // On desktop, reset sidebar open state
        this.isSidebarOpen = false
      }
    },
    closeMobileMenu() {
      this.isSidebarOpen = false
    },
  },
  mounted() {
    // Handle resize events
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  watch: {
    $route(to) {
      if (to.path.includes('/admin/dich-vu')) {
        this.isServiceMenuOpen = true
        this.loadDeletedServicesCount()
      }
      if (to.path.includes('/admin/tin-tuc')) {
        this.isNewsMenuOpen = true
        this.loadDeletedNewsCount()
      }
      if (to.path.includes('/admin/don-hang')) {
        this.isOrderMenuOpen = true
      }
      if (to.path.includes('/admin/thanh-toan')) {
        this.isPaymentMenuOpen = true
      }
    },
  },
}
</script>

<style scoped>
/* All styles moved to admin.css */
@import '@/styles/admin.css';
</style>
