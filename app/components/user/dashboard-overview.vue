<template>
  <div>
    <!-- 3 Stat Boxes (Matching Figma concept) -->
    <div class="row g-3 mb-4">
      <div class="col-4">
        <NuxtLink to="/user/wishlist" class="text-decoration-none">
          <div class="settings-card p-3 p-md-4 rounded-4 text-center stat-hover h-100 d-flex flex-column justify-content-center">
            <h3 class="fw-bold text-primary mb-1">{{ wishlistStore.wishlistCount }}</h3>
            <p class="text-secondary-custom text-xs mb-0">Wishlist</p>
          </div>
        </NuxtLink>
      </div>
      <div class="col-4">
        <div @click="cartStore.toggleCart(true)" class="settings-card p-3 p-md-4 rounded-4 text-center stat-hover cursor-pointer h-100 d-flex flex-column justify-content-center">
          <h3 class="fw-bold text-primary mb-1">{{ cartStore.cartCount }}</h3>
          <p class="text-secondary-custom text-xs mb-0">Active Cart</p>
        </div>
      </div>
      <div class="col-4">
        <div @click="emit('switch-tab', 'orders')" class="settings-card p-3 p-md-4 rounded-4 text-center stat-hover cursor-pointer h-100 d-flex flex-column justify-content-center">
          <h3 class="fw-bold text-primary mb-1">{{ orderStatus === 'pending' ? '-' : ordersCount }}</h3>
          <p class="text-secondary-custom text-xs mb-0">Orders</p>
        </div>
      </div>
    </div>

    <!-- Order Status Tracker -->
    <h6 class="fw-bold text-main mb-3 text-sm px-1">Recent Order Tracking</h6>
    <div v-if="orderStatus === 'pending'" class="settings-card p-4 rounded-4 placeholder-glow">
      <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="placeholder rounded-circle" style="width: 28px; height: 28px;"></div>
          <div class="d-flex flex-column gap-1">
            <div class="placeholder col-12 mb-0" style="width: 150px;"></div>
            <div class="placeholder col-8 mt-1" style="width: 100px;"></div>
          </div>
        </div>
        <div class="placeholder col-2 rounded-pill px-4 py-2" style="width: 80px;"></div>
      </div>
      <div class="timeline-wrapper ps-2 mt-4">
        <div class="timeline-step mb-4 position-relative">
          <div class="timeline-circle bg-surface border border-2 border-custom d-flex align-items-center justify-content-center shadow-sm placeholder"></div>
          <div class="timeline-content ms-4">
            <div class="placeholder col-6 mb-1"></div>
            <div class="placeholder col-8 mb-0"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="recentOrder" class="settings-card p-4 rounded-4">
      <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-truck text-primary fs-4"></i>
          <div>
            <h5 class="fw-bold text-main mb-0 text-sm">{{ t('dashboard.recentOrder', 'Recent Order Status') }}</h5>
            <div class="text-secondary-custom text-xs mt-1">
              {{ recentOrder.order_no || recentOrder.uuid?.split('-')[0].toUpperCase() }} • {{ new Date(recentOrder.created_at).toLocaleDateString() }}
            </div>
          </div>
        </div>
        <span class="badge rounded-pill bg-primary-light text-primary px-3 py-1.5 fw-bold text-xs text-uppercase">
          {{ recentOrder.status }}
        </span>
      </div>

      <div class="timeline-wrapper ps-2 mt-4">
        <!-- Step 1: Placed -->
        <div class="timeline-step active-step mb-4 position-relative" :class="{ 'last-active': recentOrder.status === 'pending' }">
          <div class="timeline-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
            <i class="bi bi-check2"></i>
          </div>
          <div class="timeline-content ms-4">
            <h6 class="fw-bold text-main text-sm mb-1">{{ t('dashboard.step1Title', 'Order Placed') }}</h6>
            <p class="text-secondary-custom text-xs mb-0">{{ t('dashboard.step1Desc', 'We have received your order.') }}</p>
          </div>
        </div>

        <!-- Step 2: Confirmed -->
        <div class="timeline-step position-relative mb-4" :class="{ 'active-step': recentOrder.status === 'confirmed' || recentOrder.status === 'completed', 'last-active': recentOrder.status === 'confirmed' }">
          <div class="timeline-circle d-flex align-items-center justify-content-center shadow-sm" :class="recentOrder.status === 'confirmed' || recentOrder.status === 'completed' ? 'bg-primary text-white' : 'border border-2 border-custom bg-surface text-muted'">
            <i v-if="recentOrder.status === 'confirmed' || recentOrder.status === 'completed'" class="bi bi-check2"></i>
            <i v-else class="bi bi-circle"></i>
          </div>
          <div class="timeline-content ms-4">
            <h6 class="fw-bold text-sm mb-1" :class="recentOrder.status === 'confirmed' || recentOrder.status === 'completed' ? 'text-main' : 'text-secondary-custom'">{{ t('dashboard.step2Title', 'Confirmed') }}</h6>
            <p class="text-xs mb-0" :class="recentOrder.status === 'confirmed' || recentOrder.status === 'completed' ? 'text-secondary-custom' : 'text-muted-custom'">{{ t('dashboard.step2Desc', 'Order payment and details are verified.') }}</p>
          </div>
        </div>

        <!-- Step 3: Completed -->
        <div class="timeline-step position-relative" :class="{ 'active-step': recentOrder.status === 'completed' }">
          <div class="timeline-circle d-flex align-items-center justify-content-center shadow-sm" :class="recentOrder.status === 'completed' ? 'bg-primary text-white' : 'border border-2 border-custom bg-surface text-muted'">
            <i v-if="recentOrder.status === 'completed'" class="bi bi-check2"></i>
            <i v-else class="bi bi-circle"></i>
          </div>
          <div class="timeline-content ms-4">
            <h6 class="fw-bold text-sm mb-1" :class="recentOrder.status === 'completed' ? 'text-main' : 'text-secondary-custom'">{{ t('dashboard.step3Title', 'Completed') }}</h6>
            <p class="text-xs mb-0" :class="recentOrder.status === 'completed' ? 'text-secondary-custom' : 'text-muted-custom'">{{ t('dashboard.step3Desc', 'Order has been successfully delivered.') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="settings-card p-4 rounded-4 text-center py-5">
      <i class="bi bi-box-seam text-muted-custom fs-2 mb-3 d-block"></i>
      <h6 class="fw-bold text-main mb-1">No Recent Orders</h6>
      <p class="text-secondary-custom text-xs mb-4">When you place an order, its status will appear here.</p>
      <NuxtLink to="/categories" class="text-decoration-none">
        <BaseButton variants="outline-primary" class="rounded-pill px-4 py-2 mt-2">
          {{ t('dashboard.startShopping', 'Start Shopping') }}
        </BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from "~/stores/wishlistStore";
import { useCartStore } from "~/stores/cartStore";
import BaseButton from "~/components/base/base-button.vue";

const props = defineProps({
  recentOrder: {
    type: Object,
    default: null,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  ordersCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["switch-tab"]);

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { t } = useI18n();
</script>

<style scoped>
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.stat-hover {
  transition: all 0.2s ease;
}

.stat-hover:hover {
  border-color: var(--color-primary) !important;
  transform: translateY(-2px);
}

.cursor-pointer {
  cursor: pointer;
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.bg-primary-light { background-color: var(--color-primary-light); }
.text-secondary-custom { color: var(--color-text-secondary) !important; }
.text-muted-custom { color: var(--color-text-secondary); opacity: 0.8; }

/* Timeline styling rules */
.timeline-step {
  position: relative;
  padding-left: 20px;
}

.timeline-step::before {
  content: "";
  position: absolute;
  left: 11px;
  top: 24px;
  width: 2px;
  height: calc(100% + 16px);
  background-color: var(--color-border);
  z-index: 1;
}

.timeline-step:last-child::before {
  display: none;
}

.timeline-circle {
  position: absolute;
  left: -2px;
  top: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  z-index: 2;
  font-size: 14px;
}

.active-step::before {
  background-color: var(--color-primary);
}

.active-step.last-active::before {
  background-color: var(--color-border);
}
</style>
