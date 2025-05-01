<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>SDTC Admin</h2>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-item" 
               :class="{ 'active': isServiceMenuActive }"
               @click="toggleServiceMenu">
            <div class="nav-item-content">
              <i class="fas fa-cogs"></i>
              <span>Quản lý Dịch vụ</span>
            </div>
            <i class="fas" :class="isServiceMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </div>
          
          <div class="submenu" v-show="isServiceMenuOpen">
            <router-link 
              to="/admin/dich-vu/danh-sach" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-list"></i>
              <span>Danh sách dịch vụ</span>
            </router-link>
            <router-link 
              to="/admin/dich-vu/them-moi" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-plus"></i>
              <span>Thêm dịch vụ mới</span>
            </router-link>
            <router-link 
              to="/admin/dich-vu/thung-rac" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-trash-alt"></i>
              <span>Thùng rác</span>
              <span v-if="deletedServicesCount" class="badge">{{ deletedServicesCount }}</span>
            </router-link>
          </div>
        </div>
        
        <div class="nav-group">
          <div class="nav-item" 
               :class="{ 'active': isNewsMenuActive }"
               @click="toggleNewsMenu">
            <div class="nav-item-content">
              <i class="fas fa-newspaper"></i>
              <span>Quản lý Tin tức</span>
            </div>
            <i class="fas" :class="isNewsMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </div>
          
          <div class="submenu" v-show="isNewsMenuOpen">
            <router-link 
              to="/admin/tin-tuc/danh-sach" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-list"></i>
              <span>Danh sách tin tức</span>
            </router-link>
            <router-link 
              to="/admin/tin-tuc/them-moi" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-plus"></i>
              <span>Thêm tin tức mới</span>
            </router-link>
            <router-link 
              to="/admin/tin-tuc/thung-rac" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-trash-alt"></i>
              <span>Thùng rác</span>
              <span v-if="deletedNewsCount" class="badge">{{ deletedNewsCount }}</span>
            </router-link>
          </div>
        </div>
        
        <div class="nav-group">
          <div class="nav-item" 
               :class="{ 'active': isOrderMenuActive }"
               @click="toggleOrderMenu">
            <div class="nav-item-content">
              <i class="fas fa-shopping-cart"></i>
              <span>Quản lý Đơn hàng</span>
            </div>
            <i class="fas" :class="isOrderMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </div>
          
          <div class="submenu" v-show="isOrderMenuOpen">
            <router-link 
              to="/admin/don-hang/danh-sach" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-list"></i>
              <span>Danh sách đơn hàng</span>
            </router-link>
            <router-link 
              to="/admin/don-hang/cho-duyet" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-clock"></i>
              <span>Đơn hàng chờ duyệt</span>
            </router-link>
            <router-link 
              to="/admin/don-hang/lich-su" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-history"></i>
              <span>Lịch sử đơn hàng</span>
            </router-link>
          </div>
        </div>

        <div class="nav-group">
          <div class="nav-item" 
               :class="{ 'active': isPaymentMenuActive }"
               @click="togglePaymentMenu">
            <div class="nav-item-content">
              <i class="fas fa-credit-card"></i>
              <span>Quản lý Thanh toán</span>
            </div>
            <i class="fas" :class="isPaymentMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </div>
          
          <div class="submenu" v-show="isPaymentMenuOpen">
            <router-link 
              to="/admin/thanh-toan/danh-sach" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-list"></i>
              <span>Danh sách thanh toán</span>
            </router-link>
            <router-link 
              to="/admin/thanh-toan/phuong-thuc" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-money-bill"></i>
              <span>Phương thức thanh toán</span>
            </router-link>
            <router-link 
              to="/admin/thanh-toan/lich-su" 
              class="submenu-item"
              active-class="active">
              <i class="fas fa-history"></i>
              <span>Lịch sử thanh toán</span>
            </router-link>
          </div>
        </div>
      </nav>

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
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
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
import authService from '@/api/services/authService';
import serviceService from '@/api/services/serviceService';
import emitter from '@/eventBus';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      isSidebarCollapsed: false,
      isServiceMenuOpen: false,
      isNewsMenuOpen: false,
      isOrderMenuOpen: false,
      isPaymentMenuOpen: false,
      deletedServicesCount: 0,
      deletedNewsCount: 0
    }
  },
  async created() {
    // Kiểm tra xác thực khi component được tạo
    if (!authService.isAuthenticated()) {
      this.$router.push('/admin');
      return;
    }
    
    // Load số lượng dịch vụ và tin tức đã xóa
    await this.loadDeletedServicesCount();
    await this.loadDeletedNewsCount();
    
    // Listen for updates to deleted items count using mitt
    emitter.on('update-deleted-services-count', this.loadDeletedServicesCount);
    emitter.on('update-deleted-news-count', this.loadDeletedNewsCount);
  },
  beforeUnmount() {
    // Remove event listeners
    emitter.off('update-deleted-services-count', this.loadDeletedServicesCount);
    emitter.off('update-deleted-news-count', this.loadDeletedNewsCount);
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
        'phuong-thuc': 'Phương thức thanh toán'
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
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      document.body.classList.toggle('sidebar-collapsed')
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
        authService.logout();
        
        // Chuyển về trang đăng nhập
        await this.$router.push('/admin');
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    async loadDeletedServicesCount() {
      try {
        const services = await serviceService.getServices();
        this.deletedServicesCount = services.filter(service => service.isDeleted).length;
      } catch (error) {
        console.error('Error loading deleted services count:', error);
      }
    },
    async loadDeletedNewsCount() {
      try {
        const deletedNewsInfo = JSON.parse(localStorage.getItem('deletedNewsInfo') || '[]');
        this.deletedNewsCount = deletedNewsInfo.filter(news => news.isDeleted).length;
      } catch (error) {
        console.error('Error loading deleted news count:', error);
      }
    }
  },
  watch: {
    '$route'(to) {
      if (to.path.includes('/admin/dich-vu')) {
        this.isServiceMenuOpen = true;
        this.loadDeletedServicesCount();
      }
      if (to.path.includes('/admin/tin-tuc')) {
        this.isNewsMenuOpen = true;
        this.loadDeletedNewsCount();
      }
      if (to.path.includes('/admin/don-hang')) {
        this.isOrderMenuOpen = true;
      }
      if (to.path.includes('/admin/thanh-toan')) {
        this.isPaymentMenuOpen = true;
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #2c3e50 0%, #3498db 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.sidebar-nav {
  padding: 1.5rem 1rem;
  flex: 1;
}

.nav-group {
  margin-bottom: 0.5rem;
}

.nav-item-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  width: 24px;
  text-align: center;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #e53e3e; /* Màu đỏ khi hover */
}

.logout-btn:active {
  transform: translateY(1px);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.top-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.menu-toggle {
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background: #f8f9fa;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 50px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.admin-name {
  font-weight: 500;
  color: #2c3e50;
}

.content-area {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.submenu {
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  position: relative;
}

.submenu-item i {
  font-size: 1rem;
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.submenu-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 500;
}

.badge {
  position: absolute;
  right: 10px;
  background: #e53e3e;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .sidebar-collapsed .sidebar {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .admin-name {
    display: none;
  }
}
</style> 