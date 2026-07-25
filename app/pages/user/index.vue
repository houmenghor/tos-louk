<template>
  <div class="user-dashboard-page py-5 min-vh-100 bg-body-custom">
    <div class="container max-w-container">
      <div class="row mb-4">
        <div class="col-12 d-flex align-items-center gap-3">
          <h1 class="fw-bold text-main mb-0 fs-3">{{ t('dashboard.myDashboard', 'My Dashboard') }}</h1>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: Profile & Menu List -->
        <UserDashboardSidebar v-model:activeTab="activeTab" />

        <!-- Right Column: Dynamic Content Panel -->
        <div class="col-lg-8">
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeTab === 'overview'" key="overview">
              <UserDashboardOverview
                :recent-order="recentOrder"
                :order-status="orderStatus"
                :orders-count="orderData?.paginate?.total ?? ordersList.length"
                @switch-tab="(tab) => activeTab = tab"
              />
            </div>

            <div v-else-if="activeTab === 'orders'" key="orders">
              <UserDashboardOrders
                :orders-list="ordersList"
                :order-status="orderStatus"
              />
            </div>

            <div v-else-if="activeTab === 'personal'" key="personal" class="d-flex flex-column gap-4">
              <ProfileAvatarUploader />
              <ProfileDetailsForm />
            </div>

            <div v-else-if="activeTab === 'security'" key="security">
              <ProfileSecurityTab />
            </div>

            <div v-else-if="activeTab === 'appearance'" key="appearance">
              <UserDashboardAppearance />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import ProfileAvatarUploader from "~/components/profile/profile-avatar-uploader.vue";
import ProfileDetailsForm from "~/components/profile/profile-details-form.vue";
import ProfileSecurityTab from "~/components/profile/profile-security-tab.vue";

import UserDashboardSidebar from "~/components/user/dashboard-sidebar.vue";
import UserDashboardOverview from "~/components/user/dashboard-overview.vue";
import UserDashboardOrders from "~/components/user/dashboard-orders.vue";
import UserDashboardAppearance from "~/components/user/dashboard-appearance.vue";

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

useHead({
  title: computed(() => `${t('dashboard.myDashboard', 'My Dashboard')} | Tos Louk`),
  meta: [
    {
      name: "description",
      content: "Manage your account, view order history, update personal details, change security passwords, and customize themes and languages.",
    },
  ],
});

const route = useRoute();
const activeTab = ref(route.query.tab || 'overview');

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) {
      activeTab.value = newTab;
    }
  }
);

const { data: orderData, status: orderStatus, refresh: refreshOrders } = useLazyFetch("/api/orders", {
  query: { per_page: 10 },
  watch: [() => authStore.access_token]
});

const ordersList = computed(() => {
  if (!orderData.value) return [];
  if (Array.isArray(orderData.value)) return orderData.value;
  return orderData.value.data || [];
});

const recentOrder = computed(() => {
  const orders = ordersList.value;
  return orders[0] || null;
});

// Fetch user dynamic statistics on load
onMounted(async () => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();
    refreshOrders();
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

.bg-warning-light { background-color: rgba(245, 159, 0, 0.15) !important; }
.bg-success-light { background-color: rgba(40, 167, 69, 0.15) !important; }
.bg-info-light { background-color: rgba(23, 162, 184, 0.15) !important; }
.bg-danger-light { background-color: rgba(220, 53, 69, 0.15) !important; }
.bg-secondary-light { background-color: var(--color-bg-secondary) !important; }
</style>
