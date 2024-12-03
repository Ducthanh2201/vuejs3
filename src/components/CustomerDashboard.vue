<template>
    <div class="dashboard">
      <div class="welcome-message">
        <h2>Chào mừng, {{ user.user_name }}!</h2>
        <p>Chúc bạn có một ngày tốt lành.</p>
      </div>
      <div class="logout">
        <button @click="handleLogout" class="btn-logout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const router = useRouter();
  
  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');  // Xóa token
    localStorage.removeItem('user');   // Xóa thông tin người dùng
    router.push('/login');             // Điều hướng về trang login
  };
  
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  onMounted(() => {
    if (!user.user_name) {
      router.push('/login');  // Nếu không có thông tin người dùng, điều hướng về login
    }
  });
  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f4;
  }
  
  .welcome-message {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .welcome-message h2 {
    color: #333;
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .welcome-message p {
    color: #666;
    font-size: 1.1rem;
  }
  
  .logout {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .btn-logout {
    background-color: #f44336;
    color: white;
    font-size: 1.2rem;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .btn-logout i {
    margin-right: 10px;
  }
  
  .btn-logout:hover {
    background-color: #e53935;
  }
  </style>
  