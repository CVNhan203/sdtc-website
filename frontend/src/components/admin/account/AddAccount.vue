<template>
  <div class="add-account">
    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="account-form" novalidate>
        <!-- Full Name -->
        <div class="form-group">
          <label for="fullName">Họ tên <span class="required">*</span></label>
          <input
            type="text"
            id="fullName"
            v-model="formData.fullName"
            :class="{ error: errors.fullName }"
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
            :class="{ error: errors.email }"
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
              :class="{ error: errors.password }"
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
              :class="{ error: errors.confirmPassword }"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</span>
        </div>

        <!-- Role -->
        <div class="form-group">
          <label for="role">Vai trò <span class="required">*</span></label>
          <select id="role" v-model="formData.role" :class="{ error: errors.role }">
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
          </select>
          <span class="error-message" v-if="errors.role">{{ errors.role }}</span>
        </div>

        <!-- Status -->
        <!-- <div class="form-group">
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
        </div> -->

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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import accountService from '@/api/services/accountService'
import eventBus from '@/eventBus'

export default {
  name: 'AddAccount',
  setup() {
    const router = useRouter()
    const isSubmitting = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    const formData = reactive({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: true,
    })

    const errors = reactive({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: '',
    })

    const validateForm = () => {
      let isValid = true
      // Reset errors
      Object.keys(errors).forEach((key) => (errors[key] = ''))

      // Validate fullName
      if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ tên'
        isValid = false
      } else if (formData.fullName.trim().length < 3) {
        errors.fullName = 'Họ tên phải có ít nhất 3 ký tự'
        isValid = false
      } else if (formData.fullName.trim().length > 50) {
        errors.fullName = 'Họ tên không được vượt quá 50 ký tự'
        isValid = false
      } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName.trim())) {
        errors.fullName = 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
        isValid = false
      }

      // Validate email
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email'
        isValid = false
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
        errors.email = 'Vui lòng nhập email hợp lệ (ví dụ: nam.vuphanhoai@gmail.com)'
        isValid = false
      }

      // Validate password
      if (!formData.password) {
        errors.password = 'Vui lòng nhập mật khẩu'
        isValid = false
      } else if (formData.password.length < 8) {
        errors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
        isValid = false
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
          formData.password
        )
      ) {
        errors.password =
          'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)'
        isValid = false
      }

      // Validate confirmPassword
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        isValid = false
      }

      // Validate role
      if (!formData.role) {
        errors.role = 'Vui lòng chọn vai trò'
        isValid = false
      } else if (!['admin', 'staff'].includes(formData.role)) {
        errors.role = 'Vai trò không hợp lệ'
        isValid = false
      }

      return isValid
    }

    const handleSubmit = async () => {
      // Trim input fields to handle leading/trailing spaces
      formData.fullName = formData.fullName.trim()
      formData.email = formData.email.trim()

      if (!validateForm()) {
        const firstErrorField = Object.keys(errors).find((key) => errors[key])
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField)
          if (element) {
            element.focus()
          }
        }

        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Vui lòng kiểm tra lại thông tin nhập',
        })
        return
      }

      isSubmitting.value = true
      try {
        const accountData = {
          fullName: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: formData.role,
          isDeleted: !formData.status,
        }

        const response = await accountService.createAccount(accountData)

        if (response.success) {
          eventBus.emit('show-toast', {
            type: 'success',
            message: 'Tạo tài khoản thành công',
          })
          setTimeout(() => {
            router.push({
              name: 'AccountList',
              query: { refresh: 'true' },
            })
          }, 500)
        } else {
          throw new Error(response.message || 'Không thể tạo tài khoản')
        }
      } catch (error) {
        let errorMessage = 'Không thể tạo tài khoản'

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
          // Handle specific backend validation errors
          if (error.response.data.errors) {
            const backendErrors = error.response.data.errors
            Object.keys(backendErrors).forEach((key) => {
              if (errors[key] !== undefined) {
                errors[key] = Array.isArray(backendErrors[key])
                  ? backendErrors[key][0]
                  : backendErrors[key]
              }
            })
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        eventBus.emit('show-toast', {
          type: 'error',
          message: errorMessage,
        })
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      formData,
      errors,
      isSubmitting,
      showPassword,
      showConfirmPassword,
      handleSubmit,
    }
  },
}
</script>

<style scoped>
.add-account {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.form-container {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.required {
  color: #dc2626;
  margin-left: 4px;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: #3b82f6;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #3b82f6;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 6px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.error {
  border-color: #dc2626;
}

@media (max-width: 768px) {
  .add-account {
    padding: 16px;
  }

  .form-container {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .add-account {
    padding: 12px;
  }

  .form-container {
    padding: 16px;
    border-radius: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
