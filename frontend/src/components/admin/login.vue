<template>
  <div class="admin-login">
    <div class="login-split">
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <img src="@/assets/sdtc-image/trang-chu/Logo/sdtc.png" alt="Sea Dragon Technology" class="logo-image">
          </div>
          <h2>Hệ thống quản trị</h2>
          <p>Quản lý nội dung và dữ liệu của ứng dụng</p>
        </div>
      </div>
      
      <div class="form-panel">
        <div class="form-container">
          <div class="form-header">
            <h1>Đăng nhập</h1>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="credentials.email"
                :class="{ error: emailError }"
                @input="validateEmail"
                placeholder="admin@example.com"
                required
                autocomplete="email"
              />
              <span class="error-message" v-if="emailError">{{ emailError }}</span>
            </div>

            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <div class="password-field">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="credentials.password"
                  :class="{ error: passwordError }"
                  @input="validatePassword"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password"
                />
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Ẩn' : 'Hiện' }}
                </button>
              </div>
              <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
            </div>

            <div v-if="loginMessage" :class="['message', loginMessage.type]">
              {{ loginMessage.text }}
            </div>

            <button type="submit" :disabled="!isFormValid || isLoading" class="login-button">
              <span v-if="!isLoading">Đăng nhập</span>
              <span v-else>Đang xử lý...</span>
            </button>
          </form>
          
          <div class="login-footer">
            <p>© 2025 SDTC Admin - Bản quyền thuộc về nhóm 2</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/api/services/authService'

export default {
  name: 'AdminLogin',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      emailError: '',
      passwordError: '',
      loginMessage: null,
      isLoading: false,
      showPassword: false,
    }
  },
  computed: {
    isFormValid() {
      return (
        this.credentials.email &&
        this.credentials.password &&
        !this.emailError &&
        !this.passwordError
      )
    },
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
      if (!this.isFormValid || this.isLoading) return

      this.isLoading = true
      this.loginMessage = null

      try {
        const result = await authService.login(this.credentials)

        if (result.success) {
          this.loginMessage = {
            type: 'success',
            text: 'Đăng nhập thành công! Đang chuyển hướng...',
          }

          // Chuyển hướng ngay lập tức
          await this.$router.push('/admin/dashboard')
        } else {
          this.loginMessage = {
            type: 'error',
            text: result.message || 'Email hoặc mật khẩu không chính xác',
          }
        }
      } catch (error) {
        console.error('Login error:', error)
        this.loginMessage = {
          type: 'error',
          text: 'Có lỗi xảy ra, vui lòng thử lại',
        }
      } finally {
        this.isLoading = false
      }
    },
  },
  created() {
    // Nếu đã đăng nhập thì chuyển về dashboard
    if (authService.isAuthenticated()) {
      this.$router.push('/admin/dashboard')
    }
  },
}
</script>

<style scoped>
@import "@/styles/admin.css";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5ff;
  font-family: 'Inter', sans-serif;
}

.login-split {
  display: flex;
  width: 900px;
  height: 600px;
  max-width: 100%;
  max-height: 90vh;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.brand-panel {
  flex: 0 0 40%;
  background-color: #00275f;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-panel::before {
  content: '';
  position: absolute;
  top: 5%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.brand-panel::after {
  content: '';
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.brand-content {
  text-align: center;
  padding: 0 30px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-logo {
  margin: 0 auto 30px;
  width: 180px;
  display: flex;
  justify-content: center;
}

.logo-image {
  max-width: 100%;
  height: auto;
}

.brand-content h2 {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.brand-content p {
  font-size: 15px;
  opacity: 0.9;
  line-height: 1.5;
}

.form-panel {
  flex: 0 0 60%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 360px;
  padding: 40px 20px;
}

.form-header {
  margin-bottom: 28px;
}

.form-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #0052cc;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-header p {
  color: #6b7280;
  font-size: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  background-color: #f9fafb;
  color: #111827;
  transition: border-color 0.2s, background-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0052cc;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
}

.form-group input.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.password-field {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
}

.toggle-password:hover {
  color: #374151;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
  display: block;
}

.message {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.message.success {
  background-color: #ecfdf5;
  color: #047857;
}

.message.error {
  background-color: #fef2f2;
  color: #b91c1c;
}

.login-button {
  width: 100%;
  padding: 12px 16px;
  background-color: #9ca3af;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #6b7280;
}

.login-button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 32px;
}

.login-footer p {
  color: #6b7280;
  font-size: 13px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .login-split {
    flex-direction: column;
    height: auto;
    width: 100%;
    max-width: 420px;
  }
  
  .brand-panel {
    flex: 0 0 auto;
    padding: 40px 20px;
  }
  
  .form-panel {
    flex: 0 0 auto;
  }
  
  .form-container {
    padding: 30px 20px;
  }
  
  .brand-logo {
    width: 160px;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .brand-logo {
    width: 140px;
    margin-bottom: 16px;
  }
  
  .brand-content h2 {
    font-size: 22px;
  }
  
  .form-container {
    padding: 24px 16px;
  }
  
  .form-header h1 {
    font-size: 24px;
  }
  
  .form-group {
    margin-bottom: 18px;
  }
}
</style>
