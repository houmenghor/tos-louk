<template>
  <div class="discount-page pb-5">
    <!-- Top Padding / Breadcrumb area (optional) -->
    <div class="pt-4"></div>

    <div class="container">
      <!-- 1. Hero Banner Section -->
      <section class="banner-section mb-5">
        <DiscountBanner />
      </section>

      <!-- 2. Header and Filters -->
      <section class="deals-header d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h2 class="fw-extrabold mb-2 display-6 page-title">Today's Best Deals</h2>
          <p class="text-muted-custom mb-0">Handpicked discounts and flash sales up to 70% off.</p>
        </div>

        <!-- Filter Pills -->
        <div class="deals-filters d-flex gap-2 overflow-auto pb-2 pb-md-0 hide-scrollbar">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            @click="activeFilter = filter.id"
            class="filter-pill"
            :class="{ active: activeFilter === filter.id }"
          >
            <i :class="filter.icon" class="me-1" v-if="filter.icon"></i>
            {{ filter.label }}
          </button>
        </div>
      </section>

      <!-- 3. Product Grid -->
      <section class="deals-grid position-relative min-vh-50">
        <transition-group name="grid-fade" tag="div" class="row g-4">
          <div 
            class="col-6 col-md-4 col-lg-3" 
            v-for="product in paginatedProducts" 
            :key="product.id"
          >
            <DiscountCardProduct 
              :product="product" 
              @add-to-cart="handleAddToCart"
            />
          </div>
        </transition-group>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-6 empty-state">
          <div class="empty-icon mb-3">
            <i class="bi bi-tag text-muted opacity-50 display-1"></i>
          </div>
          <h4 class="fw-bold">No deals found</h4>
          <p class="text-muted-custom">Check back later for more exciting discounts!</p>
          <button @click="activeFilter = 'all'" class="btn btn-primary-custom mt-3 px-4 py-2">
            View All Deals
          </button>
        </div>
      </section>

      <!-- 4. Pagination -->
      <div class="mt-5 pt-3" v-if="totalPages > 1">
        <BasePagination 
          :current-page="currentPage" 
          :total-pages="totalPages"
          :total-results="filteredProducts.length"
          @update:currentPage="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import DiscountBanner from "~/components/common/discount-banner.vue";
import DiscountCardProduct from "~/components/common/discount-card-product.vue";
import BasePagination from "~/components/base/base-pagination.vue";
import { useCartStore } from "~/stores/cartStore";
import { useProductStore } from "~/stores/productStore";

definePageMeta({
  layout: "default",
});

const cartStore = useCartStore();
const productStore = useProductStore();
const { products } = storeToRefs(productStore);

await useAsyncData("discount-products", async () => {
  if (products.value.length === 0) {
    await productStore.getAllProducts({
      per_page: 50,
      status: 1
    });
  }
  return true;
});

const handleAddToCart = (product) => {
  // Logic is handled internally by DiscountCardProduct, but we can emit to parent if needed
};

// Filters
const activeFilter = ref("all");
const filters = [
  { id: "all", label: "All Deals", icon: "bi-stars" },
  { id: "flash", label: "Flash Sale", icon: "bi-lightning-fill" },
  { id: "clearance", label: "Clearance", icon: "bi-box-seam" },
  { id: "under50", label: "Under $50", icon: "bi-tag-fill" },
];



const allDeals = computed(() => {
  return products.value
    .filter((item) => {
      const { oldPrice } = getProductPricing(item);
      return item.discount || oldPrice !== null;
    })
    .map((item) => {
      const { price, oldPrice, badge } = getProductPricing(item);
      const isFlash = Boolean(item.discount && item.discount.value >= 30);
      const isClearance = Boolean(!isFlash && (oldPrice !== null || (item.discount && item.discount.value >= 15)));

      return {
        id: item.id,
        uuid: item.uuid,
        slug: item.slug,
        title: item.title,
        category: item.category?.name || "SPECIAL DEAL",
        price,
        oldPrice,
        thumbnail: item.thumbnail || item.images?.[0]?.image_url || "https://placehold.co/400x400/png?text=Deal",
        image: item.thumbnail || item.images?.[0]?.image_url || "https://placehold.co/400x400/png?text=Deal",
        images: item.images || [],
        badge: badge || (isFlash ? "Flash Deal" : "Clearance"),
        stock: item.stock,
        stockWarning: item.stock_warning || 10,
        isFlash,
        isClearance
      };
    });
});

// Computed filtered products
const filteredProducts = computed(() => {
  let items = allDeals.value;
  
  if (activeFilter.value === "flash") {
    items = items.filter(p => p.isFlash);
  } else if (activeFilter.value === "clearance") {
    items = items.filter(p => p.isClearance);
  } else if (activeFilter.value === "under50") {
    items = items.filter(p => p.price < 50);
  }
  
  return items;
});

// Pagination Logic
const currentPage = ref(1);
const itemsPerPage = 8;

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

watch(activeFilter, () => {
  currentPage.value = 1;
});

const handlePageChange = (page) => {
  currentPage.value = page;
  // Smooth scroll to top of deals grid
  window.scrollTo({ top: 300, behavior: 'smooth' });
};

const { t } = useI18n();

useSeoMeta({
  title: () => t('navbar.discount'),
  ogTitle: () => t('navbar.discount')
});
</script>

<style scoped>
/* Page Layout */
.discount-page {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.page-title {
  color: var(--color-text);
  letter-spacing: -0.02em;
}

/* ── Filter Pills ── */
.deals-filters {
  white-space: nowrap;
}

.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.filter-pill {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 8px 20px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
}

.filter-pill:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.filter-pill.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 15px rgba(0, 220, 130, 0.25);
}

/* ── Vue Transition Group Animations ── */
.grid-fade-move,
.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.grid-fade-leave-active {
  position: absolute;
}

/* ── Extras ── */
.empty-state {
  animation: fadeIn 0.5s ease-out;
}

.load-more-btn {
  border-width: 2px;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 220, 130, 0.15);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
