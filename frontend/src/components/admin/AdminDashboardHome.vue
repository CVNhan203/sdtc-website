<template>
  <div class="admin-dashboard-home">
    <h1>Chào mừng đến trang Quản trị Admin!</h1>
    <p>Đây là trang tổng quan dashboard dành cho quản trị viên.</p>

    <div class="dashboard-overview">
      <h2>Tổng quan hệ thống</h2>
      <div v-if="loading">Đang tải dữ liệu...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Đơn hàng</h3>
            <p class="stat-number">{{ stats.orders }}</p>
          </div>
          <div class="stat-card">
            <h3>Thanh toán</h3>
            <p class="stat-number">{{ stats.payments }}</p>
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

        <div class="charts-row">
          <div class="chart-section">
            <h3>Biểu đồ phân bố</h3>
            <div class="chart-wrapper">
              <canvas id="stats-chart" ref="pieChart" height="250" width="250"></canvas>
            </div>
          </div>
          
          <div class="chart-section">
            <h3>So sánh số lượng</h3>
            <div class="chart-wrapper">
              <canvas id="bar-chart" ref="barChart" height="250" width="250"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/config';
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboardHome',
  data() {
    return {
      stats: {
        orders: 0,
        payments: 0,
        services: 0,
        news: 0,
        bookings: 0,
      },
      loading: true,
      error: '',
      pieChart: null,
      barChart: null,
    };
  },
  mounted() {
    this.fetchDashboardStats();
  },
  updated() {
    if (!this.loading && !this.error) {
      this.renderCharts();
    }
  },
  methods: {
    async fetchDashboardStats() {
      this.loading = true;
      this.error = '';
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          this.stats = res.data.data;
        } else {
          this.error = 'Không lấy được dữ liệu tổng quan.';
        }
      } catch (err) {
        this.error = 'Lỗi khi tải dữ liệu tổng quan.';
      } finally {
        this.loading = false;
      }
    },
    renderCharts() {
      this.renderPieChart();
      this.renderBarChart();
    },
    renderPieChart() {
      if (this.pieChart) {
        this.pieChart.destroy();
      }
      
      const canvas = this.$refs.pieChart;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      const chartData = [
        Math.max(this.stats.orders, 1),
        Math.max(this.stats.payments, 1),
        Math.max(this.stats.services, 1),
        Math.max(this.stats.news, 1),
        Math.max(this.stats.bookings, 1),
      ];
      
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Đơn hàng', 'Thanh toán', 'Dịch vụ', 'Tin tức', 'Lịch đặt'],
          datasets: [{
            data: chartData,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            title: {
              display: true,
              text: 'Phân bố dữ liệu hệ thống',
              font: {
                size: 16
              }
            }
          }
        }
      });
    },
    renderBarChart() {
      if (this.barChart) {
        this.barChart.destroy();
      }
      
      const canvas = this.$refs.barChart;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      const labels = ['Đơn hàng', 'Thanh toán', 'Dịch vụ', 'Tin tức', 'Lịch đặt'];
      const data = [
        this.stats.orders,
        this.stats.payments,
        this.stats.services,
        this.stats.news,
        this.stats.bookings
      ];
      
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Số lượng',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'So sánh số lượng',
              font: {
                size: 16
              }
            }
          }
        }
      });
    }
  },
  beforeUnmount() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.barChart) {
      this.barChart.destroy();
    }
  }
};
</script>

<style scoped>
.admin-dashboard-home {
  padding: 40px;
  text-align: center;
}
.dashboard-overview {
  margin-top: 40px;
}
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
}
.stat-card {
  background: #f5faff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 24px 32px;
  min-width: 180px;
}
.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
  margin: 0;
}
.error {
  color: red;
  margin-top: 16px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 40px;
}

.chart-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

.chart-section h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style> 