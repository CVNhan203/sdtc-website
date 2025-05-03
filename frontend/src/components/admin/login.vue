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
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group input.error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.message.success {
  background-color: #d1fae5;
  color: #065f46;
}

.message.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

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
</style>