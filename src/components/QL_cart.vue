<template>
  <div class="container mt-4">
    <div class="form-title">
      <h1 class="text-center">Quản lý giỏ hàng</h1>
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

    <!-- Bảng danh sách giỏ hàng -->
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
        <tr v-for="(cart, index) in filteredCartsPaginated" :key="cart.id">
          <td>{{ cart.customerId }}</td>
          <td>{{ cart.customerName }}</td>
          <td>{{ cart.order }}</td>
          <td>{{ cart.quantity }}</td>
          <td>
            <button
              class="btn btn-sm"
              :class="cart.status === 'Active' ? 'btn-success' : 'btn-secondary'"
              @click="toggleStatus(index)"
            >
              {{ cart.status }}
            </button>
          </td>
          <td>
            <span
              @click="viewCartDetails(cart.id)"
              class="icon-view"
              title="Xem chi tiết"
            >
              🔍
            </span>
            <span
              @click="confirmDeleteCart(cart.id)"
              class="icon-trash"
              title="Xóa giỏ hàng"
            >
              🗑️
            </span>
          </td>
        </tr>
      </tbody>
    </table>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      carts: JSON.parse(localStorage.getItem("carts")) || [], 
      searchQuery: "", 
      currentPage: 1, 
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredCarts() {
      const query = this.searchQuery.toLowerCase();
      return this.carts.filter(
        (cart) =>
          cart.customerName.toLowerCase().includes(query) ||
          cart.customerId.toString().includes(query)
      );
    },
    filteredCartsPaginated() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredCarts.slice(startIndex, startIndex + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredCarts.length / this.itemsPerPage);
    },
  },
  methods: {
    toggleStatus(index) {
      const cart = this.filteredCartsPaginated[index];
      cart.status = cart.status === "Active" ? "Inactive" : "Active";
      this.updateLocalStorage();
    },

    viewCartDetails(id) {
      this.$router.push({ name: "CartDetails", params: { id } });
    },

    confirmDeleteCart(id) {
      const confirmDelete = confirm("Bạn có chắc chắn muốn xóa giỏ hàng này?");
      if (confirmDelete) {
        this.deleteCart(id);
      }
    },

    deleteCart(id) {
      this.carts = this.carts.filter((cart) => cart.id !== id);
      this.updateLocalStorage();
    },

    updateLocalStorage() {
      localStorage.setItem("carts", JSON.stringify(this.carts));
    },

    changePage(page) {
      this.currentPage = page;
    },
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
.icon-view,
.icon-trash {
  cursor: pointer;
  font-size: 20px;
  margin: 0 8px;
}

.icon-view:hover {
  color: #007bff;
}

.icon-trash:hover {
  color: #dc3545;
}
</style>
