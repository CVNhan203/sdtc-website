<template>
  <div class="admin-dashboard-home">
    <h1>Chào mừng đến trang Quản trị Admin!</h1>
    <p>Đây là trang tổng quan dashboard dành cho quản trị viên.</p>

    <div class="dashboard-overview">
      <h2>Tổng quan hệ thống</h2>
      <div v-if="loading">Đang tải dữ liệu...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="stats-row">
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
        <div class="charts-section">
          <h2>Biểu đồ thống kê</h2>
          <div class="charts-grid">
            <div class="chart-card">
              <div class="chart-title">Đơn hàng (Bar)</div>
              <Bar :data="ordersChartData" :options="chartOptions" />
            </div>
            <div class="chart-card">
              <div class="chart-title">Dịch vụ (Line)</div>
              <Line :data="servicesChartData" :options="chartOptions" />
            </div>
            <div class="chart-card">
              <div class="chart-title">Tin tức (Pie)</div>
              <Pie :data="newsChartDataPie" :options="pieOptions" />
            </div>
            <div class="chart-card">
              <div class="chart-title">Lịch đặt (Doughnut)</div>
              <Doughnut :data="bookingsChartDataDoughnut" :options="pieOptions" />
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
        labels: ['Đơn hàng'],
        datasets: [{
          label: 'Đơn hàng',
          data: [this.stats.orders],
          backgroundColor: '#3498db',
        }]
      }
    },
    servicesChartData() {
      return {
        labels: ['Dịch vụ'],
        datasets: [{
          label: 'Dịch vụ',
          data: [this.stats.services],
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39,174,96,0.2)',
          fill: true,
          tension: 0.4,
        }]
      }
    },
    newsChartDataPie() {
      return {
        labels: ['Tin tức', 'Khác'],
        datasets: [{
          label: 'Tin tức',
          data: [this.stats.news, Math.max(1, 100 - this.stats.news)],
          backgroundColor: ['#e67e22', '#eee'],
        }]
      }
    },
    bookingsChartDataDoughnut() {
      return {
        labels: ['Lịch đặt', 'Khác'],
        datasets: [{
          label: 'Lịch đặt',
          data: [this.stats.bookings, Math.max(1, 100 - this.stats.bookings)],
          backgroundColor: ['#9b59b6', '#eee'],
        }]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
          x: { grid: { display: false } }
        }
      }
    },
    pieOptions() {
      return {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'bottom' },
          tooltip: { enabled: true },
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
  padding: 20px;
  /* Xóa max-width để full màn hình */
  width: 100%;
  margin: 0;
  background: #f6f9fb;
}

.admin-dashboard-home h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.admin-dashboard-home p {
  color: #666;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-overview {
  margin-top: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.07);
  padding: 20px;
  /* full width */
  width: 100%;
}

.dashboard-overview h2 {
  color: #2c3e50;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1 1 220px;
  background: linear-gradient(135deg, #f8fafc 70%, #eaf6fb 100%);
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.09);
  padding: 1.5rem 1rem;
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #e3eaf1;
  min-width: 220px;
}

.stat-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.13);
}

.stat-card h3 {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2.4rem;
  font-weight: 700;
  color: #3498db;
  margin: 0.5rem 0;
  background: linear-gradient(45deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.charts-section {
  margin-top: 2.5rem;
  padding: 1.5rem 1vw 0.5rem 1vw;
  background: #fafdff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.06);
  width: 100%;
}

.charts-section h2 {
  text-align: center;
  font-size: 1.3rem;
  color: #2980b9;
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
  padding: 0.5rem 0;
  width: 100%;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.07);
  padding: 1.2rem 0.7rem 1.5rem 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 220px;
  border: 1px solid #e3eaf1;
  width: 100%;
}

.chart-title {
  font-size: 1.05rem;
  color: #555;
  font-weight: 500;
  margin-bottom: 0.7rem;
  letter-spacing: 0.5px;
}

.error {
  color: #e74c3c;
  background: #ffd7d7;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .stats-row {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .admin-dashboard-home {
    padding: 0.5rem;
  }
  .dashboard-overview {
    padding: 1rem 0.2rem 1.5rem 0.2rem;
  }
  .charts-section {
    padding: 1rem 0.2rem 0.5rem 0.2rem;
  }
  .stat-card {
    padding: 1rem 0.5rem;
    margin: 0.3rem 0;
  }
  .stat-number {
    font-size: 1.7rem;
  }
  .chart-card {
    min-height: 160px;
    padding: 0.7rem 0.2rem 1rem 0.2rem;
  }
}
</style>
