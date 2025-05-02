<template>
  <div class="login-container">
    <div class="login-form">
      <div class="form-header">
        <h2>Đăng nhập Admin</h2>
        <p>Vui lòng đăng nhập để quản lý hệ thống!</p>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-container" :class="{ 'error-container': emailError }">
            <i class="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              v-model="credentials.email"
              :class="{ 'error': emailError }"
              @input="validateEmail"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <span class="error-message" v-if="emailError">
            <i class="fas fa-exclamation-circle"></i>
            {{ emailError }}
          </span>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-container" :class="{ 'error-container': passwordError }">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              id="password"
              v-model="credentials.password"
              :class="{ 'error': passwordError }"
              @input="validatePassword"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <span class="error-message" v-if="passwordError">
            <i class="fas fa-exclamation-circle"></i>
            {{ passwordError }}
          </span>
        </div>

        <div v-if="loginMessage" :class="['message', loginMessage.type]">
          <i :class="loginMessage.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
          {{ loginMessage.text }}
        </div>

        <button type="submit" :disabled="!isFormValid || isLoading" class="login-button">
          <span v-if="!isLoading">Đăng nhập</span>
          <span v-else class="loading-text">
            <i class="fas fa-spinner fa-spin"></i>
            Đang xử lý...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '@/api/services/authService';

export default {
  name: 'AdminLogin',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      emailError: '',
      passwordError: '',
      loginMessage: null,
      isLoading: false
    }
  },
  computed: {
    isFormValid() {
      return this.credentials.email && 
             this.credentials.password && 
             !this.emailError && 
             !this.passwordError
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.credentials.email) {
        this.emailError = 'Email không được để trống'
      } else if (!emailRegex.test(this.credentials.email)) {
        this.emailError = 'Email không hợp lệ'
      } else {
        this.emailError = ''
      }
      this.loginMessage = null
    },
    validatePassword() {
      if (!this.credentials.password) {
        this.passwordError = 'Mật khẩu không được để trống'
      } else if (this.credentials.password.length < 6) {
        this.passwordError = 'Mật khẩu phải có ít nhất 6 ký tự'
      } else {
        this.passwordError = ''
      }
      this.loginMessage = null
    },
    async handleSubmit() {
      if (!this.isFormValid || this.isLoading) return;

      this.isLoading = true;
      this.loginMessage = null;
      
      try {
        const result = await authService.login(this.credentials);
        
        if (result.success) {
          this.loginMessage = {
            type: 'success',
            text: 'Đăng nhập thành công! Đang chuyển hướng...'
          };
          
          // Chuyển hướng ngay lập tức
          await this.$router.push('/admin/dashboard');
        } else {
          this.loginMessage = {
            type: 'error',
            text: result.message || 'Email hoặc mật khẩu không chính xác'
          };
        }
      } catch (error) {
        console.error('Login error:', error);
        this.loginMessage = {
          type: 'error',
          text: 'Có lỗi xảy ra, vui lòng thử lại'
        };
      } finally {
        this.isLoading = false;
      }
    }
  },
  created() {
    // Nếu đã đăng nhập thì chuyển về dashboard
    if (authService.isAuthenticated()) {
      this.$router.push('/admin/dashboard');
    }
  }
}
</script>

<style scoped>
/* Import admin styles */
@import '@/styles/admin.css';

/* Component-specific styles */
.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.message.success {
  background-color: #c6f6d5;
  color: #2f855a;
}

.message.error {
  background-color: #fed7d7;
  color: #c53030;
}

.message i {
  font-size: 1rem;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
