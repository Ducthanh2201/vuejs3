<template>
  <div class="container mt-4">
      <div class="form-title">
          <h1 class="text-center">Quản lý nhân viên</h1>
      </div>

      <div class="mb-3 text-center">
          <button class="btn btn-success" @click="openAddEmployeeModal">Thêm nhân viên</button>
          <button
              v-if="selectedEmployees.length > 0"
              @click="deleteSelectedEmployees"
              class="btn btn-danger"
          >
              Xóa nhân viên đã chọn
          </button>
      </div>

      <table class="table table-bordered">
          <thead>
              <tr>
                  <th>
                      <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
                  </th>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Hình Ảnh</th>
                  <th>Trạng thái</th>
                  <th>Quyền nhân viên</th>
                  <th>Thao tác</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(employee, index) in employees" :key="employee.id">
                  <td>
                      <input
                          type="checkbox"
                          :value="employee.id"
                          v-model="selectedEmployees"
                      />
                  </td>
                  <td>{{ employee.user_id }}</td>
                  <td>{{ employee.user_name }}</td>
                  <td>{{ employee.user_email }}</td>
                  <td>{{ employee.user_phone }}</td>
                  <td>{{ employee.user_address }}</td>
                  <td>
                      <img :src="employee.image" alt="Hình ảnh" class="employee-image">
                  </td>
                  <td>{{ employee.status }}</td>
                  <td>{{ employee.role }}</td>
                  <td>
                      <span @click="editEmployee(employee)" class="icon-edit">✏️</span>
                      <span @click="confirmDeleteEmployee(employee)" class="icon-trash">🗑️</span>
                  </td>
              </tr>
          </tbody>
      </table>

      <!-- Modal Thêm Nhân Viên -->
      <div v-if="isAddModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Thêm Nhân Viên Mới</h5>
                      <button type="button" class="btn-close" @click="closeAddEmployeeModal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form @submit.prevent="addEmployee">
                          <div class="mb-3">
                              <label for="addUserName" class="form-label">Tên đăng nhập</label>
                              <input type="text" id="addUserName" v-model="newEmployee.user_name" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="addUserEmail" class="form-label">Email</label>
                              <input type="email" id="addUserEmail" v-model="newEmployee.user_email" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="addUserPhone" class="form-label">Số điện thoại</label>
                              <input type="text" id="addUserPhone" v-model="newEmployee.user_phone" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="addUserAddress" class="form-label">Địa chỉ</label>
                              <input type="text" id="addUserAddress" v-model="newEmployee.user_address" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="addImage" class="form-label">Hình Ảnh</label>
                              <input type="file" id="addImage" @change="onFileChange" class="form-control" accept="image/*" required />
                          </div>
                          <div class="mb-3">
                              <label for="addStatus" class="form-label">Trạng thái</label>
                              <select id="addStatus" v-model="newEmployee.status" class="form-select" required>
                                  <option value="Kích hoạt">Kích hoạt</option>
                                  <option value="Chưa kích hoạt">Chưa kích hoạt</option>
                              </select>
                          </div>
                          <div class="mb-3">
                              <label for="addRole" class="form-label">Quyền nhân viên</label>
                              <select id="addRole" v-model="newEmployee.role" class="form-select" required>
                                  <option value="Quản lý đơn hàng">Quản lý đơn hàng</option>
                                  <option value="Quản lý khách hàng">Quản lý khách hàng</option>
                                  <option value="Quản lý sản phẩm">Quản lý sản phẩm</option>
                              </select>
                          </div>
                          <div class="mb-3">
                              <label for="addUserRole" class="form-label">Vai trò</label>
                              <input type="radio" id="addUserRole" v-model="newEmployee.user_role" value="nhân viên" disabled>
                              <label for="addUserRole" class="form-label ms-2">Nhân viên</label>
                          </div>
                          <button type="submit" class="btn btn-primary">Thêm mới</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      <div v-if="isAddModalOpen" class="modal-backdrop fade show" @click="closeAddEmployeeModal"></div>

      <!-- Modal Sửa Nhân Viên -->
      <div v-if="isEditModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Chỉnh sửa nhân viên</h5>
                      <button type="button" class="btn-close" @click="closeEditModal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <form @submit.prevent="updateEmployee">
                          <div class="mb-3">
                              <label for="editUserName" class="form-label">Tên đăng nhập</label>
                              <input type="text" id="editUserName" v-model="currentEmployee.user_name" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="editUserEmail" class="form-label">Email</label>
                              <input type="email" id="editUserEmail" v-model="currentEmployee.user_email" class="form-control" required disabled />
                          </div>
                          <div class="mb-3">
                              <label for="editUserPhone" class="form-label">Số điện thoại</label>
                              <input type="text" id="editUserPhone" v-model="currentEmployee.user_phone" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="editUserAddress" class="form-label">Địa chỉ</label>
                              <input type="text" id="editUserAddress" v-model="currentEmployee.user_address" class="form-control" required />
                          </div>
                          <div class="mb-3">
                              <label for="editImage" class="form-label">Hình Ảnh</label>
                              <input type="file" id="editImage" @change="onFileChange" class="form-control" accept="image/*" />
                          </div>
                          <div class="mb-3">
                              <label for="editStatus" class="form-label">Trạng thái</label>
                              <select id="editStatus" v-model="currentEmployee.status" class="form-select" required>
                                  <option value="Kích hoạt">Kích hoạt</option>
                                  <option value="Chưa kích hoạt">Chưa kích hoạt</option>
                              </select>
                          </div>
                          <div class="mb-3">
                              <label for="editRole" class="form-label">Quyền nhân viên</label>
                              <select id="editRole" v-model="currentEmployee.role" class="form-select" required>
                                  <option value="Quản lý đơn hàng">Quản lý đơn hàng</option>
                                  <option value="Quản lý khách hàng">Quản lý khách hàng</option>
                                  <option value="Quản lý sản phẩm">Quản lý sản phẩm</option>
                              </select>
                          </div>
                          <button type="submit" class="btn btn-primary">Cập nhật</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      <div v-if="isEditModalOpen" class="modal-backdrop fade show" @click="closeEditModal"></div>
  </div>
</template>

  
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Biến trạng thái
const employees = ref([]);
const selectedEmployees = ref([]);
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const currentEmployee = ref({});
const newEmployee = ref({
  user_name: '',
  user_email: '',
  user_phone: '',
  user_address: '',
  image: '',
  status: 'Kích hoạt',
  user_role: 'nhân viên',
  role: 'Quản lý sản phẩm',
});
const imageFile = ref(null); // Lưu file ảnh được chọn

// Mở modal thêm nhân viên
const openAddEmployeeModal = () => {
  isAddModalOpen.value = true;
};

// Đóng modal thêm nhân viên
const closeAddEmployeeModal = () => {
  isAddModalOpen.value = false;
};

// Xử lý file ảnh và lưu vào biến `imageFile`
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
  }
};

// Thêm nhân viên mới
const addEmployee = async () => {
  try {
    // Lấy danh sách người dùng từ db.json
    const response = await axios.get('http://localhost:3000/users');
    const users = response.data;

    // Lọc dữ liệu hợp lệ và tìm giá trị user_id lớn nhất
    const validUsers = users.filter((user) => user.user_id !== null); // Loại bỏ user_id null
    const maxUserId = validUsers.length
      ? Math.max(...validUsers.map((user) => user.user_id)) // Lấy user_id lớn nhất
      : 0;

    // Tạo id và user_id mới
    const newId = users.length ? `${users[users.length - 1].id}1` : '1';
    const newUserId = maxUserId + 1;

    // Xử lý hình ảnh và tạo Blob URL từ file ảnh
    let imageBlob = '';
    if (imageFile.value) {
      imageBlob = URL.createObjectURL(imageFile.value);
    }

    const employeeData = {
      id: newId,
      user_id: newUserId,
      image: imageBlob,
      ...newEmployee.value,
    };

    // Gửi yêu cầu POST để thêm nhân viên vào db.json
    await axios.post('http://localhost:3000/users', employeeData);

    // Cập nhật danh sách nhân viên
    employees.value.push(employeeData);

    // Đóng modal sau khi thêm thành công
    closeAddEmployeeModal();
  } catch (error) {
    console.error('Lỗi khi thêm nhân viên:', error);
  }
};

// Tải danh sách nhân viên
const loadEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:3000/users');
    if (response.data && Array.isArray(response.data)) {
      employees.value = response.data.filter((employee) => employee.user_role === 'nhân viên');
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhân viên:', error);
  }
};

// Xóa nhân viên
const deleteEmployee = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/users/${id}`);
    employees.value = employees.value.filter((employee) => employee.id !== id);
    selectedEmployees.value = selectedEmployees.value.filter((selectedId) => selectedId !== id);
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
  }
};

// Xác nhận xóa nhân viên
const confirmDeleteEmployee = (employee) => {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    deleteEmployee(employee.id);
  }
};

// Sửa nhân viên
const editEmployee = (employee) => {
  currentEmployee.value = { ...employee };
  isEditModalOpen.value = true;
};

// Cập nhật nhân viên
const updateEmployee = async () => {
  try {
    // Nếu người dùng chọn file ảnh mới, tạo Blob URL
    if (imageFile.value) {
      currentEmployee.value.image = URL.createObjectURL(imageFile.value);
    }

    await axios.put(`http://localhost:3000/users/${currentEmployee.value.id}`, currentEmployee.value);

    const index = employees.value.findIndex((employee) => employee.id === currentEmployee.value.id);
    if (index !== -1) {
      employees.value[index] = { ...currentEmployee.value };
    }
    isEditModalOpen.value = false;
  } catch (error) {
    console.error('Lỗi khi cập nhật nhân viên:', error);
  }
};

// Đóng modal chỉnh sửa
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Tải dữ liệu khi gắn component
onMounted(() => {
  loadEmployees();
});

// Chọn tất cả nhân viên
const isAllSelected = computed(() => employees.value.length > 0 && selectedEmployees.value.length === employees.value.length);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedEmployees.value = [];
  } else {
    selectedEmployees.value = employees.value.map((employee) => employee.id);
  }
};

// Xóa nhân viên đã chọn
const deleteSelectedEmployees = async () => {
  if (confirm('Bạn có chắc chắn muốn xóa các nhân viên đã chọn?')) {
    for (const id of selectedEmployees.value) {
      await deleteEmployee(id);
    }
    selectedEmployees.value = [];
  }
};
</script>

<style scoped>
.employee-image {
  border-radius: 50%;
  object-fit: cover;
  width: 50px;
  height: 50px;
}
</style>
