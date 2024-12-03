<template>
  <div class="container mt-4">
    <h1 class="form-title">Danh sách sản phẩm</h1>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button class="btn btn-danger" @click="openDeleteSelectedModal">Xóa</button>
      <button class="btn btn-success" @click="openAddModal">Thêm mới</button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>
            <input type="checkbox" @change="selectAll" />
          </th>
          <th>Mã sản phẩm</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Giảm giá</th>
          <th>Số lượng</th>
          <th>Danh mục</th>
          <th>Hình ảnh</th>
          <th>Ngày tạo</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.product_id">
          <td>
            <input
              type="checkbox"
              v-model="selectedProducts"
              :value="product.product_id"
            />
          </td>
          <td>{{ product.product_id }}</td>
          <td>{{ product.product_name }}</td>
          <td>{{ product.product_price | currency }}</td>
          <td>{{ product.product_discount }}%</td>
          <td>{{ product.product_count }}</td>
          <td>{{ product.product_cat }}</td>
          <td><img :src="product.product_img" alt="Product Image" width="100" /></td>
          <td>{{ product.created_at }}</td>
          <td>{{ product.product_status }}</td>
          <td>
            <button class="btn btn-primary me-2" @click="openEditModal(product)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger" @click="openDeleteModal(product)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Thêm/Sửa Sản Phẩm -->
    <div
      v-if="isModalVisible"
      class="modal"
      style="display: block; background: rgba(0, 0, 0, 0.5);"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3">
              <label for="product_name">Tên sản phẩm:</label>
              <input
                type="text"
                id="product_name"
                v-model="currentProduct.product_name"
                class="form-control"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="product_price">Giá:</label>
              <input
                type="number"
                id="product_price"
                v-model="currentProduct.product_price"
                class="form-control"
                placeholder="Nhập giá sản phẩm"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="product_discount">Giảm giá (%):</label>
              <input
                type="number"
                id="product_discount"
                v-model="currentProduct.product_discount"
                class="form-control"
                placeholder="Nhập % giảm giá"
              />
            </div>
            <div class="form-group mb-3">
              <label for="product_count">Số lượng:</label>
              <input
                type="number"
                id="product_count"
                v-model="currentProduct.product_count"
                class="form-control"
                placeholder="Nhập số lượng"
                required
              />
            </div>
            <div>
            <label>Ngày nhập:</label>
            <input type="date" v-model="currentProduct.created_at" class="form-control" />
            </div>
            <div class="form-group mb-3">
              <label>Danh mục:</label>
            <select v-model="currentProduct.category_name" class="form-select">
              <option v-for="category in categories" :key="category.category_id" :value="category.category_name">
                {{ category.category_name }}
              </option>
            </select>
            </div>
            <div class="form-group mb-3">
              <label for="product_img">Chọn hình ảnh:</label>
              <input
                type="file"
                id="product_img"
                class="form-control"
                @change="handleImageUpload"
              />
              <img v-if="imagePreview" :src="imagePreview" alt="Hình ảnh sản phẩm" width="100" class="mt-2" />
            </div>
            <div class="form-group mb-3">
              <label for="product_status">Trạng thái:</label>
              <select
                id="product_status"
                v-model="currentProduct.product_status"
                class="form-control"
              >
                <option value="hiển thị">Hiển thị</option>
                <option value="không hiển thị">Không hiển thị</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="saveProduct">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Xóa Sản Phẩm -->
    <div
      v-if="isDeleteModalVisible"
      class="modal"
      style="display: block; background: rgba(0, 0, 0, 0.5);"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xóa sản phẩm</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            <p><strong>{{ currentProduct.product_name }}</strong></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const products = ref([]);
    const categories = ref([]);
    const selectedProducts = ref([]);
    const isModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const currentProduct = ref({});
    const modalTitle = ref("");
    const imagePreview = ref(null);

    // Load danh sách sản phẩm từ db.json
    const loadProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        products.value = response.data;
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    // Load danh sách danh mục từ cate-list (giả sử lấy từ API hoặc file khác)
    const loadCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    const selectAll = (event) => {
      selectedProducts.value = event.target.checked
        ? products.value.map((product) => product.product_id)
        : [];
    };

    const openAddModal = () => {
      currentProduct.value = { product_name: "", product_price: "", product_discount: "", product_count: "", product_cat: "", product_status: "hiển thị", product_img: "" };
      modalTitle.value = "Thêm mới sản phẩm";
      isModalVisible.value = true;
    };

    const openEditModal = (product) => {
      currentProduct.value = { ...product };
      modalTitle.value = "Sửa sản phẩm";
      isModalVisible.value = true;
    };

    const saveProduct = async () => {
      try {
        if (currentProduct.value.id) {
          await axios.put(
            `http://localhost:3000/products/${currentProduct.value.id}`,
            currentProduct.value
          );
        } else {
          await axios.post("http://localhost:3000/products", currentProduct.value);
        }
        loadProducts();
        closeModal();
      } catch (error) {
        console.error("Lỗi lưu sản phẩm:", error);
      }
    };

    const openDeleteModal = (product) => {
      currentProduct.value = product;
      isDeleteModalVisible.value = true;
    };

    const deleteProduct = async () => {
      try {
        await axios.delete(
          `http://localhost:3000/products/${currentProduct.value.id}`
        );
        loadProducts();
        closeModal();
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
      }
    };

    const closeModal = () => {
      isModalVisible.value = false;
      isDeleteModalVisible.value = false;
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.value = reader.result;
          currentProduct.value.product_img = imagePreview.value;
        };
        reader.readAsDataURL(file);
      }
    };

    const getCategoryName = (catId) => {
      const category = categories.value.find((category) => category.id === catId);
      return category ? category.name : "Không có danh mục";
    };

    onMounted(() => {
      loadProducts();
      loadCategories();
    });

    return {
      products,
      categories,
      selectedProducts,
      isModalVisible,
      isDeleteModalVisible,
      currentProduct,
      modalTitle,
      imagePreview,
      loadProducts,
      selectAll,
      openAddModal,
      openEditModal,
      saveProduct,
      openDeleteModal,
      deleteProduct,
      closeModal,
      handleImageUpload,
      getCategoryName,
    };
  },
};
</script>
<style scoped>
.product-list-container {
  max-width: 1200px;
  margin: 30px auto;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  background: #068813;
  padding: 10px;
  border-radius: 8px;
  color: rgb(32, 29, 29);
  text-align: center;
}

.actions-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.table {
  border-collapse: collapse;
  width: 100%;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

.table img {
  border-radius: 5px;
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.table-primary {
  background-color: #007bff;
  color: white;
}

.btn-icon i {
  margin-right: 5px;
}
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

/* Modal Dialog */
.modal-dialog {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 500px;
  max-width: 90%;
  position: relative;
  z-index: 1051;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 15px 0;
}

.modal-body > div {
  margin-bottom: 15px;
}

.modal-body label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.modal-body input,
.modal-body select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-footer {
  padding-top: 15px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

</style>
