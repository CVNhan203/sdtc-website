<template>
  <div class="admin-dashboard-home">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1>Dashboard Admin</h1>
        <p>Xem tổng quan và quản lý hệ thống của bạn</p>
      </div>
      <div class="header-actions">
        <button class="refresh-btn" @click="fetchDashboardStats">
          <i class="fas fa-sync-alt"></i> Làm mới
        </button>
      </div>
    </div>

    <div class="dashboard-content">
      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="fetchDashboardStats" class="retry-btn">Thử lại</button>
      </div>
      
      <div v-else>
        <div class="stats-grid">
          <div class="stat-card orders">
            <div class="stat-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-info">
              <h3>Đơn hàng</h3>
              <p class="stat-number">{{ stats.orders }}</p>
              <p class="stat-subtitle">Tổng đơn hàng</p>
            </div>
          </div>
          <div class="stat-card services">
            <div class="stat-icon">
              <i class="fas fa-concierge-bell"></i>
            </div>
            <div class="stat-info">
              <h3>Dịch vụ</h3>
              <p class="stat-number">{{ stats.services }}</p>
              <p class="stat-subtitle">Dịch vụ hoạt động</p>
            </div>
          </div>
          <div class="stat-card news">
            <div class="stat-icon">
              <i class="fas fa-newspaper"></i>
            </div>
            <div class="stat-info">
              <h3>Tin tức</h3>
              <p class="stat-number">{{ stats.news }}</p>
              <p class="stat-subtitle">Bài đăng</p>
            </div>
          </div>
          <div class="stat-card bookings">
            <div class="stat-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="stat-info">
              <h3>Lịch đặt</h3>
              <p class="stat-number">{{ stats.bookings }}</p>
              <p class="stat-subtitle">Lịch hẹn</p>
            </div>
          </div>
        </div>

        <div class="charts-container">
          <div class="chart-row">
            <div class="chart-card">
              <h3>Thống kê đơn hàng</h3>
              <div class="chart-wrapper">
                <Bar :data="ordersChartData" :options="chartOptions" />
              </div>
            </div>
            <div class="chart-card">
              <h3>Thống kê dịch vụ</h3>
              <div class="chart-wrapper">
                <Line :data="servicesChartData" :options="chartOptions" />
              </div>
            </div>
          </div>
          <div class="chart-row">
            <div class="chart-card">
              <h3>Phân bố tin tức</h3>
              <div class="chart-wrapper">
                <Pie :data="newsChartDataPie" :options="pieOptions" />
              </div>
            </div>
            <div class="chart-card">
              <h3>Phân bố lịch đặt</h3>
              <div class="chart-wrapper">
                <Doughnut :data="bookingsChartDataDoughnut" :options="pieOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/config'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'
import { Chart, BarElement, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'

Chart.register(BarElement, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default {
  name: 'AdminDashboardHome',
  components: { Bar, Line, Pie, Doughnut },
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
  computed: {
    ordersChartData() {
      return {
        labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
        datasets: [{
          label: 'Đơn hàng',
          data: [
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 50) + 10,
            Math.floor(Math.random() * 50) + 10
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        }]
      }
    },
    servicesChartData() {
      return {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
        datasets: [{
          label: 'Dịch vụ',
          data: [
            Math.floor(Math.random() * 30) + 5,
            Math.floor(Math.random() * 30) + 5,
            Math.floor(Math.random() * 30) + 5,
            Math.floor(Math.random() * 30) + 5,
            Math.floor(Math.random() * 30) + 5,
            Math.floor(Math.random() * 30) + 5
          ],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.4,
        }]
      }
    },
    newsChartDataPie() {
      return {
        labels: ['Tin tức', 'Sự kiện', 'Blog'],
        datasets: [{
          label: 'Tin tức',
          data: [
            this.stats.news, 
            Math.floor(Math.random() * 30) + 5, 
            Math.floor(Math.random() * 20) + 5
          ],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderColor: [
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)'
          ],
          borderWidth: 1
        }]
      }
    },
    bookingsChartDataDoughnut() {
      return {
        labels: ['Đã xác nhận', 'Đang chờ', 'Đã hủy'],
        datasets: [{
          label: 'Lịch đặt',
          data: [
            Math.floor(this.stats.bookings * 0.6), 
            Math.floor(this.stats.bookings * 0.3), 
            Math.floor(this.stats.bookings * 0.1)
          ],
          backgroundColor: [
            'rgba(124, 58, 237, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgb(124, 58, 237)',
            'rgb(59, 130, 246)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 1
        }]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { 
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6
          },
        },
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { precision: 0 },
            grid: { color: 'rgba(156, 163, 175, 0.1)' } 
          },
          x: { 
            grid: { display: false } 
          }
        }
      }
    },
    pieOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true, 
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: 12 }
            }
          },
          tooltip: { 
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6
          },
        }
      }
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
  font-family: 'Inter', sans-serif;
  color: #1f2937;
  background-color: #f9fafb;
  min-height: 100vh;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.welcome-section p {
  font-size: 16px;
  color: #6b7280;
  margin: 8px 0 0 0;
}

.header-actions .refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-actions .refresh-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.loader {
  border: 4px solid #f3f4f6;
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b91c1c;
}

.error-container i {
  font-size: 36px;
  margin-bottom: 16px;
}

.error-container p {
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: #dc2626;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card.orders {
  border-left-color: #3b82f6;
}

.stat-card.services {
  border-left-color: #10b981;
}

.stat-card.news {
  border-left-color: #f59e0b;
}

.stat-card.bookings {
  border-left-color: #8b5cf6;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 16px;
}

.orders .stat-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.services .stat-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.news .stat-icon {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.bookings .stat-icon {
  background-color: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.stat-subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin: 4px 0 0 0;
}

.charts-container {
  margin-top: 32px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

@media (max-width: 1024px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .header-actions .refresh-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}

@media (max-width: 640px) {
  .admin-dashboard-home {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    padding: 16px;
  }
  
  .chart-wrapper {
    height: 220px;
  }
}
</style>
