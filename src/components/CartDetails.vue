<template>
  <div class="container mt-4" v-if="cart">
    <div class="form-title">
      <h1 class="text-center">Chi tiết đơn hàng</h1>
    </div>
    <div class="details-form">
      <div class="form-group">
        <label>Mã KH:</label>
        <p>{{ cart.customerId }}</p>
      </div>
      <div class="form-group">
        <label>Tên KH:</label>
        <p>{{ cart.customerName }}</p>
      </div>
      <div class="form-group">
        <label>Đơn hàng:</label>
        <p>{{ cart.order }}</p>
      </div>
      <div class="form-group">
        <label>Giá:</label>
        <p>{{ cart.price }}</p>
      </div>
      <div class="form-group">
        <label>Số lượng:</label>
        <p>{{ cart.quantity }}</p>
      </div>
      <div class="form-group">
        <label>Ngày giờ:</label>
        <p>{{ cart.date }}</p>
      </div>
      <div class="form-group">
        <label>Phương thức thanh toán:</label>
        <p>{{ cart.payment }}</p>
      </div>
      <div class="form-group">
        <label>Trạng thái:</label>
        <p>{{ cart.status }}</p>
      </div>
      <div class="form-group">
        <label>Tổng cộng:</label>
        <p>{{ cart.total }}</p>
      </div>
      <div class="form-group">
        <label>Địa chỉ:</label>
        <p>{{ cart.address }}</p>
      </div>
      <div class="form-group">
        <label>Số điện thoại:</label>
        <p>{{ cart.phone }}</p>
      </div>
      <div class="text-center mt-3">
        <router-link to="/QL_cart" class="btn btn-secondary">Quay lại</router-link>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Đang tải dữ liệu...</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "CartDetails",
  setup() {
    const cart = ref(null); // Lưu chi tiết giỏ hàng
    const route = useRoute(); // Lấy thông tin route hiện tại

    // Xử lý khi component được mount
    onMounted(() => {
      const cartId = route.params.id; // Lấy cartId từ URL
      console.log("cartId từ URL:", cartId);

      const carts = JSON.parse(localStorage.getItem("carts")) || [];
      console.log("Dữ liệu giỏ hàng trong localStorage:", carts);

      // Tìm giỏ hàng theo ID
      cart.value = carts.find((c) => String(c.id) === cartId);
      console.log("Kết quả tìm giỏ hàng:", cart.value);

      if (!cart.value) {
        console.error("Không tìm thấy giỏ hàng với id:", cartId);
      }
    });

    return {
      cart,
    };
  },
};
</script>

<style scoped>
.form-title {
  background-color: #9acd32;
  padding: 10px 0;
  border-bottom: 2px solid #fff;
}

.container {
  max-width: 900px;
  margin: auto;
}

.details-form {
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.btn {
  width: 200px;
}
</style>
