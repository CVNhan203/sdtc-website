<template>
  <div class="admin-dashboard-home">
    <h1>Chào mừng đến trang Quản trị Admin!</h1>
    <p>Đây là trang tổng quan dashboard dành cho quản trị viên.</p>

    <div class="dashboard-overview">
      <h2>Tổng quan hệ thống</h2>
      <div v-if="loading">Đang tải dữ liệu...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="stats-grid">
        <div class="stat-card">
          <h3>Đơn hàng</h3>
          <p class="stat-number">{{ stats.orders }}</p>
        </div>
        <div class="stat-card">
          <h3>Dịch vụ</h3>
          <p class="stat-number">{{ stats.services }}</p>
        </div>
        <div class="stat-card">
          <h3>Tin tức</h3>
          <p class="stat-number">{{ stats.news }}</p>
        </div>
        <div class="stat-card">
          <h3>Lịch đặt</h3>
          <p class="stat-number">{{ stats.bookings }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/config'

export default {
  name: 'AdminDashboardHome',
  data() {
    return {
      stats: {
        orders: 0,
        services: 0,
        news: 0,
        bookings: 0,
      },
      loading: true,
      error: '',
    }
  },
  mounted() {
    this.fetchDashboardStats()
  },
  methods: {
    async fetchDashboardStats() {
      this.loading = true
      this.error = ''
      try {
        const res = await api.get('/admin/dashboard')
        if (res.data.success) {
          this.stats = res.data.data
        } else {
          this.error = 'Không lấy được dữ liệu tổng quan.'
        }
      } catch (err) {
        this.error = 'Lỗi khi tải dữ liệu tổng quan.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
@import "@/styles/admin.css";

.admin-dashboard-home {
  padding: var(--spacing-xl);
  text-align: center;
}

.dashboard-overview {
  margin-top: var(--spacing-xl);
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md) var(--spacing-lg);
  min-width: 180px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0;
}

.error {
  color: var(--danger-color);
  margin-top: var(--spacing-md);
}
</style>