<template>
  <div class="container mt-4">
    <!-- Tiêu đề và đường cắt ngang -->
    <div class="form-title">
      <h1 class="text-center">Thêm mới khách hàng</h1>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleAddCustomer" class="form-container">
      <div class="row mb-3">
        <!-- Tên đăng nhập và Họ và tên cùng nằm một hàng -->
        <div class="col-md-6">
          <label for="username" class="form-label">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            v-model="newCustomer.username"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>
        <div class="col-md-6">
          <label for="fullName" class="form-label">Họ và tên</label>
          <input
            type="text"
            id="fullName"
            v-model="newCustomer.fullName"
            class="form-control"
            placeholder="Nhập họ và tên"
            required
          />
        </div>
      </div>

      <div class="row mb-3">
        <!-- Mật khẩu -->
        <div class="col-md-6">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            v-model="newCustomer.password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <!-- Xác nhận mật khẩu -->
        <div class="col-md-6">
          <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="newCustomer.confirmPassword"
            class="form-control"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>
      </div>

      <div class="row mb-3">
        <!-- Ảnh -->
        <div class="col-md-6">
          <label for="image" class="form-label">Ảnh</label>
          <input
            type="file"
            id="image"
            class="form-control"
            @change="onFileChange"
            accept="image/*"
          />
        </div>

        <!-- Địa chỉ email -->
        <div class="col-md-6">
          <label for="email" class="form-label">Địa chỉ email</label>
          <input
            type="email"
            id="email"
            v-model="newCustomer.email"
            class="form-control"
            placeholder="Nhập email"
            required
          />
        </div>
      </div>

      <div class="row mb-3">
        <!-- Địa chỉ -->
        <div class="col-md-6">
          <label for="userAddress" class="form-label">Địa chỉ</label>
          <input
            type="text"
            id="userAddress"
            v-model="newCustomer.userAddress"
            class="form-control"
            placeholder="Nhập địa chỉ"
            required
          />
        </div>

        <!-- Số điện thoại -->
        <div class="col-md-6">
          <label for="userPhone" class="form-label">Số điện thoại</label>
          <input
            type="text"
            id="userPhone"
            v-model="newCustomer.userPhone"
            class="form-control"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
      </div>

      <div class="row mb-3">
        <!-- Kích hoạt -->
        <div class="col-md-6">
          <label class="form-label">Kích hoạt</label>
          <div class="status-checkbox">
            <input
              type="radio"
              id="isActive"
              v-model="newCustomer.status"
              value="Kích hoạt"
            />
            <label for="isActive" class="form-label ms-2">Kích hoạt</label>
            <br />
            <input
              type="radio"
              id="isInactive"
              v-model="newCustomer.status"
              value="Chưa kích hoạt"
            />
            <label for="isInactive" class="form-label ms-2">Chưa kích hoạt</label>
          </div>
        </div>

        <!-- Vai trò (chỉ có vai trò Customer và mặc định là Customer) -->
        <div class="col-md-6">
          <label class="form-label">Vai trò</label>
          <div class="role-checkbox">
            <input
              type="radio"
              id="isCustomer"
              v-model="newCustomer.role"
              value="customer"
              disabled
            />
            <label for="isCustomer" class="form-label ms-2">Customer</label>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button type="button" class="btn btn-warning me-2" @click="resetForm">Nhập lại</button>
        <button type="submit" class="btn btn-success me-2">Thêm mới</button>
        <router-link to="/Customer-list" class="btn btn-primary">Danh sách</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const newCustomer = ref({
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      email: '',
      userPhone: '', // Thêm trường số điện thoại
      userAddress: '', // Thêm trường địa chỉ
      status: 'Chưa kích hoạt',
      role: 'customer', // Mặc định là 'customer'
      image: '', // Dữ liệu ảnh
    });

    // Handle file input change for image
    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        newCustomer.value.image = URL.createObjectURL(file);
      }
    };

    // Handle form submission
    const handleAddCustomer = async () => {
      if (newCustomer.value.password !== newCustomer.value.confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu không khớp!');
        return;
      }

      if (
        !newCustomer.value.username ||
        !newCustomer.value.fullName ||
        !newCustomer.value.password ||
        !newCustomer.value.email ||
        !newCustomer.value.userAddress || // Kiểm tra địa chỉ
        !newCustomer.value.userPhone // Kiểm tra số điện thoại
      ) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      try {
        // Lấy dữ liệu người dùng hiện tại từ db.json
        const response = await axios.get('http://localhost:3000/users');
        const users = response.data;

        // Tạo id mới tự động tăng
        const newId = users.length ? users[users.length - 1].user_id + 1 : 1;

        const newCustomerData = {
          user_id: newId, // ID tự động tăng
          user_name: newCustomer.value.username,
          user_email: newCustomer.value.email,
          user_password: newCustomer.value.password,
          user_phone: newCustomer.value.userPhone, // Số điện thoại
          user_address: newCustomer.value.userAddress, // Địa chỉ
          user_role: newCustomer.value.role, // Vai trò
          status: newCustomer.value.status, // Trạng thái
          image: newCustomer.value.image, // Ảnh
        };

        // Gửi yêu cầu POST để thêm khách hàng vào db.json
        await axios.post('http://localhost:3000/users', newCustomerData);

        alert('Thêm khách hàng mới thành công!');
        resetForm();
      } catch (error) {
        console.error("Lỗi khi thêm khách hàng:", error);
        alert('Đã có lỗi xảy ra!');
      }
    };

    // Reset form
    const resetForm = () => {
      newCustomer.value = {
        username: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        email: '',
        userPhone: '', // Reset số điện thoại
        userAddress: '', // Reset địa chỉ
        status: 'Chưa kích hoạt',
        role: 'customer', // Mặc định là 'customer'
        image: '',
      };
    };

    return {
      newCustomer,
      onFileChange,
      handleAddCustomer,
      resetForm,
    };
  },
};
</script>


<style scoped>
/* Tiêu đề và đường cắt ngang */
.form-title {
  background-color: #9acd32; /* Màu xanh lá chuối */
  padding: 10px 0;
  border-bottom: 2px solid #fff;
}

.form-container {
  background-color: #f4f1e1; /* Màu trắng sữa đậm */
  padding: 20px;
  border-radius: 5px;
}

/* Tùy chỉnh input */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="file"] {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
input[type="file"]:focus {
  border-color: #4b8a3d;
}

.status-checkbox {
  margin-top: 10px;
}

.role-checkbox {
  margin-top: 10px;
}
</style>