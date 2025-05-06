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
      <!-- Tổng quan Dashboard chỉ hiển thị cho admin -->
      <div class="nav-group" v-if="userRole === 'admin'">
        <div class="nav-item" :class="{ active: isDashboardActive }">
          <router-link to="/admin/dashboard" class="nav-item-content" active-class="active">
            <i class="fas fa-tachometer-alt"></i>
            <span>Tổng quan</span>
          </router-link>
        </div>
      </div>
      <!-- Quản lý Dịch vụ chỉ hiển thị cho admin -->
      <div class="nav-group" v-if="userRole === 'admin'">
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
            <!-- <span v-if="deletedServicesCount" class="badge">{{ deletedServicesCount }}</span> -->
          </router-link>
        </div>
      </div>

      <!-- Quản lý Tin tức hiển thị cho mọi role -->
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
            <!-- <span v-if="deletedNewsCount" class="badge">{{ deletedNewsCount }}</span> -->
          </router-link>
        </div>
      </div>

      <!-- Quản lý Đơn hàng chỉ hiển thị cho admin -->
      <div class="nav-group" v-if="userRole === 'admin'">
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

      <!-- Quản lý Thanh toán chỉ hiển thị cho admin -->
      <div class="nav-group" v-if="userRole === 'admin'">
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
        </div>
      </div>

      <!-- Thêm mục Quản lý Tài khoản chỉ hiển thị cho admin -->
      <div class="nav-group" v-if="userRole === 'admin'">
        <div class="nav-item" :class="{ active: isAccountMenuActive }" @click="toggleAccountMenu">
          <div class="nav-item-content">
            <i class="fas fa-users-cog"></i>
            <span>Quản lý Tài khoản</span>
          </div>
          <i class="fas" :class="isAccountMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
        </div>

        <div class="submenu" v-show="isAccountMenuOpen">
          <router-link to="/admin/tai-khoan/danh-sach" class="submenu-item" active-class="active">
            <i class="fas fa-list"></i>
            <span>Danh sách tài khoản</span>
          </router-link>
          <router-link to="/admin/tai-khoan/them-moi" class="submenu-item" active-class="active">
            <i class="fas fa-user-plus"></i>
            <span>Thêm tài khoản mới</span>
          </router-link>
          <router-link to="/admin/tai-khoan/thung-rac" class="submenu-item" active-class="active">
            <i class="fas fa-trash-alt"></i>
            <span>Thùng rác</span>
          </router-link>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-role">
          <i class="fas fa-user-tag"></i>
          <span>{{ userRoleDisplay }}</span>
        </div>
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
// import emitter from '@/eventBus'

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
      isAccountMenuOpen: false,
      deletedServicesCount: 0,
      userRole: 'admin', // Mặc định là admin
      // deletedNewsCount: 0,
    }
  },
  created() {
    // Kiểm tra xác thực và lấy thông tin role của người dùng
    if (authService.isAuthenticated()) {
      const userInfo = authService.getAdminInfo();
      if (userInfo && userInfo.role) {
        this.userRole = userInfo.role;
      }
      
      // Nếu role là staff, tự động redirect đến phần tin tức nếu không ở đó
      if (this.userRole === 'staff' && !this.$route.path.includes('/admin/tin-tuc')) {
        this.$router.push('/admin/tin-tuc/danh-sach');
      }
    } else {
      this.$router.push('/admin');
    }
  },
  computed: {
    currentPageTitle() {
      const path = this.$route.path;
      
      // Xử lý các trường hợp đặc biệt trước
      if (path.includes('/admin/tai-khoan')) {
        if (path.includes('/danh-sach')) return 'Danh sách tài khoản';
        if (path.includes('/them-moi')) return 'Thêm tài khoản mới';
        return 'Quản lý Tài khoản';
      }

      // Xử lý các route khác
      const routeMap = {
        'dashboard': 'Dashboard',
        'dich-vu/danh-sach': 'Danh sách dịch vụ',
        'dich-vu/them-moi': 'Thêm dịch vụ mới',
        'tin-tuc/danh-sach': 'Danh sách tin tức',
        'tin-tuc/them-moi': 'Thêm tin tức mới',
        'don-hang/danh-sach': 'Danh sách đơn hàng',
        'don-hang/cho-duyet': 'Đơn hàng chờ duyệt',
        'don-hang/lich-su': 'Lịch sử đơn hàng',
        'thanh-toan/danh-sach': 'Danh sách thanh toán',
        'thanh-toan/phuong-thuc': 'Phương thức thanh toán',
        'thanh-toan/lich-su': 'Lịch sử thanh toán'
      };

      // Tìm route phù hợp
      for (const [key, value] of Object.entries(routeMap)) {
        if (path.includes(key)) return value;
      }

      return 'Dashboard';
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
    isAccountMenuActive() {
      return this.$route.path.includes('/admin/tai-khoan')
    },
    isDashboardActive() {
      return this.$route.path === '/admin/dashboard'
    },
    userRoleDisplay() {
      return this.userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên'
    }
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
    toggleAccountMenu() {
      this.isAccountMenuOpen = !this.isAccountMenuOpen
    },
    closeMobileMenu() {
      this.isSidebarOpen = false
    },
    handleLogout() {
      authService.logout()
      this.$router.push('/admin')
    },
  },
  watch: {
    // Theo dõi thay đổi route để cập nhật menu khi chuyển trang
    '$route.path'(newPath) {
      // Nếu là staff và cố gắng truy cập các trang khác ngoài tin tức, chuyển về tin tức
      if (this.userRole === 'staff' && !newPath.includes('/admin/tin-tuc')) {
        this.$router.push('/admin/tin-tuc/danh-sach');
      }
    }
  }
};
</script>

<style scoped>
/* Import CSS variables */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

:root {
  /* Color variables */
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --secondary-color: #f1f5f9;
  --secondary-hover: #e2e8f0;
  --danger-color: #ef4444;
  --danger-hover: #dc2626;
  --success-color: #10b981;
  --success-hover: #059669;

  /* Text colors */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;

  /* Border colors */
  --border-color: #e2e8f0;
  --border-hover: #cbd5e1;

  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;

  /* Spacing variables */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1.25rem;
  --spacing-lg: 2rem;
  --spacing-xl: 2.5rem;

  /* Border radius */
  --border-radius-sm: 6px;
  --border-radius-md: 10px;
  --border-radius-lg: 14px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Font sizes */
  --font-size-xs: 16px;
  --font-size-sm: 18px;
  --font-size-md: 20px;
  --font-size-lg: 22px;
  --font-size-xl: 24px;
}

/* Dashboard-specific styles */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

/* Sidebar Styles */
.sidebar {
  width: 330px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 100;
}

.sidebar-collapsed .sidebar {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-collapsed .sidebar-header {
  justify-content: center;
  padding: 1rem;
}

.logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.sidebar-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.sidebar-collapsed .sidebar-header h2 {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-collapsed .nav-item {
  padding: 0.75rem;
  justify-content: center;
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-collapsed .nav-item-content {
  justify-content: center;
}

.nav-item i {
  font-size: 20px;
  width: 24px;
  text-align: center;
  color: #fff;
}

.nav-item a{
  color: #fff;
  text-decoration: none;
  border: none;
  background: none;
}

.nav-item span {
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
  color: #fff;
}

.nav-item.active .nav-item-content i,
.nav-item:hover .nav-item-content i {
  color: #fff;
}

.submenu {
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.sidebar-collapsed .submenu {
  position: absolute;
  left: 80px;
  background: #34495e;
  margin-left: 0;
  padding: 0.5rem;
  border-radius: 0 6px 6px 0;
  min-width: 200px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  top: 0;
  border-left: none;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.9rem 1.25rem;
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
  background: var(--danger-color);
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

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-collapsed .sidebar-footer {
  padding: 1rem;
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

.sidebar-collapsed .logout-btn span {
  display: none;
}

.logout-btn:hover {
  background: var(--danger-color);
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
  transition: all 0.3s ease;
  margin-left: 0;
}

.sidebar-collapsed .main-content {
  margin-left: 80px;
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

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
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
  color: var(--text-primary);
}

.content-area {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-open .mobile-overlay {
  display: block;
  opacity: 1;
}

/* Responsive styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
  }
  
  .sidebar-open .sidebar {
    transform: translateX(0);
  }
  
  .main-content {
    width: 100%;
    max-width: 100%;
    margin-left: 0 !important;
  }
  
  .sidebar-collapsed .main-content {
    margin-left: 0 !important;
  }
  
  .top-header {
    padding-left: 1rem;
  }
}

/* Thêm style cho hiển thị role */
.user-role {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 1rem;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #f0f0f0;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.user-role i {
  font-size: 1rem;
}

/* Add new styles for account management */
.nav-item i.fa-users-cog {
  color: #fff;
}

</style>
