<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Thống Kê Sản Phẩm</h1>

    <!-- Bảng thống kê -->
    <div class="mb-5">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Loại hàng</th>
            <th>Số lượng</th>
            <th>Giá cao nhất</th>
            <th>Giá thấp nhất</th>
            <th>Giá trung bình</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.category_name }}</td>
            <td>{{ getProductCount(category.category_id) }}</td>
            <td>{{ getMaxPrice(category.category_id) }}</td>
            <td>{{ getMinPrice(category.category_id) }}</td>
            <td>{{ getAvgPrice(category.category_id) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Nút để hiển thị/ẩn biểu đồ -->
    <div class="text-center">
      <button @click="toggleChartVisibility" class="btn btn-primary mb-4">
        {{ isChartVisible ? 'Ẩn Biểu Đồ' : 'Xem Biểu Đồ' }}
      </button>
    </div>

    <!-- Biểu đồ tròn -->
    <div v-if="isChartVisible" class="pie-chart-container">
      <h3 class="text-center">Biểu đồ thống kê giá sản phẩm</h3>
      <PieChart :data="chartData" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Đăng ký các phần tử Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

export default {
  name: 'Tke',
  components: {
    PieChart: Pie,
  },
  setup() {
    const categories = ref([]);
    const products = ref([]);
    const isChartVisible = ref(false); // Quản lý trạng thái hiển thị biểu đồ

    // Lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get('http://localhost:3000/categories'),
          axios.get('http://localhost:3000/products'),
        ]);

        categories.value = categoriesResponse.data;
        products.value = productsResponse.data;
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    // Tính toán thống kê cho mỗi loại hàng
    const getProductCount = (categoryId) => {
      return products.value.filter(product => product.product_cat === categoryId).length;
    };

    const getMaxPrice = (categoryId) => {
      const productsInCategory = products.value.filter(product => product.product_cat === categoryId);
      return Math.max(...productsInCategory.map(product => product.product_price));
    };

    const getMinPrice = (categoryId) => {
      const productsInCategory = products.value.filter(product => product.product_cat === categoryId);
      return Math.min(...productsInCategory.map(product => product.product_price));
    };

    const getAvgPrice = (categoryId) => {
      const productsInCategory = products.value.filter(product => product.product_cat === categoryId);
      const totalPrice = productsInCategory.reduce((sum, product) => sum + product.product_price, 0);
      return (totalPrice / productsInCategory.length).toFixed(2);
    };

    // Biểu đồ dữ liệu
    const chartData = computed(() => {
      const labels = categories.value.map(category => category.category_name);
      const data = categories.value.map(category => {
        return products.value
          .filter(product => product.product_cat === category.category_id)
          .map(product => product.product_price);
      });

      const chartData = data.map(dataset => dataset.length ? dataset.reduce((a, b) => a + b, 0) / dataset.length : 0);

      return {
        labels: labels,
        datasets: [{
          label: 'Giá trung bình theo loại hàng',
          data: chartData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#7CBB0C'],
        }],
      };
    });

    // Chức năng hiển thị/ẩn biểu đồ
    const toggleChartVisibility = () => {
      isChartVisible.value = !isChartVisible.value;
    };

    onMounted(() => {
      fetchData();
    });

    return {
      categories,
      products,
      getProductCount,
      getMaxPrice,
      getMinPrice,
      getAvgPrice,
      chartData,
      isChartVisible,
      toggleChartVisibility,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
}

table {
  width: 100%;
}

table th, table td {
  text-align: center;
}

table th {
  background-color: #f8f9fa;
}

.text-center {
  text-align: center;
}

.btn {
  font-size: 16px;
  padding: 10px 20px;
}

button {
  cursor: pointer;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.pie-chart-container {
  width: 300px; /* Đặt chiều rộng của biểu đồ */
  height: 300px; /* Đặt chiều cao của biểu đồ */
  margin: 0 auto; /* Canh giữa biểu đồ */
}

@media (max-width: 768px) {
  .pie-chart-container {
    width: 200px; /* Đặt chiều rộng nhỏ hơn cho màn hình nhỏ */
    height: 200px; /* Đặt chiều cao nhỏ hơn cho màn hình nhỏ */
  }
}
</style>
