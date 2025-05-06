<template>
  <div class="add-account">
    <div class="page-header">
      <h2>Thêm tài khoản mới</h2>
      <button class="back-btn" @click="$router.back()">
        <i class="fas fa-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="account-form">
        <!-- Full Name -->
        <div class="form-group">
          <label for="fullName">Họ tên <span class="required">*</span></label>
          <input
            type="text"
            id="fullName"
            v-model="formData.fullName"
            :class="{ 'error': errors.fullName }"
            required
          />
          <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email <span class="required">*</span></label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="{ 'error': errors.email }"
            required
          />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Mật khẩu <span class="required">*</span></label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              :class="{ 'error': errors.password }"
              required
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu <span class="required">*</span></label>
          <div class="password-input">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :class="{ 'error': errors.confirmPassword }"
              required
            />
            <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Role -->
        <div class="form-group">
          <label for="role">Vai trò <span class="required">*</span></label>
          <select
            id="role"
            v-model="formData.role"
            :class="{ 'error': errors.role }"
            required
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
          </select>
          <span class="error-message" v-if="errors.role">{{ errors.role }}</span>
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Trạng thái</label>
          <div class="toggle-switch">
            <input
              type="checkbox"
              id="status"
              v-model="formData.status"
              :class="{ 'error': errors.status }"
            />
            <label for="status" class="switch-label"></label>
            <span class="status-text">{{ formData.status ? 'Đang hoạt động' : 'Không hoạt động' }}</span>
          </div>
          <span class="error-message" v-if="errors.status">{{ errors.status }}</span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$router.back()">Hủy</button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">
              <i class="fas fa-spinner fa-spin"></i>
              Đang xử lý...
            </span>
            <span v-else>Tạo tài khoản</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import accountService from '@/api/account/accountService';
import eventBus from '@/eventBus';

export default {
  name: 'AddAccount',
  setup() {
    const router = useRouter();
    const isSubmitting = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const formData = reactive({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: true
    });

    const errors = reactive({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: ''
    });

    const validateForm = () => {
      let isValid = true;
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '');

      // Validate full name
      if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ tên';
        isValid = false;
      } else if (formData.fullName.length < 3) {
        errors.fullName = 'Họ tên phải có ít nhất 3 ký tự';
        isValid = false;
      } else if (formData.fullName.length > 50) {
        errors.fullName = 'Họ tên không được vượt quá 50 ký tự';
        isValid = false;
      } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName)) {
        errors.fullName = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email';
        isValid = false;
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Email không hợp lệ';
        isValid = false;
      }

      // Validate password
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!formData.password) {
        errors.password = 'Vui lòng nhập mật khẩu';
        isValid = false;
      } else if (!passwordRegex.test(formData.password)) {
        errors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
        isValid = false;
      }

      // Validate confirm password
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        isValid = false;
      }

      // Validate role
      if (!formData.role) {
        errors.role = 'Vui lòng chọn vai trò';
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Vui lòng kiểm tra lại thông tin nhập'
        });
        return;
      }

      isSubmitting.value = true;
      try {
        const accountData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
          isDeleted: !formData.status
        };

        const response = await accountService.createAccount(accountData);
        
        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Tạo tài khoản thành công'
          });
          setTimeout(() => {
            router.push({ 
              name: 'AccountList',
              query: { refresh: 'true' }
            });
          }, 500);
        } else {
          throw new Error(response.message || 'Không thể tạo tài khoản');
        }
      } catch (error) {
        let errorMessage = 'Không thể tạo tài khoản';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
          // Handle specific backend validation errors
          if (error.response.data.errors) {
            const backendErrors = error.response.data.errors;
            Object.keys(backendErrors).forEach(key => {
              if (errors[key]) {
                errors[key] = backendErrors[key];
              }
            });
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        eventBus.emit('show-toast', {
          type: 'error',
          message: errorMessage
        });
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      formData,
      errors,
      isSubmitting,
      showPassword,
      showConfirmPassword,
      handleSubmit
    };
  }
};
</script>

<style scoped>
@import "@/styles/admin.css";

.add-account {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #e5e7eb;
}

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.account-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.required {
  color: #dc2626;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

input.error,
select.error {
  border-color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 4px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.switch-label {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  background-color: #e5e7eb;
  border-radius: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.switch-label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

input[type="checkbox"]:checked + .switch-label {
  background-color: #10b981;
}

input[type="checkbox"]:checked + .switch-label::after {
  transform: translateX(24px);
}

.status-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.fa-spinner {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .add-account {
    padding: 16px;
  }

  .form-container {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style> 