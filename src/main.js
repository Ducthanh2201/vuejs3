import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Đảm bảo CSS được import
import router from './router/Router.js';

// Import FontAwesome và các icon bạn muốn sử dụng
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Thêm các icon vào thư viện FontAwesome
library.add(faEnvelope, faBell, faBars);

const app = createApp(App);

// Đăng ký FontAwesomeIcon như một component toàn cục
app.component('font-awesome-icon', FontAwesomeIcon);

// Sử dụng router và mount ứng dụng
app.use(router).mount('#app');
// Nạp dữ liệu mẫu vào localStorage
if (!localStorage.getItem("carts")) {
    const sampleCarts = [
      {
        id: "1",
        customerId: "KH001",
        customerName: "Nguyễn Văn A",
        order: "Laptop",
        price: "15000000",
        quantity: 1,
        date: "2024-11-19",
        payment: "Thanh toán khi nhận hàng",
        status: "Chưa xử lý",
        total: "15000000",
        address: "123 Đường ABC, Quận 1, TP. HCM",
        phone: "0123456789",
      },
      {
        id: "2",
        customerId: "KH002",
        customerName: "Trần Thị B",
        order: "Điện thoại",
        price: "8000000",
        quantity: 2,
        date: "2024-11-18",
        payment: "Chuyển khoản",
        status: "Đã xử lý",
        total: "16000000",
        address: "456 Đường XYZ, Quận 2, TP. HCM",
        phone: "0987654321",
      },
    ];
  
    console.log("Dữ liệu mẫu sẽ được lưu vào localStorage:", sampleCarts);
    localStorage.setItem("carts", JSON.stringify(sampleCarts));
  } else {
    console.log("Dữ liệu giỏ hàng đã tồn tại trong localStorage.");
  }
  