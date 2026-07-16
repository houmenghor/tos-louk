<template>
  <section id="best-seller" class="best-seller py-6">
    <div class="container">
      <div class="text-center mb-5">
        <h2 class="fw-bold">{{ $t('bestSellers.title') }}</h2>
        <p class="subtitle-text">{{ $t('bestSellers.subtitle') }}</p>
      </div>

      <div class="row g-3 g-md-4">
        <template v-if="products.length === 0">
          <div v-for="n in 4" :key="'skeleton-'+n" class="col-12 col-md-4 col-lg-3 px-3 px-md-2">
            <SkeletonProductCard />
          </div>
        </template>
        <template v-else>
          <div v-for="item in bestSellersList" :key="item.id" class="col-12 col-md-4 col-lg-3 px-3 px-md-2">
            <CardBestSeller :product="item" />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "~/stores/productStore";
import CardBestSeller from "~/components/common/card-best-seller.vue";
import { getProductPricing } from "~/utils/helpers";

const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const bestSellersList = computed(() => {
  const filtered = products.value.filter(
    (item) => item.collection === "best_seller"
  );
  const itemsToShow = filtered.length > 0 ? filtered : products.value;

  return itemsToShow.slice(0, 8).map((item) => {
    const { price, oldPrice, badge } = getProductPricing(item);
    const imgUrl = item.thumbnail || item.images?.[0]?.image_url || "https://placehold.co/200x200/png?text=Item";
    return {
      id: item.id,
      uuid: item.uuid,
      slug: item.slug,
      title: item.title,
      description: item.description || item.desc || "Experience premium quality with modern design and exceptional performance.",
      category: item.category?.name || "PREMIUM COLLECTION",
      price,
      oldPrice,
      badge: badge === 'Best Seller' ? '' : badge,
      thumbnail: imgUrl,
      image: imgUrl,
      images: item.images || []
    };
  });
});
</script>

<style scoped>
.py-6 {
  padding-top: 6rem !important;
  padding-bottom: 6rem !important;
}

.best-seller {
  background-color: var(--color-bg);
}

.subtitle-text {
  color: var(--color-text-secondary);
}
</style>
