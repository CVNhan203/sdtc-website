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
          <input
            type="email"
            id="email"
            v-model="credentials.email"
            :class="{ 'error': emailError }"
            @input="validateEmail"
            placeholder="Nhập email của bạn"
            required
          />
          <span class="error-text" v-if="emailError">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="password-container">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="credentials.password"
              :class="{ 'error': passwordError }"
              @input="validatePassword"
              placeholder="Nhập mật khẩu"
              required
            />
            <button type="button" class="show-password" @click="showPassword = !showPassword">
              {{ showPassword ? 'Ẩn' : 'Hiện' }}
            </button>
          </div>
          <span class="error-text" v-if="passwordError">{{ passwordError }}</span>
        </div>

        <div v-if="loginMessage" :class="['message', loginMessage.type]">
          {{ loginMessage.text }}
        </div>

        <button type="submit" :disabled="!isFormValid || isLoading" class="login-button">
          <span v-if="!isLoading">Đăng nhập</span>
          <span v-else>Đang xử lý...</span>
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
      isLoading: false,
      showPassword: false
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
}
</script>

<style scoped>
@import "@/styles/admin.css";

/* Login Page Styles */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  font-family: 'Roboto', sans-serif;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
  border-color: var(--danger-color);
}

.error-text {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

/* Message Styles */
.message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
}

.message.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Button Styles */
.login-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
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

/* Password Container */
.password-container {
  position: relative;
  display: flex;
}

.password-container input {
  width: 100%;
}

.show-password {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.show-password:hover {
  color: #333;
}

/* Responsive Styles */
@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
    margin: 0.5rem;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-header p {
    font-size: 0.875rem;
  }
}
</style>