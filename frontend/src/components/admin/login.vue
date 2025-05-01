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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
  padding: 1rem;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: #2d3748;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #718096;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.input-container i {
  position: absolute;
  left: 1rem;
  color: #a0aec0;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.input-container.error-container i {
  color: #e53e3e;
}

input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

input.error {
  border-color: #e53e3e;
}

input.error:focus {
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message i {
  font-size: 1rem;
}

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

.login-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.login-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .login-form {
    padding: 2rem;
    margin: 1rem;
  }

  .form-header h2 {
    font-size: 1.75rem;
  }
}
</style>
