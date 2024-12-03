import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import ForgotPassword from '../components/ForgotPassword.vue';

// Admin routes
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminHome from '../components/AdminHome.vue';
import AddCustomer from '../components/Add-customer.vue';
import CateList from '../components/Cate-list.vue';
import PrList from '../components/Pr-list.vue';
import CustomerList from '../components/Customer-list.vue';
import QL_cart from '../components/QL_cart.vue';
import Tke from '../components/Tke.vue';
import Pagination from '../components/Pagination.vue';
import CartDetails from '../components/CartDetails.vue';
import Role from '../components/Role.vue';

// Customer routes
import CustomerDashboard from '../components/CustomerDashboard.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { 
    path: '/customer-dashboard', 
    name: 'CustomerDashboard', 
    component: CustomerDashboard, 
    meta: { requiresAuth: true, role: 'customer' } 
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' }, // Chỉ dành cho admin
    children: [
      { path: '', name: 'AdminHome', component: AdminHome },
      { path: 'add-customer', name: 'AddCustomer', component: AddCustomer },
      { path: 'cate-list', name: 'CateList', component: CateList },
      { path: 'pr-list', name: 'PrList', component: PrList },
      { path: 'customer-list', name: 'CustomerList', component: CustomerList },
      { path: 'QL_cart', name: 'QL_cart', component: QL_cart },
      { 
        path: 'Tke', 
        name: 'Tke', 
        component: Tke, 
        props: (route) => ({
          categories: route.query.categories || [], 
          products: route.query.products || []
        })
      },
      { path: 'role', name: 'Role', component: Role },
      { path: 'pagination', name: 'Pagination', component: Pagination },
      { path: 'cart-details/:id', name: 'CartDetails', component: CartDetails, props: true },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Lấy thông tin user từ localStorage

  // Kiểm tra nếu route yêu cầu xác thực và người dùng chưa đăng nhập
  if (to.meta.requiresAuth && !token) {
    return next('/login'); // Chuyển hướng về trang login
  }

  // Kiểm tra quyền truy cập theo role
  if (to.meta.role && user.user_role !== to.meta.role) {
    return next('/login'); // Chuyển hướng về trang login nếu không có quyền
  }

  // Nếu người dùng đã đăng nhập và truy cập vào trang login hoặc register, chuyển hướng về trang chủ
  if (to.path === '/login' && token) {
    if (user.user_role === 'admin') {
      return next('/'); // Điều hướng về trang admin nếu là admin
    } else if (user.user_role === 'customer') {
      return next('/customer-dashboard'); // Điều hướng về trang khách hàng nếu là customer
    }
  }

  // if (to.path === '/register' && token) {
  //   return next('/'); // Điều hướng về trang chủ nếu đã đăng nhập
  // }

  next(); // Chuyển hướng bình thường
});

export default router;
