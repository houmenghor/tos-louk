<template>
  <div class="product-detail-page position-relative overflow-hidden pb-5">
    <!-- Animated Background Blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    
    <!-- Top Padding for Fixed Header -->
    <div class="pt-5 mt-4"></div>

    <div class="container position-relative z-1 mb-5">
      <!-- Breadcrumbs -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/" class="text-decoration-none text-muted-custom hover-primary">Home</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink to="/categories" class="text-decoration-none text-muted-custom hover-primary">Products</NuxtLink>
          </li>
          <li class="breadcrumb-item active text-main fw-semibold" aria-current="page">
            {{ product.title }}
          </li>
        </ol>
      </nav>

      <!-- Main Product Section -->
      <div class="glass-card-clean rounded-5 p-4 p-md-5 mb-5 shadow-sm">
        <div class="row g-5">
          
          <!-- Left Column: Image Gallery -->
          <div class="col-lg-6">
            <div class="image-gallery-container d-flex flex-column gap-3">
              <div class="main-image-wrapper rounded-4 overflow-hidden position-relative bg-light-transparent">
                <span v-if="product.badge" class="badge custom-badge position-absolute top-0 start-0 m-3 z-2">
                  {{ product.badge }}
                </span>
                
                <button 
                  class="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3 z-2 wishlist-btn-float"
                  :class="{ 'text-danger': wishlistStore.isInWishlist(product.id) }"
                  @click.stop="toggleWishlist"
                >
                  <i class="bi" :class="wishlistStore.isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'"></i>
                </button>

                <NuxtImg
                  :src="activeImage"
                  :alt="product.title"
                  class="img-fluid w-100 main-img object-fit-contain p-4 transition-all"
                  style="aspect-ratio: 1/1;"
                  draggable="false"
                />
              </div>
              
              <!-- Thumbnails -->
              <div class="d-flex gap-3 overflow-x-auto thumbnail-scroll pb-2">
                <div 
                  v-for="(img, idx) in product.images" 
                  :key="idx"
                  class="thumbnail-wrapper rounded-3 overflow-hidden cursor-pointer bg-light-transparent flex-shrink-0"
                  :class="{ 'border-primary': activeImage === img }"
                  @click="activeImage = img"
                  style="width: 80px; height: 80px;"
                >
                  <NuxtImg :src="img" class="img-fluid w-100 h-100 object-fit-cover p-2" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Product Details -->
          <div class="col-lg-6 d-flex flex-column">
            <div class="d-flex align-items-center gap-3 mb-2">
              <span class="text-primary fw-bold text-uppercase letter-spacing-1 small">{{ product.category }}</span>
              <div class="d-flex align-items-center gap-1 text-warning small">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
                <span class="text-muted-custom ms-1">(128 reviews)</span>
              </div>
            </div>

            <h1 class="display-5 fw-extrabold text-main mb-3">{{ product.title }}</h1>
            
            <div class="d-flex align-items-end gap-3 mb-4">
              <h2 class="text-primary mb-0 fw-bold">${{ product.price }}</h2>
              <h4 v-if="product.oldPrice" class="text-muted-custom mb-1 text-decoration-line-through">${{ product.oldPrice }}</h4>
              <span v-if="product.oldPrice" class="badge bg-danger-subtle text-danger mb-1 ms-2">
                Save {{ Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) }}%
              </span>
            </div>

            <p class="subtitle-text mb-4 lh-lg">
              {{ product.description }}
            </p>

            <hr class="border-secondary opacity-25 mb-4">

            <!-- Variants Selection -->
            <div class="row g-4 mb-4">
              <!-- Colors -->
              <div class="col-sm-6">
                <h6 class="fw-semibold text-main mb-3">Color</h6>
                <div class="d-flex gap-2">
                  <div 
                    v-for="color in product.colors" 
                    :key="color"
                    class="color-swatch rounded-circle cursor-pointer position-relative shadow-sm"
                    :style="{ backgroundColor: color }"
                    :class="{ 'active': selectedColor === color }"
                    @click="selectedColor = color"
                  ></div>
                </div>
              </div>
              
              <!-- Sizes -->
              <div class="col-sm-6">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-semibold text-main mb-0">Size</h6>
                  <a href="#" class="small text-primary text-decoration-none">Size Guide</a>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <button 
                    v-for="size in product.sizes" 
                    :key="size"
                    class="btn btn-outline-custom size-btn flex-grow-1"
                    :class="{ 'active': selectedSize === size }"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Action Area -->
            <div class="mt-auto pt-3">
              <div class="d-flex gap-3 mb-3">
                <!-- Quantity Selector -->
                <div class="quantity-selector d-flex align-items-center bg-input-wrapper rounded-pill px-3 shadow-sm" style="height: 54px;">
                  <button class="btn btn-link text-main p-0 border-0" @click="quantity > 1 ? quantity-- : null">
                    <i class="bi bi-dash fs-5"></i>
                  </button>
                  <input type="number" v-model.number="quantity" class="form-control border-0 bg-transparent text-center fw-bold text-main" style="width: 50px; outline: none; box-shadow: none;" min="1">
                  <button class="btn btn-link text-main p-0 border-0" @click="quantity++">
                    <i class="bi bi-plus fs-5"></i>
                  </button>
                </div>

                <!-- Add to Cart -->
                <button class="btn btn-primary-custom flex-grow-1 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2" @click="handleAddToCart">
                  <i class="bi bi-bag-plus"></i> Add to Cart
                </button>
              </div>

              <!-- Extra info -->
              <div class="d-flex flex-wrap gap-4 text-muted-custom small justify-content-center justify-content-md-start mt-4">
                <span class="d-flex align-items-center gap-2"><i class="bi bi-truck text-primary fs-5"></i> Free Shipping worldwide</span>
                <span class="d-flex align-items-center gap-2"><i class="bi bi-arrow-return-left text-primary fs-5"></i> 30 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Tabs Section -->
      <div class="glass-card-clean rounded-4 p-4 shadow-sm mb-5">
        <ul class="nav nav-pills custom-tabs mb-4 gap-2" id="productTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab">Description</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="specs-tab" data-bs-toggle="tab" data-bs-target="#specs" type="button" role="tab">Specifications</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">Reviews (128)</button>
          </li>
        </ul>
        <div class="tab-content text-main lh-lg" id="productTabsContent">
          <div class="tab-pane fade show active" id="desc" role="tabpanel">
            <p>Experience the perfect blend of style, comfort, and durability with our premium product. Meticulously crafted from high-quality materials, this item is designed to exceed your expectations and integrate seamlessly into your daily routine. The sleek, modern design makes it an ideal choice for any occasion, ensuring you always look and feel your best.</p>
            <p>Our commitment to excellence is reflected in every detail, from the reinforced stitching to the carefully selected color palettes. Upgrade your lifestyle with a product that truly understands your needs.</p>
          </div>
          <div class="tab-pane fade" id="specs" role="tabpanel">
            <div class="row">
              <div class="col-md-6">
                <ul class="list-group list-group-flush bg-transparent">
                  <li class="list-group-item bg-transparent text-main d-flex justify-content-between border-secondary-subtle">
                    <span class="fw-semibold">Material</span>
                    <span>100% Premium Cotton</span>
                  </li>
                  <li class="list-group-item bg-transparent text-main d-flex justify-content-between border-secondary-subtle">
                    <span class="fw-semibold">Weight</span>
                    <span>450g</span>
                  </li>
                  <li class="list-group-item bg-transparent text-main d-flex justify-content-between border-secondary-subtle">
                    <span class="fw-semibold">Dimensions</span>
                    <span>15 x 20 x 5 cm</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="reviews" role="tabpanel">
            <div class="d-flex align-items-center justify-content-center h-100 py-5 text-muted-custom">
              <div class="text-center">
                <i class="bi bi-chat-square-quote display-4 text-primary opacity-50 mb-3 d-block"></i>
                <p>Reviews will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '~/stores/cartStore';
import { useWishlistStore } from '~/stores/wishlistStore';
import { useAppToast } from '~/composables/ui/useAppToast';
import { useAuthStore } from '~/stores/authStore';

const route = useRoute();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();
const { locale } = useI18n();

// Mock Product Data based on ID
const productId = route.params.id || 1;
const isSale = productId % 4 === 0;

const product = ref({
  id: productId,
  title: `Premium Item ${productId}`,
  description: "Curabitur aliquet quam id dui posuere blandit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  price: Math.floor(Math.random() * 50) + 20,
  oldPrice: isSale ? Math.floor(Math.random() * 30) + 80 : null,
  badge: isSale ? "Sale" : "",
  category: "Electronics",
  images: [
    `https://placehold.co/600x600/png?text=Item+${productId}+Front`,
    `https://placehold.co/600x600/png?text=Item+${productId}+Back`,
    `https://placehold.co/600x600/png?text=Item+${productId}+Side`,
    `https://placehold.co/600x600/png?text=Item+${productId}+Detail`
  ],
  colors: ['#0f172a', '#3b82f6', '#10b981', '#ef4444'],
  sizes: ['S', 'M', 'L', 'XL']
});

const activeImage = ref(product.value.images[0]);
const selectedColor = ref(product.value.colors[0]);
const selectedSize = ref(product.value.sizes[1]);
const quantity = ref(1);

const verifyLogin = (actionName) => {
  if (!authStore.access_token) {
    showError(
      locale.value === "kh"
        ? `សូមចូលគណនីជាមុនសិនដើម្បី ${actionName}!`
        : `Please login first to ${actionName}!`
    );
    navigateTo("/auth/login");
    return false;
  }
  return true;
};

const handleAddToCart = () => {
  if (verifyLogin(locale.value === "kh" ? "បន្ថែមទៅកន្ត្រក" : "add to cart")) {
    const itemToAdd = {
      ...product.value,
      quantity: quantity.value,
      selectedColor: selectedColor.value,
      selectedSize: selectedSize.value,
      image: product.value.images[0] // for cart compatibility
    };
    cartStore.addToCart(itemToAdd);
    showSuccess(
      locale.value === "kh"
        ? "បានបន្ថែមទៅក្នុងកន្ត្រកជោគជ័យ!"
        : "Added to cart successfully!"
    );
  }
};

const toggleWishlist = () => {
  if (verifyLogin(locale.value === "kh" ? "បញ្ចូលទៅបញ្ជីចំណូលចិត្ត" : "add to wishlist")) {
    wishlistStore.toggleWishlist(product.value.id);
    if (wishlistStore.isInWishlist(product.value.id)) {
      showSuccess(locale.value === "kh" ? "បានបន្ថែមទៅចំណូលចិត្ត!" : "Added to Wishlist!");
    } else {
      showSuccess(locale.value === "kh" ? "បានដកចេញពីចំណូលចិត្ត!" : "Removed from Wishlist!");
    }
  }
};
</script>

<style scoped>
.product-detail-page {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.text-main {
  color: var(--color-text);
}
.text-muted-custom {
  color: var(--color-text-secondary);
}

.hover-primary {
  transition: color 0.2s ease;
}
.hover-primary:hover {
  color: var(--color-primary) !important;
}

/* Glass Card */
.glass-card-clean {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
.dark .glass-card-clean {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, #ffffff 10%, transparent);
}

/* Background Blobs */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}
.blob-1 {
  background: var(--color-primary);
  width: 500px;
  height: 500px;
  top: -100px;
  right: -100px;
}
.blob-2 {
  background: #3b82f6; /* Accent blue */
  width: 400px;
  height: 400px;
  bottom: 20%;
  left: -150px;
}

.dark .bg-blob {
  opacity: 0.08;
}

/* Images */
.bg-light-transparent {
  background-color: color-mix(in srgb, var(--color-text) 3%, transparent);
}
.main-img {
  transition: transform 0.3s ease;
}
.main-img:hover {
  transform: scale(1.05);
}
.thumbnail-wrapper {
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.thumbnail-wrapper.border-primary {
  border-color: var(--color-primary) !important;
}
.thumbnail-scroll {
  scrollbar-width: none;
}
.thumbnail-scroll::-webkit-scrollbar {
  display: none;
}

/* Badges & Buttons */
.custom-badge {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.wishlist-btn-float {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.wishlist-btn-float:hover {
  transform: translateY(-3px);
  color: var(--color-primary);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}

/* Color Swatches */
.color-swatch {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.color-swatch::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.color-swatch.active::after {
  border-color: var(--color-primary);
}

/* Size Buttons */
.btn-outline-custom {
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: transparent;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-outline-custom:hover, .btn-outline-custom.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Inputs */
.bg-input-wrapper {
  background-color: color-mix(in srgb, var(--color-text) 4%, transparent);
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Custom Tabs */
.custom-tabs .nav-link {
  color: var(--color-text-secondary);
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.custom-tabs .nav-link:hover {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.custom-tabs .nav-link.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

/* Add to Cart Button */
.btn-primary-custom {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
}
.btn-primary-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--color-primary) 30%, transparent) !important;
}
</style>
