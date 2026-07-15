<template>
  <section class="hero-banner py-6 mt-0">
    <div class="container">
      <div class="row align-items-center gy-5">
        <div class="col-lg-5">
          <span class="badge custom-badge mb-3 px-3 py-2 rounded-pill">
            {{ $t('hero.badge') }}
          </span>

          <h1 class="display-5 fw-bold mb-3 title-text leading-tight">
            {{ $t('hero.titleLine1') }} <br class="d-none d-lg-block" />
            {{ $t('hero.titleLine2') }}
          </h1>

          <p class="subtitle-text mb-4 pe-lg-4">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="d-flex flex-wrap gap-3 mb-4">
            <button class="btn btn-primary-custom px-4 py-2 shadow-sm text-nowrap">
              {{ $t('hero.browseItems') }}
            </button>
            <button class="btn btn-outline-custom px-4 py-2 shadow-sm d-flex align-items-center gap-2 text-nowrap">
              {{ $t('hero.seeAllCategories') }} <i class="bi bi-arrow-right"></i>
            </button>
          </div>

          <div class="d-flex flex-wrap gap-4 small subtitle-text mt-3">
            <span class="d-flex align-items-center gap-2">
              <i class="bi bi-box-seam text-primary-icon"></i> {{ $t('hero.freeShipping') }}
            </span>
            <span class="d-flex align-items-center gap-2">
              <i class="bi bi-shield-check text-primary-icon"></i> {{ $t('hero.verifiedQuality') }}
            </span>
            <span class="d-flex align-items-center gap-2">
              <i class="bi bi-arrow-return-left text-primary-icon"></i> {{ $t('hero.easyReturns') }}
            </span>
          </div>
        </div>

        <div class="col-lg-7">
          <SkeletonHeroBanner v-if="products.length === 0" />
          <div v-else class="row g-3">

            <!-- Best Seller -->
            <div class="col-md-5">
              <NuxtLink :to="generateProductUrl(heroBestSeller)"
                class="card glass-card h-100 border-0 shadow-sm p-3 position-relative text-decoration-none text-main">
                <span class="badge custom-badge position-absolute top-0 start-0 m-3">{{ $t('hero.bestSeller') }}</span>
                <NuxtImg :src="heroBestSeller.thumbnail || heroBestSeller.image"
                  class="card-img-top w-75 mx-auto mt-4 mb-2 object-fit-contain" style="height: 140px;"
                  :alt="heroBestSeller.title" draggable="false" />
                <div class="card-body px-1 pb-0 mt-auto">
                  <h6 class="card-title text-truncate mb-1">
                    {{ heroBestSeller.title }}
                  </h6>
                  <p class="price-text fw-bold mb-0">
                    ${{ heroBestSeller.price }}
                    <del v-if="heroBestSeller.oldPrice" class="subtitle-text fw-normal small ms-1">${{
                      heroBestSeller.oldPrice }}</del>
                  </p>
                </div>
              </NuxtLink>
            </div>

            <!-- Trending -->
            <div class="col-md-7">
              <NuxtLink :to="generateProductUrl(heroTrending)"
                class="card glass-card h-100 border-0 shadow-sm p-3 position-relative text-decoration-none text-main">
                <span class="badge custom-badge position-absolute top-0 start-0 m-3">{{ $t('hero.trendingNow') }}</span>
                <NuxtImg :src="heroTrending.thumbnail || heroTrending.image"
                  class="card-img-top w-75 mx-auto mt-4 mb-2 object-fit-contain" style="height: 140px;"
                  :alt="heroTrending.title" draggable="false" />
                <div class="card-body px-1 pb-0 mt-auto">
                  <h6 class="card-title text-truncate mb-1">{{ heroTrending.title }}</h6>
                  <p class="price-text fw-bold mb-0">
                    ${{ heroTrending.price }}
                    <del v-if="heroTrending.oldPrice" class="subtitle-text fw-normal small ms-1">${{
                      heroTrending.oldPrice }}</del>
                  </p>
                </div>
              </NuxtLink>
            </div>

            <!-- Just Launched -->
            <div class="col-12">
              <NuxtLink :to="generateProductUrl(heroJustLaunched)"
                class="card glass-card border-0 shadow-sm p-3 position-relative text-decoration-none text-main">
                <span class="badge custom-badge position-absolute top-0 start-0 m-3 z-1">{{ $t('hero.justLaunched') }}</span>
                <div class="row g-0 align-items-center mt-4">
                  <div class="col-sm-4 text-center">
                    <NuxtImg :src="heroJustLaunched.thumbnail || heroJustLaunched.image"
                      class="img-fluid rounded-start w-75 object-fit-contain" style="max-height: 140px;"
                      :alt="heroJustLaunched.title" draggable="false" />
                  </div>
                  <div class="col-sm-8">
                    <div class="card-body py-0 pe-1">
                      <h6 class="card-title mb-2">
                        {{ heroJustLaunched.title }}
                      </h6>
                      <p class="subtitle-text small mb-3 text-truncate-2">
                        {{ heroJustLaunched.desc }}
                      </p>
                      <p class="price-text fw-bold mb-0">
                        ${{ heroJustLaunched.price }}
                        <del v-if="heroJustLaunched.oldPrice" class="subtitle-text fw-normal small ms-1">${{
                          heroJustLaunched.oldPrice }}</del>
                      </p>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "~/stores/productStore";
import { useI18n } from "vue-i18n";
import SkeletonHeroBanner from "~/components/skeleton/hero-banner.vue";

const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const { t } = useI18n();

const heroBestSeller = computed(() => {
  const item = products.value.find(p => p.collection === 'best_seller') || products.value[0] || {};
  const { price, oldPrice } = getProductPricing(item);
  const imgUrl = item.thumbnail || item.images?.[0]?.image_url || 'https://placehold.co/200x200/png?text=Best+Seller';
  return {
    id: item.id || 1,
    uuid: item.uuid || '',
    title: item.title || t('hero.fallbackTitle1'),
    price: price || 0,
    oldPrice,
    thumbnail: imgUrl,
    image: imgUrl,
    images: item.images || []
  };
});

const heroTrending = computed(() => {
  const item = products.value.find(p => p.collection === 'popular') || products.value[1] || products.value[0] || {};
  const { price, oldPrice } = getProductPricing(item);
  const imgUrl = item.thumbnail || item.images?.[0]?.image_url || 'https://placehold.co/300x150/png?text=Trending';
  return {
    id: item.id || 2,
    uuid: item.uuid || '',
    title: item.title || t('hero.fallbackTitle2'),
    price: price || 0,
    oldPrice,
    thumbnail: imgUrl,
    image: imgUrl,
    images: item.images || []
  };
});

const heroJustLaunched = computed(() => {
  const item = products.value.find(p => p.collection === 'new_arrival') || products.value[2] || products.value[0] || {};
  const { price, oldPrice } = getProductPricing(item);
  const imgUrl = item.thumbnail || item.images?.[0]?.image_url || 'https://placehold.co/150x200/png?text=New+Arrival';
  return {
    id: item.id || 3,
    uuid: item.uuid || '',
    title: item.title || t('hero.fallbackTitle3'),
    desc: item.description || t('hero.fallbackDesc'),
    price: price || 0,
    oldPrice,
    thumbnail: imgUrl,
    image: imgUrl,
    images: item.images || []
  };
});
</script>

<style scoped>
.py-6 {
  padding-top: 6rem !important;
  padding-bottom: 6rem !important;
}

.title-text {
  color: var(--color-text);
}

.subtitle-text {
  color: var(--color-text-secondary);
}

.price-text,
.text-primary-icon {
  color: var(--color-primary);
}

.leading-tight {
  line-height: 1.2;
}

/* Glassmorphism Cards */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  border-radius: 12px;
  color: var(--color-text);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md), var(--glass-shadow);
}

.card-title {
  color: var(--color-text);
}

/* Buttons */
.btn-primary-custom {
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover);
  color: #ffffff;
}

.btn-outline-custom {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.btn-outline-custom:hover {
  background-color: var(--glass-hover-bg);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* Badges */
.custom-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-family: var(--font-main);
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
  border: 1px solid rgba(0, 220, 130, 0.2);
}
</style>
