<template>
  <section class="category-tabs py-6">
    <div class="container">
      <div class="tab-header d-flex justify-content-center align-items-center mb-5 gap-3">
        <button v-for="tab in tabs" :key="tab.id" @click="handleSelectTab(tab.id)" class="tab-pill"
          :class="{ active: activeTab === tab.id }">
          {{ tab.label }}
        </button>
      </div>

      <transition name="fade" mode="out-in">
        <div :key="activeTab" class="row g-4">
          <div v-if="currentCategoryData.length === 0 && !loadingCategoryTab" class="col-12 text-center py-5">
            <i class="bi bi-box fs-1 text-muted mb-3 d-block"></i>
            <p class="text-muted fw-medium">No products found in this category yet.</p>
          </div>
          <div v-else v-for="item in currentCategoryData" :key="item.id" class="col-12 col-md-4 col-lg-3">
            <CategoryProductCard :product="item" @add-to-cart="handleAddToCart" />
          </div>
        </div>
      </transition>

      <div class="text-center mt-5">
        <NuxtLink to="/categories"
          class="btn btn-primary-custom rounded-pill px-5 py-2 text-decoration-none d-inline-block">
          View All Products →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAsyncData } from "nuxt/app";
import { useProductStore } from "~/stores/productStore";
import { useCategoryStore } from "~/stores/categoryStore";
import CategoryProductCard from "~/components/common/category-product-card.vue";
import { getProductPricing } from "~/utils/helpers";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const { products } = storeToRefs(productStore);

const { data: fetchedParentCategories } = await useAsyncData("home-category-tabs", () =>
  categoryStore.getCategories({ per_page: 50, parent_id: "null" })
);

const tabs = computed(() => {
  const list = [{ id: "all", label: "All" }];
  if (fetchedParentCategories.value?.data && Array.isArray(fetchedParentCategories.value.data)) {
    fetchedParentCategories.value.data.forEach((cat) => {
      list.push({ id: cat.id, label: cat.name });
    });
  }
  return list;
});

const activeTab = ref("all");
const categoryFilteredProducts = ref([]);
const loadingCategoryTab = ref(false);

const handleSelectTab = async (tabId) => {
  activeTab.value = tabId;
  loadingCategoryTab.value = true;
  categoryFilteredProducts.value = [];
  try {
    const params = { per_page: 12, status: 1, column: 'created_at', sort: 'desc' };
    if (tabId !== "all") {
      params.category_id = tabId;
    }
    const res = await productStore.getFilteredProducts(params);
    if (res?.data) {
      categoryFilteredProducts.value = res.data;
    }
  } catch (err) {
    console.error("Failed to filter products by category:", err);
  } finally {
    loadingCategoryTab.value = false;
  }
};

const currentCategoryData = computed(() => {
  const rawItems = categoryFilteredProducts.value.length > 0
    ? categoryFilteredProducts.value
    : (activeTab.value === "all" ? products.value.slice(0, 12) : []);

  return rawItems.map((item) => {
    const { price, oldPrice, badge } = getProductPricing(item);
    const imgUrl = item.thumbnail || item.images?.[0]?.image_url || 'https://placehold.co/600x600/png?text=No+Image';
    return {
      id: item.id,
      uuid: item.uuid,
      title: item.title,
      category: item.category?.name || "SPECIAL DEAL",
      price,
      oldPrice,
      thumbnail: imgUrl,
      image: imgUrl,
      images: item.images || [],
      badge: badge === 'Best Seller' ? '' : badge,
      stock: item.stock
    };
  });
});

const handleAddToCart = (product) => {
  console.log("Added to cart:", product.title);
};
</script>

<style scoped>
.py-6 {
  padding-top: 6rem !important;
  padding-bottom: 6rem !important;
}

.category-tabs {
  background-color: var(--color-surface);
}

.tab-header {
  gap: 2rem;
  flex-wrap: wrap;
}

.tab-pill {
  padding: 8px 24px;
  border-radius: 50px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all 0.3s;
}

.tab-pill.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.btn-primary-custom {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover);
  color: #fff;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
