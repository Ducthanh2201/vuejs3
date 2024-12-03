<template>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="$emit('page-changed', currentPage - 1)">
        Trước
      </button>
      <span>Trang {{ currentPage }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="$emit('page-changed', currentPage + 1)"
      >
        Sau
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalItems: Number,
      itemsPerPage: Number,
    },
    computed: {
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
      },
    },
  };
  </script>
  
  <style>
  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  </style>
  