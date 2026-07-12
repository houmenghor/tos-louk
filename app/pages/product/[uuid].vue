<template>
  <div class="product-detail-page position-relative overflow-hidden pb-5">
    <!-- Animated Background Blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <!-- Top Padding for Fixed Header -->
    <div class="pt-5 mt-4"></div>

    <div class="container position-relative z-1 mb-5">
      <!-- Breadcrumbs -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/" class="text-decoration-none text-muted-custom hover-primary">Home</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink to="/categories" class="text-decoration-none text-muted-custom hover-primary">Products</NuxtLink>
          </li>
          <li class="breadcrumb-item active text-main fw-semibold" aria-current="page">
            {{ product.title }}
          </li>
        </ol>
      </nav>

      <!-- Main Product Section Skeleton Loader -->
      <SkeletonProductDetail v-if="isLoading" />

      <!-- Main Product Section -->
      <div v-else class="glass-card-clean rounded-5 p-4 p-md-5 mb-5 shadow-sm">
        <div class="row g-5">
          <!-- Left Column: Image Gallery -->
          <div class="col-lg-6">
            <ProductGallery
              :product="product"
              v-model:activeImage="activeImage"
              @toggle-wishlist="toggleWishlist"
            />
          </div>

          <!-- Right Column: Product Details -->
          <div class="col-lg-6 d-flex flex-column">
            <ProductInfo
              :product="product"
              v-model:selectedColor="selectedColor"
              v-model:selectedSize="selectedSize"
              v-model:quantity="quantity"
              @add-to-cart="handleAddToCart"
            />
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
const { locale } = useI18n();

const { currentProduct } = storeToRefs(productStore);

const activeImage = ref('');
const selectedColor = ref('#0f172a');
const selectedSize = ref('M');
const quantity = ref(1);
const isLoading = ref(true);

onMounted(async () => {
  if (route.params.uuid) {
    isLoading.value = true;
    try {
      const res = await productStore.getProductByUuid(route.params.uuid);
      if (res?.data) {
        const p = res.data;
        activeImage.value = (p.images && p.images.length > 0) ? p.images[0].image_url : (p.thumbnail || 'https://placehold.co/600x600/png?text=Product');
      }
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});

watch(() => route.params.uuid, async (newUuid) => {
  if (newUuid) {
    isLoading.value = true;
    try {
      const res = await productStore.getProductByUuid(newUuid);
      if (res?.data) {
        const p = res.data;
        activeImage.value = (p.images && p.images.length > 0) ? p.images[0].image_url : (p.thumbnail || 'https://placehold.co/600x600/png?text=Product');
      }
    } finally {
      isLoading.value = false;
    }
  }
});

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
      uuid: route.params.uuid,
      title: "Loading product...",
      description: "Please wait while we fetch the product details.",
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

  return {
    id: p.id,
    uuid: p.uuid,
    title: p.title || "Untitled Product",
    description: p.description || "No detailed description available.",
    price: p.sell_price || 0,
    oldPrice: p.unit_price > p.sell_price ? p.unit_price : null,
    badge: p.discount ? `-${p.discount.value}%` : (p.collection === 'best_seller' ? 'Best Seller' : ''),
    category: p.category?.name || "PREMIUM",
    images: (p.images && p.images.length > 0) ? p.images.map(img => img.image_url) : [p.thumbnail || 'https://placehold.co/600x600/png?text=No+Image'],
    colors: extractedColors,
    sizes: extractedSizes,
    variants: p.variants || []
  };
});

const verifyLogin = (actionName) => {
  if (!authStore.access_token) {
    showError(
      locale.value === "kh"
        ? `សូមចូលគណនីជាមុនសិនដើម្បី ${actionName}!`
        : `Please login first to ${actionName}!`
    );
    navigateTo("/auth/login");
    return false;
  }
  return true;
};

const handleAddToCart = () => {
  if (verifyLogin(locale.value === "kh" ? "បន្ថែមទៅកន្ត្រក" : "add to cart")) {
    const itemToAdd = {
      ...product.value,
      quantity: quantity.value,
      selectedColor: selectedColor.value,
      selectedSize: selectedSize.value,
      image: product.value.images[0] // for cart compatibility
    };
    cartStore.addToCart(itemToAdd);
    showSuccess(
      locale.value === "kh"
        ? "បានបន្ថែមទៅក្នុងកន្ត្រកជោគជ័យ!"
        : "Added to cart successfully!"
    );
  }
};

const toggleWishlist = () => {
  if (verifyLogin(locale.value === "kh" ? "បញ្ចូលទៅបញ្ជីចំណូលចិត្ត" : "add to wishlist")) {
    wishlistStore.toggleWishlist(product.value.id);
    if (wishlistStore.isInWishlist(product.value.id)) {
      showSuccess(locale.value === "kh" ? "បានបន្ថែមទៅចំណូលចិត្ត!" : "Added to Wishlist!");
    } else {
      showSuccess(locale.value === "kh" ? "បានដកចេញពីចំណូលចិត្ត!" : "Removed from Wishlist!");
    }
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
