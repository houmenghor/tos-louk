<template>
  <div class="wishlist-page py-5 bg-body-custom min-vh-100">
    <div class="container max-w-container">
      
      <!-- Wishlist Hero Section -->
      <div class="wishlist-hero p-4 p-md-5 rounded-4 mb-5 text-center position-relative overflow-hidden border shadow-sm">
        <div class="glow-bubble-red-1"></div>
        <div class="glow-bubble-red-2"></div>
        <div class="position-relative z-1">
          <span class="badge rounded-pill bg-danger-light text-danger mb-3 px-3 py-2 fw-semibold text-uppercase tracking-wider text-xxs">
            Curated Favorites
          </span>
          <h1 class="display-5 fw-extrabold text-main mb-3">Your Wishlist</h1>
          <p class="lead subtitle-text mx-auto mb-0 text-sm" style="max-width: 600px;">
            Save your favorite design pieces, modern tech gadgets, and active essentials here. Add them directly to your cart at any time.
          </p>
        </div>
      </div>

      <!-- Guest State: User is not logged in -->
      <div v-if="!authStore.access_token" class="text-center py-5 empty-state-wrapper rounded-4 border bg-surface-custom p-4 p-md-5 shadow-sm">
        <div class="empty-state-icon-container mb-4 position-relative">
          <div class="glow-halo-red"></div>
          <i class="bi bi-shield-lock display-1 text-muted position-relative z-1"></i>
        </div>
        <h3 class="fw-bold text-main mb-2">Sign In to Save Favorites</h3>
        <p class="subtitle-text mb-4 mx-auto text-xs" style="max-width: 420px;">
          Saving items to your wishlist is only available for registered members. Please login to your account to save items and access them from any device.
        </p>
        <NuxtLink 
          to="/auth/login" 
          class="btn btn-primary-custom px-4 py-2.5 rounded-pill fw-bold text-xs d-inline-flex align-items-center gap-2 transition-all"
        >
          <i class="bi bi-box-arrow-in-right"></i> Log In to Account
        </NuxtLink>
      </div>

      <!-- Authenticated State: User is logged in -->
      <div v-else>
        <!-- Wishlist Items Grid -->
        <div v-if="wishlistStore.items.length > 0">
          <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold mb-0 text-main text-sm">Saved Products</h4>
              <span class="badge bg-secondary-light text-secondary-custom">
                {{ wishlistStore.wishlistCount }} {{ wishlistStore.wishlistCount === 1 ? 'item' : 'items' }}
              </span>
            </div>
            <button 
              @click="wishlistStore.clearWishlist" 
              class="btn btn-outline-danger-custom btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 text-xs transition-all"
            >
              <i class="bi bi-trash-fill"></i> Clear All
            </button>
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

        <!-- Authenticated Empty State -->
        <div v-else class="text-center py-5 empty-state-wrapper rounded-4 border bg-surface-custom p-4 p-md-5 shadow-sm">
          <div class="empty-state-icon-container mb-4 position-relative">
            <div class="glow-halo-red"></div>
            <i class="bi bi-heartbreak display-1 text-muted position-relative z-1 heartbeat-animation text-danger-custom"></i>
          </div>
          <h3 class="fw-bold text-main mb-2">No Favorites Yet</h3>
          <p class="subtitle-text mb-4 mx-auto text-xs" style="max-width: 320px;">
            Tap the heart icon on any product to save it to your wishlist and view it here later.
          </p>
          <NuxtLink 
            to="/categories" 
            class="btn btn-primary-custom px-4 py-2.5 rounded-pill fw-bold text-xs d-inline-flex align-items-center gap-2 transition-all"
          >
            Explore Catalog <i class="bi bi-arrow-right"></i>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { useWishlistStore } from '~/stores/wishlistStore';
import { useCartStore } from '~/stores/cartStore';
import { useAppToast } from '~/composables/ui/useAppToast';
import CategoryProductCard from '~/components/common/CategoryProductCard.vue';

// Page layout settings
definePageMeta({
  layout: 'default'
});

const authStore = useAuthStore();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { showSuccess } = useAppToast();

// Fetch wishlist and cart caches on load
onMounted(() => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();
  }
});

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
  font-family: var(--font-main);
}

.max-w-container {
  max-width: 1040px;
}

.bg-body-custom {
  background-color: var(--color-bg);
}

.bg-surface-custom {
  background-color: var(--color-surface);
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
  background-color: rgba(107, 114, 128, 0.05);
  border: 1px solid var(--color-border);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

/* Wishlist Hero Banner */
.wishlist-hero {
  background: var(--color-surface);
  border-color: var(--color-border) !important;
  box-shadow: var(--shadow-sm);
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

.glow-halo-red {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 75%);
  pointer-events: none;
}

.text-danger-custom {
  color: var(--color-danger, #ef4444);
}

/* Buttons */
.btn-primary-custom {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 220, 130, 0.15);
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(0, 220, 130, 0.25);
  transform: translateY(-1px);
}

.btn-outline-danger-custom {
  background-color: transparent;
  border: 1px solid var(--color-danger, #ef4444);
  color: var(--color-danger, #ef4444);
}

.btn-outline-danger-custom:hover {
  background-color: var(--color-danger, #ef4444);
  color: #ffffff;
}

/* Grid animations */
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

.text-xxs {
  font-size: 10px;
}

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 14px;
}
</style>
