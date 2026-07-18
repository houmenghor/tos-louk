<template>
  <div class="theme-wrapper">
    <!-- 1. Hero Section -->
    <HomeHeroBanner />

    <!-- 2. Product Carousel -->
    <HomeProductCarousel />

    <!-- 3. Category Tabs -->
    <HomeCategoryTabs />

    <!-- 4. Best Sellers -->
    <HomeBestSellersSection />

    <!-- 5. Discount Deals -->
    <HomeDiscountSection />

    <!-- 6. Newsletter Subscription -->
    <HomeNewsletterSubscribe />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useProductStore } from "~/stores/productStore";
import { useAsyncData } from "nuxt/app";

const productStore = useProductStore();
const { t } = useI18n();

useSeoMeta({
  title: () => t('navbar.home'),
  ogTitle: () => t('navbar.home')
});


onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.getAllProducts({
      per_page: 30,
      column: "created_at",
      sort: "desc",
      status: 1,
    });
  }
});
</script>

<style scoped>
.theme-wrapper {
  background-color: var(--color-bg);
  color: var(--color-text);
  overflow-x: hidden;
}
</style>
