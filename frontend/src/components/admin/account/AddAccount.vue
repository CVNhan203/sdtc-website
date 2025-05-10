<template>
  <div class="add-account">
    <div class="form-container">
      <div v-if="errorMessage" class="error-alert">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="account-form" novalidate>
        <div class="form-group" :class="{ 'has-error': errors.fullName }">
          <label for="fullName">Họ tên <span class="required">*</span></label>
          <input
            type="text"
            id="fullName"
            v-model="formData.fullName"
            :class="{ error: errors.fullName }"
          />
          <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label for="email">Email <span class="required">*</span></label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="{ error: errors.email }"
          />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.password }">
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

        <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
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

        <div class="form-group" :class="{ 'has-error': errors.role }">
          <label for="role">Vai trò <span class="required">*</span></label>
          <select id="role" v-model="formData.role" :class="{ error: errors.role }">
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
          </select>
          <span class="error-message" v-if="errors.role">{{ errors.role }}</span>
        </div>

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

    const errorMessage = ref('')

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

      // Reset thông báo lỗi
      errorMessage.value = ''

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
          // Xử lý lỗi trả về từ accountService
          handleApiErrors(response)
        }
      } catch (error) {
        // Xử lý lỗi nếu có exception
        errorMessage.value = 'Có lỗi xảy ra khi tạo tài khoản'
        console.error('Error in handleSubmit:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    // Xử lý lỗi từ API
    const handleApiErrors = (response) => {
      // Reset các lỗi hiện tại
      Object.keys(errors).forEach((key) => (errors[key] = ''))

      // Xử lý lỗi theo mã
      if (response.code === 'EMAIL_EXISTS') {
        errorMessage.value = 'Email này đã được sử dụng'
        errors.email = 'Email đã tồn tại'
      } else if (response.code === 'USERNAME_EXISTS') {
        errorMessage.value = 'Tên tài khoản này đã tồn tại'
        errors.fullName = 'Tên đã được sử dụng'
      } else {
        errorMessage.value = response.message || 'Có lỗi khi tạo tài khoản'
      }

      // Xử lý lỗi validation
      if (response.errors && Object.keys(response.errors).length > 0) {
        Object.entries(response.errors).forEach(([field, message]) => {
          if (errors[field] !== undefined) {
            errors[field] = Array.isArray(message) ? message[0] : message
          }
        })
      }

      // Focus vào trường lỗi đầu tiên
      const firstErrorField = Object.keys(errors).find((key) => errors[key])
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) element.focus()
      }

      // Hiển thị thông báo lỗi
      eventBus.emit('show-toast', {
        type: 'error',
        message: errorMessage.value,
      })
    }

    return {
      formData,
      errors,
      errorMessage,
      isSubmitting,
      showPassword,
      showConfirmPassword,
      handleSubmit,
    }
  },
}
</script>

<style scoped>
@import '@/styles/admin.css';

.add-account {
  max-width: 800px;
  margin: 0 auto;
}

.error-alert {
  background-color: #fee2e2;
  color: #ef4444;
  border-left: 4px solid #ef4444;
  padding: 10px 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.error-alert i {
  margin-right: 8px;
}

.has-error label {
  color: #ef4444;
}

.has-error input,
.has-error select {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

.form-group {
  margin-bottom: 20px;
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

.password-input {
  position: relative;
}

@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }
}
</style>
