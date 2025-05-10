<template>
  <div class="add-account">
    <div class="form-container">
      <!-- Hiển thị thông báo lỗi nếu có -->
      <div v-if="errorMessage" class="error-alert">
        <i class="fas fa-exclamation-circle"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="account-form" novalidate>
        <!-- Nhập họ tên -->
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

        <!-- Nhập email -->
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

        <!-- Nhập mật khẩu -->
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

        <!-- Nhập xác nhận mật khẩu -->
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
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Chọn vai trò -->
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
    const isSubmitting = ref(false) // Trạng thái gửi form
    const showPassword = ref(false) // Trạng thái hiển thị mật khẩu
    const showConfirmPassword = ref(false) // Trạng thái hiển thị xác nhận mật khẩu

    // Dữ liệu form
    const formData = reactive({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: true,
    })

    // Lỗi form
    const errors = reactive({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: '',
    })

    const errorMessage = ref('') // Thông báo lỗi chung

    // Hàm xác thực form
    const validateForm = () => {
      let isValid = true
      // Reset lỗi
      Object.keys(errors).forEach((key) => (errors[key] = ''))

      // Xác thực họ tên
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

      // Xác thực email
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email'
        isValid = false
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
        errors.email = 'Vui lòng nhập email hợp lệ (ví dụ: sea.dragon@gmail.com)'
        isValid = false
      }

      // Xác thực mật khẩu
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

      // Xác thực xác nhận mật khẩu
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        isValid = false
      }

      // Xác thực vai trò
      if (!formData.role) {
        errors.role = 'Vui lòng chọn vai trò'
        isValid = false
      } else if (!['admin', 'staff'].includes(formData.role)) {
        errors.role = 'Vai trò không hợp lệ'
        isValid = false
      }

      return isValid // Trả về true nếu form hợp lệ
    }

    // Hàm xử lý gửi form
    const handleSubmit = async () => {
      // Trim các trường nhập để xử lý khoảng trắng
      formData.fullName = formData.fullName.trim()
      formData.email = formData.email.trim()

      // Reset thông báo lỗi
      errorMessage.value = ''

      if (!validateForm()) {
        const firstErrorField = Object.keys(errors).find((key) => errors[key])
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField)
          if (element) {
            element.focus() // Tập trung vào trường lỗi đầu tiên
          }
        }

        eventBus.emit('show-toast', {
          type: 'error',
          message: 'Vui lòng kiểm tra lại thông tin nhập',
        })
        return
      }

      isSubmitting.value = true // Đặt trạng thái gửi form
      try {
        const accountData = {
          fullName: formData.fullName,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: formData.role,
          isDeleted: !formData.status,
        }

        const response = await accountService.createAccount(accountData) // Gọi API tạo tài khoản

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
          }, 500) // Chuyển hướng về danh sách tài khoản
        } else {
          // Xử lý lỗi trả về từ accountService
          handleApiErrors(response)
        }
      } catch (error) {
        // Xử lý lỗi nếu có exception
        errorMessage.value = 'Có lỗi xảy ra khi tạo tài khoản'
        console.error('Error in handleSubmit:', error)
      } finally {
        isSubmitting.value = false // Đặt lại trạng thái gửi form
      }
    }

    // Xử lý lỗi từ API
    const handleApiErrors = (response) => {
      // Reset các lỗi hiện tại
      Object.keys(errors).forEach((key) => (errors[key] = ''))

      let hasError = false

      // Xử lý lỗi theo mã
      if (
        response &&
        (response.code === 'EMAIL_EXISTS' ||
          (response.errors && response.errors.email && (
            response.errors.email === 'Email đã tồn tại' ||
            (Array.isArray(response.errors.email) && response.errors.email.includes('Email đã tồn tại'))
          ))
        )
      ) {
        errorMessage.value = 'Email này đã được sử dụng'
        errors.email = 'Email đã tồn tại'
        hasError = true
      } else if (response && response.code === 'USERNAME_EXISTS') {
        errorMessage.value = 'Tên tài khoản này đã tồn tại'
        errors.fullName = 'Tên đã được sử dụng'
        hasError = true
      }

      // Xử lý lỗi validation
      if (response && response.errors && Object.keys(response.errors).length > 0) {
        //entries trả về đối tượng có thể lặp
        //forEach lặp qua các phần tử
        Object.entries(response.errors).forEach(([field, message]) => {
          //undefined đại diện 1 giá trị chưa được xác định
          if (errors[field] !== undefined) {
            errors[field] = Array.isArray(message) ? message[0] : message
            hasError = true
          }
        })
      }

      // Nếu không có lỗi cụ thể, báo lỗi chung
      if (!hasError) {
        errorMessage.value = (response && response.message) || 'Có lỗi khi tạo tài khoản'
      }

      // Tập trung vào trường lỗi đầu tiên
      const firstErrorField = Object.keys(errors).find((key) => errors[key])
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) element.focus()
      }

      // Hiển thị thông báo lỗi (luôn luôn gọi)
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
@import "@/styles/admin.css";

.add-account {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto; /* Căn giữa */
}

.form-container {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 24px; /* Khoảng cách giữa các nhóm form */
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.required {
  color: #dc2626; /* Màu đỏ cho các trường bắt buộc */
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
  background: #f9fafb; /* Màu nền cho các trường nhập */
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: #3b82f6; /* Màu viền khi trường được chọn */
  background: #fff; /* Màu nền khi trường được chọn */
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-input {
  position: relative; /* Để đặt nút hiển thị mật khẩu */
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
  color: #3b82f6; /* Màu khi hover */
}

.error-message {
  color: #dc2626; /* Màu đỏ cho thông báo lỗi */
  font-size: 0.875rem;
  margin-top: 6px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 16px; /* Khoảng cách giữa các nút */
  justify-content: flex-end; /* Căn phải */
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb; /* Đường viền trên cùng */
}

.submit-btn,
.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px; /* Khoảng cách giữa biểu tượng và văn bản */
}

.submit-btn {
  background: #3b82f6; /* Màu nền cho nút gửi */
  color: white;
  border: none;
}

.submit-btn:hover {
  background: #2563eb; /* Màu nền khi hover */
  transform: translateY(-1px); /* Hiệu ứng nhấn */
}

.cancel-btn {
  background: #f3f4f6; /* Màu nền cho nút hủy */
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #e5e7eb; /* Màu nền khi hover */
}

.error {
  border-color: #dc2626; /* Màu viền cho trường có lỗi */
}

/* Responsive Design */
@media (max-width: 768px) {
  .add-account {
    padding: 16px; /* Giảm padding cho màn hình nhỏ */
  }

  .form-container {
    padding: 24px; /* Giảm padding cho màn hình nhỏ */
  }
}

@media (max-width: 480px) {
  .add-account {
    padding: 12px; /* Giảm padding cho màn hình rất nhỏ */
  }

  .form-container {
    padding: 16px;
    border-radius: 12px; /* Giảm bo góc cho màn hình nhỏ */
  }

  .form-actions {
    flex-direction: column; /* Đặt các nút theo chiều dọc */
  }

  .submit-btn,
  .cancel-btn {
    width: 100%; /* Đặt chiều rộng 100% cho các nút */
    justify-content: center; /* Căn giữa văn bản trong nút */
  }
}
</style>