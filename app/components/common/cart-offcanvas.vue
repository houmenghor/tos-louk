<template>
  <div
    ref="offcanvasRef"
    class="offcanvas offcanvas-end glass-cart-offcanvas border-0 shadow-lg"
    tabindex="-1"
    id="cartOffcanvas"
    aria-labelledby="cartOffcanvasLabel"
  >
    <!-- Cart Header -->
    <div class="offcanvas-header border-bottom border-custom-glass py-3 px-4">
      <div class="d-flex align-items-center gap-2">
        <h5 class="offcanvas-title fw-bold text-main" id="cartOffcanvasLabel">
          {{ $t('cart.title') }}
        </h5>
        <span
          class="badge bg-primary-brand text-white rounded-pill px-2.5 py-1 text-xs"
        >
          {{ cartStore.cartCount }}
          {{ cartStore.cartCount === 1 ? $t('cart.item') : $t('cart.items') }}
        </span>
      </div>
      <button
        type="button"
        class="btn-close btn-close-custom"
        @click="cartStore.toggleCart(false)"
        aria-label="Close"
      ></button>
    </div>

    <!-- Cart Body -->
    <div class="offcanvas-body d-flex flex-column p-0 bg-body-custom">

        <!-- 1. Free Shipping Progress Tracker (Only shown when cart is not empty) -->
        <div
          v-if="cartStore.items.length > 0"
          class="shipping-tracker-wrapper p-4 border-bottom border-custom-glass"
        >
          <div
            class="d-flex justify-content-between align-items-center mb-2 small text-main"
          >
            <span
              v-if="cartStore.isFreeShipping"
              class="fw-semibold text-success animate-pulse"
            >
              {{ $t('cart.qualifyFreeShipping') }}
            </span>
            <span v-else class="fw-medium text-muted-custom">
              {{ $t('cart.spendMoreFor', { amount: '$' + cartStore.amountToFreeShipping.toFixed(2) }) }}
              <strong class="text-primary-brand text-nowrap"
                >{{ $t('cart.freeShipping') }}</strong
              >
            </span>
          </div>
          <div
            class="progress shipping-progress rounded-pill bg-input"
            style="height: 8px"
          >
            <div
              class="progress-bar rounded-pill transition-all"
              role="progressbar"
              :class="
                cartStore.isFreeShipping ? 'bg-success' : 'bg-primary-brand'
              "
              :style="{ width: `${cartStore.shippingProgress}%` }"
              aria-valuenow="cartStore.shippingProgress"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <!-- 2. Scrollable Product Items List -->
        <div
          v-if="cartStore.items.length > 0"
          class="flex-grow-1 overflow-y-auto p-4 d-flex flex-column gap-3 cart-items-list"
        >
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item-card p-3 rounded-4 d-flex gap-3 position-relative border border-custom-glass transition-all hover-translate-y"
          >
            <!-- Product Image -->
            <div
              class="cart-item-img-wrapper rounded-3 overflow-hidden bg-light-custom flex-shrink-0"
            >
              <NuxtImg
                :src="item.image || item.thumbnail || 'https://placehold.co/400x400/png?text=Product'"
                :alt="item.title || item.name || 'Product'"
                class="w-100 h-100 object-fit-cover"
              />
            </div>

            <!-- Product Details -->
            <div class="d-flex flex-column justify-content-between flex-grow-1">
              <div>
                <div
                  class="d-flex justify-content-between align-items-start gap-2"
                >
                  <h6
                    class="item-title mb-1 fw-bold text-main text-line-clamp-2"
                  >
                    {{ item.title || item.name }}
                  </h6>
                  <BaseButton
                    variants="outline-danger"
                    size="sm"
                    @click="cartStore.removeFromCart(item.id)"
                    title="Remove item"
                    class="remove-btn"
                  >
                    <i class="bi bi-trash"></i>
                  </BaseButton>
                </div>
                <span
                  class="item-category text-xs text-muted-custom text-uppercase fw-semibold tracking-wider d-block mb-2"
                >
                  {{ item.category }}
                </span>
              </div>

              <!-- Price & Quantity Selector -->
              <div
                class="d-flex align-items-center justify-content-between mt-2"
              >
                <span class="item-price fw-bold text-main"
                  >${{ Number(item.price || 0).toFixed(2) }}</span
                >
                <div
                  class="qty-adjuster d-flex align-items-center rounded-pill bg-input border"
                >
                  <button
                    @click="decreaseQty(item)"
                    class="btn btn-sm border-0 rounded-circle text-muted-custom px-2.5 py-1 line-height-1 hover-primary"
                    aria-label="Decrease quantity"
                  >
                    <i class="bi bi-dash fw-bold"></i>
                  </button>
                  <span
                    class="qty-display px-2 text-main fw-semibold small select-none"
                    >{{ item.quantity }}</span
                  >
                  <button
                    @click="increaseQty(item)"
                    class="btn btn-sm border-0 rounded-circle text-muted-custom px-2.5 py-1 line-height-1 hover-primary"
                    aria-label="Increase quantity"
                  >
                    <i class="bi bi-plus fw-bold"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Empty Cart State (logged in but no items) -->
        <div
          v-else
          class="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-5 text-center empty-state-wrapper"
        >
          <div class="empty-cart-icon-container mb-4 position-relative">
            <div class="glow-halo"></div>
            <i
              class="bi bi-bag-x display-3 text-muted position-relative z-1 animate-bounce"
            ></i>
          </div>
          <h4 class="fw-bold text-main mb-2">{{ $t('cart.empty') }}</h4>
          <p
            class="small text-muted-custom mb-4 mx-auto"
            style="max-width: 250px"
          >
            {{ $t('cart.emptyDesc') }}
          </p>
          <BaseButton
            variants="primary"
            size="md"
            @click="cartStore.toggleCart(false)"
          >
            {{ $t('cart.startShopping') }} <i class="bi bi-arrow-right"></i>
          </BaseButton>
        </div>

        <!-- 4. Footer Checkout Section (Only shown when cart is not empty) -->
        <div
          v-if="cartStore.items.length > 0"
          class="cart-footer border-top border-custom-glass p-4 mt-auto"
        >
          <div class="d-flex flex-column gap-2 mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted-custom small">{{ $t('cart.subtotal') }}</span>
              <span class="text-main fw-semibold"
                >${{ cartStore.cartSubtotal.toFixed(2) }}</span
              >
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted-custom small">{{ $t('cart.shipping') }}</span>
              <span
                v-if="cartStore.isFreeShipping"
                class="text-success fw-bold small"
                >{{ $t('cart.free') }}</span
              >
              <span v-else class="text-main fw-semibold"
                >${{ cartStore.shippingCost.toFixed(2) }}</span
              >
            </div>
            <hr class="border-custom-glass my-2" />
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold text-main">{{ $t('cart.total') }}</span>
              <span class="fw-extrabold text-main fs-4"
                >${{ cartStore.cartTotal.toFixed(2) }}</span
              >
            </div>
          </div>
          <BaseButton
            variants="primary"
            size="lg"
            class="w-100 mb-2"
            @click="handleCheckout"
          >
            {{ $t('cart.secureCheckout') }}
          </BaseButton>
          <BaseButton
            variants="secondary"
            size="md"
            class="w-100"
            @click="cartStore.toggleCart(false)"
          >
            {{ $t('cart.continueShopping') }}
          </BaseButton>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useCartStore } from "~/stores/cartStore";
import { useAuthStore } from "~/stores/authStore";

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const offcanvasRef = ref(null);
let offcanvasInstance = null;

const increaseQty = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1);
};

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1);
  } else {
    cartStore.removeFromCart(item.id);
  }
};

const handleCheckout = () => {
  if (!authStore.access_token) {
    cartStore.toggleCart(false);
    router.push("/auth/login");
  } else {
    cartStore.toggleCart(false);
    router.push("/checkout");
  }
};

onMounted(() => {
  // Initialize cart state
  cartStore.initCart();

  if (process.client && offcanvasRef.value) {
    const bootstrap = window.bootstrap || globalThis.bootstrap;
    if (bootstrap) {
      offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(
        offcanvasRef.value,
      );

      // Sync local state when closed via BS backdrop/buttons or keypress
      offcanvasRef.value.addEventListener("hidden.bs.offcanvas", () => {
        cartStore.isOpen = false;
      });
    }
  }
});

// Open/close offcanvas based on store state
watch(
  () => cartStore.isOpen,
  (newVal) => {
    if (offcanvasInstance) {
      if (newVal) {
        offcanvasInstance.show();
      } else {
        offcanvasInstance.hide();
      }
    }
  },
);
</script>

<style scoped>
/* Glassmorphism sidebar */
.glass-cart-offcanvas {
  background: var(--color-surface) !important;
  border-left: 1px solid var(--glass-border) !important;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  width: 440px !important;
  max-width: 100vw;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* Custom background to support dark mode transition */
.bg-body-custom {
  background-color: var(--color-surface);
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

/* Close button custom design */
.btn-close-custom {
  background-color: var(--color-border);
  border-radius: 50%;
  padding: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.btn-close-custom:hover {
  opacity: 1;
  background-color: var(--color-primary-light);
  transform: rotate(90deg);
}

/* Tracker styling */
.shipping-tracker-wrapper {
  background-color: rgba(0, 220, 130, 0.03);
}

.shipping-progress {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.transition-all {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Cart Item Card */
.cart-item-card {
  background: var(--color-surface);
  box-sizing: border-box;
}

.cart-item-card:hover {
  border-color: var(--color-primary) !important;
  box-shadow: var(--shadow-md);
}

.cart-item-img-wrapper {
  width: 80px;
  height: 80px;
  border: 1px solid var(--color-border);
}

.item-title {
  font-size: 0.95rem;
  line-height: 1.35;
  color: var(--color-text);
}

.text-line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-category {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}

.item-price {
  font-size: 1.1rem;
  color: var(--color-primary);
}

/* Qty Adjuster */
.qty-adjuster {
  padding: 2px;
}

.qty-display {
  font-size: 0.85rem;
  min-width: 24px;
  text-align: center;
}

.qty-adjuster button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  transition: all 0.2s ease;
}

.qty-adjuster button:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary) !important;
}

/* Remove button hover scale */
.remove-btn {
  opacity: 0.6;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Empty State Styling */
.empty-state-wrapper {
  animation: fadeIn 0.4s ease;
}

.empty-cart-icon-container {
  display: inline-block;
}

.glow-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    var(--color-primary-light) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  z-index: 0;
  opacity: 0.8;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* Buttons and Shimmer effects */
.btn-primary-custom {
  background-color: var(--color-primary) !important;
  color: #111827 !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 4px 14px var(--color-primary-light);
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 220, 130, 0.3);
}

.btn-primary-custom:active {
  transform: translateY(1px) scale(0.97) !important;
  box-shadow: 0 2px 8px rgba(0, 220, 130, 0.2) !important;
}

.checkout-btn {
  position: relative;
  overflow: hidden;
}

/* Shimmer overlay effect on checkout button hover */
.checkout-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-25deg);
  transition: 0.75s ease;
  opacity: 0;
}

.checkout-btn:hover::after {
  left: 125%;
  opacity: 1;
  transition: left 0.75s ease-in-out;
}

/* Animations */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hover-translate-y:hover {
  transform: translateY(-2px);
}

/* Custom colors matching app modes */
.text-main {
  color: var(--color-text);
}

.text-primary-brand {
  color: var(--color-primary) !important;
}

.bg-primary-brand {
  background-color: var(--color-primary) !important;
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

.bg-light-custom {
  background-color: var(--color-bg-secondary);
}

.bg-input {
  background-color: var(--color-bg) !important;
  border-color: var(--color-border) !important;
}

/* Guest Cart State */
.guest-cart-icon-container {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glow-halo-green {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-rgb, 99, 102, 241), 0.15) 0%,
    transparent 70%
  );
  animation: pulse 2.5s ease-in-out infinite;
}

.btn-outline-primary-custom {
  background: transparent;
  border: 1.5px solid var(--color-primary, #6366f1);
  color: var(--color-primary, #6366f1);
  transition: all 0.2s ease;
}

.btn-outline-primary-custom:hover {
  background: var(--color-primary, #6366f1);
  color: #fff;
}
</style>
