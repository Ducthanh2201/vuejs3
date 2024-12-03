<template>
  <div class="container mt-4">
    <!-- Tiêu đề và đường cắt ngang -->
    <div class="form-title">
      <h1 class="text-center">Danh sách khách hàng</h1>
    </div>

    <!-- Hiển thị nút xóa khách hàng đã chọn nếu có khách hàng được chọn -->
    <div class="mb-3 text-center">
      <button
        v-if="selectedCustomers.length > 0"
        @click="deleteSelectedCustomers"
        class="btn btn-danger"
      >
        Xóa khách hàng đã chọn
      </button>
    </div>

    <!-- Bảng danh sách khách hàng -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <!-- Checkbox để chọn khách hàng -->
          <th>
            <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
          </th>
          <th>ID</th>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Số điện thoại</th>
          <th>Địa chỉ</th>
          <th>Hình ảnh</th>
          <th>Kích hoạt</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customer, index) in customers" :key="customer.id">
          <td>
            <input
              type="checkbox"
              :value="customer.id"
              v-model="selectedCustomers"
            />
          </td>
          <td>{{ customer.user_id }}</td>
          <td>{{ customer.user_name }}</td>
          <td>{{ customer.user_email }}</td>
          <td>{{ customer.user_phone }}</td>
          <td>{{ customer.user_address }}</td>
          <td>
            <!-- Hiển thị hình ảnh hoặc thông báo nếu không có hình ảnh -->
            <img v-if="customer.image && typeof customer.image === 'string' && customer.image.startsWith('blob:')" 
                 :src="customer.image" 
                 alt="Customer Image" 
                 class="customer-image" />
            <span v-else>Chưa có ảnh</span>
          </td>
          <td>
            <!-- Hiển thị trạng thái Kích hoạt -->
            <span :class="{ 'text-success': customer.status === 'Kích hoạt', 'text-danger': customer.status === 'Chưa kích hoạt' }">
              {{ customer.status }}
            </span>
          </td>
          <td>
            <!-- Các icon sửa và xóa -->
            <span @click="editCustomer(customer)" class="icon-edit">✏️</span>
            <span @click="confirmDeleteCustomer(customer)" class="icon-trash">🗑️</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Thêm mới khách hàng -->
    <div class="text-center">
      <router-link to="/Add-customer" class="btn btn-success">Thêm mới</router-link>
    </div>

    <div v-if="isEditModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Chỉnh sửa thông tin khách hàng</h5>
            <button type="button" class="btn-close" @click="closeEditModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateCustomer">
              <div class="mb-3">
                <label for="userName" class="form-label">Tên đăng nhập</label>
                <input type="text" id="userName" v-model="currentCustomer.user_name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input type="email" id="userEmail" v-model="currentCustomer.user_email" class="form-control" disabled required />
              </div>
              <div class="mb-3">
                <label for="userPhone" class="form-label">Số điện thoại</label>
                <input type="text" id="userPhone" v-model="currentCustomer.user_phone" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="userAddress" class="form-label">Địa chỉ</label>
                <input type="text" id="userAddress" v-model="currentCustomer.user_address" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="userStatus" class="form-label">Trạng thái</label>
                <div class="status-options">
                  <label class="status-option">
                    <input type="radio" v-model="currentCustomer.status" value="Kích hoạt" />
                    <span class="status-circle"></span>
                    Kích hoạt
                  </label>
                  <label class="status-option">
                    <input type="radio" v-model="currentCustomer.status" value="Chưa kích hoạt" />
                    <span class="status-circle"></span>
                    Chưa kích hoạt
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Cập nhật</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isEditModalOpen" class="modal-backdrop fade show" @click="closeEditModal"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Biến trạng thái
const customers = ref([]); // Danh sách khách hàng
const selectedCustomers = ref([]); // Danh sách khách hàng được chọn
const isEditModalOpen = ref(false); // Trạng thái modal chỉnh sửa
const currentCustomer = ref({}); // Dữ liệu khách hàng đang chỉnh sửa
const router = useRouter(); // Router để chuyển hướng

// Hàm tải danh sách khách hàng, chỉ lấy khách hàng với vai trò là 'customer'
const loadCustomers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/users');
    if (response.data && Array.isArray(response.data)) {
      customers.value = response.data.filter(customer => customer.user_role === 'customer');
    } else {
      console.warn("Không có dữ liệu khách hàng.");
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách khách hàng:", error);
  }
};

// Kiểm tra nếu tất cả khách hàng đã được chọn
const isAllSelected = computed(() => {
  return customers.value.length > 0 && selectedCustomers.value.length === customers.value.length;
});

// Hàm chọn tất cả khách hàng
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCustomers.value = [];
  } else {
    selectedCustomers.value = customers.value.map((customer) => customer.id);
  }
};

// Hàm xóa khách hàng
const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3000/users/${id}`);
    if (response.status === 200) {
      customers.value = customers.value.filter((customer) => customer.id !== id);
      selectedCustomers.value = selectedCustomers.value.filter((selectedId) => selectedId !== id);
    } else {
      console.error('Không thể xóa khách hàng:', response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi xóa khách hàng:", error.response ? error.response.data : error);
  }
};

// Xác nhận xóa khách hàng
const confirmDeleteCustomer = (customer) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa khách hàng này?');
  if (confirmDelete) {
    deleteCustomer(customer.id);
  }
};

// Xóa các khách hàng được chọn
const deleteSelectedCustomers = async () => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa những khách hàng đã chọn?');
  if (confirmDelete) {
    const customersToDelete = customers.value.filter((customer) =>
      selectedCustomers.value.includes(customer.id)
    );
    for (let customer of customersToDelete) {
      await deleteCustomer(customer.id);
    }
    selectedCustomers.value = [];
  }
};

// Mở modal chỉnh sửa
const editCustomer = (customer) => {
  currentCustomer.value = { ...customer }; // Sao chép thông tin khách hàng vào biến currentCustomer
  isEditModalOpen.value = true; // Mở modal
};

// Đóng modal chỉnh sửa
const closeEditModal = () => {
  isEditModalOpen.value = false; // Đóng modal
};

// Cập nhật thông tin khách hàng
const updateCustomer = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/users/${currentCustomer.value.id}`, currentCustomer.value);
    if (response.status === 200) {
      // Cập nhật dữ liệu trong giao diện
      const index = customers.value.findIndex(customer => customer.id === currentCustomer.value.id);
      if (index !== -1) {
        customers.value[index] = { ...currentCustomer.value };
      }
      closeEditModal(); // Đóng modal
    } else {
      console.error('Không thể cập nhật khách hàng:', response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật khách hàng:", error.response ? error.response.data : error);
  }
};

// Tải dữ liệu khi component được gắn vào DOM
onMounted(() => {
  loadCustomers();
});
</script>



<style scoped>
/* Tiêu đề và đường cắt ngang */
.form-title {
  background-color: #9acd32; /* Màu xanh lá chuối */
  padding: 10px 0;
  border-bottom: 2px solid #fff;
}

/* Màu nền và padding cho các phần khác */
.container {
  max-width: 900px;
  margin: auto;
}

.text-center {
  text-align: center;
}

button {
  width: 180px;
}

.table {
  background-color: #f4f1e1; /* Màu trắng sữa đậm */
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.icon-edit,
.icon-trash {
  cursor: pointer;
  font-size: 18px;
  margin: 0 10px;
}

.icon-edit:hover {
  color: #007bff;
}

.icon-trash:hover {
  color: #dc3545;
}

/* Cập nhật hình ảnh */
.customer-image {
  border-radius: 50%;
  object-fit: cover;
  width: 50px;
  height: 50px;
}

/* Cập nhật màu sắc cho trạng thái */
.text-success {
  color: green;
}

.text-danger {
  color: red;
}
.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề modal */
.modal-header {
  background-color: #9acd32;
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Nút đóng modal */
.btn-close {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
}

.modal-body {
  padding: 20px;
}

.modal-body .form-label {
  font-weight: bold;
  color: #333;
}

.modal-body .form-control {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
  font-size: 1rem;
}

/* Trạng thái selectbox với dấu chấm tròn */
.status-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-option {
  display: flex;
  align-items: center;
}

.status-option input[type="radio"] {
  display: none;
}

.status-option .status-circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 10px;
}

.status-option input[type="radio"]:checked + .status-circle {
  background-color: #9acd32;
}

.status-option input[type="radio"]:focus + .status-circle {
  outline: 2px solid #007bff;
}

.modal-body .btn-primary {
  background-color: #9acd32;
  border-color: #9acd32;
  width: 100%;
  padding: 12px;
  font-size: 1.2rem;
  border-radius: 8px;
  color: white;
  transition: background-color 0.3s ease;
}

.modal-body .btn-primary:hover {
  background-color: #7a9f2f;
  border-color: #7a9f2f;
}

.modal-backdrop.fade.show {
  background-color: rgba(0, 0, 0, 0.5);
}

</style>
