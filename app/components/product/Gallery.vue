<template>
  <div class="image-gallery-container d-flex flex-column gap-3">
    <div class="main-image-wrapper rounded-4 overflow-hidden position-relative bg-light-transparent">
      <span v-if="product?.badge" class="badge custom-badge position-absolute top-0 start-0 m-3 z-2">
        {{ product.badge }}
      </span>

      <button
        class="btn btn-light rounded-circle shadow-sm position-absolute top-0 end-0 m-3 z-2 wishlist-btn-float"
        :class="{ 'text-danger': wishlistStore.isInWishlist(product?.id) }"
        @click.stop="$emit('toggle-wishlist')"
      >
        <i class="bi" :class="wishlistStore.isInWishlist(product?.id) ? 'bi-heart-fill' : 'bi-heart'"></i>
      </button>

      <NuxtImg
        :src="activeImage || product?.images?.[0] || 'https://placehold.co/600x600/png?text=Product'"
        :alt="product?.title || 'Product Image'"
        class="img-fluid w-100 main-img object-fit-contain p-4 transition-all"
        style="aspect-ratio: 1/1;"
        draggable="false"
      />
    </div>

    <!-- Thumbnails -->
    <div class="d-flex gap-3 overflow-x-auto thumbnail-scroll pb-2">
      <div
        v-for="(img, idx) in product?.images"
        :key="idx"
        class="thumbnail-wrapper rounded-3 overflow-hidden cursor-pointer bg-light-transparent flex-shrink-0"
        :class="{ 'border-primary': activeImage === img }"
        @click="$emit('update:activeImage', img)"
        style="width: 80px; height: 80px;"
      >
        <NuxtImg :src="img" class="img-fluid w-100 h-100 object-fit-cover p-2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '~/stores/wishlistStore';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  activeImage: {
    type: String,
    default: '',
  },
});

defineEmits(['update:activeImage', 'toggle-wishlist']);

const wishlistStore = useWishlistStore();
</script>

<style scoped>
.bg-light-transparent {
  background-color: color-mix(in srgb, var(--color-text) 3%, transparent);
}

.main-img {
  transition: transform 0.3s ease;
}

.main-img:hover {
  transform: scale(1.05);
}

.thumbnail-wrapper {
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail-wrapper.border-primary {
  border-color: var(--color-primary) !important;
}

.thumbnail-scroll {
  scrollbar-width: none;
}

.thumbnail-scroll::-webkit-scrollbar {
  display: none;
}

.custom-badge {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.wishlist-btn-float {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.wishlist-btn-float:hover {
  transform: translateY(-3px);
  color: var(--color-primary);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}
</style>
