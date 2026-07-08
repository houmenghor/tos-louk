<template>
  <div class="categories-page py-5">
    <div class="container">
      
      <!-- Hero Section -->
      <div class="categories-hero p-5 rounded-4 mb-5 text-center position-relative overflow-hidden shadow-sm">
        <div class="glow-bubble-1"></div>
        <div class="glow-bubble-2"></div>
        <div class="position-relative z-1">
          <span class="badge rounded-pill bg-primary-light text-primary mb-3 px-3 py-2 fw-semibold text-uppercase">
            Browse Catalog
          </span>
          <h1 class="display-4 fw-extrabold text-main mb-3">Explore Categories</h1>
          <p class="lead subtitle-text mx-auto" style="max-width: 600px;">
            Find exactly what you are looking for by browsing our curated collections. Toggle filters, search items, and discover modern essentials.
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
              <NuxtImg :src="cat.image" :alt="cat.name" class="w-100 h-100 object-fit-cover" />
              <div class="img-overlay"></div>
              <span class="badge position-absolute top-0 end-0 m-3 item-count-badge">
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
                <span v-for="sub in cat.subcategories" :key="sub" class="sub-pill">
                  {{ sub }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Catalog Header / Filter bar -->
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 filter-bar p-3 rounded-3 border">
        <div class="d-flex align-items-center gap-3">
          <h4 class="fw-bold mb-0 text-main capitalize-text">
            {{ selectedCategory === 'all' ? 'All Products' : selectedCategory }}
          </h4>
          <span class="badge bg-secondary-light text-secondary-custom">
            {{ filteredProducts.length }} Products found
          </span>
        </div>
        
        <div class="d-flex align-items-center gap-2 flex-wrap flex-grow-1 flex-md-grow-0 justify-content-end">
          <!-- Search Input -->
          <div class="search-input-group position-relative flex-grow-1 flex-md-grow-0">
            <i class="bi bi-search search-icon position-absolute start-0 top-50 translate-middle-y ms-3"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control border bg-input ps-5" 
              placeholder="Search products..." 
            />
          </div>
          
          <!-- Sort dropdown -->
          <select v-model="sortBy" class="form-select sort-select border bg-input w-auto">
            <option value="default">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          
          <!-- Reset button -->
          <button v-if="hasActiveFilters" @click="resetFilters" class="btn btn-outline-danger-custom px-3">
            Reset
          </button>
        </div>
      </div>

      <!-- Product Browser Section -->
      <div class="row g-4">
        
        <!-- Sidebar Filters (Left Column on Desktop) -->
        <div class="col-lg-3 col-md-4">
          <div class="sidebar-filters d-flex flex-column gap-4">
            
            <!-- Categories Accordion Widget -->
            <div class="filter-widget p-3 border rounded-3 bg-card">
              <h5 class="fw-bold mb-3 widget-title position-relative ps-3">
                Categories
              </h5>
              <div class="accordion-list d-flex flex-column gap-2">
                
                <!-- Clothing Accordion -->
                <div class="accordion-item border-0">
                  <div class="d-flex justify-content-between align-items-center py-2 px-1 clickable" @click="toggleAccordion('clothing')">
                    <span :class="{ 'fw-bold text-primary': selectedCategory === 'clothing' }">Clothing</span>
                    <i class="bi" :class="activeAccordion.clothing ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </div>
                  <div v-show="activeAccordion.clothing" class="accordion-sub-list ps-3 py-1 d-flex flex-column gap-1">
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'clothing'">Polo Shirts</a>
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'clothing'">T-Shirts</a>
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'clothing'">Blazers</a>
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'clothing'">Pants</a>
                  </div>
                </div>

                <!-- Electronics Accordion -->
                <div class="accordion-item border-0">
                  <div class="d-flex justify-content-between align-items-center py-2 px-1 clickable" @click="toggleAccordion('electronics')">
                    <span :class="{ 'fw-bold text-primary': selectedCategory === 'electronics' }">Electronics</span>
                    <i class="bi" :class="activeAccordion.electronics ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </div>
                  <div v-show="activeAccordion.electronics" class="accordion-sub-list ps-3 py-1 d-flex flex-column gap-1">
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'electronics'">Audio</a>
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'electronics'">Wearables</a>
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'electronics'">Chargers</a>
                    <a href="#" class="sub-link" @click.prevent="selectedCategory = 'electronics'">Computers</a>
                  </div>
                </div>

                <!-- Home & Kitchen Accordion -->
                <div class="accordion-item border-0">
                  <div class="d-flex justify-content-between align-items-center py-2 px-1 clickable" @click="toggleAccordion('homeKitchen')">
                    <span>Home & Kitchen</span>
                    <i class="bi" :class="activeAccordion.homeKitchen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </div>
                  <div v-show="activeAccordion.homeKitchen" class="accordion-sub-list ps-3 py-1 d-flex flex-column gap-1">
                    <a href="#" class="sub-link">Kitchenware</a>
                    <a href="#" class="sub-link">Home Decor</a>
                  </div>
                </div>

                <!-- Accessories -->
                <div class="d-flex justify-content-between align-items-center py-2 px-1 clickable" @click="selectedCategory = 'accessories'">
                  <span :class="{ 'fw-bold text-primary': selectedCategory === 'accessories' }">Accessories</span>
                </div>
                
                <!-- Bags & Travel -->
                <div class="d-flex justify-content-between align-items-center py-2 px-1 clickable" @click="selectedCategory = 'bags-travel'">
                  <span :class="{ 'fw-bold text-primary': selectedCategory === 'bags-travel' }">Bags & Travel</span>
                </div>
              </div>
            </div>

            <!-- Price Range Widget -->
            <div class="filter-widget p-3 border rounded-3 bg-card">
              <h5 class="fw-bold mb-3 widget-title position-relative ps-3">
                Price Range
              </h5>
              <div class="d-flex justify-content-between mb-2 small text-muted-custom">
                <span>Min: ${{ tempMinPrice }}</span>
                <span>Max: ${{ tempMaxPrice }}</span>
              </div>
              
              <!-- Double Range Slider Track -->
              <div class="price-slider-track-wrapper position-relative mb-4 mt-2">
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
                  <input type="number" v-model.number="tempMinPrice" class="form-control border bg-input text-center" />
                </div>
                <span class="text-muted small">-</span>
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-input-addon">$</span>
                  <input type="number" v-model.number="tempMaxPrice" class="form-control border bg-input text-center" />
                </div>
              </div>

              <button @click="applyPriceFilter" class="btn btn-primary-custom w-100 py-2 btn-sm fw-bold">
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
                <i class="bi bi-search position-absolute end-0 top-50 translate-middle-y me-2 small text-muted-custom"></i>
              </div>

              <!-- Checklist -->
              <div class="brand-checklist d-flex flex-column gap-2 mb-3 overflow-auto" style="max-height: 180px;">
                <div v-for="b in filteredBrandList" :key="b.name" class="form-check d-flex justify-content-between align-items-center pe-2">
                  <div>
                    <input class="form-check-input check-primary" type="checkbox" v-model="b.checked" :id="'brand-' + b.name" />
                    <label class="form-check-label text-muted-custom small ms-1" :for="'brand-' + b.name">
                      {{ b.name }}
                    </label>
                  </div>
                  <span class="small text-muted-custom">({{ b.count }})</span>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button @click="clearBrandFilter" class="btn btn-link btn-sm p-0 text-decoration-none text-muted-custom hover-primary">
                  Clear All
                </button>
                <button @click="applyBrandFilter" class="btn btn-primary-custom py-1.5 px-3 btn-sm fw-bold">
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
                  :class="{ 'swatch-active': activeColorFilter === c.name, 'border': c.border }"
                  :title="c.name"
                >
                  <i v-if="activeColorFilter === c.name" class="bi bi-check check-mark-icon" :class="{ 'text-dark': c.name === 'White' }"></i>
                </button>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button @click="clearColorFilter" class="btn btn-link btn-sm p-0 text-decoration-none text-muted-custom hover-primary">
                  Clear All
                </button>
                <button @click="applyColorFilter" class="btn btn-primary-custom py-1.5 px-3 btn-sm fw-bold">
                  Apply Filter
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Product Grid (Right Column on Desktop) -->
        <div class="col-lg-9 col-md-8">
          <transition-group name="grid" tag="div" class="row g-4">
            <div v-for="product in filteredProducts" :key="product.id" class="col-sm-6 col-lg-4">
              <CategoryProductCard :product="product" @add-to-cart="handleAddToCart" />
            </div>
            
            <!-- Empty state -->
            <div v-if="filteredProducts.length === 0" class="col-12 text-center py-5">
              <i class="bi bi-inbox-fill text-muted display-1 d-block mb-3"></i>
              <h4 class="fw-bold text-main">No Products Found</h4>
              <p class="subtitle-text">Try adjusting your filters or search query.</p>
              <button @click="resetFilters" class="btn btn-primary-custom px-4 py-2 mt-2">
                Clear all filters
              </button>
            </div>
          </transition-group>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CategoryProductCard from '~/components/common/CategoryProductCard.vue';
import { useCartStore } from '~/stores/cartStore';
import { useAppToast } from '~/composables/ui/useAppToast';

const cartStore = useCartStore();
const { showSuccess } = useAppToast();

const selectedCategory = ref('all');
const searchQuery = ref('');
const sortBy = ref('default');

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
    width: `${maxPercent - minPercent}%`
  };
});

const applyPriceFilter = () => {
  minPrice.value = tempMinPrice.value;
  maxPrice.value = tempMaxPrice.value;
};

// Accordion Toggles
const activeAccordion = ref({
  clothing: false,
  electronics: false,
  homeKitchen: false
});

const toggleAccordion = (section) => {
  activeAccordion.value[section] = !activeAccordion.value[section];
};

// Brand States
const brandSearchQuery = ref('');
const selectedBrands = ref([]);

const brands = ref([
  { name: 'Nike', count: 24, checked: false },
  { name: 'Adidas', count: 18, checked: false },
  { name: 'Puma', count: 12, checked: false },
  { name: 'Reebok', count: 9, checked: false },
  { name: 'Under Armour', count: 7, checked: false },
  { name: 'New Balance', count: 6, checked: false },
  { name: 'Converse', count: 5, checked: false },
  { name: 'Vans', count: 4, checked: false }
]);

const filteredBrandList = computed(() => {
  if (!brandSearchQuery.value) return brands.value;
  const query = brandSearchQuery.value.toLowerCase();
  return brands.value.filter(b => b.name.toLowerCase().includes(query));
});

const applyBrandFilter = () => {
  selectedBrands.value = brands.value.filter(b => b.checked).map(b => b.name.toLowerCase());
};

const clearBrandFilter = () => {
  brands.value.forEach(b => b.checked = false);
  selectedBrands.value = [];
};

// Color States
const activeColorFilter = ref(null);
const selectedColorApplied = ref(null);

const colors = [
  { name: 'Black', value: '#000000', border: false },
  { name: 'White', value: '#ffffff', border: true },
  { name: 'Red', value: '#ef4444', border: false },
  { name: 'Blue', value: '#3b82f6', border: false },
  { name: 'Green', value: '#10b981', border: false },
  { name: 'Yellow', value: '#f59e0b', border: false },
  { name: 'Purple', value: '#8b5cf6', border: false },
  { name: 'Orange', value: '#f97316', border: false },
  { name: 'Pink', value: '#ec4899', border: false },
  { name: 'Brown', value: '#78350f', border: false }
];

const selectColor = (colorName) => {
  activeColorFilter.value = activeColorFilter.value === colorName ? null : colorName;
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
    name: 'Electronics',
    slug: 'electronics',
    icon: 'bi-laptop',
    count: 120,
    desc: 'Gadgets, accessories, smart devices and premium acoustics.',
    image: 'https://placehold.co/400x250/png?text=Electronics',
    subcategories: ['Audio', 'Wearables', 'Chargers', 'Computers']
  },
  {
    id: 2,
    name: 'Clothing',
    slug: 'clothing',
    icon: 'bi-tags',
    count: 85,
    desc: 'Modern and curated premium design collections for daily active wear.',
    image: 'https://placehold.co/400x250/png?text=Clothing',
    subcategories: ['Polo Shirts', 'T-Shirts', 'Blazers', 'Pants']
  },
  {
    id: 3,
    name: 'Accessories',
    slug: 'accessories',
    icon: 'bi-watch',
    count: 42,
    desc: 'Wallets, belts, sunglasses, and high-end leather accessories.',
    image: 'https://placehold.co/400x250/png?text=Accessories',
    subcategories: ['Watches', 'Sunglasses', 'Belts', 'Wallets']
  },
  {
    id: 4,
    name: 'Bags & Travel',
    slug: 'bags-travel',
    icon: 'bi-backpack',
    count: 29,
    desc: 'Lightweight backpacks, suitcases, travel gear, and active duffels.',
    image: 'https://placehold.co/400x250/png?text=Travel+Gear',
    subcategories: ['Backpacks', 'Duffle Bags', 'Luggage']
  }
];

const mockProducts = [
  { id: 1, title: 'Premium Wireless Headphones', category: 'electronics', brand: 'nike', color: 'Black', price: 98, oldPrice: 179, rating: 4.8, image: 'https://placehold.co/300x300/png?text=Headphones' },
  { id: 2, title: 'Smart Fitness Tracker Pro', category: 'electronics', brand: 'puma', color: 'Blue', price: 60, oldPrice: 120, rating: 4.5, image: 'https://placehold.co/300x300/png?text=Fitness+Tracker' },
  { id: 3, title: 'Wireless Charging Pad', category: 'electronics', brand: 'vans', color: 'White', price: 49, oldPrice: 75, rating: 4.2, image: 'https://placehold.co/300x300/png?text=Charger' },
  { id: 4, title: 'Precision Audio Hub', category: 'electronics', brand: 'nike', color: 'Black', price: 219, oldPrice: 299, rating: 4.9, image: 'https://placehold.co/300x300/png?text=Audio+Hub' },
  { id: 5, title: 'Classic Polo Shirt', category: 'clothing', brand: 'nike', color: 'Red', price: 45, oldPrice: 60, rating: 4.3, image: 'https://placehold.co/300x300/png?text=Polo+Shirt' },
  { id: 6, title: 'Slim Fit Denim', category: 'clothing', brand: 'adidas', color: 'Blue', price: 79, oldPrice: 110, rating: 4.1, image: 'https://placehold.co/300x300/png?text=Denim+Jeans' },
  { id: 7, title: 'Wool Blend Blazer', category: 'clothing', brand: 'reebok', color: 'Brown', price: 129, oldPrice: 180, rating: 4.7, image: 'https://placehold.co/300x300/png?text=Blazer' },
  { id: 8, title: 'Minimalist Leather Wallet', category: 'accessories', brand: 'nike', color: 'Brown', price: 35, oldPrice: 50, rating: 4.6, image: 'https://placehold.co/300x300/png?text=Leather+Wallet' },
  { id: 9, title: 'Polarized Sunglasses', category: 'accessories', brand: 'adidas', color: 'Black', price: 120, oldPrice: 160, rating: 4.4, image: 'https://placehold.co/300x300/png?text=Sunglasses' },
  { id: 10, title: 'Leather Watch Strap', category: 'accessories', brand: 'converse', color: 'Brown', price: 59, oldPrice: 85, rating: 4.0, image: 'https://placehold.co/300x300/png?text=Watch+Strap' },
  { id: 11, title: 'Lightweight Travel Backpack', category: 'bags-travel', brand: 'under armour', color: 'Pink', price: 136, oldPrice: 210, rating: 4.8, image: 'https://placehold.co/300x300/png?text=Travel+Backpack' }
];

const selectCategory = (slug) => {
  selectedCategory.value = selectedCategory.value === slug ? 'all' : slug;
};

const totalProductCount = computed(() => mockProducts.length);

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'all' || 
         searchQuery.value !== '' || 
         minPrice.value > 0 || 
         maxPrice.value < 300 || 
         selectedBrands.value.length > 0 || 
         selectedColorApplied.value !== null;
});

const resetFilters = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
  sortBy.value = 'default';
  tempMinPrice.value = 0;
  tempMaxPrice.value = 300;
  applyPriceFilter();
  clearBrandFilter();
  clearColorFilter();
};

const filteredProducts = computed(() => {
  let result = [...mockProducts];

  // Category filter
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value);
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(q));
  }

  // Price filter
  result = result.filter(p => p.price >= minPrice.value && p.price <= maxPrice.value);

  // Brand filter
  if (selectedBrands.value.length > 0) {
    result = result.filter(p => selectedBrands.value.includes(p.brand.toLowerCase()));
  }

  // Color filter
  if (selectedColorApplied.value) {
    result = result.filter(p => p.color.toLowerCase() === selectedColorApplied.value.toLowerCase());
  }

  // Sorting
  if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
});

const handleAddToCart = (product) => {
  cartStore.addToCart(product);
  showSuccess(`${product.title} added to cart!`);
};
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
  background: radial-gradient(circle, rgba(0, 220, 130, 0.12) 0%, transparent 70%);
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
  background: radial-gradient(circle, rgba(0, 220, 130, 0.08) 0%, transparent 70%);
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
  box-shadow: var(--shadow-md), 0 8px 25px rgba(0, 220, 130, 0.1) !important;
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
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
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
  content: '';
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

.range-slider::-webkit-slider-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  pointer-events: auto;
  -webkit-appearance: none;
  cursor: pointer;
  border: 2px solid var(--color-surface);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.range-slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  pointer-events: auto;
  cursor: pointer;
  border: 2px solid var(--color-surface);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
  transition: transform 0.2s, box-shadow 0.2s;
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
</style>