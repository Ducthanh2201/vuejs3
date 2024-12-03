<template>
  <div class="container mt-4">
    <h1 class="form-title">Danh sách danh mục</h1>
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
          <th>Mã loại</th>
          <th>Tên loại</th>
          <th>Mô tả</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.category_id">
          <td>
            <input
              type="checkbox"
              v-model="selectedCategories"
              :value="category.category_id"
            />
          </td>
          <td>{{ category.category_id }}</td>
          <td>{{ category.category_name }}</td>
          <td>{{ category.category_desc }}</td>
          <td>
            <button class="btn btn-primary me-2" @click="openEditModal(category)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger" @click="openDeleteModal(category)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Thêm/Sửa Danh Mục -->
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
              <label for="category_name">Tên loại:</label>
              <input
                type="text"
                id="category_name"
                v-model="currentCategory.category_name"
                class="form-control"
                placeholder="Nhập tên danh mục"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="category_desc">Mô tả:</label>
              <textarea
                id="category_desc"
                v-model="currentCategory.category_desc"
                class="form-control"
                placeholder="Nhập mô tả danh mục"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button type="button" class="btn btn-primary" @click="saveCategory">
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Xóa Danh Mục -->
    <div
      v-if="isDeleteModalVisible"
      class="modal"
      style="display: block; background: rgba(0, 0, 0, 0.5);"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xóa danh mục</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
            <p><strong>{{ currentCategory.category_name }}</strong></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button type="button" class="btn btn-danger" @click="deleteCategory">
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
    const categories = ref([]);
    const selectedCategories = ref([]);
    const isModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const currentCategory = ref({});
    const modalTitle = ref("");

    // Load danh sách danh mục từ db.json
    const loadCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    const selectAll = (event) => {
      selectedCategories.value = event.target.checked
        ? categories.value.map((category) => category.category_id)
        : [];
    };

    const openAddModal = () => {
      currentCategory.value = { category_name: "", category_desc: "" };
      modalTitle.value = "Thêm mới danh mục";
      isModalVisible.value = true;
    };

    const openEditModal = (category) => {
      currentCategory.value = { ...category };
      modalTitle.value = "Chỉnh sửa danh mục";
      isModalVisible.value = true;
    };

    const saveCategory = async () => {
      try {
        if (modalTitle.value === "Thêm mới danh mục") {
          // Tự động tăng category_id
          const newId =
            categories.value.length > 0
              ? Math.max(...categories.value.map((c) => c.category_id)) + 1
              : 1;
          const newCategory = { ...currentCategory.value, category_id: newId };
          await axios.post("http://localhost:3000/categories", newCategory);
        } else {
          // Chỉnh sửa danh mục
          await axios.put(
            `http://localhost:3000/categories/${currentCategory.value.id}`,
            currentCategory.value
          );
        }
        loadCategories();
        closeModal();
      } catch (error) {
        console.error("Lỗi lưu danh mục:", error);
      }
    };

    const openDeleteModal = (category) => {
      currentCategory.value = { ...category };
      isDeleteModalVisible.value = true;
    };

    const deleteCategory = async () => {
      try {
        await axios.delete(
          `http://localhost:3000/categories/${currentCategory.value.id}`
        );
        loadCategories();
        closeModal();
      } catch (error) {
        console.error("Lỗi xóa danh mục:", error);
      }
    };

    const closeModal = () => {
      isModalVisible.value = false;
      isDeleteModalVisible.value = false;
    };

    onMounted(loadCategories);

    return {
      categories,
      selectedCategories,
      isModalVisible,
      isDeleteModalVisible,
      currentCategory,
      modalTitle,
      selectAll,
      openAddModal,
      openEditModal,
      saveCategory,
      openDeleteModal,
      deleteCategory,
      closeModal,
    };
  },
};
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  background-color: #f8f9fa; /* Light background color */
  border-radius: 10px; /* Rounded corners */
  border: 1px solid #ddd; /* Light border */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
}

.form-title {
  background-color: #9acd32; /* Màu nền xanh lá chuối */
  color: white; /* Màu chữ trắng */
  padding: 10px 0;
  border-bottom: 2px solid #fff;
  text-align: center; /* Căn giữa tiêu đề */
  font-size: 24px; /* Tăng kích thước chữ */
  font-weight: bold; /* Đậm chữ */
}

button {
  font-size: 16px;
  padding: 10px;
  min-width: 120px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f1f1f1;
}

button.btn-primary {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

button.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

button.btn-danger {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

button.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

button.btn-success {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

button.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

input[type="checkbox"] {
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #007bff;
}

.fa-edit, .fa-trash-alt {
  font-size: 16px;
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow: hidden;
  outline: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Màu nền mờ đen */
}

.modal-dialog {
  position: relative;
  margin: auto;
  max-width: 500px;
  width: 100%;
  background: #fff; /* Màu nền trắng */
  border-radius: 10px; /* Bo tròn góc */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Đổ bóng */
  animation: slideDown 0.3s ease-out; /* Hiệu ứng slide xuống */
}

.modal-content {
  border: none; /* Loại bỏ border */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #007bff; /* Màu xanh dương */
  color: white;
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 10px; /* Bo tròn góc trên */
  border-top-right-radius: 10px; /* Bo tròn góc trên */
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
}

.btn-close:hover {
  color: #f8d7da; /* Đổi màu khi hover */
}

.modal-body {
  padding: 20px;
  font-size: 16px;
  color: #333; /* Màu chữ đen nhạt */
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  background-color: #f1f1f1; /* Màu nền nhạt */
  border-top: 1px solid #ddd;
  border-bottom-left-radius: 10px; /* Bo tròn góc dưới */
  border-bottom-right-radius: 10px; /* Bo tròn góc dưới */
}

.modal-footer button {
  font-size: 14px;
  margin-left: 10px;
}

button.btn-secondary {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

button.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

/* Hiệu ứng xuất hiện modal */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
