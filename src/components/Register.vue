<template>
  <div class="register-page">
    <!-- Hình ảnh nền -->
    <div class="background-image"></div>

    <!-- Form đăng ký -->
    <div class="register-form-container">
      <div class="register-form">
        <h2 class="text-center mb-4">Đăng Ký</h2>

        <!-- Form đăng ký -->
        <form @submit.prevent="submitRegister">
          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-user"></i>
              <input type="text" v-model="fullName" class="form-input" required placeholder="Nhập họ tên">
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-user-circle"></i>
              <input type="text" v-model="username" class="form-input" required placeholder="Nhập tên đăng nhập">
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="password" class="form-input" required placeholder="Nhập mật khẩu">
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-lock"></i>
              <input type="password" v-model="confirmPassword" class="form-input" required placeholder="Nhập lại mật khẩu">
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="email" class="form-input" required placeholder="Nhập email">
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-phone"></i>
              <input type="text" v-model="phone" class="form-input" required placeholder="Nhập số điện thoại">
            </div>
          </div>

          <div class="form-group">
            <div class="input-container">
              <i class="fas fa-home"></i>
              <input type="text" v-model="address" class="form-input" required placeholder="Nhập địa chỉ">
            </div>
          </div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success w-100">Đăng Ký</button>
          </div>

          <p class="text-center mt-3">
            Đã có tài khoản? <router-link to="/login" class="text-success">Đăng nhập</router-link>
          </p>
        </form>

        <!-- Các nút đăng ký với Google và Facebook -->
        <div class="social-login mt-4">
          <button class="btn btn-outline-danger w-100 mb-2" @click="loginWithGoogle">
            <i class="fab fa-google"></i> Đăng ký với Google
          </button>
          <button class="btn btn-outline-primary w-100" @click="loginWithFacebook">
            <i class="fab fa-facebook"></i> Đăng ký với Facebook
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Khai báo reactive refs cho form data
const fullName = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');

// Hàm xử lý đăng ký
const submitRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Mật khẩu không khớp");
    return;
  }

  try {
    // Lấy danh sách users hiện tại để tính user_id mới
    const usersResponse = await axios.get('http://localhost:3000/users');
    const users = usersResponse.data;
    const newUserId = users.length > 0 ? Math.max(...users.map(user => user.user_id)) + 1 : 1;

    // Tạo đối tượng người dùng với user_id mới
    const newUser = {
      user_id: newUserId,
      user_name: fullName.value,
      user_email: email.value,
      user_password: password.value,
      user_phone: phone.value,
      user_address: address.value,
      user_role: 'customer',
    };

    // Gửi yêu cầu POST để đăng ký user mới
    const response = await axios.post('http://localhost:3000/users', newUser);
    
    if (response.status === 201) {
      alert('Đăng ký thành công!');
      router.push('/login');
    } else {
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu đăng ký:', error);
    alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
  }
};

// Các hàm đăng nhập social
const loginWithGoogle = () => {
  console.log("Đăng ký với Google");
  // Logic đăng ký với Google ở đây
};

const loginWithFacebook = () => {
  console.log("Đăng ký với Facebook");
  // Logic đăng ký với Facebook ở đây
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  background-color: #f0f0f0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/banner3.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(5px);
}

.register-form-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
}

.register-form {
  background-color: rgba(255, 255, 255, 0.402); /* Nền trong suốt */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #0b560f;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.input-container {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ddd;
  margin-bottom: 15px;
}

.input-container i {
  color: #777;
  font-size: 1.2rem;
  margin-right: 10px;
}

.form-input {
  width: 100%;
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: #fff8f8;
}

.form-input::placeholder {
  color: #ffffff;
}

.form-input:focus {
  border-bottom: 2px solid #69ba13;
}

.btn {
  background-color: #69ba13;
  color: white;
  border-radius: 5px;
  padding: 10px 20px;
  border: none;
  font-size: 1.1rem;
}

.btn:hover {
  background-color: #76c72d;
}

.text-center {
  text-align: center;
}

.text-success {
  color: #69ba13;
}

.text-success:hover {
  color: #519c0f;
}

.social-login button {
  font-size: 1.1rem;
  padding: 10px 20px;
  border-radius: 5px;
}

.social-login .btn-google {
  background-color: #db4437;
  color: white;
}

.social-login .btn-facebook {
  background-color: #3b5998;
  color: white;
}

.social-login button i {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .register-page {
    padding: 20px;
  }

  .register-form-container {
    width: 100%;
    max-width: 350px;
  }
}
</style>
  