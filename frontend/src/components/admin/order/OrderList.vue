<template>
  <div class="order-list">
    <!-- Header Actions -->
    <div class="actions-header">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
            @input="handleSearch"
          >
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th>Số điện thoại</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in filteredOrders" :key="order.id">
            <td>{{ index + 1 }}</td>
            <td>{{ order.orderCode }}</td>
            <td>{{ order.customerName }}</td>
            <td>{{ order.phone }}</td>
            <td>{{ formatCurrency(order.totalAmount) }}</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td class="actions">
              <button class="icon-btn info" @click="showDetails(order)">
                <i class="fas fa-info-circle"></i>
              </button>
              <button class="icon-btn edit" @click="openEditModal(order)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="icon-btn delete" @click="confirmDelete(order)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Details Modal -->
    <div class="modal" v-if="showDetailsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Chi tiết đơn hàng</h3>
          <button class="close-btn" @click="showDetailsModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4>Thông tin khách hàng</h4>
            <div class="detail-item">
              <label>Tên khách hàng:</label>
              <p>{{ selectedOrder.customerName }}</p>
            </div>
            <div class="detail-item">
              <label>Số điện thoại:</label>
              <p>{{ selectedOrder.phone }}</p>
            </div>
            <div class="detail-item">
              <label>Địa chỉ:</label>
              <p>{{ selectedOrder.address }}</p>
            </div>
            <div class="detail-item">
              <label>Email:</label>
              <p>{{ selectedOrder.email }}</p>
            </div>
          </div>

          <div class="detail-section">
            <h4>Thông tin đơn hàng</h4>
            <div class="detail-item">
              <label>Mã đơn hàng:</label>
              <p>{{ selectedOrder.orderCode }}</p>
            </div>
            <div class="detail-item">
              <label>Ngày đặt:</label>
              <p>{{ formatDate(selectedOrder.orderDate) }}</p>
            </div>
            <div class="detail-item">
              <label>Trạng thái:</label>
              <p>
                <span :class="['status-badge', selectedOrder.status]">
                  {{ getStatusText(selectedOrder.status) }}
                </span>
              </p>
            </div>
            <div class="detail-item">
              <label>Phương thức thanh toán:</label>
              <p>{{ selectedOrder.paymentMethod }}</p>
            </div>
          </div>

          <div class="detail-section">
            <h4>Chi tiết dịch vụ</h4>
            <table class="services-table">
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in selectedOrder.services" :key="service.id">
                  <td>{{ service.name }}</td>
                  <td>{{ service.quantity }}</td>
                  <td>{{ formatCurrency(service.price) }}</td>
                  <td>{{ formatCurrency(service.price * service.quantity) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="total-label">Tổng tiền:</td>
                  <td class="total-amount">{{ formatCurrency(selectedOrder.totalAmount) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Order Modal -->
    <div class="modal" v-if="showFormModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Cập nhật đơn hàng</h3>
          <button class="close-btn" @click="showFormModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="order-form">
            <div class="form-section">
              <h4>Thông tin khách hàng</h4>
              <div class="form-group">
                <label>Tên khách hàng <span class="required">*</span></label>
                <input 
                  type="text" 
                  v-model="formData.customerName"
                  required
                  placeholder="Nhập tên khách hàng"
                >
              </div>
              <div class="form-group">
                <label>Số điện thoại <span class="required">*</span></label>
                <input 
                  type="tel" 
                  v-model="formData.phone"
                  required
                  placeholder="Nhập số điện thoại"
                >
              </div>
              <div class="form-group">
                <label>Địa chỉ <span class="required">*</span></label>
                <textarea 
                  v-model="formData.address"
                  required
                  rows="2"
                  placeholder="Nhập địa chỉ"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="formData.email"
                  placeholder="Nhập email"
                >
              </div>
            </div>

            <div class="form-section">
              <h4>Thông tin đơn hàng</h4>
              <div class="form-group">
                <label>Trạng thái</label>
                <select v-model="formData.status">
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div class="form-group">
                <label>Phương thức thanh toán</label>
                <select v-model="formData.paymentMethod">
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                  <option value="momo">Ví MoMo</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showFormModal = false">Hủy</button>
              <button type="submit" class="submit-btn">Cập nhật</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button class="close-btn" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa đơn hàng "{{ selectedOrder.orderCode }}" không?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteModal = false">Hủy</button>
            <button class="delete-btn" @click="handleDelete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      orders: [
        {
          id: 1,
          orderCode: 'DH001',
          customerName: 'Nguyễn Văn A',
          phone: '0123456789',
          email: 'nguyenvana@email.com',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          orderDate: '2024-03-15',
          status: 'completed',
          paymentMethod: 'Tiền mặt',
          totalAmount: 1500000,
          services: [
            {
              id: 1,
              name: 'Dịch vụ 1',
              quantity: 2,
              price: 500000
            },
            {
              id: 2,
              name: 'Dịch vụ 2',
              quantity: 1,
              price: 500000
            }
          ]
        },
        // Thêm dữ liệu mẫu khác...
      ],
      searchQuery: '',
      showDetailsModal: false,
      showFormModal: false,
      showDeleteModal: false,
      selectedOrder: {},
      formData: {
        customerName: '',
        phone: '',
        email: '',
        address: '',
        status: 'pending',
        paymentMethod: 'cash'
      }
    }
  },
  computed: {
    filteredOrders() {
      if (!this.searchQuery) return this.orders

      const query = this.searchQuery.toLowerCase()
      return this.orders.filter(order => 
        order.orderCode.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.phone.includes(query)
      )
    }
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN')
    },
    getStatusText(status) {
      const statusMap = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
      }
      return statusMap[status] || status
    },
    handleSearch() {
      // Implement debounce if needed
    },
    showDetails(order) {
      this.selectedOrder = { ...order }
      this.showDetailsModal = true
    },
    openEditModal(order) {
      this.formData = {
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        address: order.address,
        status: order.status,
        paymentMethod: order.paymentMethod
      }
      this.selectedOrder = order
      this.showFormModal = true
    },
    confirmDelete(order) {
      this.selectedOrder = order
      this.showDeleteModal = true
    },
    async handleSubmit() {
      try {
        const index = this.orders.findIndex(o => o.id === this.selectedOrder.id)
        this.orders[index] = {
          ...this.orders[index],
          ...this.formData
        }
        this.showFormModal = false
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async handleDelete() {
      try {
        const index = this.orders.findIndex(o => o.id === this.selectedOrder.id)
        this.orders.splice(index, 1)
        this.showDeleteModal = false
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>

<style scoped>
.order-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #e0f2fe;
  color: #0369a1;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-btn.info {
  background: #e0f2fe;
  color: #0369a1;
}

.icon-btn.edit {
  background: #f1f5f9;
  color: #475569;
}

.icon-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.icon-btn:hover {
  opacity: 0.8;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h4 {
  color: #1e293b;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
}

.detail-item label {
  font-weight: 500;
  color: #64748b;
}

.services-table {
  width: 100%;
  margin-top: 1rem;
}

.services-table th {
  background: #f8fafc;
  padding: 0.75rem;
}

.services-table td {
  padding: 0.75rem;
}

.total-label {
  text-align: right;
  font-weight: 600;
}

.total-amount {
  font-weight: 600;
  color: #1e293b;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 6px;
}

.form-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1e293b;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.form-group .required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.submit-btn,
.delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.submit-btn:hover {
  background: #2563eb;
}

.delete-btn:hover {
  background: #dc2626;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .actions-header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-filter {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .detail-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .modal-content {
    margin: 1rem;
  }

  .services-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
