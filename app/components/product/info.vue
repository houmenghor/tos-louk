<template>
  <div class="d-flex flex-column h-100 p-4 p-md-5 border rounded-4 shadow-sm info-wrapper">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <NuxtLink :prefetch="false" to="/categories"
        class="badge rounded-pill border text-primary bg-primary-subtle text-decoration-none px-3 py-2 fw-medium">{{
          product?.category || $t('product.categoryDefault') }}</NuxtLink>
      <span v-if="product?.stock !== undefined && product?.stock !== null" class="fw-semibold small d-flex align-items-center gap-2"
        :class="`text-${stockStatus.color}`">
        <span class="rounded-circle flex-shrink-0" style="width: 8px; height: 8px;" :class="`bg-${stockStatus.color}`"></span>
        <span>{{ stockStatus.text }}</span>
      </span>
    </div>

    <h2 class="display-6 fw-bold text-main mb-4" style="line-height: 1.2;">{{ product?.title }}</h2>

    <div class="rounded-3 p-3 mb-4 d-flex align-items-center gap-3 price-box">
      <h2 class="text-main mb-0 fw-bold">${{ product?.price }}</h2>
      <h5 v-if="product?.oldPrice" class="text-muted-custom mb-0 text-decoration-line-through">${{ product.oldPrice }}</h5>
      <span v-if="product?.oldPrice" class="badge bg-success-subtle text-success rounded-pill px-3 py-2 fw-medium">
        {{ $t('product.save', { amount: (product.oldPrice - product.price).toFixed(2) }) }}
      </span>
    </div>

    <!-- Variants Selection -->
    <div class="row g-4 mb-4">
      <!-- Colors -->
      <div class="col-sm-6" v-if="product?.colors?.length">
        <h6 class="fw-semibold text-main mb-3">{{ $t('product.color') }}</h6>
        <div class="d-flex gap-2">
          <div v-for="color in product.colors" :key="color"
            class="color-swatch rounded-circle cursor-pointer position-relative shadow-sm"
            :style="{ backgroundColor: color }" :class="{ 'active': selectedColor === color }"
            @click="$emit('update:selectedColor', color)"></div>
        </div>
      </div>

      <!-- Sizes -->
      <div class="col-sm-6" v-if="product?.sizes?.length">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-semibold text-main mb-0">{{ $t('product.size') }}</h6>
          <a href="#" class="small text-primary text-decoration-none">{{ $t('product.sizeGuide') }}</a>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button v-for="size in product.sizes" :key="size" class="btn btn-outline-custom size-btn flex-grow-1"
            :class="{ 'active': selectedSize === size }" @click="$emit('update:selectedSize', size)">
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- Action Area -->
    <div class="mt-4">
      <div class="d-flex gap-3 mb-3">
        <!-- Quantity Selector -->
        <div class="quantity-selector d-flex align-items-center border rounded-3 px-2 bg-input-wrapper" style="height: 48px;">
          <button class="btn btn-link text-main p-0 border-0" style="width: 24px;"
            @click="quantity > 1 ? $emit('update:quantity', quantity - 1) : null">
            <i class="bi bi-dash"></i>
          </button>
          <input type="number" :value="quantity"
            @input="$emit('update:quantity', Math.max(1, parseInt($event.target.value) || 1))"
            class="form-control border-0 bg-transparent text-center fw-bold text-main p-0"
            style="width: 40px; outline: none; box-shadow: none;" min="1">
          <button class="btn btn-link text-main p-0 border-0" style="width: 24px;"
            @click="$emit('update:quantity', quantity + 1)">
            <i class="bi bi-plus"></i>
          </button>
        </div>

        <!-- Add to Cart -->
        <button
          class="btn btn-primary-custom flex-grow-1 rounded-3 fw-medium d-flex align-items-center justify-content-center gap-2 shadow-none"
          :disabled="isSoldOut" @click="!isSoldOut && $emit('add-to-cart')" style="height: 48px;">
          <i class="bi bi-bag" v-if="!isSoldOut"></i> {{ isSoldOut ? $t('product.soldOut') : $t('product.addToCart') }}
        </button>

        <!-- Wishlist Button -->
        <button
          class="btn border rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 text-muted-custom"
          style="width: 48px; height: 48px; background: transparent;" @click="$emit('toggle-wishlist')" title="Wishlist">
          <i class="bi" :class="wishlistStore.isInWishlist(product?.id) ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
        </button>

        <!-- Share Button -->
        <button class="btn border rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 text-muted-custom"
          style="width: 48px; height: 48px; background: transparent;" @click="copyLink" title="Copy Link">
          <i class="bi bi-share"></i>
        </button>
      </div>

      <!-- Extra info Grid -->
      <div class="border rounded-3">
        <div class="p-3 py-3 d-flex align-items-center justify-content-center gap-2 fw-medium text-main text-center">
          <i class="bi bi-truck text-primary fs-5"></i> {{ $t('product.freeShippingOver', { amount: freeShippingThreshold }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppToast } from '~/composables/ui/useAppToast';
import { useI18n } from 'vue-i18n';
import { useSettingStore } from '~/stores/settingStore';
import { useWishlistStore } from '~/stores/wishlistStore';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  selectedColor: {
    type: String,
    default: '',
  },
  selectedSize: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

defineEmits(['update:selectedColor', 'update:selectedSize', 'update:quantity', 'add-to-cart', 'toggle-wishlist']);

const settingStore = useSettingStore();
const wishlistStore = useWishlistStore();
const freeShippingThreshold = computed(() => settingStore.settings?.shipping?.free_shipping_threshold || '40.00');

const isSoldOut = computed(() => {
  if (!props.product) return false;
  const stock = props.product.stock !== undefined && props.product.stock !== null ? Number(props.product.stock) : 20;
  return stock <= 0;
});

const stockStatus = computed(() => {
  if (!props.product) return { text: 'Unknown', color: 'secondary' };
  const stock = props.product.stock !== undefined && props.product.stock !== null ? Number(props.product.stock) : 20;
  const warning = props.product.stockWarning !== undefined && props.product.stockWarning !== null
    ? Number(props.product.stockWarning)
    : (props.product.stock_warning !== undefined && props.product.stock_warning !== null ? Number(props.product.stock_warning) : 10);
  
  if (stock <= 0) {
    return { text: 'Sold Out', color: 'danger' };
  } else if (stock <= warning) {
    return { text: `Only ${stock} left in stock`, color: 'warning' };
  } else {
    return { text: 'In Stock', color: 'success' };
  }
});

const { showSuccess, showError } = useAppToast();
const { t } = useI18n();

const copyLink = async () => {
  try {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    showSuccess(t('product.copySuccess'));
  } catch (err) {
    showError(t('product.copyError'));
    console.error('Failed to copy: ', err);
  }
};
</script>

<style scoped>
.info-wrapper {
  background-color: var(--color-surface);
}

.price-box {
  background-color: var(--color-bg);
}

.border {
  border-color: var(--color-border) !important;
}

.text-main {
  color: var(--color-text);
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

.color-swatch {
  width: 32px;
  height: 32px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.color-swatch::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.color-swatch.active::after {
  border-color: var(--color-primary);
}

.btn-outline-custom {
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: transparent;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-outline-custom:hover,
.btn-outline-custom.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.bg-input-wrapper {
  background-color: color-mix(in srgb, var(--color-text) 4%, transparent);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-primary-custom {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--color-primary) 30%, transparent) !important;
}
</style>
