<template>
  <div class="card glass-card h-100 shadow-sm border-0 overflow-hidden">
    <!-- Image Area -->
    <div
      class="image-container position-relative overflow-hidden bg-light-custom"
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
        <button class="action-circle-btn shadow-sm border" title="Add to Bag">
          <i class="bi bi-bag"></i>
        </button>
      </div>
    </div>

    <!-- Card details -->
    <div class="card-body p-3 d-flex flex-column justify-content-between">
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
        <h6 class="product-title mb-1.5 text-main fw-bold">
          {{ product.title }}
        </h6>

        <!-- Rating -->
        <div class="d-flex align-items-center gap-2 rating-container mb-3">
          <div class="stars d-flex gap-0.5 text-warning small">
            <i
              v-for="n in 5"
              :key="n"
              :class="[
                n <= Math.floor(product.rating || 4.5)
                  ? 'bi bi-star-fill'
                  : 'bi bi-star',
              ]"
            ></i>
          </div>
          <span class="reviews-text small text-muted-custom">
            {{ ((product.id * 13) % 40) + 15 }} reviews
          </span>
        </div>
      </div>

      <!-- Price & Cart button row -->
      <div
        class="d-flex align-items-center justify-content-between mt-auto pt-2"
      >
        <div class="price-container">
          <span class="current-price fw-bold text-main"
            >${{ product.price }}.00</span
          >
          <span
            v-if="product.oldPrice"
            class="old-price small text-decoration-line-through ms-2 text-muted-custom"
          >
            ${{ product.oldPrice }}.00
          </span>
        </div>

        <button
          @click.stop="$emit('add-to-cart', product)"
          class="btn btn-primary-custom btn-sm px-3 py-2 fw-bold text-xs d-flex align-items-center gap-1.5"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useWishlistStore } from "~/stores/wishlistStore";

const props = defineProps({
  product: { type: Object, required: true },
});
defineEmits(["add-to-cart"]);

const wishlistStore = useWishlistStore();

const isWishlisted = computed(() =>
  wishlistStore.isInWishlist(props.product.id),
);
const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product);
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
