<template>
  <div>
    <h5 class="fw-bold text-main mb-4 text-sm">{{ t('dashboard.orderHistory', 'Order History') }}</h5>
    
    <div v-if="orderStatus === 'pending'" class="d-flex flex-column gap-3">
      <div v-for="n in 3" :key="n" class="settings-card p-4 rounded-4 placeholder-glow">
        <div class="placeholder col-6 mb-2"></div>
        <div class="placeholder col-4"></div>
      </div>
    </div>
    
    <div v-else-if="ordersList && ordersList.length > 0" class="d-flex flex-column gap-3">
      <div v-for="order in ordersList" :key="order.id" class="settings-card p-4 rounded-4">
        <div class="d-flex justify-content-between align-items-start border-bottom border-custom-glass pb-3 mb-3 flex-wrap gap-2">
          <div>
            <div class="fw-bold text-main text-sm">{{ order.order_no || order.uuid.split('-')[0].toUpperCase() }}</div>
            <div class="text-secondary-custom text-xs mt-1">Placed on {{ new Date(order.created_at).toLocaleDateString() }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge rounded-pill text-xs px-2.5 py-1 text-uppercase" :class="getStatusBadgeClass(order.status)">
              {{ order.status }}
            </span>
            <span class="badge rounded-pill text-xs px-2.5 py-1 text-uppercase" :class="getPaymentStatusBadgeClass(order.payment_status)">
              {{ order.payment_status }}
            </span>
          </div>
        </div>
        
        <!-- Items summary -->
        <div class="d-flex flex-column gap-2 mb-3">
          <div v-for="item in order.items" :key="item.id" class="d-flex align-items-center justify-content-between gap-3">
            <div class="d-flex align-items-center gap-3">
              <NuxtImg :src="item.product?.image || 'https://placehold.co/100x100'" class="rounded-3 object-fit-cover" style="width: 44px; height: 44px;" alt="Product" />
              <div>
                <div class="fw-semibold text-main text-xs text-truncate" style="max-width: 250px;">{{ item.product?.title || 'Product' }}</div>
                <div class="text-secondary-custom text-[11px] mt-0.5">Qty: {{ item.quantity }}</div>
              </div>
            </div>
            <div class="fw-bold text-main text-xs">${{ Number(item.price).toFixed(2) }}</div>
          </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center border-top border-custom-glass pt-3 flex-wrap gap-2">
          <div class="text-secondary-custom text-xs">
            Total: <span class="fw-bold text-main text-sm ms-1">${{ Number(order.grand_total).toFixed(2) }}</span>
          </div>
          <NuxtLink v-if="order.payment_status === 'pending'" :to="`/checkout?order_no=${order.order_no}&uuid=${order.uuid}`" class="btn btn-primary-custom btn-xs rounded-pill px-3 py-1.5 fw-semibold text-xs text-white">
            {{ t('dashboard.payNow', 'Pay Now') }}
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <div v-else class="settings-card p-4 rounded-4 text-center py-5">
      <i class="bi bi-bag text-muted-custom fs-2 mb-3 d-block"></i>
      <h6 class="fw-bold text-main mb-1">No Orders Found</h6>
      <p class="text-secondary-custom text-xs mb-4">You haven't placed any orders yet.</p>
      <NuxtLink to="/categories" class="text-decoration-none">
        <BaseButton variants="outline-primary" class="rounded-pill px-4 py-2 mt-2">
          {{ t('dashboard.startShopping', 'Start Shopping') }}
        </BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "~/components/base/base-button.vue";

const props = defineProps({
  ordersList: {
    type: Array,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-warning-light text-warning';
    case 'confirmed':
    case 'processing': return 'bg-info-light text-info';
    case 'completed': return 'bg-success-light text-success';
    case 'cancelled':
    case 'failed': return 'bg-danger-light text-danger';
    default: return 'bg-secondary-light text-secondary';
  }
};

const getPaymentStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-warning-light text-warning';
    case 'paid': return 'bg-success-light text-success';
    case 'expired':
    case 'failed': return 'bg-danger-light text-danger';
    default: return 'bg-secondary-light text-secondary';
  }
};
</script>

<style scoped>
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-secondary-custom { color: var(--color-text-secondary) !important; }
.text-muted-custom { color: var(--color-text-secondary); opacity: 0.8; }

.bg-warning-light { background-color: rgba(245, 159, 0, 0.15) !important; }
.bg-success-light { background-color: rgba(40, 167, 69, 0.15) !important; }
.bg-info-light { background-color: rgba(23, 162, 184, 0.15) !important; }
.bg-danger-light { background-color: rgba(220, 53, 69, 0.15) !important; }
.bg-secondary-light { background-color: var(--color-bg-secondary) !important; }
</style>
