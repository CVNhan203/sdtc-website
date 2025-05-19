<template>
  <div class="payment-container">
    <div class="payment-header">
      <h2>Thanh toán dịch vụ</h2>
    </div>

    <div class="payment-content">
      <!-- Thông tin dịch vụ -->
      <div class="service-info" v-if="service">
        <h3>Thông tin dịch vụ</h3>
        <div class="service-card">
          <div class="service-image">
            <img
              :src="service.icon || require('@/assets/payment/MoMo_Logo.png')"
              :alt="service.title"
            />
          </div>
          <div class="service-details">
            <h4>{{ service.title }}</h4>
            <p class="service-price">{{ formatCurrency(service.price) }}</p>
            <!-- <p class="service-description">
              {{ service.shortDescription || 'Dịch vụ thiết kế và phát triển chuyên nghiệp' }}
            </p> -->
          </div>
        </div>
      </div>

      <!-- Form thông tin khách hàng -->
      <div class="customer-info">
        <h3>Thông tin khách hàng</h3>
        <form @submit.prevent="submitOrder" class="payment-form">
          <div class="form-group">
            <label for="fullName">Họ và tên <span class="required">*</span></label>
            <input
              type="text"
              id="fullName"
              v-model="formData.fullName"
              required
              :class="{ error: errors.fullName }"
              placeholder="Nhập họ và tên của bạn"
            />
            <span class="error-message" v-if="errors.fullName">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Số điện thoại <span class="required">*</span></label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              required
              :class="{ error: errors.phone }"
              placeholder="Nhập số điện thoại của bạn"
            />
            <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              :class="{ error: errors.email }"
              placeholder="Nhập địa chỉ email của bạn"
            />
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label>Phương thức thanh toán <span class="required">*</span></label>
            <div class="payment-methods">
              <div
                class="payment-method"
                :class="{ selected: formData.paymentMethod === 'MOMO' }"
                @click="selectPaymentMethod('MOMO')"
              >
                <img
                  :src="require('@/assets/payment/MoMo_Logo.png')"
                  alt="MoMo"
                  class="payment-logo"
                />
                <span>Ví MoMo</span>
              </div>
              <div
                class="payment-method"
                :class="{ selected: formData.paymentMethod === 'VNPAY' }"
                @click="selectPaymentMethod('VNPAY')"
              >
                <img
                  :src="require('@/assets/payment/vnpay-logo.jpg')"
                  alt="VNPay"
                  class="payment-logo"
                />
                <span>VNPay</span>
              </div>
            </div>
            <span class="error-message" v-if="errors.paymentMethod">{{
              errors.paymentMethod
            }}</span>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="goBack">Quay lại</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Đang xử lý...' : 'Thanh toán ngay' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal xác nhận thanh toán -->
    <div class="modal" v-if="showConfirmModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận thanh toán</h3>
          <button class="close-btn" @click="showConfirmModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="formData.paymentMethod === 'MOMO'">
            <div class="qr-code">
              <img :src="require('@/assets/payment/momo.jpg')" alt="MoMo QR Code" />
            </div>
            <p class="payment-instruction">Quét mã QR bằng ứng dụng MoMo để thanh toán</p>
            <p class="payment-amount">Số tiền: {{ formatCurrency(service.price) }}</p>
            <p class="payment-note">Nội dung chuyển khoản: {{ generateTransferContent() }}</p>
          </div>

          <div v-else-if="formData.paymentMethod === 'VNPAY'">
            <div class="qr-code">
              <img :src="require('@/assets/payment/vnpay.jpg')" alt="VNPay QR Code" />
            </div>
            <p class="payment-instruction">
              Quét mã QR bằng ứng dụng ngân hàng hỗ trợ VNPay để thanh toán
            </p>
            <p class="payment-amount">Số tiền: {{ formatCurrency(service.price) }}</p>
            <p class="payment-note">Nội dung chuyển khoản: {{ generateTransferContent() }}</p>
          </div>

          <div class="confirm-actions">
            <button class="btn-cancel" @click="showConfirmModal = false">Đóng</button>
            <button class="btn-confirm" @click="confirmPayment">Đã thanh toán</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal thông báo thanh toán thành công -->
    <div class="modal" v-if="showSuccessModal">
      <div class="modal-content success-modal">
        <div class="modal-header">
          <h3>Thanh toán thành công</h3>
          <button class="close-btn" @click="showSuccessModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <p class="success-message">Cảm ơn bạn đã đặt dịch vụ của chúng tôi!</p>
          <p>Chúng tôi đã ghi nhận đơn hàng của bạn và sẽ liên hệ trong thời gian sớm nhất.</p>
          <p>
            Mã đơn hàng: <strong>{{ orderId }}</strong>
          </p>

          <div class="confirm-actions">
            <button class="btn-confirm" @click="goToHome">Về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/api/services/orderService'
import serviceService from '@/api/services/serviceService'

export default {
  name: 'ComPayment',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const service = ref(null)
    const isSubmitting = ref(false)
    const showConfirmModal = ref(false)
    const showSuccessModal = ref(false)
    const orderId = ref('')

    const formData = reactive({
      fullName: '',
      phone: '',
      email: '',
      paymentMethod: 'MOMO',
      serviceId: route.params.serviceId || '',
    })

    const errors = reactive({
      fullName: '',
      phone: '',
      email: '',
      paymentMethod: '',
    })

    // Lấy thông tin dịch vụ từ ID
    const fetchServiceDetails = async () => {
      try {
        if (route.params.serviceId) {
          try {
            const response = await serviceService.getServiceById(route.params.serviceId)
            console.log('Service response:', response)

            if (response) {
              service.value = {
                title: response.title,
                price: response.price,
                shortDescription:
                  response.description && response.description.length > 0
                    ? response.description[0]
                    : '',
                icon: response.image
                  ? getImageUrl(response.image)
                  : require('@/assets/sdtc-image/icon/website.svg'),
              }
            } else {
              console.error('No service data returned')
              router.push('/bang-gia')
            }
          } catch (serviceError) {
            console.error('Error fetching service:', serviceError)
            router.push('/bang-gia')
          }
        } else {
          console.error('No serviceId in route params')
          router.push('/bang-gia')
        }
      } catch (error) {
        console.error('Error in fetchServiceDetails:', error)
        router.push('/bang-gia')
      }
    }

    // Định dạng tiền tệ
    const formatCurrency = (amount) => {
      if (!amount) return '0 VND'
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
    }

    // Lấy URL hình ảnh
    const getImageUrl = (image) => {
      if (!image) return ''
      if (image.startsWith('http')) return image
      return `http://localhost:3000/${image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')}`
    }

    // Chọn phương thức thanh toán
    const selectPaymentMethod = (method) => {
      formData.paymentMethod = method
      errors.paymentMethod = ''
    }

    // Tạo nội dung chuyển khoản
    const generateTransferContent = () => {
      return `SDTC_${formData.phone.substring(formData.phone.length - 4)}`
    }

    // Tạo mã giao dịch ngẫu nhiên
    const generateTransactionId = () => {
      const prefix = formData.paymentMethod.substring(0, 3).toUpperCase()
      const timestamp = new Date().getTime().toString().substring(5)
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')
      return `${prefix}_${timestamp}_${random}`
    }

    // Xác thực form
    const validateForm = () => {
      let isValid = true

      // Xác thực họ tên
      if (!formData.fullName.trim()) {
        errors.fullName = 'Vui lòng nhập họ và tên'
        isValid = false
      } else if (formData.fullName.trim().length < 2) {
        errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự'
        isValid = false
      } else {
        errors.fullName = ''
      }

      // Xác thực số điện thoại
      const phoneRegex = /^(0[35789][0-9]{8})$/
      if (!formData.phone.trim()) {
        errors.phone = 'Vui lòng nhập số điện thoại'
        isValid = false
      } else if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = 'Số điện thoại không hợp lệ (VD: 0779518027)'
        isValid = false
      } else {
        errors.phone = ''
      }

      // Xác thực email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!formData.email.trim()) {
        errors.email = 'Vui lòng nhập email'
        isValid = false
      } else if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Email không hợp lệ'
        isValid = false
      } else {
        errors.email = ''
      }

      // Xác thực phương thức thanh toán
      if (!formData.paymentMethod) {
        errors.paymentMethod = 'Vui lòng chọn phương thức thanh toán'
        isValid = false
      } else {
        errors.paymentMethod = ''
      }

      return isValid
    }

    // Gửi đơn hàng
    const submitOrder = () => {
      if (!validateForm()) return

      showConfirmModal.value = true
    }

    // Xác nhận thanh toán
    const confirmPayment = async () => {
      try {
        isSubmitting.value = true

        // Bước 1: Tạo đơn hàng mới
        const orderData = {
          serviceId: formData.serviceId,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          paymentMethod: formData.paymentMethod,
        }

        const createResponse = await orderService.createOrder(orderData)

        if (createResponse.success) {
          // Lưu ID đơn hàng
          orderId.value = createResponse.data._id

          // Bước 2: Xử lý thanh toán
          const paymentData = {
            transactionId: generateTransactionId(),
            amount: service.value.price || 0,
          }

          const paymentResponse = await orderService.processPayment(orderId.value, paymentData)

          if (paymentResponse.success) {
            showConfirmModal.value = false
            showSuccessModal.value = true
          } else {
            alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.')
          }
        } else {
          alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.')
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.')
      } finally {
        isSubmitting.value = false
      }
    }

    // Quay lại trang trước
    const goBack = () => {
      router.go(-1)
    }

    // Về trang chủ
    const goToHome = () => {
      router.push('/')
    }

    onMounted(() => {
      fetchServiceDetails()
    })

    return {
      service,
      formData,
      errors,
      isSubmitting,
      showConfirmModal,
      showSuccessModal,
      orderId,
      formatCurrency,
      selectPaymentMethod,
      generateTransferContent,
      generateTransactionId,
      submitOrder,
      confirmPayment,
      goBack,
      goToHome,
    }
  },
}
</script>

<style scoped>
.payment-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
}

.payment-header {
  text-align: center;
  margin-bottom: 40px;
}

.payment-header h2 {
  font-size: 32px;
  color: #3b82f6;
  margin: 0;
}

.payment-content {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.service-info {
  flex: 1;
  min-width: 300px;
  text-align: center;
}

.customer-info {
  flex: 1;
  min-width: 300px;
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
}

.service-card {
  background: #f8fafc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.service-image {
  height: 300px;
  overflow: hidden;
}

.service-image img {
  width: auto;
  height: 300px;
  object-fit: cover;
  text-align: center;
}

.service-details {
  padding: 20px;
}

.service-details h4 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #1e293b;
}

.service-price {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
  margin: 0 0 15px 0;
}

.service-description {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.payment-form {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e293b;
}

.required {
  color: #ef4444;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.payment-methods {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.payment-method {
  flex: 1;
  min-width: 120px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-method:hover {
  border-color: #3b82f6;
  background: #f1f5f9;
}

.payment-method.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.payment-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 10px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.btn-cancel,
.btn-submit,
.btn-confirm {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit,
.btn-confirm {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-submit:hover,
.btn-confirm:hover {
  background: #2563eb;
}

.btn-submit:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  border: none;
  padding: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 20px;
}

.qr-code {
  text-align: center;
  margin-bottom: 20px;
}

.qr-code img {
  max-width: 200px;
  height: auto;
}

.payment-instruction,
.payment-amount,
.payment-note {
  margin-bottom: 15px;
  text-align: center;
}

.payment-amount {
  font-weight: bold;
  font-size: 20px;
  color: #3b82f6;
}

.bank-info {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.bank-info p {
  margin: 10px 0;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* Success modal */
.success-modal .modal-body {
  text-align: center;
}

.success-icon {
  font-size: 60px;
  color: #10b981;
  margin-bottom: 20px;
}

.success-message {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .payment-content {
    flex-direction: column;
    gap: 20px;
  }

  .service-info,
  .customer-info {
    width: 100%;
    min-width: 0;
  }

  .service-image img {
    height: auto;
    max-width: 100%;
  }

  .payment-header h2 {
    font-size: 28px;
  }

  h3 {
    font-size: 20px;
  }

  .btn-cancel,
  .btn-submit,
  .btn-confirm {
    width: 100%;
    padding: 12px;
  }

  .payment-method {
    flex: 1;
    min-width: 100px;
  }

  .payment-header {
    margin-bottom: 20px;
  }

  .payment-header h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .service-image {
    height: 200px;
  }

  .service-image img {
    height: 200px;
    width: 100%;
    object-fit: contain;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-cancel,
  .btn-submit,
  .btn-confirm {
    width: 100%;
    padding: 14px;
  }

  .modal-content {
    width: 95%;
    max-height: 80vh;
  }
}

@media (max-width: 480px) {
  .payment-container {
    padding: 20px 12px;
  }

  .payment-form {
    padding: 15px;
  }

  .service-details {
    padding: 15px;
  }

  .service-details h4 {
    font-size: 18px;
  }

  .service-price {
    font-size: 20px;
  }

  input {
    padding: 10px;
    font-size: 14px;
  }

  .payment-methods {
    gap: 10px;
  }

  .payment-method {
    padding: 10px;
  }

  .payment-logo {
    width: 50px;
    height: 50px;
  }

  .modal-body {
    padding: 15px;
  }

  .qr-code img {
    max-width: 150px;
  }
}
</style>
