<template>
  <div class="user-dashboard-page py-5 min-vh-100 bg-body-custom">
    <div class="container max-w-container">
      
      <!-- Welcome Hero Section -->
      <div class="welcome-hero p-4 p-md-5 rounded-4 border mb-5 position-relative overflow-hidden shadow-sm">
        <div class="glow-bubble-1"></div>
        <div class="glow-bubble-2"></div>
        <div class="row align-items-center g-4 position-relative z-1">
          <div class="col-sm-auto">
            <div class="avatar-wrapper position-relative">
              <img 
                :src="profileImageSrc" 
                class="rounded-circle object-fit-cover border border-3 border-surface shadow" 
                width="88" 
                height="88" 
                alt="Avatar"
                referrerpolicy="no-referrer"
                @error="handleAvatarError"
              />
            </div>
          </div>
          <div class="col-sm text-center text-sm-start">
            <span class="badge rounded-pill bg-primary-light text-primary mb-2 px-3 py-1.5 fw-bold text-uppercase text-xxs">
              Active Member
            </span>
            <h1 class="h2 fw-extrabold text-main mb-1">
              Welcome back, {{ authStore.userProfile?.full_name || 'Member' }}!
            </h1>
            <p class="text-secondary-custom text-sm mb-0">
              Manage your preferences, track deliveries, and check active community items.
            </p>
          </div>
          <div class="col-md-auto text-center text-md-end">
            <div class="text-muted text-xxs uppercase-text fw-semibold">Member since</div>
            <div class="fw-extrabold text-main text-sm mt-0.5">{{ memberSinceDate }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Tracker -->
      <div class="row g-4 mb-5">
        <!-- Wishlist Metric Card -->
        <div class="col-md-4">
          <div class="metric-card p-4 rounded-4 border shadow-sm transition-all d-flex align-items-center justify-content-between">
            <div>
              <div class="text-secondary-custom text-xxs fw-bold text-uppercase mb-1">My Wishlist</div>
              <h3 class="fw-extrabold text-main mb-1">{{ wishlistStore.wishlistCount }} items</h3>
              <NuxtLink to="/wishlist" class="text-primary text-xs fw-semibold text-decoration-none">
                View wishlist <i class="bi bi-arrow-right-short"></i>
              </NuxtLink>
            </div>
            <div class="metric-icon-badge bg-primary-light text-primary rounded-4 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
              <i class="bi bi-heart fs-4"></i>
            </div>
          </div>
        </div>

        <!-- Cart Metric Card -->
        <div class="col-md-4">
          <div class="metric-card p-4 rounded-4 border shadow-sm transition-all d-flex align-items-center justify-content-between">
            <div>
              <div class="text-secondary-custom text-xxs fw-bold text-uppercase mb-1">Active Cart</div>
              <h3 class="fw-extrabold text-main mb-1">{{ cartStore.cartCount }} items</h3>
              <button @click="cartStore.toggleCart(true)" class="btn p-0 text-primary text-xs fw-semibold text-decoration-none border-0 bg-transparent text-start">
                Open cart <i class="bi bi-arrow-right-short"></i>
              </button>
            </div>
            <div class="metric-icon-badge bg-primary-light text-primary rounded-4 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
              <i class="bi bi-cart3 fs-4"></i>
            </div>
          </div>
        </div>

        <!-- Cart Value Metric Card -->
        <div class="col-md-4">
          <div class="metric-card p-4 rounded-4 border shadow-sm transition-all d-flex align-items-center justify-content-between">
            <div>
              <div class="text-secondary-custom text-xxs fw-bold text-uppercase mb-1">Total Subtotal</div>
              <h3 class="fw-extrabold text-primary-custom mb-1">${{ cartStore.cartSubtotal.toFixed(2) }}</h3>
              <span class="text-secondary-custom text-xs">
                {{ cartStore.cartSubtotal >= 30 ? 'Free Shipping Active!' : `$${(30 - cartStore.cartSubtotal).toFixed(2)} to free shipping` }}
              </span>
            </div>
            <div class="metric-icon-badge bg-primary-light text-primary rounded-4 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px;">
              <i class="bi bi-currency-dollar fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <!-- Left: Quick Navigation Cards -->
        <div class="col-lg-6">
          <div class="d-flex align-items-center gap-2 mb-4">
            <i class="bi bi-compass text-primary fs-4"></i>
            <h3 class="fw-extrabold text-main mb-0 text-sm">Quick Actions</h3>
          </div>
          
          <div class="d-flex flex-column gap-3">
            <!-- Edit Settings Link -->
            <NuxtLink to="/profile" class="action-card p-3.5 rounded-4 border shadow-sm d-flex align-items-center gap-3 text-decoration-none transition-all">
              <div class="action-icon bg-body-custom rounded-3 d-flex align-items-center justify-content-center border" style="width: 44px; height: 44px;">
                <i class="bi bi-person-gear text-primary fs-5"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold text-main mb-0.5 text-sm">Edit Profile settings</h6>
                <p class="text-secondary-custom text-xs mb-0">Update personal details, address, and login password.</p>
              </div>
              <i class="bi bi-chevron-right text-muted-custom"></i>
            </NuxtLink>

            <!-- Browse Catalog Link -->
            <NuxtLink to="/categories" class="action-card p-3.5 rounded-4 border shadow-sm d-flex align-items-center gap-3 text-decoration-none transition-all">
              <div class="action-icon bg-body-custom rounded-3 d-flex align-items-center justify-content-center border" style="width: 44px; height: 44px;">
                <i class="bi bi-grid-3x3-gap text-primary fs-5"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold text-main mb-0.5 text-sm">Shop Catalog Categories</h6>
                <p class="text-secondary-custom text-xs mb-0">Browse modern items, toggle filters, and discover essentials.</p>
              </div>
              <i class="bi bi-chevron-right text-muted-custom"></i>
            </NuxtLink>

            <!-- Deals Link -->
            <NuxtLink to="/discount" class="action-card p-3.5 rounded-4 border shadow-sm d-flex align-items-center gap-3 text-decoration-none transition-all">
              <div class="action-icon bg-body-custom rounded-3 d-flex align-items-center justify-content-center border" style="width: 44px; height: 44px;">
                <i class="bi bi-lightning-charge text-primary fs-5"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold text-main mb-0.5 text-sm">Active Deals & Flash Sales</h6>
                <p class="text-secondary-custom text-xs mb-0">View discounted items and free shipping qualifying deals.</p>
              </div>
              <i class="bi bi-chevron-right text-muted-custom"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Right: Recent Order Delivery Progress -->
        <div class="col-lg-6">
          <div class="d-flex align-items-center gap-2 mb-4">
            <i class="bi bi-truck text-primary fs-4"></i>
            <h3 class="fw-extrabold text-main mb-0 text-sm">Recent Order Status</h3>
          </div>

          <div class="settings-card p-4 rounded-4 border shadow-sm position-relative">
            <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-custom-glass pb-3">
              <div>
                <div class="fw-extrabold text-main text-sm">ORD-98231</div>
                <div class="text-secondary-custom text-xxs mt-0.5">Placed on July 1, 2026</div>
              </div>
              <span class="badge rounded-pill bg-primary-light text-primary px-3 py-1.5 fw-bold text-xxs uppercase-text">
                SHIPPED
              </span>
            </div>

            <!-- Vertical Timeline Tracker -->
            <div class="timeline-wrapper ps-2">
              
              <!-- Step 1: Placed -->
              <div class="timeline-step active-step mb-4 position-relative">
                <div class="timeline-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                  <i class="bi bi-check2"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-main text-xs mb-0.5">Order Placed & Confirmed</h6>
                  <p class="text-secondary-custom text-xxs mb-0">Payment successful. Invoice dispatched.</p>
                </div>
              </div>

              <!-- Step 2: Shipped -->
              <div class="timeline-step active-step mb-4 position-relative">
                <div class="timeline-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                  <i class="bi bi-check2"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-main text-xs mb-0.5">Shipped from Warehouse</h6>
                  <p class="text-secondary-custom text-xxs mb-0">Dispatched via Fast Express. Tracking: #FE9812A.</p>
                </div>
              </div>

              <!-- Step 3: Delivered -->
              <div class="timeline-step pending-step position-relative">
                <div class="timeline-circle border border-2 border-custom bg-surface d-flex align-items-center justify-content-center">
                  <i class="bi bi-circle text-muted"></i>
                </div>
                <div class="timeline-content ms-4">
                  <h6 class="fw-bold text-secondary-custom text-xs mb-0.5">Out for Delivery & Received</h6>
                  <p class="text-muted-custom text-xxs mb-0">Expected delivery: July 12, 2026.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/authStore';
import { useWishlistStore } from '~/stores/wishlistStore';
import { useCartStore } from '~/stores/cartStore';

// Page Settings (Protected by Global Auth Middleware)
definePageMeta({
  layout: 'default'
});

const authStore = useAuthStore();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { locale } = useI18n();

// Fetch user dynamic statistics on load
onMounted(async () => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();
  }
});

// Member since calculation formatted nicely
const memberSinceDate = computed(() => {
  if (!authStore.userProfile?.created_at) return 'July 2026';
  const date = new Date(authStore.userProfile.created_at);
  return date.toLocaleDateString(locale.value === 'kh' ? 'km-KH' : 'en-US', {
    year: 'numeric',
    month: 'long'
  });
});

const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a1a1aa"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-1-5.48-2.58C7.64 15.84 10 15 12 15s4.36.84 5.48 2.42C16.43 19 14.03 20 12 20z"/></svg>';

// Avatar Source Computed
const profileImageSrc = computed(() => {
  const avatar = authStore.userProfile?.userProfile?.profile_image || authStore.userProfile?.profile_image;
  if (!avatar) return defaultAvatar;
  
  if (avatar.startsWith('http')) return avatar;
  return `${useRuntimeConfig().public.apiBase.replace('/api/v1', '')}/storage/${avatar}`;
});

const handleAvatarError = (event) => {
  event.target.src = defaultAvatar;
};
</script>

<style scoped>
.user-dashboard-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main);
}

.bg-body-custom {
  background-color: var(--color-bg);
}

/* --------------------------------------------------------------------------
   Container Limit
-------------------------------------------------------------------------- */
.max-w-container {
  max-width: 1040px;
}

/* --------------------------------------------------------------------------
   Welcome Hero Banner Layout
-------------------------------------------------------------------------- */
.welcome-hero {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
}

.glow-bubble-1 {
  position: absolute;
  top: -60px;
  left: -60px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%);
  opacity: 0.45;
  pointer-events: none;
}

.glow-bubble-2 {
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%);
  opacity: 0.35;
  pointer-events: none;
}

/* --------------------------------------------------------------------------
   Metric Widgets
-------------------------------------------------------------------------- */
.metric-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary) !important;
  box-shadow: var(--shadow-md) !important;
}

/* --------------------------------------------------------------------------
   Quick Action Cards
-------------------------------------------------------------------------- */
.action-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  color: var(--color-text);
}

.action-card:hover {
  border-color: var(--color-primary) !important;
  transform: translateX(4px);
}

.action-icon {
  border-color: var(--color-border) !important;
  background-color: var(--color-bg-secondary);
}

.action-card:hover .action-icon {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary) !important;
}

/* --------------------------------------------------------------------------
   Delivery Timeline Tracker
-------------------------------------------------------------------------- */
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.timeline-step {
  padding-left: 20px;
}

/* Connecting line */
.timeline-step::before {
  content: '';
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

.timeline-circle.bg-surface {
  background-color: var(--color-surface);
}

.border-custom {
  border-color: var(--color-border) !important;
}

/* Active states for timeline nodes */
.active-step::before {
  background-color: var(--color-primary);
}

/* --------------------------------------------------------------------------
   Utility typography classes
-------------------------------------------------------------------------- */
.text-xxs {
  font-size: 10px;
}

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 14px;
}

.bg-primary-light {
  background-color: var(--color-primary-light);
}

.bg-secondary-light {
  background-color: rgba(107, 114, 128, 0.05);
  border: 1px solid var(--color-border);
}

.text-primary-custom {
  color: var(--color-primary);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.text-muted-custom {
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.uppercase-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>