<template>
  <div class="user-dashboard-page py-5 min-vh-100 bg-body-custom">
    <div class="container max-w-container">
      <div class="row mb-4">
        <div class="col-12 d-flex align-items-center gap-3">
          <h2 class="fw-bold text-main mb-0">{{ t('dashboard.myDashboard', 'My Dashboard') }}</h2>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: Profile & Menu List -->
        <div class="col-lg-4">
          <!-- User Profile Card -->
          <div class="settings-card p-4 rounded-4 mb-4 d-flex align-items-center gap-3">
            <BaseAvatar
              :src="authStore.userProfile?.profile_image || authStore.userProfile?.userProfile?.profile_image"
              :name="authStore.userProfile?.full_name || 'Member'"
              :size="56"
              border-class="border border-2 border-surface shadow-sm"
            />
            <div class="overflow-hidden">
              <h5 class="fw-bold text-main mb-1 text-sm text-truncate">
                {{ authStore.userProfile?.full_name || t('dashboard.member') }}
              </h5>
              <p class="text-secondary-custom text-xs mb-0 text-truncate">
                {{ authStore.userProfile?.email || '' }}
              </p>
            </div>
          </div>

          <!-- Settings & Navigation List -->
          <div class="settings-card rounded-4 overflow-hidden mb-4 mb-lg-0">
             <div @click="activeTab = 'overview'" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-custom-glass" :class="{ 'bg-secondary-light': activeTab === 'overview' }">
                <div class="d-flex align-items-center gap-3">
                   <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
                     <i class="bi bi-grid text-secondary-custom"></i>
                   </div>
                   <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'overview' }">Overview</span>
                </div>
                <i class="bi bi-chevron-right text-muted-custom"></i>
             </div>

             <div @click="activeTab = 'personal'" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-custom-glass" :class="{ 'bg-secondary-light': activeTab === 'personal' }">
                <div class="d-flex align-items-center gap-3">
                   <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
                     <i class="bi bi-person text-secondary-custom"></i>
                   </div>
                   <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'personal' }">Personal Info</span>
                </div>
                <i class="bi bi-chevron-right text-muted-custom"></i>
             </div>

             <div @click="activeTab = 'security'" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer" :class="{ 'bg-secondary-light': activeTab === 'security' }">
                <div class="d-flex align-items-center gap-3">
                   <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
                     <i class="bi bi-shield-lock text-secondary-custom"></i>
                   </div>
                   <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'security' }">Security & Password</span>
                </div>
                <i class="bi bi-chevron-right text-muted-custom"></i>
             </div>
          </div>
        </div>

        <!-- Right Column: Dynamic Content Panel -->
        <div class="col-lg-8">
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeTab === 'overview'" key="overview">
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
                <div class="settings-card p-3 p-md-4 rounded-4 text-center stat-hover h-100 d-flex flex-column justify-content-center">
                   <h3 class="fw-bold text-primary mb-1">{{ orderStatus === 'pending' ? '-' : (recentOrder ? '1' : '0') }}</h3>
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

          <div v-else-if="recentOrder" class="settings-card p-4 rounded-4">
            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-truck text-primary fs-4"></i>
                <div>
                  <h5 class="fw-bold text-main mb-0 text-sm">{{ t('dashboard.recentOrder', 'Recent Order') }}</h5>
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
                  <h6 class="fw-bold text-main text-sm mb-1">{{ t('dashboard.step1Title', 'Order Placed') }}</h6>
                  <p class="text-secondary-custom text-xs mb-0">{{ t('dashboard.step1Desc', 'We have received your order.') }}</p>
                </div>
              </div>

              <!-- Step 2: Shipped -->
              <div class="timeline-step position-relative mb-4" :class="{ 'active-step': recentOrder.status === 'shipped' || recentOrder.status === 'delivered', 'last-active': recentOrder.status === 'shipped' }">
                <div class="timeline-circle d-flex align-items-center justify-content-center shadow-sm" :class="recentOrder.status === 'shipped' || recentOrder.status === 'delivered' ? 'bg-primary text-white' : 'border border-2 border-custom bg-surface text-muted'">
                  <i v-if="recentOrder.status === 'shipped' || recentOrder.status === 'delivered'" class="bi bi-check2"></i>
                  <i v-else class="bi bi-circle"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-sm mb-1" :class="recentOrder.status === 'shipped' || recentOrder.status === 'delivered' ? 'text-main' : 'text-secondary-custom'">{{ t('dashboard.step2Title', 'Shipped') }}</h6>
                  <p class="text-xs mb-0" :class="recentOrder.status === 'shipped' || recentOrder.status === 'delivered' ? 'text-secondary-custom' : 'text-muted-custom'">{{ t('dashboard.step2Desc', 'Your item is on the way.') }}</p>
                </div>
              </div>

              <!-- Step 3: Delivered -->
              <div class="timeline-step position-relative" :class="{ 'active-step': recentOrder.status === 'delivered' }">
                <div class="timeline-circle d-flex align-items-center justify-content-center shadow-sm" :class="recentOrder.status === 'delivered' ? 'bg-primary text-white' : 'border border-2 border-custom bg-surface text-muted'">
                  <i v-if="recentOrder.status === 'delivered'" class="bi bi-check2"></i>
                  <i v-else class="bi bi-circle"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-sm mb-1" :class="recentOrder.status === 'delivered' ? 'text-main' : 'text-secondary-custom'">{{ t('dashboard.step3Title', 'Delivered') }}</h6>
                  <p class="text-xs mb-0" :class="recentOrder.status === 'delivered' ? 'text-secondary-custom' : 'text-muted-custom'">{{ t('dashboard.step3Desc', 'Order has been delivered.') }}</p>
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

            <div v-else-if="activeTab === 'personal'" key="personal" class="d-flex flex-column gap-4">
              <ProfileAvatarUploader />
              <ProfileDetailsForm />
            </div>

            <div v-else-if="activeTab === 'security'" key="security">
              <ProfileSecurityTab />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import BaseAvatar from "~/components/base/base-avatar.vue";
import BaseButton from "~/components/base/base-button.vue";
import ProfileAvatarUploader from "~/components/profile/profile-avatar-uploader.vue";
import ProfileDetailsForm from "~/components/profile/profile-details-form.vue";
import ProfileSecurityTab from "~/components/profile/profile-security-tab.vue";

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

const activeTab = ref('overview');

const { data: orderData, status: orderStatus } = useLazyFetch("/api/orders", {
  query: { per_page: 1 },
  key: "recent-order",
  getCachedData: (key, nuxtApp) => {
    // Only use cache during initial hydration to prevent stale data on client navigation
    return nuxtApp.isHydrating ? nuxtApp.payload.data[key] : null;
  }
});

const recentOrder = computed(() => {
  if (!orderData.value) return null;
  
  if (Array.isArray(orderData.value)) return orderData.value[0] || null;
  
  const data = orderData.value.data;
  if (Array.isArray(data)) return data[0] || null;
  
  if (data && Array.isArray(data.data)) return data.data[0] || null;
  
  return null;
});

// Fetch user dynamic statistics on load
onMounted(async () => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();
  }
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

.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.nav-list-item {
  background-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  color: var(--color-text);
}

.nav-list-item:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

.nav-list-item i {
  transition: all 0.2s ease;
}

.icon-box {
  width: 36px;
  height: 36px;
}

.bg-secondary-light {
  background-color: var(--color-bg-secondary);
}


.stat-hover {
  transition: all 0.2s ease;
}

.stat-hover:hover {
  border-color: var(--color-primary) !important;
  transform: translateY(-2px);
}

.custom-select-box {
  outline: none;
  box-shadow: none !important;
  cursor: pointer;
}

.custom-option {
  background-color: var(--color-surface);
  color: var(--color-text);
}

.text-primary-brand {
  color: var(--color-primary) !important;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
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

.cursor-pointer {
  cursor: pointer;
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.action-hover {
  transition: all 0.3s ease;
  background-color: transparent;
}
.action-hover:hover {
  background-color: var(--color-bg-secondary);
}

.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.bg-primary-light { background-color: var(--color-primary-light); }
.text-secondary-custom { color: var(--color-text-secondary) !important; }
.text-muted-custom { color: var(--color-text-secondary); opacity: 0.8; }

</style>
