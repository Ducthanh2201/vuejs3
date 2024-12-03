<template>
  <div id="app" class="admin-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="logo">LOGO</div>
      </div>
      <div class="header-right">
        <i class="fa fa-envelope"></i>
        <i class="fa fa-bell"></i>
        <div class="auth-icons">
          <!-- Nếu người dùng đã đăng nhập -->
          <template v-if="userName !== 'Chưa đăng nhập'">
            <a href="#" @click="logout" class="auth-link">
              <i class="fa fa-sign-out-alt"></i> Đăng xuất
            </a>
          </template>
          <!-- Nếu người dùng chưa đăng nhập -->
          <template v-else>
            <a href="/login" class="auth-link">
              <i class="fa fa-sign-in-alt"></i> Đăng nhập
            </a>
            <a href="/register" class="auth-link">
              <i class="fa fa-user-plus"></i> Đăng ký
            </a>
          </template>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
      <div class="user-info">
        <img src="https://via.placeholder.com/50" alt="User Avatar" class="avatar" />
        <div class="user-details">
          <h3>{{ userName }}</h3>
          <div class="status">
            <span class="status-icon"></span>
            <span class="status-text">Online</span>
          </div>
        </div>
      </div>
      <hr />
     <!-- Menu styles -->
<nav class="menu">
  <ul>
    <li>
      <router-link to="/AdminHome">
        <i class="fa fa-home"></i> <span>Trang chủ</span>
      </router-link>
    </li>

    <!-- Menu Danh mục -->
    <li>
      <div @click="toggleSubMenu('categories')" class="menu-item">
        <i class="fa fa-folder"></i> <span>Danh mục</span>
        <i class="fa" :class="subMenuState.categories ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
      <ul v-if="subMenuState.categories" class="sub-menu">
        <li>
          <router-link to="/Add-cate">
            <i class="fa fa-plus"></i> Thêm danh mục
          </router-link>
        </li>
        <li>
          <router-link to="/Cate-list">
            <i class="fa fa-stream"></i> Danh sách Danh mục
          </router-link>
        </li>
      </ul>
    </li>

    <!-- Menu Role -->
    <li>
      <router-link to="/Role">
        <i class="fa fa-user-shield"></i> <span>Vai trò</span>
      </router-link>
    </li>

    <!-- Menu Sản phẩm -->
    <li>
      <div @click="toggleSubMenu('products')" class="menu-item">
        <i class="fa fa-box"></i> <span>Sản phẩm</span>
        <i class="fa" :class="subMenuState.products ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
      <ul v-if="subMenuState.products" class="sub-menu">
        <li>
          <router-link to="/Add-pr">
            <i class="fa fa-plus"></i> Thêm sản phẩm
          </router-link>
        </li>
        <li>
          <router-link to="/Pr-list">
            <i class="fa fa-boxes"></i> Danh sách sản phẩm
          </router-link>
        </li>
      </ul>
    </li>

    <!-- Menu Khách hàng -->
    <li>
      <div @click="toggleSubMenu('customers')" class="menu-item">
        <i class="fa fa-users"></i> <span>Khách hàng</span>
        <i class="fa" :class="subMenuState.customers ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </div>
      <ul v-if="subMenuState.customers" class="sub-menu">
        <li>
          <router-link to="/Add-customer">
            <i class="fa fa-user-plus"></i> Thêm khách hàng
          </router-link>
        </li>
        <li>
          <router-link to="/Customer-list">
            <i class="fa fa-user-friends"></i> Danh sách khách hàng
          </router-link>
        </li>
      </ul>
    </li>

    <!-- Các menu khác -->
    <li>
      <router-link to="/Tke">
        <i class="fa fa-chart-line"></i> <span>Thống kê</span>
      </router-link>
    </li>
    <li>
      <router-link to="/QL_cart">
        <i class="fa fa-shopping-cart"></i> <span>Đơn hàng</span>
      </router-link>
    </li>
  </ul>
</nav>

    </aside>

    <!-- Sidebar Toggle Icon -->
    <div class="sidebar-toggle" @click="toggleSidebar">
      <i class="fa" :class="isSidebarCollapsed ? 'fa-bars' : 'fa-times'"></i>
    </div>

    <!-- Main Content -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "AdminLayout",
  data() {
    return {
      isSidebarCollapsed: false, // Trạng thái mở/đóng sidebar
      subMenuState: {
        categories: false,
        products: false,
        customers: false,
      },
      userName: 'Chưa đăng nhập', // Tên người dùng
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleSubMenu(menu) {
      this.subMenuState[menu] = !this.subMenuState[menu];
    },
    checkLoginStatus() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.userName = user.user_name || "Người dùng";
      } else {
        this.userName = "Chưa đăng nhập";
      }
    },
    logout() {
      // Xóa thông tin người dùng khỏi localStorage hoặc sessionStorage
      localStorage.removeItem("user");
      this.userName = "Chưa đăng nhập"; // Đặt lại tên người dùng
      this.$router.push("/login"); // Chuyển hướng ngay về trang login
    },
  },
};
</script>


<style scoped>
/* General layout styles */
.admin-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  transition: grid-template-columns 0.3s ease;
}

/* Header styles */
.header {
  grid-area: header;
  background-color: #004080;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right i {
  font-size: 1.2rem;
  cursor: pointer;
}

/* Auth icons container */
.auth-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auth-link {
  display: flex;
  align-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.auth-link i {
  margin-right: 5px;
  font-size: 1.1rem;
}

.auth-link:hover {
  color: #ffd700; /* Màu vàng khi hover */
}

/* Sidebar styles */
.sidebar {
  grid-area: sidebar;
  background-color: #f5f5f5;
  padding: 20px;
  transition: transform 0.3s ease, width 0.3s ease;
  overflow: hidden;
  position: relative;
}

.sidebar.collapsed {
  transform: translateX(-100%);
  width: 50px;
}

/* Sidebar Toggle Icon */
.sidebar-toggle {
  position: fixed;
  top: 13%;
  left: 200px;
  transform: translateY(-50%);
  background-color: #004080;
  color: #fff;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: left 0.3s ease;
  z-index: 1000;
}

.sidebar-toggle i {
  font-size: 1.5rem;
}

/* When sidebar is collapsed */
.sidebar-collapsed .sidebar-toggle {
  left: 10px;
}

/* Main Content */
.content {
  grid-area: content;
  padding: 20px;
  background-color: #f9f9f9;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .content {
  margin-left: -200px;
}

/* User info styles */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.user-details h3 {
  margin: 0;
  font-size: 1.1rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-icon {
  width: 10px;
  height: 10px;
  background-color: #4caf50;
  border-radius: 50%;
}

.status-text {
  font-size: 0.9rem;
  color: #4caf50;
}

/* Menu styles */
.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu ul li {
  margin-bottom: 10px;
}

.menu ul li a,
.menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  background-color: #fff;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu ul li a:hover,
.menu-item:hover {
  background-color: #ddd;
}

.sub-menu {
  padding-left: 20px;
}
</style>
