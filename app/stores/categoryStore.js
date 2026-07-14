import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const currentCategory = ref(null);

  const getCategories = async (params = {}) => {
    const query = {};
    if (params.per_page) query.per_page = params.per_page;
    if (params.page !== undefined && params.page !== null) query.page = params.page;
    if (params.search) query.search = params.search;
    if (params.status) query.status = params.status;
    if (params.parent_id !== undefined && params.parent_id !== null) query.parent_id = params.parent_id;
    if (params.column) query.column = params.column;
    if (params.sort) query.sort = typeof params.sort === "string" ? params.sort.toLowerCase() : params.sort;

    const response = await $fetch("/api/categories", { query });
    if (response?.data !== undefined) {
      categories.value = response.data;
    }
    return response;
  };

  const getCategoryByUuid = async (uuid) => {
    const response = await $fetch(`/api/categories/${uuid}`);
    if (response?.data) {
      currentCategory.value = response.data;
    }
    return response;
  };

  return {
    categories,
    currentCategory,
    getCategories,
    getCategoryByUuid,
  };
});
