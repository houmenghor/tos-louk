<template>
  <div class="user-dashboard-page py-5 min-vh-100 bg-body-custom">
    <div class="container max-w-container">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="fw-bold text-main mb-0">{{ t('dashboard.myDashboard') || 'My Dashboard' }}</h2>
          <p class="text-muted-custom mt-1">{{ t('dashboard.subtitle') }}</p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: User Profile Summary -->
        <div class="col-lg-4">
          <div class="profile-card p-4 rounded-4 shadow-sm text-center">
            <div class="avatar-wrapper mx-auto mb-3 position-relative d-flex justify-content-center">
              <BaseAvatar
                :src="authStore.userProfile?.profile_image || authStore.userProfile?.userProfile?.profile_image"
                :name="authStore.userProfile?.full_name || 'Member'"
                :size="100"
                border-class="border border-3 border-surface shadow-sm"
              />
            </div>
            
            <h4 class="fw-bold text-main mb-1">
              {{ authStore.userProfile?.full_name || t('dashboard.member') }}
            </h4>
            <p class="text-secondary-custom small mb-3">
              {{ authStore.userProfile?.email || '' }}
            </p>
            
            <span class="badge rounded-pill bg-primary-light text-primary mb-4 px-3 py-2 fw-medium text-xs">
              {{ t('dashboard.memberSince') }} {{ memberSinceDate }}
            </span>

            <div class="d-flex flex-column gap-2 mt-2">
              <NuxtLink to="/profile" class="btn btn-primary w-100 rounded-pill py-2">
                <i class="bi bi-person-gear me-2"></i> {{ t('dashboard.editProfile') }}
              </NuxtLink>
              <NuxtLink to="/categories" class="btn border border-custom w-100 rounded-pill py-2 action-hover" style="color: var(--color-text);">
                <i class="bi bi-shop me-2"></i> {{ t('dashboard.shopCatalog') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Right Column: Metrics and Order Tracking -->
        <div class="col-lg-8">
          
          <!-- Metrics Row -->
          <div class="row g-4 mb-4">
            <div class="col-sm-6">
              <NuxtLink to="/user/wishlist" class="text-decoration-none">
                <div class="metric-card p-4 rounded-4 shadow-sm h-100 d-flex align-items-center">
                  <div class="bg-primary-light text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 54px; height: 54px;">
                    <i class="bi bi-heart-fill fs-5"></i>
                  </div>
                  <div class="ms-3 flex-grow-1">
                    <p class="text-muted-custom text-xs fw-bold text-uppercase mb-1">{{ t('dashboard.myWishlist') }}</p>
                    <h4 class="fw-bold text-main mb-0 text-capitalize">{{ t('dashboard.items', wishlistStore.wishlistCount, { count: wishlistStore.wishlistCount }) }}</h4>
                  </div>
                  <i class="bi bi-chevron-right text-muted-custom opacity-50"></i>
                </div>
              </NuxtLink>
            </div>

            <div class="col-sm-6">
              <div @click="cartStore.toggleCart(true)" class="metric-card p-4 rounded-4 shadow-sm h-100 d-flex align-items-center cursor-pointer">
                <div class="bg-primary-light text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 54px; height: 54px;">
                  <i class="bi bi-cart-fill fs-5"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted-custom text-xs fw-bold text-uppercase mb-1">{{ t('dashboard.activeCart') }}</p>
                  <h4 class="fw-bold text-main mb-0 text-capitalize">{{ t('dashboard.items', cartStore.cartCount, { count: cartStore.cartCount }) }}</h4>
                </div>
                <i class="bi bi-chevron-right text-muted-custom opacity-50"></i>
              </div>
            </div>
          </div>

          <!-- Order Status Tracker -->
          <div v-if="orderStatus === 'pending'" class="tracker-card p-4 rounded-4 shadow-sm placeholder-glow">
            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
              <div class="d-flex align-items-center gap-2">
                <div class="placeholder rounded-circle" style="width: 28px; height: 28px;"></div>
                <div class="d-flex flex-column gap-1">
                  <h5 class="placeholder col-12 mb-0" style="width: 150px;"></h5>
                  <div class="placeholder col-8 mt-1" style="width: 100px;"></div>
                </div>
              </div>
              <span class="placeholder col-2 rounded-pill px-4 py-2" style="width: 80px;"></span>
            </div>
            <div class="timeline-wrapper ps-2 mt-4">
              <div class="timeline-step mb-4 position-relative">
                <div class="timeline-circle bg-surface border border-2 border-custom d-flex align-items-center justify-content-center shadow-sm placeholder"></div>
                <div class="timeline-content ms-4">
                  <h6 class="placeholder col-6 mb-1"></h6>
                  <p class="placeholder col-8 mb-0"></p>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="recentOrder" class="tracker-card p-4 rounded-4 shadow-sm">
            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-truck text-primary fs-4"></i>
                <div>
                  <h5 class="fw-bold text-main mb-0">{{ t('dashboard.recentOrder') }}</h5>
                  <div class="text-secondary-custom text-xs mt-1">{{ recentOrder.order_no || recentOrder.uuid?.split('-')[0].toUpperCase() }} • {{ new Date(recentOrder.created_at).toLocaleDateString() }}</div>
                </div>
              </div>
              <span class="badge rounded-pill bg-primary-light text-primary px-3 py-1.5 fw-bold text-xs text-uppercase">
                {{ recentOrder.status }}
              </span>
            </div>

            <div class="timeline-wrapper ps-2 mt-4">
              <!-- Step 1: Placed -->
              <div class="timeline-step active-step mb-4 position-relative" :class="{ 'last-active': recentOrder.status === 'pending' || recentOrder.status === 'processing' }">
                <div class="timeline-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                  <i class="bi bi-check2"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-main text-sm mb-1">{{ t('dashboard.step1Title') }}</h6>
                  <p class="text-secondary-custom text-xs mb-0">{{ t('dashboard.step1Desc') }}</p>
                </div>
              </div>

              <!-- Step 2: Shipped -->
              <div class="timeline-step position-relative mb-4" :class="{ 'active-step': recentOrder.status === 'shipped' || recentOrder.status === 'delivered', 'last-active': recentOrder.status === 'shipped' }">
                <div class="timeline-circle d-flex align-items-center justify-content-center shadow-sm" :class="recentOrder.status === 'shipped' || recentOrder.status === 'delivered' ? 'bg-primary text-white' : 'border border-2 border-custom bg-surface text-muted'">
                  <i v-if="recentOrder.status === 'shipped' || recentOrder.status === 'delivered'" class="bi bi-check2"></i>
                  <i v-else class="bi bi-circle"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-sm mb-1" :class="recentOrder.status === 'shipped' || recentOrder.status === 'delivered' ? 'text-main' : 'text-secondary-custom'">{{ t('dashboard.step2Title') }}</h6>
                  <p class="text-xs mb-0" :class="recentOrder.status === 'shipped' || recentOrder.status === 'delivered' ? 'text-secondary-custom' : 'text-muted-custom'">{{ t('dashboard.step2Desc') }}</p>
                </div>
              </div>

              <!-- Step 3: Delivered -->
              <div class="timeline-step position-relative" :class="{ 'active-step': recentOrder.status === 'delivered' }">
                <div class="timeline-circle d-flex align-items-center justify-content-center shadow-sm" :class="recentOrder.status === 'delivered' ? 'bg-primary text-white' : 'border border-2 border-custom bg-surface text-muted'">
                  <i v-if="recentOrder.status === 'delivered'" class="bi bi-check2"></i>
                  <i v-else class="bi bi-circle"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-sm mb-1" :class="recentOrder.status === 'delivered' ? 'text-main' : 'text-secondary-custom'">{{ t('dashboard.step3Title') }}</h6>
                  <p class="text-xs mb-0" :class="recentOrder.status === 'delivered' ? 'text-secondary-custom' : 'text-muted-custom'">{{ t('dashboard.step3Desc') }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="tracker-card p-4 rounded-4 shadow-sm text-center py-5">
            <i class="bi bi-box-seam text-muted-custom fs-2 mb-3 d-block"></i>
            <h6 class="fw-bold text-main mb-1">No Recent Orders</h6>
            <p class="text-secondary-custom text-xs mb-0">When you place an order, its status will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useWishlistStore } from "~/stores/wishlistStore";
import { useCartStore } from "~/stores/cartStore";

// Page Settings (Protected by Global Auth Middleware)
definePageMeta({
  layout: "default",
});

const authStore = useAuthStore();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { t, locale } = useI18n();

const { data: orderData, status: orderStatus } = useLazyAsyncData("recent-order", () =>
  $fetch("/api/orders", { query: { per_page: 1 } })
);

const recentOrder = computed(() => {
  const data = orderData.value?.data;
  if (Array.isArray(data)) return data[0] || null;
  if (data?.data && Array.isArray(data.data)) return data.data[0] || null;
  return null;
});

// Fetch user dynamic statistics on load
onMounted(async () => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();
  }
});

// Member since calculation formatted nicely
const memberSinceDate = computed(() => {
  if (!authStore.userProfile?.created_at) return locale.value === "kh" ? "កក្កដា ២០២៦" : "July 2026";
  const date = new Date(authStore.userProfile.created_at);
  return date.toLocaleDateString(locale.value === "kh" ? "km-KH" : "en-US", {
    year: "numeric",
    month: "long",
  });
});
</script>

<style scoped>
.user-dashboard-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main);
}

.max-w-container {
  max-width: 1040px;
}

.profile-card,
.metric-card,
.tracker-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
}

.metric-card {
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary) !important;
}

.action-hover {
  transition: all 0.3s ease;
  background-color: transparent;
}
.action-hover:hover {
  background-color: var(--color-bg-secondary);
}

.cursor-pointer {
  cursor: pointer;
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.timeline-step {
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

.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.bg-primary-light { background-color: var(--color-primary-light); }
.text-secondary-custom { color: var(--color-text-secondary); }
.text-muted-custom { color: var(--color-text-secondary); opacity: 0.8; }

</style>
