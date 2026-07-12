<template>
  <div
    class="discount-card h-100 position-relative overflow-hidden"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Discount Badge -->
    <div v-if="product.badge" class="deal-badge position-absolute z-2">
      <span class="deal-badge-pill">
        <i class="bi bi-lightning-fill me-1"></i>{{ product.badge }}
      </span>
    </div>

    <!-- Wishlist Button -->
    <button
      class="wishlist-btn position-absolute z-2"
      :class="{ wishlisted: wishlistStore.isInWishlist(product.id) }"
      @click.stop="handleToggleWishlist"
      :title="
        wishlistStore.isInWishlist(product.id)
          ? 'Remove from Wishlist'
          : 'Add to Wishlist'
      "
    >
      <i
        class="bi"
        :class="
          wishlistStore.isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart'
        "
      ></i>
    </button>

    <!-- Quick View Button -->
    <NuxtLink
      :to="`/product/${product.id}`"
      class="quick-view-btn position-absolute z-2"
      title="View Details"
    >
      <i class="bi bi-eye"></i>
    </NuxtLink>

    <!-- Product Image -->
    <div class="image-area">
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        class="product-img"
        :class="{ 'img-zoomed': hovered }"
      />
      <!-- Hover overlay CTA -->
      <div class="img-overlay" :class="{ 'overlay-visible': hovered }">
        <button class="overlay-cart-btn" @click="handleAddToCart">
          <i class="bi bi-cart-plus-fill me-2"></i>Quick Add
        </button>
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <!-- Category tag -->
      <span v-if="product.category" class="category-tag">{{
        product.category
      }}</span>

      <!-- Title -->
      <h6 class="product-title">{{ product.title }}</h6>

      <!-- Price Row -->
      <div class="price-row">
        <span class="price-now">${{ product.price }}</span>
        <del v-if="product.oldPrice" class="price-was"
          >${{ product.oldPrice }}</del
        >
        <span v-if="savings" class="save-chip">-${{ savings }}</span>
      </div>

      <!-- Stock urgency bar -->
      <div class="stock-section">
        <div class="stock-labels">
          <span class="stock-left">
            <i class="bi bi-fire text-danger me-1"></i>
            Only <strong>{{ itemsLeft }}</strong> left
          </span>
          <span class="stock-percent">{{ progress }}% sold</span>
        </div>
        <div class="stock-track">
          <div class="stock-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="action-row">
        <BaseButton
          variants="primary"
          size="md"
          class="flex-grow-1"
          @click="handleAddToCart"
        >
          <i class="bi bi-cart-plus-fill me-1"></i> Add to Cart
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useCartStore } from "~/stores/cartStore";
import { useWishlistStore } from "~/stores/wishlistStore";
import { useAppToast } from "~/composables/ui/useAppToast";

const props = defineProps({
  product: { type: Object, required: true },
});

const emit = defineEmits(["add-to-cart"]);

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { showSuccess, showError } = useAppToast();
const { locale } = useI18n();
const hovered = ref(false);

// ── Auth Guard ──
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

// ── Actions ──
const handleAddToCart = () => {
  if (verifyLogin(locale.value === "kh" ? "បន្ថែមទៅកន្ត្រក" : "add to cart")) {
    cartStore.addToCart(props.product);
    emit("add-to-cart", props.product);
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
    showSuccess(
      isNowAdded
        ? locale.value === "kh"
          ? "បានបន្ថែមទៅក្នុងបញ្ជីប្រាថ្នា!"
          : "Added to wishlist!"
        : locale.value === "kh"
          ? "បានដកចេញពីបញ្ជីប្រាថ្នា!"
          : "Removed from wishlist!",
    );
  }
};

// ── Computed ──
const savings = computed(() => {
  if (props.product.oldPrice && props.product.price) {
    const s = (props.product.oldPrice - props.product.price).toFixed(0);
    return s > 0 ? s : null;
  }
  return null;
});

const progress = computed(() =>
  Math.min(95, Math.max(30, ((props.product.id || 0) * 13) % 100)),
);

const itemsLeft = computed(() =>
  Math.max(2, ((props.product.id || 0) * 7) % 12),
);

const handleBuyNow = () => emit("add-to-cart", props.product);
</script>

<style scoped>
/* ── Card Shell ── */
.discount-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
  color: var(--color-text);
}

.discount-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 220, 130, 0.4);
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 220, 130, 0.1);
}

/* ── Deal Badge ── */
.deal-badge {
  top: 14px;
  left: 14px;
}
.deal-badge-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: #fff;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.35);
}

/* ── Wishlist Button ── */
.wishlist-btn {
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}
.wishlist-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.1);
}
.wishlist-btn.wishlisted {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* ── Quick View Button ── */
.quick-view-btn {
  top: 56px;
  right: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
  text-decoration: none;
}
.quick-view-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.1);
}

/* ── Image Area ── */
.image-area {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  border-radius: 20px 20px 0 0;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.img-zoomed {
  transform: scale(1.07);
}

/* Hover overlay */
.img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 15, 30, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.overlay-visible {
  opacity: 1;
}
.overlay-cart-btn {
  padding: 9px 22px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  border: none;
  cursor: pointer;
  transform: translateY(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  backdrop-filter: blur(8px);
}
.overlay-visible .overlay-cart-btn {
  transform: translateY(0);
}
.overlay-cart-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

/* ── Card Content ── */
.card-content {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Category tag */
.category-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-primary);
  background: rgba(0, 220, 130, 0.1);
  border: 1px solid rgba(0, 220, 130, 0.2);
  padding: 3px 9px;
  border-radius: 999px;
}

/* Title */
.product-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin: 0;
}

/* Price */
.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.price-now {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ef4444;
}
.price-was {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}
.save-chip {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 220, 130, 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(0, 220, 130, 0.2);
  padding: 3px 8px;
  border-radius: 999px;
}

/* Stock urgency */
.stock-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.stock-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
}
.stock-left {
  color: var(--color-text-secondary);
  font-weight: 500;
}
.stock-left strong {
  color: #ef4444;
}
.stock-percent {
  color: var(--color-text-secondary);
  font-size: 11px;
}
.stock-track {
  height: 5px;
  border-radius: 999px;
  background: var(--color-border);
  overflow: hidden;
}
.stock-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ef4444, #f97316);
  transition: width 0.6s ease;
}

/* Actions */
.action-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
}
</style>
