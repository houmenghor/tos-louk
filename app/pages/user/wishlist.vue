<template>
  <div class="wishlist-page py-5 bg-body-custom min-vh-100">
    <div class="container">
      
      <!-- Wishlist Hero Section -->
      <div class="wishlist-hero p-5 rounded-4 mb-5 text-center position-relative overflow-hidden border shadow-sm">
        <div class="glow-bubble-red-1"></div>
        <div class="glow-bubble-red-2"></div>
        <div class="position-relative z-1">
          <span class="badge rounded-pill bg-danger-light text-danger mb-3 px-3 py-2 fw-semibold text-uppercase tracking-wider">
            Curated Favorites
          </span>
          <h1 class="display-4 fw-extrabold text-main mb-3">Your Wishlist</h1>
          <p class="lead subtitle-text mx-auto mb-0" style="max-width: 600px;">
            Save your favorite design pieces, modern tech gadgets, and active essentials here. Add them directly to your cart at any time.
          </p>
        </div>
      </div>

      <!-- Wishlist Items Grid -->
      <div v-if="wishlistStore.items.length > 0">
        <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
          <div class="d-flex align-items-center gap-2">
            <h4 class="fw-bold mb-0 text-main">Saved Products</h4>
            <span class="badge bg-secondary-light text-secondary-custom">
              {{ wishlistStore.wishlistCount }} {{ wishlistStore.wishlistCount === 1 ? 'item' : 'items' }}
            </span>
          </div>
          <BaseButton
            variants="outline-danger"
            size="sm"
            @click="wishlistStore.clearWishlist"
          >
            <i class="bi bi-trash-fill"></i> Clear All
          </BaseButton>
        </div>

        <transition-group name="grid" tag="div" class="row g-4">
          <div 
            v-for="item in wishlistStore.items" 
            :key="item.id" 
            class="col-xl-3 col-lg-4 col-md-6 grid-item"
          >
            <CategoryProductCard :product="item" @add-to-cart="handleAddToCart" />
          </div>
        </transition-group>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5 empty-state-wrapper">
        <div class="empty-state-icon-container mb-4 position-relative">
          <div class="glow-halo-red"></div>
          <i class="bi bi-heartbreak display-1 text-muted position-relative z-1 heartbeat-animation"></i>
        </div>
        <h3 class="fw-bold text-main mb-2">No Favorites Yet</h3>
        <p class="subtitle-text mb-4 mx-auto" style="max-width: 320px;">
          Tap the heart icon on any product to save it to your wishlist and view it here later.
        </p>
        <BaseButton
          variants="primary"
          size="lg"
          @click="router.push('/categories')"
        >
          Explore Catalog <i class="bi bi-arrow-right"></i>
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '~/stores/wishlistStore';
import { useCartStore } from '~/stores/cartStore';
import { useAppToast } from '~/composables/ui/useAppToast';
import CategoryProductCard from '~/components/common/CategoryProductCard.vue';

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { showSuccess } = useAppToast();
const router = useRouter();

// Fetch wishlist state on component load
if (process.client) {
  wishlistStore.initWishlist();
  cartStore.initCart();
}

const handleAddToCart = (product) => {
  cartStore.addToCart(product);
  showSuccess(`${product.title} added to cart!`);
};
</script>

<style scoped>
.wishlist-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  box-sizing: border-box;
}

.bg-body-custom {
  background-color: var(--color-bg);
}

.text-main {
  color: var(--color-text);
}

.subtitle-text {
  color: var(--color-text-secondary);
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.bg-secondary-light {
  background-color: var(--color-border);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

/* Wishlist Hero Banner */
.wishlist-hero {
  background: var(--color-surface);
  border-color: var(--color-border) !important;
}

.dark .wishlist-hero {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.bg-danger-light {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-danger) !important;
}

/* Red Glow Bubbles inside Hero */
.glow-bubble-red-1 {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
}

.glow-bubble-red-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.06) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

.fw-extrabold {
  font-weight: 800;
}

/* Grid animation for removing item */
.grid-item {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.grid-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.grid-leave-active {
  position: absolute;
  width: calc(25% - 24px); /* Fallback for col-xl-3 width during exit animation */
}

@media (max-width: 1199.98px) {
  .grid-leave-active {
    width: calc(33.3333% - 24px); /* col-lg-4 */
  }
}

@media (max-width: 991.98px) {
  .grid-leave-active {
    width: calc(50% - 24px); /* col-md-6 */
  }
}

@media (max-width: 575.98px) {
  .grid-leave-active {
    width: calc(100% - 24px); /* col-sm-6 */
  }
}

/* Empty State Styling */
.empty-state-wrapper {
  animation: fadeIn 0.4s ease;
}

.empty-state-icon-container {
  display: inline-block;
}

.glow-halo-red {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(255,255,255,0) 70%);
  z-index: 0;
  opacity: 0.8;
}

.heartbeat-animation {
  animation: heartbeat 2.5s infinite ease-in-out;
  color: var(--color-danger) !important;
  opacity: 0.85;
}

.hover-scale {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.03);
}



/* Animations */
@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.05); }
  50% { transform: scale(1); }
  75% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
