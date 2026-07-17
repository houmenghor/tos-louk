<template>
  <div class="product-detail-page position-relative pb-5">
    <!-- Animated Background Blobs -->
    <div class="blobs-wrapper">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
    </div>

    <!-- Top Padding for Fixed Header -->
    <div class="pt-4"></div>

    <div class="container position-relative z-1 mb-5 mt-2">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h2 class="h3 fw-bold text-main mb-0">{{ $t('product.details') }}</h2>
        <!-- Breadcrumbs -->
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item">
              <NuxtLink to="/" class="text-decoration-none text-muted-custom hover-primary">{{ $t('product.home') }}
              </NuxtLink>
            </li>
            <li class="breadcrumb-item">
              <NuxtLink to="/categories" class="text-decoration-none text-muted-custom hover-primary">
                <span class="capitalize-text">{{ product?.category || $t('product.categoryDefault') }}</span>
              </NuxtLink>
            </li>
            <li class="breadcrumb-item active text-main fw-semibold" aria-current="page">
              {{ product.title }}
            </li>
          </ol>
        </nav>
      </div>

      <!-- Main Product Section Skeleton Loader -->
      <SkeletonProductDetail v-if="isLoading" />

      <!-- Main Product Section -->
      <div v-else class="glass-card-clean rounded-5 p-4 p-md-5 mb-5 shadow-sm">
        <div class="row g-5">
          <!-- Left Column: Image Gallery -->
          <div class="col-lg-6">
            <ProductGallery :product="product" v-model:activeImage="activeImage" @toggle-wishlist="toggleWishlist" />
          </div>

          <!-- Right Column: Product Details -->
          <div class="col-lg-6 d-flex flex-column">
            <ProductInfo :product="product" v-model:selectedColor="selectedColor" v-model:selectedSize="selectedSize"
              v-model:quantity="quantity" @add-to-cart="handleAddToCart" @toggle-wishlist="toggleWishlist" />
          </div>
        </div>
      </div>

      <!-- Details Tabs Section -->
      <ProductTabs :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cartStore';
import { useWishlistStore } from '~/stores/wishlistStore';
import { useProductStore } from '~/stores/productStore';
import { useAppToast } from '~/composables/ui/useAppToast';
import { useAuthStore } from '~/stores/authStore';

const route = useRoute();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const productStore = useProductStore();
const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();
const { t, locale } = useI18n();

const { currentProduct } = storeToRefs(productStore);

const activeImage = ref('');
const selectedColor = ref('#0f172a');
const selectedSize = ref('M');
const quantity = ref(1);

const { data: productResponse, pending, error } = useAsyncData(`product-${route.params.slug}`, async () => {
  if (route.params.slug) {
    return await productStore.getProductByUuid(route.params.slug);
  }
  return null;
}, {
  lazy: true,
  watch: [() => route.params.slug]
});

const isLoading = computed(() => pending.value && !currentProduct.value);

// Keep the store's currentProduct synchronized with the asyncData response during hydration / after fetch
watch(() => productResponse.value, (newVal) => {
  if (newVal?.data) {
    currentProduct.value = newVal.data;
  }
}, { immediate: true });

// Reset local and store states when navigating to a different product URL
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    if (!currentProduct.value || (currentProduct.value.uuid !== newSlug && currentProduct.value.slug !== newSlug)) {
      activeImage.value = '';
      selectedColor.value = '#0f172a';
      selectedSize.value = 'M';
      quantity.value = 1;
      currentProduct.value = null;
    }
  }
}, { immediate: true });

watch(() => currentProduct.value, (newP) => {
  if (newP && !activeImage.value) {
    activeImage.value = (newP.images && newP.images.length > 0) ? newP.images[0].image_url : (newP.thumbnail || 'https://placehold.co/600x600/png?text=Product');
  }
}, { immediate: true });

const product = computed(() => {
  const p = currentProduct.value;
  if (!p) {
    return {
      id: null,
      uuid: route.params.slug,
      title: error.value ? t('product.notFound', 'Product not found') : t('product.loading'),
      description: error.value ? t('product.notFoundDesc', 'The product you are looking for does not exist.') : t('product.loadingDesc'),
      price: 0,
      oldPrice: null,
      badge: "",
      category: "PREMIUM",
      images: ['https://placehold.co/600x600/png?text=Loading...'],
      colors: [],
      sizes: []
    };
  }

  const extractedColors = [];
  const extractedSizes = [];

  if (p.variants && Array.isArray(p.variants)) {
    p.variants.forEach((v) => {
      if (v.attributes && Array.isArray(v.attributes)) {
        v.attributes.forEach((attr) => {
          const nameLower = (attr.name || "").toLowerCase();
          if (nameLower === "color" || nameLower === "colour") {
            if (attr.value && !extractedColors.includes(attr.value)) {
              extractedColors.push(attr.value);
            }
          } else if (nameLower === "size") {
            if (attr.value && !extractedSizes.includes(attr.value)) {
              extractedSizes.push(attr.value);
            }
          }
        });
      }
    });
  }

  const basePrice = Number(p.sell_price !== undefined ? p.sell_price : (p.unit_price || 0));
  const unitPrice = Number(p.unit_price || 0);

  let finalPrice = basePrice;
  let oldPrice = unitPrice > basePrice ? unitPrice : null;
  let badge = '';

  if (p.discount && p.discount.value) {
    const discountValue = Number(p.discount.value);
    const discountType = p.discount.type; // 'percent' or 'fixed'

    oldPrice = oldPrice || basePrice;

    if (discountType === 'percent') {
      finalPrice = Math.max(0, basePrice - (basePrice * (discountValue / 100)));
      badge = `-${discountValue}%`;
    } else {
      finalPrice = Math.max(0, basePrice - discountValue);
      badge = `-$${discountValue}`;
    }
  } else if (oldPrice) {
    badge = 'Sale';
  }

  finalPrice = Number(finalPrice.toFixed(2));
  if (oldPrice !== null) {
    oldPrice = Number(oldPrice.toFixed(2));
    if (oldPrice <= finalPrice) {
      oldPrice = null;
    }
  }

  return {
    id: p.id,
    uuid: p.uuid,
    title: p.title || "Untitled Product",
    description: p.description || "No detailed description available.",
    price: finalPrice,
    oldPrice,
    badge,
    brand: p.brand || null,
    sku: p.sku || null,
    weight: p.weight || null,
    stock: p.stock !== undefined && p.stock !== null ? Number(p.stock) : 20,
    stockWarning: p.stockWarning !== undefined ? p.stockWarning : (p.stock_warning !== undefined ? p.stock_warning : 10),
    category: p.category?.name || "PREMIUM",
    images: (p.images && p.images.length > 0) ? p.images.map(img => img.image_url) : [p.thumbnail || 'https://placehold.co/600x600/png?text=No+Image'],
    colors: extractedColors,
    sizes: extractedSizes,
    variants: p.variants || []
  };
});
const requestUrl = useRequestURL();

useSeoMeta({
  title: () => product.value.title,
  ogTitle: () => product.value.title,
  description: () => product.value.description,
  ogDescription: () => product.value.description,
  ogImage: () => activeImage.value,
  ogUrl: () => requestUrl.href,
  ogType: 'product',
  twitterCard: 'summary',
  twitterTitle: () => product.value.title,
  twitterDescription: () => product.value.description,
  twitterImage: () => activeImage.value
});

const handleAddToCart = () => {
  const itemToAdd = {
    ...product.value,
    quantity: quantity.value,
    selectedColor: selectedColor.value,
    selectedSize: selectedSize.value,
    image: product.value.images[0] // for cart compatibility
  };
  cartStore.addToCart(itemToAdd);
};

const toggleWishlist = () => {
  wishlistStore.toggleWishlist(product.value);
  if (wishlistStore.isInWishlist(product.value.id)) {
    showSuccess(locale.value === "kh" ? "បានបន្ថែមទៅចំណូលចិត្ត!" : "Added to Wishlist!");
  } else {
    showSuccess(locale.value === "kh" ? "បានដកចេញពីចំណូលចិត្ត!" : "Removed from Wishlist!");
  }
};
</script>

<style scoped>
.product-detail-page {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.text-main {
  color: var(--color-text);
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

.hover-primary {
  transition: color 0.2s ease;
}

.hover-primary:hover {
  color: var(--color-primary) !important;
}

/* Glass Card */
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

/* Background Blobs */
.blobs-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  background: var(--color-primary);
  width: 500px;
  height: 500px;
  top: -100px;
  right: -100px;
}

.blob-2 {
  background: #3b82f6;
  width: 400px;
  height: 400px;
  bottom: 20%;
  left: -150px;
}

.dark .bg-blob {
  opacity: 0.08;
}
</style>
