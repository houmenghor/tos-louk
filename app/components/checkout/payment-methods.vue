<template>
  <div class="checkout-card p-4 p-md-5 rounded-4 border">
    <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-custom flex-wrap gap-2">
      <h4 class="fw-bold text-main mb-0 d-flex align-items-center gap-3">
        <span class="step-badge flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm">2</span>
        {{ $t('checkout.paymentMethod') }}
      </h4>
      <span class="badge bg-success-light text-success border border-success border-opacity-25 rounded-pill text-xs px-3 py-1 fw-semibold text-nowrap">
        <i class="bi bi-shield-check me-1"></i> Instant Verification
      </span>
    </div>

    <div class="row g-3">
      <!-- KHQR / Bakong Option -->
      <div class="col-12">
        <label
          class="payment-option-card card p-4 rounded-4 border cursor-pointer position-relative overflow-hidden"
          :class="paymentMethod === 'bakong' ? 'selected-card' : 'unselected-card'"
        >
          <div class="d-flex align-items-center justify-content-between w-100 gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="payment-icon-box rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" :class="paymentMethod === 'bakong' ? 'bg-primary text-white' : 'bg-surface text-secondary-custom border border-custom'">
                <i class="bi bi-qr-code-scan fs-5"></i>
              </div>
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span v-if="$t('checkout.khqrPayment') !== 'KHQR'" class="fw-bold text-main fs-6">{{ $t('checkout.khqrPayment') }}</span>
                  <span class="badge bg-danger rounded text-xs px-2 py-1">KHQR</span>
                </div>
                <p class="text-xs text-secondary-custom mb-0">{{ $t('checkout.khqrDesc') }}</p>
              </div>
            </div>
            
            <div class="custom-radio flex-shrink-0" :class="{ 'radio-active': paymentMethod === 'bakong' }">
              <i v-if="paymentMethod === 'bakong'" class="bi bi-check-lg text-white"></i>
            </div>
          </div>
          
          <input
            :checked="paymentMethod === 'bakong'"
            @change="emit('update:paymentMethod', 'bakong')"
            type="radio"
            value="bakong"
            name="payment_method"
            class="d-none"
          />
        </label>
      </div>

      <!-- Cash on Delivery Option -->
      <div class="col-12">
        <label
          class="payment-option-card card p-4 rounded-4 border cursor-pointer position-relative overflow-hidden"
          :class="paymentMethod === 'cash_on_delivery' ? 'selected-card' : 'unselected-card'"
        >
          <div class="d-flex align-items-center justify-content-between w-100 gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="payment-icon-box rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" :class="paymentMethod === 'cash_on_delivery' ? 'bg-primary text-white' : 'bg-surface text-secondary-custom border border-custom'">
                <i class="bi bi-cash-stack fs-5"></i>
              </div>
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="fw-bold text-main fs-6">{{ $t('checkout.codPayment') }}</span>
                  <span class="badge bg-success rounded-pill text-xxs px-2">COD</span>
                </div>
                <p class="text-xs text-secondary-custom mb-0">{{ $t('checkout.codDesc') }}</p>
              </div>
            </div>
            
            <div class="custom-radio flex-shrink-0" :class="{ 'radio-active': paymentMethod === 'cash_on_delivery' }">
              <i v-if="paymentMethod === 'cash_on_delivery'" class="bi bi-check-lg text-white"></i>
            </div>
          </div>
          
          <input
            :checked="paymentMethod === 'cash_on_delivery'"
            @change="emit('update:paymentMethod', 'cash_on_delivery')"
            type="radio"
            value="cash_on_delivery"
            name="payment_method"
            class="d-none"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  paymentMethod: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:paymentMethod"]);
</script>

<style scoped>
.checkout-card {
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

.step-badge {
  width: 32px;
  height: 32px;
  background-color: var(--color-primary);
  font-size: 0.9rem;
}

.payment-option-card {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--color-bg-secondary);
}

.unselected-card {
  border-color: var(--color-border) !important;
}

.unselected-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-text-secondary) !important;
  background-color: var(--color-surface);
}

.selected-card {
  border: 1.5px solid var(--color-primary) !important;
  background-color: var(--color-primary-light) !important;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.payment-icon-box {
  width: 48px;
  height: 48px;
  transition: all 0.25s ease;
}

.bg-surface {
  background-color: var(--color-surface);
}

.custom-radio {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  background-color: var(--color-surface);
}

.custom-radio.radio-active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}

.custom-radio i {
  font-size: 1rem;
  line-height: 1;
}

.bg-success-light {
  background-color: rgba(34, 197, 94, 0.1);
}

.text-xxs {
  font-size: 0.72rem;
}
</style>
