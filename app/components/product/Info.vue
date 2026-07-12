<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex align-items-center gap-3 mb-2">
      <span class="text-primary fw-bold text-uppercase letter-spacing-1 small">{{ product?.category }}</span>
    </div>

    <h1 class="display-5 fw-extrabold text-main mb-3">{{ product?.title }}</h1>

    <div class="d-flex align-items-end gap-3 mb-4">
      <h2 class="text-primary mb-0 fw-bold">${{ product?.price }}</h2>
      <h4 v-if="product?.oldPrice" class="text-muted-custom mb-1 text-decoration-line-through">${{ product.oldPrice }}</h4>
      <span v-if="product?.oldPrice" class="badge bg-danger-subtle text-danger mb-1 ms-2">
        Save {{ Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) }}%
      </span>
    </div>

    <p class="subtitle-text mb-4 lh-lg">
      {{ product?.description }}
    </p>

    <hr class="border-secondary opacity-25 mb-4">

    <!-- Variants Selection -->
    <div class="row g-4 mb-4">
      <!-- Colors -->
      <div class="col-sm-6" v-if="product?.colors?.length">
        <h6 class="fw-semibold text-main mb-3">Color</h6>
        <div class="d-flex gap-2">
          <div
            v-for="color in product.colors"
            :key="color"
            class="color-swatch rounded-circle cursor-pointer position-relative shadow-sm"
            :style="{ backgroundColor: color }"
            :class="{ 'active': selectedColor === color }"
            @click="$emit('update:selectedColor', color)"
          ></div>
        </div>
      </div>

      <!-- Sizes -->
      <div class="col-sm-6" v-if="product?.sizes?.length">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-semibold text-main mb-0">Size</h6>
          <a href="#" class="small text-primary text-decoration-none">Size Guide</a>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="size in product.sizes"
            :key="size"
            class="btn btn-outline-custom size-btn flex-grow-1"
            :class="{ 'active': selectedSize === size }"
            @click="$emit('update:selectedSize', size)"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- Action Area -->
    <div class="mt-auto pt-3">
      <div class="d-flex gap-3 mb-3">
        <!-- Quantity Selector -->
        <div class="quantity-selector d-flex align-items-center bg-input-wrapper rounded-pill px-3 shadow-sm" style="height: 54px;">
          <button class="btn btn-link text-main p-0 border-0" @click="quantity > 1 ? $emit('update:quantity', quantity - 1) : null">
            <i class="bi bi-dash fs-5"></i>
          </button>
          <input
            type="number"
            :value="quantity"
            @input="$emit('update:quantity', Math.max(1, parseInt($event.target.value) || 1))"
            class="form-control border-0 bg-transparent text-center fw-bold text-main"
            style="width: 50px; outline: none; box-shadow: none;"
            min="1"
          >
          <button class="btn btn-link text-main p-0 border-0" @click="$emit('update:quantity', quantity + 1)">
            <i class="bi bi-plus fs-5"></i>
          </button>
        </div>

        <!-- Add to Cart -->
        <button
          class="btn btn-primary-custom flex-grow-1 rounded-pill fw-bold shadow d-flex align-items-center justify-content-center gap-2"
          @click="$emit('add-to-cart')"
        >
          <i class="bi bi-bag-plus"></i> Add to Cart
        </button>
      </div>

      <!-- Extra info -->
      <div class="d-flex flex-wrap gap-4 text-muted-custom small justify-content-center justify-content-md-start mt-4">
        <span class="d-flex align-items-center gap-2"><i class="bi bi-truck text-primary fs-5"></i> Free Shipping worldwide</span>
        <span class="d-flex align-items-center gap-2"><i class="bi bi-arrow-return-left text-primary fs-5"></i> 30 Days Return</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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

defineEmits(['update:selectedColor', 'update:selectedSize', 'update:quantity', 'add-to-cart']);
</script>

<style scoped>
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
