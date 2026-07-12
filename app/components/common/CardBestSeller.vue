<template>
  <NuxtLink :to="`/product/${product.uuid}`" class="product-card text-decoration-none">
    <div class="image-wrapper">
      <NuxtImg :src="product.image" :alt="product.title" />
      <span v-if="product.badge" class="badge">{{ product.badge }}</span>
      <div class="icon-actions">
        <!-- Wishlist Toggle Button -->
        <button
          class="action-btn"
          :class="{ active: wishlistStore.isInWishlist(product.id) }"
          @click.stop="handleToggleWishlist"
          title="Add to Wishlist"
        >
          <i
            class="bi"
            :class="
              wishlistStore.isInWishlist(product.id)
                ? 'bi-heart-fill text-danger'
                : 'bi-heart'
            "
          ></i>
        </button>
        <button class="action-btn" title="Quick View">
          <i class="bi bi-eye"></i>
        </button>
      </div>
    </div>

    <div class="info-wrapper">
      <div class="meta-row">
        <span class="category">{{ product.category }}</span>
      </div>

      <h3 class="title">{{ product.title }}</h3>

      <div class="bottom-row">
        <!-- <div class="color-swatches">
          <span v-for="color in product.colors" :key="color" class="dot"
            :style="{ backgroundColor: color }"></span>
        </div> -->
        <div class="price-container">
          <!-- <span v-if="product.oldPrice" class="old-price">${{ product.oldPrice }}</span> -->
          <span class="current-price">${{ product.price }}</span>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button class="add-to-cart-btn" @click.stop="handleAddToCart">
        Add to Cart <i class="bi bi-bag-plus"></i>
      </button>
    </div>
  </NuxtLink>
</template>

<script setup>
import { useAuthStore } from "~/stores/authStore";
import { useCartStore } from "~/stores/cartStore";
import { useWishlistStore } from "~/stores/wishlistStore";
import { useAppToast } from "~/composables/ui/useAppToast";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { showSuccess, showError } = useAppToast();
const { locale } = useI18n();

// Reusable login verification checker
const verifyLogin = (actionName) => {
  if (!authStore.access_token) {
    showError(
      locale.value === "kh"
        ? `សូមចូលគណនីជាមុនសិនដើម្បី ${actionName}!`
        : `Please login first to ${actionName}!`,
    );
    navigateTo("/auth/login");
    return false;
  }
  return true;
};

const handleAddToCart = () => {
  if (verifyLogin(locale.value === "kh" ? "បន្ថែមទៅកន្ត្រក" : "add to cart")) {
    cartStore.addToCart(props.product);
    showSuccess(
      locale.value === "kh"
        ? "បានបន្ថែមទៅក្នុងកន្ត្រកជោគជ័យ!"
        : "Added to cart successfully!",
    );
  }
};

const handleToggleWishlist = () => {
  if (
    verifyLogin(
      locale.value === "kh" ? "បន្ថែមទៅបញ្ជីប្រាថ្នា" : "add to wishlist",
    )
  ) {
    wishlistStore.toggleWishlist(props.product);
    const isNowAdded = wishlistStore.isInWishlist(props.product.id);
    if (isNowAdded) {
      showSuccess(
        locale.value === "kh"
          ? "បានបន្ថែមទៅក្នុងបញ្ជីប្រាថ្នា!"
          : "Added to wishlist!",
      );
    } else {
      showSuccess(
        locale.value === "kh"
          ? "បានលុបចេញពីបញ្ជីប្រាថ្នា!"
          : "Removed from wishlist!",
      );
    }
  }
};
</script>

<style scoped>
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.product-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.image-wrapper {
  position: relative;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-wrapper img {
  max-width: 70%;
  max-height: 70%;
  transition: transform 0.5s ease;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--color-primary);
  color: #000;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.icon-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .icon-actions {
  opacity: 1;
}

.action-btn {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-primary);
  color: #000;
}

.action-btn.active {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.action-btn.active:hover {
  background: var(--color-danger, #ef4444);
  color: #fff;
  border-color: var(--color-danger, #ef4444);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.title {
  font-size: 1rem;
  margin: 8px 0;
  color: var(--color-text);
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}

.old-price {
  text-decoration: line-through;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  margin-right: 6px;
}

.current-price {
  font-weight: 800;
  color: var(--color-text);
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover {
  background: var(--color-primary);
  color: var(--color-bg);
}
</style>
