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
      <div class="charts-grid" v-if="!loading && !error">
        <div class="chart-card">
          <Bar :data="ordersChartData" :options="chartOptions" />
        </div>
        <div class="chart-card">
          <Line :data="servicesChartData" :options="chartOptions" />
        </div>
        <div class="chart-card">
          <Pie :data="newsChartDataPie" :options="pieOptions" />
        </div>
        <div class="chart-card">
          <Doughnut :data="bookingsChartDataDoughnut" :options="pieOptions" />
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
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-dashboard-home h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.admin-dashboard-home p {
  color: #666;
  font-size: 1.1rem;
}

.dashboard-overview {
  margin-top: 3rem;
}

.dashboard-overview h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 2.8rem;
  font-weight: 700;
  color: #3498db;
  margin: 0.5rem 0;
  background: linear-gradient(45deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error {
  color: #e74c3c;
  background: #ffd7d7;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

@media (max-width: 768px) {
  .admin-dashboard-home {
    padding: 1rem;
  }

  .stat-card {
    padding: 1.2rem;
  }

  .stat-number {
    font-size: 2.2rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .chart-card {
    padding: 1rem;
    min-height: 120px;
  }
}
</style>
