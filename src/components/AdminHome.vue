<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Dashboard Admin</h1>
    <div class="row">
      <!-- Box Quản lý danh mục -->
      <div class="col-md-3">
        <div class="box bg-success text-white text-center py-4">
          <div>
            <i class="bi bi-grid-fill icon"></i>
            <h4>{{ totalCategories }}</h4> <!-- Hiển thị số lượng danh mục -->
            <p>Danh mục</p>
          </div>
        </div>
      </div>

      <!-- Box Quản lý sản phẩm -->
      <div class="col-md-3">
        <div class="box bg-warning text-white text-center py-4">
          <div>
            <i class="bi bi-box-seam-fill icon"></i>
            <h4>{{ totalProducts }}</h4> <!-- Hiển thị số lượng sản phẩm -->
            <p>Sản phẩm</p>
          </div>
        </div>
      </div>

      <!-- Box Quản lý khách hàng -->
      <div class="col-md-3">
        <div class="box bg-danger text-white text-center py-4">
          <div>
            <i class="bi bi-people-fill icon"></i>
            <h4>{{ totalCustomers }}</h4> <!-- Hiển thị số lượng khách hàng -->
            <p>Khách hàng</p>
          </div>
        </div>
      </div>

      <!-- Box Quản lý đơn hàng -->
      <div class="col-md-3">
        <div class="box bg-primary text-white text-center py-4">
          <div>
            <i class="bi bi-receipt-cutoff icon"></i>
            <h4>{{ totalOrders }}</h4> <!-- Hiển thị số lượng đơn hàng -->
            <p>Đơn hàng</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'AdminHome',
  setup() {
    const categories = ref([]);
    const products = ref([]);
    const customers = ref([]);
    const bills = ref([]);

    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        // Gọi API để lấy dữ liệu
        const [categoriesResponse, productsResponse, customersResponse, billsResponse] = await Promise.all([
          axios.get('http://localhost:3000/categories'),
          axios.get('http://localhost:3000/products'),
          axios.get('http://localhost:3000/users'),
          axios.get('http://localhost:3000/bills') // Lấy dữ liệu đơn hàng
        ]);

        // Gán dữ liệu vào các biến
        categories.value = categoriesResponse.data;
        products.value = productsResponse.data;
        customers.value = customersResponse.data;
        bills.value = billsResponse.data;
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    // Gọi hàm fetchData khi component được mount
    onMounted(() => {
      fetchData();
    });

    // Các computed properties
    const totalCategories = computed(() => categories.value.length);
    const totalProducts = computed(() => products.value.length);
    const totalCustomers = computed(() => customers.value.length);
    const totalOrders = computed(() => bills.value.length);

    return {
      totalCategories,
      totalProducts,
      totalCustomers,
      totalOrders
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}

.row {
  display: flex;
  justify-content: space-between;
}

.box {
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
}

.box i {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.box h4 {
  font-size: 32px;
  margin: 0;
}

.box p {
  margin: 5px 0 0;
  font-size: 18px;
}
</style>
