<template>
  <div class="card discount-card h-100 border-0 overflow-hidden position-relative shadow-sm">
    <!-- Discount Badge -->
    <div v-if="product.badge" class="discount-badge position-absolute top-0 start-0 m-3 z-2">
      <span class="badge rounded-pill bg-danger-gradient shadow-sm">
        <i class="bi bi-lightning-fill text-warning me-1"></i>{{ product.badge }}
      </span>
    </div>

    <!-- Heart Wishlist Button -->
    <button 
      class="btn wishlist-btn rounded-circle position-absolute top-0 end-0 m-3 z-2 d-flex align-items-center justify-content-center shadow-sm"
      :class="{ 'active': isWishlisted }"
      @click.stop="toggleWishlist"
      title="Add to Wishlist"
    >
      <i class="bi" :class="isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
    </button>

    <!-- Product Image -->
    <div class="image-wrapper position-relative overflow-hidden">
      <img :src="product.image" :alt="product.title" class="w-100 h-100 object-fit-cover product-image" />
      
      <!-- Action Hover Overlay -->
      <div class="image-overlay d-flex align-items-center justify-content-center">
        <button class="btn btn-blur rounded-pill px-4 py-2 fw-semibold add-to-cart-btn" @click="$emit('add-to-cart', product)">
          <i class="bi bi-cart-plus-fill me-2"></i> Add to Cart
        </button>
      </div>
    </div>

    <!-- Product Details -->
    <div class="card-body p-4 d-flex flex-column justify-content-between">
      <div>
        <h6 class="product-title fw-bold mb-2">{{ product.title }}</h6>
        
        <!-- Price Display -->
        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="price-discounted fw-bold fs-5">${{ product.price }}</span>
          <del v-if="product.oldPrice" class="price-original">${{ product.oldPrice }}</del>
          <span v-if="savings" class="savings-label badge ms-auto">
            Save ${{ savings }}
          </span>
        </div>

        <!-- Stock Progress Bar (Urgency Feature) -->
        <div class="stock-urgency mb-3">
          <div class="d-flex justify-content-between small mb-1">
            <span class="stock-text">Only <strong class="text-danger-custom">{{ itemsLeft }}</strong> left!</span>
            <span class="stock-text">{{ progress }}% sold</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div 
              class="progress-bar progress-bar-striped progress-bar-animated bg-danger-bar" 
              role="progressbar" 
              :style="{ width: progress + '%' }" 
              :aria-valuenow="progress" 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions (Visible always on small screen / on hover on large) -->
      <div class="d-flex gap-2 mt-2 card-actions">
        <button class="btn btn-outline-primary-custom flex-grow-1 py-2 text-sm fw-semibold rounded-3" @click="$emit('add-to-cart', product)">
          Add to Cart
        </button>
        <button class="btn btn-primary-custom px-3 py-2 rounded-3" title="Buy Now" @click="handleBuyNow">
          <i class="bi bi-wallet2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart']);

const isWishlisted = ref(false);

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
};

// Calculate savings
const savings = computed(() => {
  if (props.product.oldPrice && props.product.price) {
    return (props.product.oldPrice - props.product.price).toFixed(0);
  }
  return null;
});

// Urgency mock progress bar
const progress = computed(() => {
  return Math.min(95, Math.max(30, ((props.product.id || 0) * 13) % 100));
});

const itemsLeft = computed(() => {
  return Math.max(2, ((props.product.id || 0) * 7) % 12);
});

const handleBuyNow = () => {
  emit('add-to-cart', props.product);
};
</script>

<style scoped>
.discount-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  color: var(--color-text);
}

.discount-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md), 0 10px 25px -5px rgba(0, 220, 130, 0.15);
  border-color: var(--color-primary);
}

/* Badge with vibrant gradient */
.bg-danger-gradient {
  background: linear-gradient(135deg, var(--color-danger, #ef4444), #ff6b6b);
  border: none;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  padding: 6px 12px;
}

/* Wishlist Button */
.wishlist-btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;
}

.wishlist-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-danger, #ef4444);
  transform: scale(1.1);
}

.wishlist-btn.active {
  background: var(--color-primary-light);
  border-color: rgba(0, 220, 130, 0.2);
  color: var(--color-danger, #ef4444);
}

/* Image wrapper and effect */
.image-wrapper {
  height: 260px;
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.discount-card:hover .product-image {
  transform: scale(1.08);
}

/* Hover Overlay for Cart Action */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.55);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.discount-card:hover .image-overlay {
  opacity: 1;
}

.btn-blur {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.discount-card:hover .btn-blur {
  transform: translateY(0);
}

.btn-blur:hover {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
  transform: translateY(0) scale(1.05);
}

/* Typography & Price styling */
.product-title {
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.4rem;
  line-height: 1.2rem;
  font-size: 0.95rem;
}

.price-discounted {
  color: var(--color-danger, #ef4444);
}

.price-original {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

.savings-label {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid rgba(0, 220, 130, 0.2);
}

.stock-text {
  color: var(--color-text-secondary);
}

.text-danger-custom {
  color: var(--color-danger, #ef4444);
}

/* Progress bar customizations */
.progress {
  background-color: var(--color-border);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  border-radius: 10px;
}

.bg-danger-bar {
  background-color: var(--color-danger, #ef4444) !important;
}

/* Quick Actions buttons */
.btn-outline-primary-custom {
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  transition: all 0.2s ease;
}

.btn-outline-primary-custom:hover {
  background-color: var(--color-primary);
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

.text-sm {
  font-size: 0.875rem;
}
</style>
