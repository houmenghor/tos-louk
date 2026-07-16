<template>
  <div class="summary-card p-4 rounded-4 border sticky-top" style="top: 90px; z-index: 10;">
    <div class="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-custom">
      <h5 class="fw-bold text-main mb-0 d-flex align-items-center gap-2">
        {{ $t('checkout.orderSummary') }}
      </h5>
      <span class="badge badge-count text-white rounded-pill px-3 py-1 text-xs">
        {{ cartStore.cartCount }} {{ cartStore.cartCount === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <!-- Items List with Live Quantity Adjusters -->
    <div class="cart-items-preview mb-4 pe-1 overflow-auto" style="max-height: 320px;">
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="cart-summary-item py-3 border-bottom border-custom d-flex align-items-center gap-3 transition-all"
      >
        <!-- Thumbnail -->
        <div
          class="item-thumbnail rounded-3 overflow-hidden bg-thumbnail border border-custom flex-shrink-0"
          style="width: 60px; height: 60px;"
        >
          <NuxtImg
            :src="item.image || item.thumbnail || 'https://placehold.co/400x400/png?text=Product'"
            :alt="item.title || item.name || 'Product'"
            class="w-100 h-100 object-fit-cover"
          />
        </div>

        <!-- Title & Live Quantity Adjuster -->
        <div class="flex-grow-1 overflow-hidden">
          <h6 class="text-truncate fw-bold text-main mb-1 text-xs">
            {{ item.title || item.name || 'Product' }}
          </h6>
          <div class="d-flex align-items-center justify-content-between mt-2">
            <div class="qty-adjuster d-flex align-items-center rounded-pill border border-custom">
              <button
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                class="btn btn-sm border-0 rounded-circle text-secondary-custom px-2 py-0 hover-primary"
                type="button"
                aria-label="Decrease quantity"
              >
                <i class="bi bi-dash fw-bold"></i>
              </button>
              <span class="qty-display px-2 text-main fw-semibold text-xs select-none">{{ item.quantity }}</span>
              <button
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                class="btn btn-sm border-0 rounded-circle text-secondary-custom px-2 py-0 hover-primary"
                type="button"
                aria-label="Increase quantity"
              >
                <i class="bi bi-plus fw-bold"></i>
              </button>
            </div>
            <span class="fw-bold text-main text-small">${{ Number((item.price || 0) * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Remove button -->
        <button
          @click="cartStore.removeFromCart(item.id)"
          class="btn btn-sm text-secondary-custom hover-danger border-0 p-1 flex-shrink-0"
          type="button"
          title="Remove item"
        >
          <i class="bi bi-trash fs-6"></i>
        </button>
      </div>
    </div>

    <!-- Free Shipping Progress Notice (No Emojis, clean icons) -->
    <div
      v-if="!cartStore.isFreeShipping"
      class="alert rounded-4 p-3 mb-4 border border-warning bg-warning bg-opacity-10 text-xs d-flex align-items-center gap-2.5 text-main shadow-sm"
    >
      <div>
        {{ $t('cart.spendMoreFor', { amount: '$' + cartStore.amountToFreeShipping.toFixed(2) }) }}
        <strong class="text-primary-custom">{{ $t('cart.freeShipping') }}</strong>
      </div>
    </div>
    <div
      v-else
      class="alert rounded-4 p-3 mb-4 border border-success bg-success bg-opacity-10 text-xs d-flex align-items-center gap-2.5 text-success fw-bold shadow-sm"
    >
      <i class="bi bi-check-circle-fill text-success fs-5 flex-shrink-0"></i>
      <span>{{ $t('cart.qualifyFreeShipping') }}</span>
    </div>

    <!-- Price Breakdown -->
    <div class="d-flex flex-column gap-2.5 mb-4 text-small">
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-secondary-custom">{{ $t('checkout.subtotal') }}</span>
        <span class="text-main fw-semibold">${{ cartStore.cartSubtotal.toFixed(2) }}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-secondary-custom d-flex align-items-center gap-1.5">
           {{ $t('checkout.shipping') }}
        </span>
        <span v-if="cartStore.isFreeShipping" class="badge bg-success rounded-pill px-2.5 py-1 text-xs fw-bold">
          {{ $t('checkout.freeShipping') }}
        </span>
        <span v-else class="text-main fw-semibold">${{ deliveryFee.toFixed(2) }}</span>
      </div>
      <hr class="border-custom my-1" />
      <div class="d-flex justify-content-between align-items-center pt-1">
        <span class="fw-bold text-main fs-5">{{ $t('checkout.total') }}</span>
        <span class="fw-extrabold text-primary-custom fs-3">${{ grandTotal.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      @click="emit('submit')"
      :disabled="loading || cartStore.items.length === 0"
      class="btn btn-primary-custom rounded-pill w-100 py-3.5 fw-bold fs-6 shadow-hover transition-all d-flex align-items-center justify-content-center gap-2"
    >
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
      <span>{{ loading ? $t('checkout.processing') : $t('checkout.placeOrder') }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "~/stores/cartStore";

const props = defineProps({
  deliveryFee: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);
const cartStore = useCartStore();

const grandTotal = computed(() => {
  return cartStore.cartSubtotal + props.deliveryFee;
});
</script>

<style scoped>
.summary-card {
  background-color: var(--color-surface);
  border-color: var(--color-border) !important;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.border-custom {
  border-color: var(--color-border) !important;
}

.text-main {
  color: var(--color-text);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.text-primary-custom {
  color: var(--color-primary);
}

.badge-count {
  background-color: var(--color-primary);
}

.bg-thumbnail {
  background-color: var(--color-bg-secondary);
}

.qty-adjuster {
  background-color: var(--color-bg-secondary);
}

.hover-primary:hover {
  color: var(--color-primary) !important;
}

.hover-danger:hover {
  color: var(--color-danger) !important;
}

.btn-primary-custom {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
}

.btn-primary-custom:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 15px rgba(3, 185, 113, 0.35);
  transform: translateY(-2px);
}

.btn-primary-custom:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-none {
  user-select: none;
}

.cart-summary-item:last-child {
  border-bottom: none !important;
}
</style>
