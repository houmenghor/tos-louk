<template>
  <NuxtLink 
    :to="`/product/${product.uuid}`"
    class="card glass-card shadow-sm border-0 overflow-hidden text-decoration-none"  
    :class="layout === 'list' ? 'flex-sm-row flex-column h-auto' : 'h-100'"
  >
    <!-- Image Area -->
    <div 
      class="position-relative overflow-hidden bg-light-custom"
      :class="layout === 'list' ? 'image-container-list flex-shrink-0' : 'image-container'"
    >
      <!-- Image Zoom-in hover -->
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        class="product-img w-100 h-100 object-fit-cover"
      />

      <!-- Badges (Top Left) -->
      <div
        class="position-absolute top-0 start-0 m-3 z-2 d-flex flex-column gap-2"
      >
        <span
          v-if="product.oldPrice"
          class="badge bg-danger-light text-danger rounded-pill px-2.5 py-1.5 fw-bold text-xs"
        >
          -{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
        </span>
        <span
          v-else-if="product.id % 3 === 0"
          class="badge bg-success-light text-success rounded-pill px-2.5 py-1.5 fw-bold text-xs"
        >
          Just Curated
        </span>
      </div>

      <!-- Action Buttons Column (Slides in on hover from right) -->
      <div
        class="action-buttons-column position-absolute top-0 end-0 m-3 z-2 d-flex flex-column gap-2"
      >
        <button
          @click.stop="toggleWishlist"
          class="action-circle-btn shadow-sm border"
          :class="{ wishlisted: isWishlisted }"
          :title="isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
        >
          <i :class="isWishlisted ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </button>
        <button class="action-circle-btn shadow-sm border" title="Quick View">
          <i class="bi bi-eye"></i>
        </button>
        <button class="action-circle-btn shadow-sm border" title="Add to Bag" @click.stop="handleAddToCart">
          <i class="bi bi-bag"></i>
        </button>
      </div>
    </div>

    <!-- Card details -->
    <div class="card-body d-flex flex-column justify-content-between" :class="layout === 'list' ? 'p-3 p-sm-4' : 'p-3'">
      <div>
        <!-- Collection Text -->
        <span
          class="collection-text text-uppercase text-xs fw-bold tracking-wider d-block mb-1 text-muted-custom"
        >
          {{
            product.category === "electronics"
              ? "Electronics Hub"
              : product.category === "clothing"
                ? "Men's Collection"
                : "Fashion Picks"
          }}
        </span>

        <!-- Product Title -->
        <h6 class="product-title text-main fw-bold" :class="layout === 'list' ? 'mb-2 fs-5 list-title' : 'mb-1.5'">{{ product.title }}</h6>
        
        <!-- Product Description (List view only) -->
        <p v-if="layout === 'list'" class="product-description text-muted-custom small mb-3 mt-1 d-none d-sm-block">
          Discover our latest premium collection featuring high-quality materials and modern design.
        </p>
      </div>


      <!-- Price & Cart button row -->
      <div class="d-flex mt-auto pt-2" :class="layout === 'list' ? 'align-items-center gap-4' : 'align-items-center justify-content-between'">
        <div class="price-container">
          <span class="current-price fw-bold text-main" :class="layout === 'list' ? 'fs-4' : ''">${{ product.price }}.00</span>
          <span v-if="product.oldPrice" class="old-price small text-decoration-line-through ms-2 text-muted-custom">
            ${{ product.oldPrice }}.00
          </span>
        </div>
        
        <button @click.stop="handleAddToCart" class="btn btn-primary-custom fw-bold d-flex align-items-center gap-1.5" :class="layout === 'list' ? 'px-4 py-2' : 'btn-sm px-3 py-2 text-xs'">
          <i class="bi bi-cart-plus d-none d-sm-inline" v-if="layout === 'list'"></i> Add to Cart
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWishlistStore } from '~/stores/wishlistStore';
import { useAuthStore } from '~/stores/authStore';
import { useAppToast } from '~/composables/ui/useAppToast';

const props = defineProps({
  product: { type: Object, required: true },
  layout: { type: String, default: 'grid' }
});
const emit = defineEmits(['add-to-cart']);

const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const router = useRouter();
const { showWarning } = useAppToast();

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.product.id));

const toggleWishlist = () => {
  if (!authStore.isAuthenticated) {
    showWarning('Please login first to use the wishlist');
    return router.push('/auth/login');
  }
  wishlistStore.toggleWishlist(props.product);
};

const handleAddToCart = () => {
  if (!authStore.isAuthenticated) {
    showWarning('Please login first to add items to your cart');
    return router.push('/auth/login');
  }
  emit('add-to-cart', props.product);
};
</script>

<style scoped>
.glass-card {
  background-color: var(--color-surface) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 16px;
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-sizing: border-box;
}

.glass-card:hover {
  transform: translateY(-6px);
  box-shadow:
    var(--shadow-md),
    0 12px 30px rgba(0, 220, 130, 0.08) !important;
  border-color: var(--color-primary) !important;
}

.image-container {
  height: 310px;
  border-radius: 12px 12px 0 0;
}

.image-container-list {
  width: 220px;
  height: auto;
  min-height: 200px;
  border-radius: 12px 0 0 12px;
}

@media (max-width: 576px) {
  .image-container-list {
    width: 100%;
    height: 300px;
    border-radius: 12px 12px 0 0;
  }
}

.bg-light-custom {
  background-color: var(--color-bg-secondary);
}

.product-img {
  transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.glass-card:hover .product-img {
  transform: scale(1.06);
}

/* Badges */
.bg-danger-light {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444 !important;
}

.bg-success-light {
  background-color: rgba(0, 220, 130, 0.1);
  color: var(--color-primary) !important;
}

.text-xs {
  font-size: 0.72rem;
}

/* Action Buttons Column */
.action-buttons-column {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.glass-card:hover .action-buttons-column {
  opacity: 1;
  transform: translateX(0);
}

.action-circle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  border-color: var(--color-border) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0;
}

.action-circle-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff !important;
  border-color: var(--color-primary) !important;
  transform: scale(1.1);
}

.action-circle-btn:active {
  transform: scale(0.82) !important;
  background-color: var(--color-primary-light) !important;
  color: var(--color-primary) !important;
}

.action-circle-btn.wishlisted:active {
  transform: scale(0.82) !important;
  background-color: rgba(239, 68, 68, 0.15) !important;
  color: #ef4444 !important;
}

.action-circle-btn.wishlisted {
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
}

.action-circle-btn.wishlisted:hover {
  background-color: #ef4444;
  color: #ffffff !important;
  border-color: #ef4444 !important;
}

/* Text styles */
.collection-text {
  font-size: 0.7rem;
  letter-spacing: 0.8px;
}

.product-title {
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 2.8rem;
}

.list-title {
  height: auto;
  -webkit-line-clamp: 3;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 700;
}

.old-price {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

.text-main {
  color: var(--color-text);
}

.btn-primary-custom {
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  border-radius: 8px;
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-primary-custom:active {
  transform: translateY(1px) scale(0.92) !important;
  background-color: var(--color-primary-hover) !important;
  opacity: 0.88 !important;
}
</style>
