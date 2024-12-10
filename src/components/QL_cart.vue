<template>
  <div class="container mt-4">
    <div class="form-title">
      <h1 class="text-center">Quản lý Đơn Hàng</h1>
    </div>

    <!-- Thanh tìm kiếm -->
    <div class="search-bar mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Tìm kiếm theo tên hoặc mã khách hàng"
      />
    </div>

    <!-- Bảng danh sách đơn hàng -->
    <table class="table table-bordered">
      <thead class="table-dark">
        <tr>
          <th>Mã KH</th>
          <th>Tên KH</th>
          <th>Đơn hàng</th>
          <th>Số lượng</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cart, index) in filteredCartsPaginated" :key="cart.bill_id">
          <td>{{ cart.user_id }}</td>
          <td>{{ cart.user_name }}</td>
          <td>{{ cart.bill_pr }}</td>
          <td>{{ cart.bill_count }}</td>
          <td>
            <select v-model="cart.bill_status" @change="updateBillStatus(cart)">
              <option value="Đang chờ xử lý">Đang chờ xử lý</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Hủy đơn">Hủy đơn</option>
            </select>
          </td>
          <td>
            <span
              @click="viewCartDetails(cart)"
              class="icon-view"
              title="Xem chi tiết"
            >
              🔍
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <div class="pagination-controls">
      <button
        class="btn btn-sm btn-primary"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Trước
      </button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button
        class="btn btn-sm btn-primary"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Sau
      </button>
    </div>

    <!-- Modal Chi tiết -->
    <div v-if="selectedCart" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đơn hàng</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Mã KH:</strong> {{ selectedCart.user_id }}</p>
            <p><strong>Tên KH:</strong> {{ selectedCart.user_name }}</p>
            <p><strong>Đơn hàng:</strong> {{ selectedCart.bill_pr }}</p>
            <p><strong>Đơn giá:</strong> {{ selectedCart.bill_pice_pr }}</p>
            <p><strong>Số lượng:</strong> {{ selectedCart.bill_count }}</p>
            <p><strong>Tổng tiền:</strong> {{ selectedCart.bill_pice }}</p>
            <p><strong>Ngày giờ:</strong> {{ selectedCart.bill_date }}</p>
            <p><strong>Phương thức thanh toán:</strong> {{ selectedCart.payment_method }}</p>
            <p><strong>Địa chỉ:</strong> {{ selectedCart.user_address }}</p>
            <p><strong>Số điện thoại:</strong> {{ selectedCart.user_phone }}</p>
            <p><strong>Trạng thái:</strong> {{ selectedCart.bill_status }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const users = ref([]);
    const bills = ref([]);
    const carts = ref([]);
    const searchQuery = ref("");
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const selectedCart = ref(null);

    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3000/users");
        const billsResponse = await axios.get("http://localhost:3000/bills");

        users.value = usersResponse.data;
        bills.value = billsResponse.data;

        carts.value = bills.value.map((bill) => {
          const user = users.value.find((u) => u.user_id === bill.user_id) || {};
          return { ...bill, bill_id: bill.id, ...user }; // Đổi `id` của bills thành `bill_id`
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    const filteredCarts = computed(() => {
      if (!searchQuery.value) return carts.value;
      return carts.value.filter(
        (cart) =>
          cart.user_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          cart.user_id.toString().includes(searchQuery.value)
      );
    });

    const filteredCartsPaginated = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredCarts.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() =>
      Math.ceil(filteredCarts.value.length / itemsPerPage.value)
    );

    const changePage = (page) => {
      currentPage.value = page;
    };

    const viewCartDetails = (cart) => {
      if (cart && cart.bill_id) {
        selectedCart.value = cart;
      } else {
        console.error("Không tìm thấy ID của đơn hàng");
      }
    };

    const closeModal = () => {
      selectedCart.value = null;
    };

    const updateBillStatus = async (cart) => {
      try {
        await axios.put(`http://localhost:3000/bills/${cart.bill_id}`, {
          ...cart,
          bill_status: cart.bill_status,
        });
        console.log("Cập nhật trạng thái đơn hàng thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      }
    };

    onMounted(fetchData);

    return {
      users,
      bills,
      carts,
      searchQuery,
      currentPage,
      totalPages,
      filteredCartsPaginated,
      changePage,
      viewCartDetails,
      selectedCart,
      closeModal,
      updateBillStatus,
    };
  },
};
</script>



<style scoped>
/* Tiêu đề */
.form-title {
  background-color: #9acd32;
  padding: 10px 0;
  border-bottom: 2px solid #fff;
  text-align: center;
}

/* Bảng */
.table-bordered {
  background-color: #f8f9fa;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.table-dark th {
  background-color: #343a40;
  color: #fff;
}

/* Phân trang */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.pagination-controls button {
  width: 80px;
}

/* Biểu tượng */
.icon-view {
  cursor: pointer;
  font-size: 20px;
  margin: 0 8px;
}

.icon-view:hover {
  color: #007bff;
}
</style>
