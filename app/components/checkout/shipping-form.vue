<template>
  <div class="checkout-card p-4 p-md-5 rounded-4 border mb-4">
    <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-custom">
      <h4 class="fw-bold text-main mb-0 d-flex align-items-center gap-3">
        <span class="step-badge rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm">1</span>
        {{ $t('checkout.shippingInfo') }}
      </h4>
      <span class="secure-badge rounded-pill px-3 py-1 text-xs d-flex align-items-center gap-1.5 fw-semibold">
         Secure Encrypted
      </span>
    </div>

    <div class="row g-4">
      <!-- Full Name -->
      <div class="col-md-6">
        <BaseInput
          :model-value="form.customer_name"
          @update:modelValue="updateField('customer_name', $event)"
          @blur="touchedFields.customer_name = true"
          :label="$t('checkout.fullName')"
          placeholder="John Doe"
          left-icon="bi bi-person"
          :error="showFieldErr('customer_name') ? errors.customer_name : ''"
          required
        />
      </div>

      <!-- Email Address -->
      <div class="col-md-6">
        <BaseInput
          :model-value="form.customer_email"
          @update:modelValue="updateField('customer_email', $event)"
          @blur="touchedFields.customer_email = true"
          type="email"
          :label="$t('checkout.email')"
          placeholder="example@gmail.com"
          left-icon="bi bi-envelope"
          :error="showFieldErr('customer_email') ? errors.customer_email : ''"
          required
        />
      </div>

      <!-- Phone Number -->
      <div class="col-md-6">
        <BaseInput
          :model-value="form.customer_phone"
          @update:modelValue="updateField('customer_phone', $event)"
          @blur="touchedFields.customer_phone = true"
          type="tel"
          :label="$t('checkout.phone')"
          placeholder="012 345 678"
          left-icon="bi bi-telephone"
          :error="showFieldErr('customer_phone') ? errors.customer_phone : ''"
          required
        />
      </div>

      <!-- Province / City Dropdown (CAMBODIA_PROVINCES) -->
      <div class="col-md-6">
        <BaseSelectOption
          :model-value="form.shipping_province"
          @update:modelValue="onProvinceChange"
          @blur="touchedFields.shipping_province = true"
          :options="CAMBODIA_PROVINCES.map(prov => ({ value: prov.province_en, label: locale === 'kh' ? prov.province_kh : prov.province_en }))"
          :label="$t('checkout.province')"
          required
          placeholder="Select Province / City"
          left-icon="bi bi-geo-alt"
          :error="showFieldErr('shipping_province') ? errors.shipping_province : ''"
          class="mb-0 custom-checkout-select"
          searchable
        />

        <!-- Location verification warning note on mismatch -->
        <div v-if="form.shipping_latitude && form.shipping_longitude && !isLocationMismatch" class="text-success text-xxs fw-semibold d-flex align-items-center gap-1 mt-2">
          {{ $t('checkout.locVerified') }}
        </div>
        <div v-if="isLocationMismatch" class="alert alert-warning py-2 px-3 mt-2 rounded-3 text-xxs d-flex align-items-start gap-2 mb-0">
          <i class="bi bi-exclamation-triangle-fill text-warning mt-0.5"></i>
          <span v-if="form.shipping_province === 'Phnom Penh'">
            {{ $t('checkout.locWarningOutsidePP') }}
          </span>
          <span v-else>
            {{ $t('checkout.locWarningInsidePP') }}
          </span>
        </div>
      </div>

      <!-- Street Address -->
      <div class="col-12">
        <BaseInput
          :model-value="form.shipping_street"
          @update:modelValue="updateField('shipping_street', $event)"
          @blur="touchedFields.shipping_street = true"
          :label="$t('checkout.streetAddress')"
          :placeholder="$t('checkout.streetPlaceholder') || 'House number, street name, Sangkat, Khan...'"
          left-icon="bi bi-house-door"
          :error="showFieldErr('shipping_street') ? errors.shipping_street : ''"
          required
        />
      </div>

      <!-- Delivery Method -->
      <div class="col-12" v-if="form.payment_method !== 'cash_on_delivery'">
        <BaseSelectOption
          :model-value="form.delivery_method"
          @update:modelValue="updateField('delivery_method', $event)"
          @blur="touchedFields.delivery_method = true"
          :options="[
            { value: 'j_and_t', label: 'J&T Express' },
            { value: 'vireak_buntham', label: 'Vireak Buntham' }
          ]"
          :label="$t('checkout.deliveryMethod')"
          required
          :placeholder="$t('checkout.selectDeliveryMethod')"
          left-icon="bi bi-truck"
          :error="showFieldErr('delivery_method') ? errors.delivery_method : ''"
          class="mb-0 custom-checkout-select"
        />
      </div>

      <!-- Order Notes -->
      <div class="col-12">
        <BaseInput
          :model-value="form.notes"
          @update:modelValue="updateField('notes', $event)"
          type="textarea"
          rows="3"
          :label="$t('checkout.orderNotes')"
          :placeholder="$t('checkout.notesPlaceholder') || 'Any special instructions for delivery rider...'"
          left-icon="bi bi-journal-text"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { CAMBODIA_PROVINCES } from "~/utils/provinces";

const { locale } = useI18n();

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  submitCount: {
    type: Number,
    default: 0,
  },
  meta: {
    type: Object,
    default: () => ({ touched: {} }),
  },
});

const touchedFields = reactive({});

const showFieldErr = (field) => {
  return props.errors[field] && (props.submitCount > 0 || touchedFields[field]);
};

const emit = defineEmits(["updateField"]);

const updateField = (field, value) => {
  emit("updateField", field, value);
  if (props.meta && props.meta.touched) {
    props.meta.touched[field] = true;
  }
};

const onProvinceChange = (value) => {
  updateField("shipping_province", value);
};

// Check whether GPS coordinates indicate location mismatch with claimed province
const isLocationMismatch = computed(() => {
  const lat = Number(props.form.shipping_latitude);
  const lon = Number(props.form.shipping_longitude);
  if (!lat || !lon) return false;

  // Approximate bounding box for Phnom Penh area (lat 11.42 to 11.68, lon 104.80 to 104.98)
  const isInsideBoundingBox = lat >= 11.42 && lat <= 11.68 && lon >= 104.80 && lon <= 104.98;
  
  if (props.form.shipping_province === "Phnom Penh") {
    return !isInsideBoundingBox; // Mismatch if they select PP but are outside
  } else {
    // They selected a provincial area
    return isInsideBoundingBox; // Mismatch if they select provincial but are inside PP
  }
});
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

.step-badge {
  width: 32px;
  height: 32px;
  background-color: var(--color-primary);
  font-size: 0.9rem;
}

.secure-badge {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.form-label {
  color: var(--color-text-secondary);
}



.text-xxs {
  font-size: 0.73rem;
}

/* BaseSelectOption Overrides for Checkout Form */
:deep(.custom-checkout-select .custom-select-trigger) {
  background-color: var(--color-bg-secondary) !important;
  border-color: var(--color-border) !important;
  min-height: 45px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

:deep(.custom-checkout-select .custom-select-trigger.active),
:deep(.custom-checkout-select .custom-select-trigger:focus) {
  background-color: var(--color-surface) !important;
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px var(--color-primary-light) !important;
}
</style>
