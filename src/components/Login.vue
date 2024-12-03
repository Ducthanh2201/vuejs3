<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// Data binding
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const errorMessage = ref("");

// Router instance
const router = useRouter();

// Lấy thông tin người dùng từ localStorage nếu có
const savedUser = localStorage.getItem("user");
if (savedUser) {
  const user = JSON.parse(savedUser);
  email.value = user.user_email; // Điền email vào form nếu có
  password.value = user.user_password; // Điền mật khẩu vào form nếu có
  rememberMe.value = true; // Tích chọn "Nhớ tài khoản"
}

const handleLogin = async () => {
  try {
    // Fetch dữ liệu người dùng từ API
    const response = await axios.get("http://localhost:3000/users");
    const user = response.data.find(
      (u) => u.user_email === email.value && u.user_password === password.value
    );

    if (user) {
      // Nếu là customer và tài khoản chưa được kích hoạt
      if (user.user_role === "customer" && user.status !== "Kích hoạt") {
        errorMessage.value = "Tài khoản của bạn chưa được kích hoạt.";
        return; // Dừng lại nếu tài khoản chưa kích hoạt
      }

      // Nếu "Nhớ tài khoản" được chọn, lưu thông tin vào localStorage
      if (rememberMe.value) {
        localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
      } else {
        localStorage.removeItem("user"); // Xóa thông tin user khỏi localStorage nếu không chọn "Nhớ tài khoản"
      }

      // Lưu token vào localStorage
      localStorage.setItem("token", "example_token");

      // Kiểm tra vai trò của user và điều hướng
      if (user.user_role === "admin") {
        alert("Đăng nhập thành công! Bạn đang đăng nhập với vai trò quản trị viên.");
        router.push("/"); // Điều hướng đến trang AdminLayout
      } else if (user.user_role === "customer") {
        alert("Đăng nhập thành công!");
        router.push("/customer-dashboard"); // Điều hướng đến trang khách hàng
      } else {
        alert("Vai trò không hợp lệ.");
      }
    } else {
      errorMessage.value = "Email hoặc mật khẩu không chính xác.";
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Không thể kết nối đến server.";
  }
};
</script>


<template>
  <div class="login-page">
    <div class="background-image"></div>

    <div class="login-form-container">
      <div class="login-form">
        <h2 class="text-center mb-4">Đăng Nhập</h2>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <div class="input-icon">
              <i class="fas fa-user"></i>
              <input
                type="email"
                id="username"
                v-model="email"
                class="form-control"
                required
                placeholder="Nhập tài khoản email"
              />
            </div>
          </div>

          <div class="form-group">
            <div class="input-icon">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                v-model="password"
                class="form-control"
                required
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center">
            <div class="form-check">
              <input
                type="checkbox"
                id="rememberMe"
                v-model="rememberMe"
                class="form-check-input"
              />
              <label for="rememberMe" class="form-check-label">Nhớ tài khoản</label>
            </div>
            <router-link to="/forgot-password" class="text-success">Quên mật khẩu?</router-link>
          </div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success w-100">Đăng Nhập</button>
          </div>

          <p class="text-center mt-3">
            Chưa có tài khoản?
            <router-link to="/register" class="text-success">Đăng ký</router-link>
          </p>
        </form>

        <p v-if="errorMessage" class="text-danger mt-3 text-center">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>



<style scoped>
.login-page {
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
  background-image: url('../assets/images/banner3.jpg'); /* Đảm bảo đường dẫn đúng */
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: 0;
}

.login-form-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.331);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #0b560f;
  font-weight: bold;
}

.form-control {
  border: none;
  border-bottom: 2px solid #ddd;
  background-color: transparent;
  padding-left: 35px;
  font-size: 1rem;
  margin-bottom: 20px;
}

.input-icon {
  position: relative;
}

.input-icon i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #dddddd;
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
  color: #81ed0e;
}

.text-success:hover {
  color: #356a08;
}

.form-check {
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .login-page {
    padding: 20px;
  }

  .login-form-container {
    width: 100%;
    max-width: 350px;
  }
}
</style>