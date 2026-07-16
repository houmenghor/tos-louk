<template>
  <div
    class="discount-card h-100 position-relative overflow-hidden"
    :class="layout === 'list' ? 'd-flex flex-sm-row flex-column h-auto' : ''"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Deal/Discount Badge -->
    <div v-if="(product.badge && product.badge !== 'Best Seller') || (product.oldPrice && product.price < product.oldPrice)" class="deal-badge position-absolute z-2">
      <span class="deal-badge-pill" v-if="product.badge && product.badge !== 'Best Seller'">
        {{ product.badge }}
      </span>
      <span class="deal-badge-pill" v-else-if="product.oldPrice && product.price < product.oldPrice">
        -{{ Math.round((1 - product.price / product.oldPrice) * 100) }}%
      </span>
    </div>

    <!-- Wishlist Button -->
    <button
      class="wishlist-btn position-absolute z-2"
      :class="{ wishlisted: isWishlisted }"
      @click.stop="toggleWishlist"
      :aria-label="`Add ${product.title} to wishlist`"
      :title="isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
    >
      <i
        class="bi"
        :class="isWishlisted ? 'bi-heart-fill' : 'bi-heart'"
      ></i>
    </button>

    <!-- Quick View Button -->
    <NuxtLink :prefetch="false"
      :to="generateProductUrl(product)"
      class="quick-view-btn position-absolute z-2"
      :aria-label="`Quick view ${product.title}`"
      title="View Details"
    >
      <i class="bi bi-eye"></i>
    </NuxtLink>

    <!-- Product Image -->
    <NuxtLink :prefetch="false"
      :to="generateProductUrl(product)"
      class="image-area text-decoration-none d-block"
      :class="layout === 'list' ? 'image-container-list flex-shrink-0' : ''"
      :aria-label="`View image of ${product.title}`"
    >
      <NuxtImg
        :src="product.thumbnail || product.images?.[0]?.image_url || product.image || 'https://placehold.co/400x400/png?text=Product'"
        :alt="product.title"
        class="product-img"
        :class="{ 'img-zoomed': hovered }"
        loading="lazy"
        decoding="async"
        width="300"
        height="300"
        format="webp"
        quality="80"
      />
      <!-- Hover overlay CTA (Grid mode only) -->
      <div v-if="layout !== 'list'" class="img-overlay" :class="{ 'overlay-visible': hovered && !isSoldOut }">
        <button class="overlay-cart-btn" @click.prevent.stop="handleAddToCart" :disabled="isSoldOut">
          Quick Add
        </button>
      </div>
    </NuxtLink>

    <!-- Card Content -->
    <div class="card-content">
      <!-- Category tag -->
      <span v-if="product.category" class="category-tag">{{
        product.category
      }}</span>

      <!-- Title & Description Group -->
      <div class="title-desc-group">
        <NuxtLink :prefetch="false" :to="generateProductUrl(product)" class="text-decoration-none">
          <h3 class="product-title fs-6" :class="layout === 'list' ? 'list-title' : ''">{{ product.title }}</h3>
        </NuxtLink>
        <p class="product-desc" :class="layout === 'list' ? 'list-desc' : ''">
          {{ product.description || product.desc || 'Discover our latest premium collection featuring high-quality materials and modern design.' }}
        </p>
      </div>

      <!-- Footer Section (Price & Actions aligned to bottom) -->
      <div class="card-footer-section mt-auto">
        <!-- Price Row -->
        <div class="price-row">
          <span class="price-now">${{ product.price }}</span>
          <del v-if="product.oldPrice" class="price-was"
            >${{ product.oldPrice }}</del
          >
          <span v-if="savings && layout !== 'list'" class="save-chip">-${{ savings }}</span>
        </div>

        <!-- Actions -->
        <div class="action-row pt-2" :class="layout === 'list' ? 'd-flex align-items-center gap-3' : ''">
          <BaseButton
            variants="primary"
            size="md"
            class="flex-grow-1"
            :disabled="isSoldOut"
            @click="handleAddToCart"
          >
            {{ isSoldOut ? $t('product.soldOut') : $t('product.addToCart') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWishlistStore } from '~/stores/wishlistStore';
import { useAuthStore } from '~/stores/authStore';
import { useAppToast } from '~/composables/ui/useAppToast';
import { useCartStore } from '~/stores/cartStore';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  product: { type: Object, required: true },
  layout: { type: String, default: 'grid' }
});
const emit = defineEmits(['add-to-cart']);

const hovered = ref(false);
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const { showWarning, showSuccess, showError } = useAppToast();
const { locale } = useI18n();

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.product.id));

const itemsLeft = computed(() => {
  if (props.product.stock !== undefined && props.product.stock !== null) {
    return Number(props.product.stock);
  }
  return 20; // Default fallback
});

const isSoldOut = computed(() => {
  return itemsLeft.value <= 0;
});

const savings = computed(() => {
  if (props.product.oldPrice && props.product.price) {
    const s = (props.product.oldPrice - props.product.price).toFixed(0);
    return s > 0 ? s : null;
  }
  return null;
});

const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product);
};

const handleAddToCart = () => {
  if (isSoldOut.value) return;
  cartStore.addToCart(props.product);
};
</script>

<style scoped>
/* ── Card Shell ── */
.discount-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

.discount-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 220, 130, 0.4);
  box-shadow:
    0 20px 40px -12px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 220, 130, 0.1);
}

/* ── Deal Badge ── */
.deal-badge {
  top: 14px;
  left: 14px;
}
.deal-badge-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 220, 130, 0.35);
}

/* ── Wishlist Button ── */
.wishlist-btn {
  top: 14px;
  right: 14px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}
.wishlist-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.1);
}
.wishlist-btn.wishlisted {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* ── Quick View Button ── */
.quick-view-btn {
  top: 64px;
  right: 14px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
  text-decoration: none;
}
.quick-view-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.1);
}

/* ── Image Area ── */
.image-area {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: var(--color-bg-secondary);
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-container-list {
  width: 220px;
  height: auto;
  min-height: 200px;
  border-radius: 20px 0 0 20px;
}
@media (max-width: 576px) {
  .image-container-list {
    width: 100%;
    height: 200px;
    border-radius: 20px 20px 0 0;
  }
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.img-zoomed {
  transform: scale(1.07);
}

/* Hover overlay */
.img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 15, 30, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.overlay-visible {
  opacity: 1;
}
.overlay-cart-btn {
  padding: 9px 22px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  border: none;
  cursor: pointer;
  transform: translateY(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  backdrop-filter: blur(8px);
}
.overlay-visible .overlay-cart-btn {
  transform: translateY(0);
}
.overlay-cart-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

/* ── Card Content ── */
.card-content {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 10px;
}

/* Category tag */
.category-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-primary);
  background: rgba(0, 220, 130, 0.1);
  border: 1px solid rgba(0, 220, 130, 0.2);
  padding: 3px 9px;
  border-radius: 999px;
  align-self: flex-start;
}

/* Title */
/* Title & Description Group */
.title-desc-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Card Footer Section (anchored to bottom) */
.card-footer-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Title */
.product-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin: 0;
  transition: color 0.2s ease;
}
.product-title:hover {
  color: var(--color-primary);
}
.list-title {
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

/* Description */
.product-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
  margin: 0;
}
.list-desc {
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

/* Price */
.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.price-now {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-primary);
}
.price-was {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: line-through;
}
.save-chip {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  background: rgba(0, 220, 130, 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(0, 220, 130, 0.2);
  padding: 3px 8px;
  border-radius: 999px;
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

/* Actions */
.action-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: auto;
}
</style>
