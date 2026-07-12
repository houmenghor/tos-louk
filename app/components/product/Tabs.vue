<template>
  <div class="glass-card-clean rounded-4 p-4 shadow-sm mb-5">
    <ul class="nav nav-pills custom-tabs mb-4 gap-2" id="productTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab">Description</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="specs-tab" data-bs-toggle="tab" data-bs-target="#specs" type="button" role="tab">Specifications</button>
      </li>
    </ul>
    <div class="tab-content text-main lh-lg" id="productTabsContent">
      <div class="tab-pane fade show active" id="desc" role="tabpanel">
        <p v-if="product?.description">{{ product.description }}</p>
        <p v-else>Experience the perfect blend of style, comfort, and durability with our premium product. Meticulously crafted from high-quality materials, this item is designed to exceed your expectations and integrate seamlessly into your daily routine. The sleek, modern design makes it an ideal choice for any occasion, ensuring you always look and feel your best.</p>
      </div>
      <div class="tab-pane fade" id="specs" role="tabpanel">
        <div class="row">
          <div class="col-md-6">
            <ul class="list-group list-group-flush bg-transparent">
              <li class="list-group-item bg-transparent text-main d-flex justify-content-between border-secondary-subtle">
                <span class="fw-semibold">Material</span>
                <span>100% Premium Cotton</span>
              </li>
              <li class="list-group-item bg-transparent text-main d-flex justify-content-between border-secondary-subtle">
                <span class="fw-semibold">Weight</span>
                <span>450g</span>
              </li>
              <li class="list-group-item bg-transparent text-main d-flex justify-content-between border-secondary-subtle">
                <span class="fw-semibold">Dimensions</span>
                <span>15 x 20 x 5 cm</span>
              </li>
            </ul>
          </div>
        </div>
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
});
</script>

<style scoped>
.text-main {
  color: var(--color-text);
}

.glass-card-clean {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.dark .glass-card-clean {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, #ffffff 10%, transparent);
}

.custom-tabs .nav-link {
  color: var(--color-text-secondary);
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.custom-tabs .nav-link:hover {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.custom-tabs .nav-link.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
</style>
