<template>
  <div class="categories-page py-5">
    <div class="container">
      <!-- Hero Section -->
      <div
        class="categories-hero p-5 rounded-4 mb-5 text-center position-relative overflow-hidden shadow-sm"
      >
        <div class="glow-bubble-1"></div>
        <div class="glow-bubble-2"></div>
        <div class="position-relative z-1">
          <span
            class="badge rounded-pill bg-primary-light text-primary mb-3 px-3 py-2 fw-semibold text-uppercase"
          >
            Browse Catalog
          </span>
          <h1 class="display-4 fw-extrabold text-main mb-3">
            Explore Categories
          </h1>
          <p class="lead subtitle-text mx-auto" style="max-width: 600px">
            Find exactly what you are looking for by browsing our curated
            collections. Toggle filters, search items, and discover modern
            essentials.
          </p>
        </div>
      </div>

      <!-- Categories Card Grid -->
      <div class="row g-4 mb-5">
        <div v-for="cat in categories" :key="cat.id" class="col-xl-3 col-md-6">
          <div
            class="category-card rounded-4 overflow-hidden border shadow-sm"
            :class="{ 'active-card': selectedCategory === cat.slug }"
            @click="selectCategory(cat.slug)"
          >
            <div class="img-container position-relative">
              <NuxtImg
                :src="cat.image"
                :alt="cat.name"
                class="w-100 h-100 object-fit-cover"
              />
              <div class="img-overlay"></div>
              <span
                class="badge position-absolute top-0 end-0 m-3 item-count-badge"
              >
                {{ cat.count }} Items
              </span>
            </div>
            <div class="card-content p-4">
              <div class="d-flex align-items-center gap-2 mb-2">
                <i :class="['bi', cat.icon, 'text-primary-icon']"></i>
                <h5 class="fw-bold mb-0 text-main">{{ cat.name }}</h5>
              </div>
              <p class="small text-muted-custom mb-3">{{ cat.desc }}</p>

              <!-- Subcategory pills -->
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="sub in cat.subcategories"
                  :key="sub"
                  class="sub-pill"
                >
                  {{ sub }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Catalog Header / Filter bar -->
      <div class="mb-4 p-4 rounded-4 bg-surface shadow-sm border filter-bar-container">
        <div class="d-flex flex-column flex-lg-row gap-4 align-items-lg-end">
          
          <!-- Search -->
          <div class="flex-grow-1">
            <label class="form-label fw-bold mb-2 small" style="font-size: 15px; color: var(--color-text);">Search Products</label>
            <div class="input-group">
              <input 
                type="text" 
                v-model="searchQuery" 
                class="form-control top-filter-input" 
                placeholder="Search for products..."
              >
              <button class="btn btn-primary-custom d-flex align-items-center justify-content-center px-4 search-addon-btn" type="button">
                <i class="bi bi-search text-white"></i>
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div class="filter-dropdown-wrapper" style="min-width: 160px;">
            <label class="form-label fw-bold mb-2 small" style="font-size: 15px; color: var(--color-text);">Price Range</label>
            <BaseSelectOption 
              v-model="priceRangeSelect" 
              :options="priceOptions"
              placeholder="All Prices"
              class="top-filter-select"
              style="margin-bottom: 0 !important;"
            />
          </div>

          <!-- Sort By -->
          <div class="filter-dropdown-wrapper" style="min-width: 160px;">
            <label class="form-label fw-bold mb-2 small" style="font-size: 15px; color: var(--color-text);">Sort By</label>
            <BaseSelectOption 
              v-model="sortBy" 
              :options="sortOptions"
              placeholder="Featured"
              class="top-filter-select"
              style="margin-bottom: 0 !important;"
            />
          </div>

          <!-- View -->
          <div class="d-flex align-items-end gap-3 flex-wrap flex-sm-nowrap">
            <div>
              <label class="form-label fw-bold mb-2 small d-block" style="font-size: 15px; color: var(--color-text);">View</label>
              <div class="d-flex gap-2">
                <button 
                  class="btn view-toggle-btn d-flex align-items-center justify-content-center" 
                  :class="viewMode === 'grid' ? 'btn-primary-custom active-view' : 'btn-outline-border text-muted-custom'"
                  @click="viewMode = 'grid'"
                >
                  <i class="bi bi-grid-fill"></i>
                </button>
                <button 
                  class="btn view-toggle-btn d-flex align-items-center justify-content-center" 
                  :class="viewMode === 'list' ? 'btn-primary-custom active-view' : 'btn-outline-border text-muted-custom'"
                  @click="viewMode = 'list'"
                >
                  <i class="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
            
            <div style="min-width: 130px;">
              <label class="form-label mb-2 d-block d-none d-lg-block">&nbsp;</label>
              <BaseSelectOption 
                v-model="itemsPerPage" 
                :options="itemsPerPageOptions"
                placeholder="12 per page"
                class="top-filter-select"
                style="margin-bottom: 0 !important;"
              />
            </div>
          </div>
          
        </div>

        <!-- Active Filters Section -->
        <template v-if="hasActiveFilters">
          <hr class="my-4" style="border-color: var(--color-border); opacity: 0.5;">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div class="d-flex align-items-center flex-wrap gap-2">
              <span class="fw-bold me-2 text-main">Active Filters:</span>
              
              <!-- Search Pill -->
              <span v-if="searchQuery" class="badge position-relative overflow-hidden d-flex align-items-center gap-2 px-3 py-2 border-0 fw-medium rounded-pill" style="color: var(--color-primary); z-index: 1;">
                <div class="position-absolute w-100 h-100 top-0 start-0 z-n1" style="background-color: var(--color-primary); opacity: 0.1;"></div>
                "{{ searchQuery }}"
                <i class="bi bi-x cursor-pointer fs-6 lh-1" @click="searchQuery = ''"></i>
              </span>
              
              <!-- Category Pill -->
              <span v-if="selectedCategory !== 'all'" class="badge position-relative overflow-hidden d-flex align-items-center gap-2 px-3 py-2 border-0 fw-medium rounded-pill capitalize-text" style="color: var(--color-primary); z-index: 1;">
                <div class="position-absolute w-100 h-100 top-0 start-0 z-n1" style="background-color: var(--color-primary); opacity: 0.1;"></div>
                {{ selectedCategory }}
                <i class="bi bi-x cursor-pointer fs-6 lh-1" @click="selectedCategory = 'all'"></i>
              </span>

              <!-- Price Select Pill -->
              <span v-if="priceRangeSelect !== 'all'" class="badge position-relative overflow-hidden d-flex align-items-center gap-2 px-3 py-2 border-0 fw-medium rounded-pill" style="color: var(--color-primary); z-index: 1;">
                <div class="position-absolute w-100 h-100 top-0 start-0 z-n1" style="background-color: var(--color-primary); opacity: 0.1;"></div>
                {{ priceOptions.find(o => o.value === priceRangeSelect)?.label }}
                <i class="bi bi-x cursor-pointer fs-6 lh-1" @click="priceRangeSelect = 'all'"></i>
              </span>

              <!-- Brands Pill -->
              <span v-for="brand in selectedBrands" :key="brand" class="badge position-relative overflow-hidden d-flex align-items-center gap-2 px-3 py-2 border-0 fw-medium rounded-pill capitalize-text" style="color: var(--color-primary); z-index: 1;">
                <div class="position-absolute w-100 h-100 top-0 start-0 z-n1" style="background-color: var(--color-primary); opacity: 0.1;"></div>
                {{ brand }}
                <i class="bi bi-x cursor-pointer fs-6 lh-1" @click="selectedBrands = selectedBrands.filter(b => b !== brand)"></i>
              </span>

              <!-- Color Pill -->
              <span v-if="selectedColorApplied" class="badge position-relative overflow-hidden d-flex align-items-center gap-2 px-3 py-2 border-0 fw-medium rounded-pill capitalize-text" style="color: var(--color-primary); z-index: 1;">
                <div class="position-absolute w-100 h-100 top-0 start-0 z-n1" style="background-color: var(--color-primary); opacity: 0.1;"></div>
                {{ selectedColorApplied }}
                <i class="bi bi-x cursor-pointer fs-6 lh-1" @click="clearColorFilter"></i>
              </span>
            </div>

            <button @click="resetFilters" class="btn btn-outline-primary-custom px-4 rounded-pill fw-medium clear-all-btn d-flex align-items-center justify-content-center" style="height: 38px;">
              Clear All
            </button>
          </div>
        </template>

      </div>

      <!-- Product Browser Section -->
      <div class="row g-4">
        <!-- Sidebar Filters (Left Column on Desktop) -->
        <div class="col-lg-3 col-md-4">
          <div class="sidebar-filters d-flex flex-column gap-4">
            <!-- Categories Accordion Widget -->
            <div class="product-categories-widget widget-item mb-4">
              <h3 class="widget-title">Categories</h3>
              <ul class="category-tree list-unstyled mb-0">
                <!-- Clothing -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="toggleAccordion('clothing')">
                    <a href="javascript:void(0)" class="category-link">Clothing</a>
                    <span class="category-toggle">
                      <i class="bi" :class="activeAccordion.clothing ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </span>
                  </div>
                  <ul :class="['subcategory-list list-unstyled ps-3', { expanded: activeAccordion.clothing }]">
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'clothing'">Men's Wear</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'clothing'">Women's Wear</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'clothing'">Kids' Clothing</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'clothing'">Accessories</a></li>
                  </ul>
                </li>

                <!-- Electronics -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="toggleAccordion('electronics')">
                    <a href="javascript:void(0)" class="category-link">Electronics</a>
                    <span class="category-toggle">
                      <i class="bi" :class="activeAccordion.electronics ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </span>
                  </div>
                  <ul :class="['subcategory-list list-unstyled ps-3', { expanded: activeAccordion.electronics }]">
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'electronics'">Mobiles</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'electronics'">Laptops</a></li>
                  </ul>
                </li>

                <!-- Home & Kitchen -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="toggleAccordion('homeKitchen')">
                    <a href="javascript:void(0)" class="category-link">Home &amp; Kitchen</a>
                    <span class="category-toggle">
                      <i class="bi" :class="activeAccordion.homeKitchen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </span>
                  </div>
                  <ul :class="['subcategory-list list-unstyled ps-3', { expanded: activeAccordion.homeKitchen }]">
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'homeKitchen'">Kitchenware</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'homeKitchen'">Home Decor</a></li>
                  </ul>
                </li>

                <!-- Beauty & Personal Care -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="toggleAccordion('beautyPersonal')">
                    <a href="javascript:void(0)" class="category-link">Beauty &amp; Personal Care</a>
                    <span class="category-toggle">
                      <i class="bi" :class="activeAccordion.beautyPersonal ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </span>
                  </div>
                  <ul :class="['subcategory-list list-unstyled ps-3', { expanded: activeAccordion.beautyPersonal }]">
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'beautyPersonal'">Makeup</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'beautyPersonal'">Skincare</a></li>
                  </ul>
                </li>

                <!-- Sports & Outdoors -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="toggleAccordion('sportsOutdoors')">
                    <a href="javascript:void(0)" class="category-link">Sports &amp; Outdoors</a>
                    <span class="category-toggle">
                      <i class="bi" :class="activeAccordion.sportsOutdoors ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </span>
                  </div>
                  <ul :class="['subcategory-list list-unstyled ps-3', { expanded: activeAccordion.sportsOutdoors }]">
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'sportsOutdoors'">Fitness</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'sportsOutdoors'">Camping</a></li>
                  </ul>
                </li>

                <!-- Books -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="selectedCategory = 'books'">
                    <a href="javascript:void(0)" class="category-link">Books</a>
                  </div>
                </li>

                <!-- Toys & Games -->
                <li class="category-item">
                  <div class="category-header d-flex justify-content-between align-items-center" @click="toggleAccordion('toysGames')">
                    <a href="javascript:void(0)" class="category-link">Toys &amp; Games</a>
                    <span class="category-toggle">
                      <i class="bi" :class="activeAccordion.toysGames ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                    </span>
                  </div>
                  <ul :class="['subcategory-list list-unstyled ps-3', { expanded: activeAccordion.toysGames }]">
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'toysGames'">Action Figures</a></li>
                    <li><a href="#" class="subcategory-link" @click.prevent="selectedCategory = 'toysGames'">Board Games</a></li>
                  </ul>
                </li>
              </ul>
            </div>

            <!-- Price Range Widget -->
            <div class="filter-widget p-3 border rounded-3 bg-card">
              <h5 class="fw-bold mb-3 widget-title position-relative ps-3">
                Price Range
              </h5>
              <div
                class="d-flex justify-content-between mb-2 small text-muted-custom"
              >
                <span>Min: ${{ tempMinPrice }}</span>
                <span>Max: ${{ tempMaxPrice }}</span>
              </div>

              <!-- Double Range Slider Track -->
              <div
                class="price-slider-track-wrapper position-relative mb-4 mt-2"
              >
                <div class="slider-progress" :style="progressStyle"></div>
                <input
                  type="range"
                  v-model.number="tempMinPrice"
                  :min="0"
                  :max="300"
                  class="range-slider range-min"
                />
                <input
                  type="range"
                  v-model.number="tempMaxPrice"
                  :min="0"
                  :max="300"
                  class="range-slider range-max"
                />
              </div>

              <!-- Input textboxes layout -->
              <div class="d-flex gap-2 align-items-center mb-3">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-input-addon">$</span>
                  <input
                    type="number"
                    v-model.number="tempMinPrice"
                    class="form-control border bg-input text-center"
                  />
                </div>
                <span class="text-muted small">-</span>
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-input-addon">$</span>
                  <input
                    type="number"
                    v-model.number="tempMaxPrice"
                    class="form-control border bg-input text-center"
                  />
                </div>
              </div>

              <button
                @click="applyPriceFilter"
                class="btn btn-primary-custom w-100 py-2 btn-sm fw-bold"
              >
                Apply Filter
              </button>
            </div>

            <!-- Filter by Brand Widget -->
            <div class="filter-widget p-3 border rounded-3 bg-card">
              <h5 class="fw-bold mb-3 widget-title position-relative ps-3">
                Filter by Brand
              </h5>

              <!-- Search Brand input -->
              <div class="search-input-group position-relative mb-3">
                <input
                  v-model="brandSearchQuery"
                  type="text"
                  class="form-control form-control-sm border bg-input ps-3 pe-4"
                  placeholder="Search brands..."
                />
                <i
                  class="bi bi-search position-absolute end-0 top-50 translate-middle-y me-2 small text-muted-custom"
                ></i>
              </div>

              <!-- Checklist -->
              <div
                class="brand-checklist d-flex flex-column gap-2 mb-3 overflow-auto"
                style="max-height: 180px"
              >
                <div
                  v-for="b in filteredBrandList"
                  :key="b.name"
                  class="form-check d-flex justify-content-between align-items-center pe-2"
                >
                  <div>
                    <input
                      class="form-check-input check-primary"
                      type="checkbox"
                      v-model="b.checked"
                      :id="'brand-' + b.name"
                    />
                    <label
                      class="form-check-label text-muted-custom small ms-1"
                      :for="'brand-' + b.name"
                    >
                      {{ b.name }}
                    </label>
                  </div>
                  <span class="small text-muted-custom">({{ b.count }})</span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button
                  @click="clearBrandFilter"
                  class="btn btn-link btn-sm p-0 text-decoration-none text-muted-custom hover-primary"
                >
                  Clear All
                </button>
                <button
                  @click="applyBrandFilter"
                  class="btn btn-primary-custom py-1.5 px-3 btn-sm fw-bold"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            <!-- Filter by Color Widget -->
            <div class="filter-widget p-3 border rounded-3 bg-card">
              <h5 class="fw-bold mb-3 widget-title position-relative ps-3">
                Filter by Color
              </h5>

              <!-- Colors Swatches Grid -->
              <div class="d-flex flex-wrap gap-2 mb-3">
                <button
                  v-for="c in colors"
                  :key="c.name"
                  @click="selectColor(c.name)"
                  class="color-swatch-btn rounded-circle position-relative"
                  :style="{ backgroundColor: c.value }"
                  :class="{
                    'swatch-active': activeColorFilter === c.name,
                    border: c.border,
                  }"
                  :title="c.name"
                >
                  <i
                    v-if="activeColorFilter === c.name"
                    class="bi bi-check check-mark-icon"
                    :class="{ 'text-dark': c.name === 'White' }"
                  ></i>
                </button>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button
                  @click="clearColorFilter"
                  class="btn btn-link btn-sm p-0 text-decoration-none text-muted-custom hover-primary"
                >
                  Clear All
                </button>
                <button
                  @click="applyColorFilter"
                  class="btn btn-primary-custom py-1.5 px-3 btn-sm fw-bold"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Grid (Right Column on Desktop) -->
        <div class="col-lg-9 col-md-8">
          <transition-group name="grid" tag="div" class="row g-3 g-md-4">
            <div v-for="product in paginatedProducts" :key="product.id" :class="viewMode === 'grid' ? 'col-12 col-sm-6 col-lg-4 px-3 px-md-2' : 'col-12 px-3 px-md-2'">
              <CategoryProductCard :product="product" :layout="viewMode" @add-to-cart="handleAddToCart" />
            </div>

            <!-- Empty state -->
            <div
              v-if="filteredProducts.length === 0"
              class="col-12 text-center py-5"
            >
              <i class="bi bi-inbox-fill text-muted display-1 d-block mb-3"></i>
              <h4 class="fw-bold text-main">No Products Found</h4>
              <p class="subtitle-text">
                Try adjusting your filters or search query.
              </p>
              <button
                @click="resetFilters"
                class="btn btn-primary-custom px-4 py-2 mt-2"
              >
                Clear all filters
              </button>
            </div>
          </transition-group>

          <!-- Pagination -->
          <div class="mt-4 pt-2" v-if="totalPages > 1">
            <BasePagination 
              :current-page="currentPage" 
              :total-pages="totalPages"
              :total-results="filteredProducts.length"
              @update:currentPage="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import CategoryProductCard from '~/components/common/category-product-card.vue';
import BasePagination from '~/components/base/base-pagination.vue';
import { useCartStore } from '~/stores/cartStore';
import { useProductStore } from '~/stores/productStore';
import { useAppToast } from '~/composables/ui/useAppToast';

const cartStore = useCartStore();
const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const { showSuccess } = useAppToast();

await useAsyncData("categories-products", async () => {
  if (products.value.length === 0) {
    await productStore.getAllProducts({
      per_page: 50,
      status: 1
    });
  }
  return true;
});

const selectedCategory = ref("all");
const searchQuery = ref("");
const sortBy = ref("default");

const sortOptions = [
  { value: 'default', label: 'Sort: Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
];

const viewMode = ref('grid');
const priceRangeSelect = ref('all');
const itemsPerPage = ref(12);

const priceOptions = [
  { value: 'all', label: 'All Prices' },
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 to $100' },
  { value: 'over-100', label: 'Over $100' }
];

const itemsPerPageOptions = [
  { value: 12, label: '12 per page' },
  { value: 24, label: '24 per page' },
  { value: 36, label: '36 per page' }
];

// Price States
const minPrice = ref(0);
const maxPrice = ref(300);
const tempMinPrice = ref(0);
const tempMaxPrice = ref(300);

const progressStyle = computed(() => {
  const minPercent = (tempMinPrice.value / 300) * 100;
  const maxPercent = (tempMaxPrice.value / 300) * 100;
  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`,
  };
});

const applyPriceFilter = () => {
  minPrice.value = tempMinPrice.value;
  maxPrice.value = tempMaxPrice.value;
};

// Accordion Toggles
const activeAccordion = reactive({
  clothing: false,
  electronics: false,
  homeKitchen: false,
  beautyPersonal: false,
  sportsOutdoors: false,
  toysGames: false
});

const toggleAccordion = (section) => {
  activeAccordion[section] = !activeAccordion[section];
};

// Brand States
const brandSearchQuery = ref("");
const selectedBrands = ref([]);

const brands = ref([
  { name: "Nike", count: 24, checked: false },
  { name: "Adidas", count: 18, checked: false },
  { name: "Puma", count: 12, checked: false },
  { name: "Reebok", count: 9, checked: false },
  { name: "Under Armour", count: 7, checked: false },
  { name: "New Balance", count: 6, checked: false },
  { name: "Converse", count: 5, checked: false },
  { name: "Vans", count: 4, checked: false },
]);

const filteredBrandList = computed(() => {
  if (!brandSearchQuery.value) return brands.value;
  const query = brandSearchQuery.value.toLowerCase();
  return brands.value.filter((b) => b.name.toLowerCase().includes(query));
});

const applyBrandFilter = () => {
  selectedBrands.value = brands.value
    .filter((b) => b.checked)
    .map((b) => b.name.toLowerCase());
};

const clearBrandFilter = () => {
  brands.value.forEach((b) => (b.checked = false));
  selectedBrands.value = [];
};

// Color States
const activeColorFilter = ref(null);
const selectedColorApplied = ref(null);

const colors = [
  { name: "Black", value: "#000000", border: false },
  { name: "White", value: "#ffffff", border: true },
  { name: "Red", value: "#ef4444", border: false },
  { name: "Blue", value: "#3b82f6", border: false },
  { name: "Green", value: "#10b981", border: false },
  { name: "Yellow", value: "#f59e0b", border: false },
  { name: "Purple", value: "#8b5cf6", border: false },
  { name: "Orange", value: "#f97316", border: false },
  { name: "Pink", value: "#ec4899", border: false },
  { name: "Brown", value: "#78350f", border: false },
];

const selectColor = (colorName) => {
  activeColorFilter.value =
    activeColorFilter.value === colorName ? null : colorName;
};

const applyColorFilter = () => {
  selectedColorApplied.value = activeColorFilter.value;
};

const clearColorFilter = () => {
  activeColorFilter.value = null;
  selectedColorApplied.value = null;
};

// Categories metadata
const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    icon: "bi-laptop",
    count: 120,
    desc: "Gadgets, accessories, smart devices and premium acoustics.",
    image: "https://placehold.co/400x250/png?text=Electronics",
    subcategories: ["Audio", "Wearables", "Chargers", "Computers"],
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    icon: "bi-tags",
    count: 85,
    desc: "Modern and curated premium design collections for daily active wear.",
    image: "https://placehold.co/400x250/png?text=Clothing",
    subcategories: ["Polo Shirts", "T-Shirts", "Blazers", "Pants"],
  },
  {
    id: 3,
    name: "Accessories",
    slug: "accessories",
    icon: "bi-watch",
    count: 42,
    desc: "Wallets, belts, sunglasses, and high-end leather accessories.",
    image: "https://placehold.co/400x250/png?text=Accessories",
    subcategories: ["Watches", "Sunglasses", "Belts", "Wallets"],
  },
  {
    id: 4,
    name: "Bags & Travel",
    slug: "bags-travel",
    icon: "bi-backpack",
    count: 29,
    desc: "Lightweight backpacks, suitcases, travel gear, and active duffels.",
    image: "https://placehold.co/400x250/png?text=Travel+Gear",
    subcategories: ["Backpacks", "Duffle Bags", "Luggage"],
  },
];

const mockProducts = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    category: "electronics",
    brand: "nike",
    color: "Black",
    price: 98,
    oldPrice: 179,
    rating: 4.8,
    image: "https://placehold.co/300x300/png?text=Headphones",
  },
  {
    id: 2,
    title: "Smart Fitness Tracker Pro",
    category: "electronics",
    brand: "puma",
    color: "Blue",
    price: 60,
    oldPrice: 120,
    rating: 4.5,
    image: "https://placehold.co/300x300/png?text=Fitness+Tracker",
  },
  {
    id: 3,
    title: "Wireless Charging Pad",
    category: "electronics",
    brand: "vans",
    color: "White",
    price: 49,
    oldPrice: 75,
    rating: 4.2,
    image: "https://placehold.co/300x300/png?text=Charger",
  },
  {
    id: 4,
    title: "Precision Audio Hub",
    category: "electronics",
    brand: "nike",
    color: "Black",
    price: 219,
    oldPrice: 299,
    rating: 4.9,
    image: "https://placehold.co/300x300/png?text=Audio+Hub",
  },
  {
    id: 5,
    title: "Classic Polo Shirt",
    category: "clothing",
    brand: "nike",
    color: "Red",
    price: 45,
    oldPrice: 60,
    rating: 4.3,
    image: "https://placehold.co/300x300/png?text=Polo+Shirt",
  },
  {
    id: 6,
    title: "Slim Fit Denim",
    category: "clothing",
    brand: "adidas",
    color: "Blue",
    price: 79,
    oldPrice: 110,
    rating: 4.1,
    image: "https://placehold.co/300x300/png?text=Denim+Jeans",
  },
  {
    id: 7,
    title: "Wool Blend Blazer",
    category: "clothing",
    brand: "reebok",
    color: "Brown",
    price: 129,
    oldPrice: 180,
    rating: 4.7,
    image: "https://placehold.co/300x300/png?text=Blazer",
  },
  {
    id: 8,
    title: "Minimalist Leather Wallet",
    category: "accessories",
    brand: "nike",
    color: "Brown",
    price: 35,
    oldPrice: 50,
    rating: 4.6,
    image: "https://placehold.co/300x300/png?text=Leather+Wallet",
  },
  {
    id: 9,
    title: "Polarized Sunglasses",
    category: "accessories",
    brand: "adidas",
    color: "Black",
    price: 120,
    oldPrice: 160,
    rating: 4.4,
    image: "https://placehold.co/300x300/png?text=Sunglasses",
  },
  {
    id: 10,
    title: "Leather Watch Strap",
    category: "accessories",
    brand: "converse",
    color: "Brown",
    price: 59,
    oldPrice: 85,
    rating: 4.0,
    image: "https://placehold.co/300x300/png?text=Watch+Strap",
  },
  {
    id: 11,
    title: "Lightweight Travel Backpack",
    category: "bags-travel",
    brand: "under armour",
    color: "Pink",
    price: 136,
    oldPrice: 210,
    rating: 4.8,
    image: "https://placehold.co/300x300/png?text=Travel+Backpack",
  },
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 12 + i,
    title: `Premium Item ${i + 12}`,
    category: i % 2 === 0 ? "clothing" : "accessories",
    brand: i % 3 === 0 ? "nike" : i % 2 === 0 ? "adidas" : "puma",
    color: i % 2 === 0 ? "Black" : "White",
    price: Math.floor(Math.random() * 80) + 20,
    oldPrice: Math.floor(Math.random() * 150) + 100,
    rating: (Math.random() * 1 + 4).toFixed(1),
    image: `https://placehold.co/300x300/png?text=Item+${i + 12}`,
  }))
];

const selectCategory = (slug) => {
  selectedCategory.value = selectedCategory.value === slug ? "all" : slug;
};

const totalProductCount = computed(() => mockProducts.length);

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'all' || 
         searchQuery.value !== '' || 
         minPrice.value > 0 || 
         maxPrice.value < 300 || 
         priceRangeSelect.value !== 'all' ||
         selectedBrands.value.length > 0 || 
         selectedColorApplied.value !== null;
});

const resetFilters = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
  sortBy.value = 'default';
  priceRangeSelect.value = 'all';
  tempMinPrice.value = 0;
  tempMaxPrice.value = 300;
  applyPriceFilter();
  clearBrandFilter();
  clearColorFilter();
};

const filteredProducts = computed(() => {
  const sourceProducts = products.value.length > 0
    ? products.value.map((item) => {
        const basePrice = Number(item.sell_price !== undefined ? item.sell_price : (item.unit_price || 0));
        const unitPrice = Number(item.unit_price || 0);
        let finalPrice = basePrice;
        let oldPrice = unitPrice > basePrice ? unitPrice : null;
        if (item.discount && item.discount.value) {
          const val = Number(item.discount.value);
          if (item.discount.type === 'percent') finalPrice = Math.max(0, basePrice - (basePrice * (val / 100)));
          else finalPrice = Math.max(0, basePrice - val);
        }
        const imgUrl = item.thumbnail || item.images?.[0]?.image_url || 'https://placehold.co/300x300/png?text=Product';
        return {
          id: item.id,
          uuid: item.uuid,
          slug: item.slug,
          title: item.title,
          category: item.category?.slug || item.category?.name?.toLowerCase() || 'electronics',
          brand: item.brand?.toLowerCase() || 'nike',
          color: 'Black',
          price: Number(finalPrice.toFixed(2)),
          oldPrice: oldPrice ? Number(oldPrice.toFixed(2)) : null,
          rating: 4.8,
          thumbnail: imgUrl,
          image: imgUrl,
          images: item.images || []
        };
      })
    : mockProducts;

  let result = [...sourceProducts];

  // Category filter
  if (selectedCategory.value !== "all") {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q));
  }

  // Price filter (slider)
  result = result.filter(p => p.price >= minPrice.value && p.price <= maxPrice.value);

  // Top bar price select filter
  if (priceRangeSelect.value === 'under-50') {
    result = result.filter(p => p.price < 50);
  } else if (priceRangeSelect.value === '50-100') {
    result = result.filter(p => p.price >= 50 && p.price <= 100);
  } else if (priceRangeSelect.value === 'over-100') {
    result = result.filter(p => p.price > 100);
  }

  // Brand filter
  if (selectedBrands.value.length > 0) {
    result = result.filter((p) =>
      selectedBrands.value.includes(p.brand.toLowerCase()),
    );
  }

  // Color filter
  if (selectedColorApplied.value) {
    result = result.filter(
      (p) => p.color.toLowerCase() === selectedColorApplied.value.toLowerCase(),
    );
  }

  // Sorting
  if (sortBy.value === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "price-high") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
});

const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

watch(filteredProducts, () => {
  currentPage.value = 1;
});

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleAddToCart = (product) => {
  cartStore.addToCart(product);
};

const { t } = useI18n();

useSeoMeta({
  title: () => t('navbar.categories'),
  ogTitle: () => t('navbar.categories')
});
</script>

<style scoped>
.categories-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
}

.text-main {
  color: var(--color-text);
}

.subtitle-text {
  color: var(--color-text-secondary);
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

/* Category Hero */
.categories-hero {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.dark .categories-hero {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: rgba(255, 255, 255, 0.05);
}

.glow-bubble-1 {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 220, 130, 0.12) 0%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
}

.glow-bubble-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 220, 130, 0.08) 0%,
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
}

.bg-primary-light {
  background-color: rgba(0, 220, 130, 0.1);
  color: var(--color-primary) !important;
}

.fw-extrabold {
  font-weight: 800;
}

/* Top Filter Bar Styles */
.top-filter-input {
  border-radius: 8px 0 0 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  font-size: 14px;
  height: 42px;
  padding-left: 16px;
  box-shadow: none;
  color: var(--color-text);
}
.top-filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  z-index: 2;
}
.top-filter-input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.search-addon-btn {
  border-radius: 0 8px 8px 0;
  height: 42px;
  min-width: 48px;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  z-index: 1;
}
.search-addon-btn:hover {
  filter: brightness(0.9);
  opacity: 0.95;
}

.top-filter-select :deep(.custom-select-trigger) {
  border-radius: 8px;
  height: 42px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  padding: 8px 16px;
  font-size: 14px;
  box-shadow: none;
}
.top-filter-select :deep(.custom-select-trigger:focus), 
.top-filter-select :deep(.custom-select-trigger.active) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.view-toggle-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0;
}
.btn-outline-border {
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}
.btn-outline-border:hover {
  border-color: var(--color-primary);
  color: var(--color-primary) !important;
}
.active-view {
  color: #fff !important;
}

.btn-outline-primary-custom {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  transition: all 0.2s ease;
}
.btn-outline-primary-custom:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Category Cards */
.category-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  height: 100%;
}

.category-card:hover,
.category-card.active-card {
  transform: translateY(-5px);
  border-color: var(--color-primary) !important;
  box-shadow:
    var(--shadow-md),
    0 8px 25px rgba(0, 220, 130, 0.1) !important;
}

.category-card.active-card {
  background-color: var(--color-bg-secondary);
}

.img-container {
  height: 160px;
  overflow: hidden;
}

.img-container img {
  transition: transform 0.6s ease;
}

.category-card:hover .img-container img {
  transform: scale(1.08);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
}

.item-count-badge {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 50px;
}

.text-primary-icon {
  color: var(--color-primary);
  font-size: 1.25rem;
}

/* Subcategory pills */
.sub-pill {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.category-card:hover .sub-pill {
  background-color: var(--color-surface);
}

/* Filter bar & Inputs */
.filter-bar {
  background-color: var(--color-surface);
  border-color: var(--color-border) !important;
}

.bg-input {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border-color: var(--color-border) !important;
}

.bg-input:focus {
  background-color: var(--color-surface);
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.15);
}

.form-check-input {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border) !important;
}

.form-check-input:checked {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

.search-icon {
  color: var(--color-text-secondary);
}

.bg-secondary-light {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.capitalize-text {
  text-transform: capitalize;
}

/* Sidebar filter widgets */
.sidebar-filters {
  position: sticky;
  top: 110px; /* offset for sticky header */
}

.filter-widget {
  background: var(--color-surface);
  border-color: var(--color-border) !important;
}

.widget-title {
  color: var(--color-text);
  font-size: 0.95rem;
  font-weight: 700;
}

.widget-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

/* Accordion link item */
.clickable {
  cursor: pointer;
}

.clickable span {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  transition: color 0.2s;
}

.clickable:hover span {
  color: var(--color-primary);
}

.sub-link {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 5px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.sub-link:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
}

/* Checkbox alignment */
.check-primary:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

/* Dual Range Slider track style */
.price-slider-track-wrapper {
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  width: 100%;
}

.slider-progress {
  position: absolute;
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}

.range-slider {
  position: absolute;
  width: 100%;
  height: 6px;
  top: 0;
  left: 0;
  background: none;
  pointer-events: none;
  appearance: none;
  margin: 0;
}

.custom-search :deep(.form-control) {
  padding-left: 2.5rem !important;
  width: 100% !important;
  height: 38px !important;
}

.range-slider::-webkit-slider-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  pointer-events: auto;
  -webkit-appearance: none;
  cursor: pointer;
  border: 2px solid var(--color-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.range-slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  pointer-events: auto;
  cursor: pointer;
  border: 2px solid var(--color-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.bg-input-addon {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border) !important;
  color: var(--color-text-secondary);
}

/* Color swatch swatches */
.color-swatch-btn {
  width: 30px;
  height: 30px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  padding: 0;
  box-sizing: border-box;
}

.color-swatch-btn:hover {
  transform: scale(1.1);
}

.color-swatch-btn.swatch-active {
  box-shadow: 0 0 0 3px var(--color-primary);
}

.check-mark-icon {
  color: #ffffff;
  font-size: 1rem;
}

.hover-primary:hover {
  color: var(--color-primary) !important;
}

.btn-outline-danger-custom {
  border: 1px solid var(--color-danger, #ef4444);
  color: var(--color-danger, #ef4444);
  background: transparent;
  transition: all 0.2s;
}

.btn-outline-danger-custom:hover {
  background-color: var(--color-danger, #ef4444);
  color: #ffffff;
}

.btn-primary-custom {
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover);
}

/* Transitions */
.grid-enter-active,
.grid-leave-active {
  transition: all 0.5s ease;
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.custom-accordion-item {
  border-bottom: 1px solid var(--color-border) !important;
}
.custom-accordion-item:last-child {
  border-bottom: none !important;
}
.sub-link {
  color: var(--color-text-secondary);
  font-size: 15px;
  transition: all 0.2s;
}
.sub-link:hover {
  color: var(--color-primary) !important;
}

.filter-widget {
  transition: all 0.3s ease;
}

/* Product Categories Widget Matching FashionStore */
.product-categories-widget {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
}

.widget-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  position: relative;
  padding-left: 15px;
}

.widget-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background-color: var(--color-primary, #00b894);
  border-radius: 4px;
}

.category-tree .category-item {
  margin-bottom: 10px;
}

.category-header {
  padding: 8px 0;
  cursor: pointer;
}

.category-link {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: 0.3s;
}

.category-header:hover .category-link,
.category-header:hover .category-toggle {
  color: var(--color-primary, #00b894);
}

.category-toggle {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  transition: 0.3s;
}

.subcategory-list {
  margin-bottom: 0;
  overflow: hidden;
}

.subcategory-list li {
  margin-bottom: 8px;
}
.subcategory-list li:last-child {
  margin-bottom: 0;
}

.subcategory-link {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: 0.3s;
  display: block;
  padding: 4px 0;
}

.subcategory-link:hover {
  color: var(--color-primary, #00b894);
  padding-left: 5px;
}

/* Accordion Transition */
.subcategory-list {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out;
  opacity: 0;
  margin-top: 0 !important;
}

.subcategory-list.expanded {
  max-height: 500px;
  opacity: 1;
  margin-top: 0.5rem !important; /* mt-2 equivalent */
}
</style>
