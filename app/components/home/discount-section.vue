<template>
  <section id="discount" class="discount-product py-6">
    <div class="container">
      <DiscountBanner :target-date="activeDiscountEndDate" :max-percent="activeMaxPercent"
        :title="activeCampaignTitle" />

      <div class="row g-3 g-md-4">
        <template v-if="products.length === 0">
          <div v-for="n in 4" :key="'skeleton-'+n" class="col-12 col-md-4 col-lg-3 px-3 px-md-2">
            <SkeletonProductCard />
          </div>
        </template>
        <template v-else>
          <div v-for="item in discountProducts" :key="item.id" class="col-12 col-md-4 col-lg-3 px-3 px-md-2">
            <DiscountCardProduct :product="item" @add-to-cart="handleAddToCart" />
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
import DiscountBanner from "~/components/common/discount-banner.vue";
import DiscountCardProduct from "~/components/common/discount-card-product.vue";
import { getProductPricing } from "~/utils/helpers";

const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const discountProducts = computed(() => {
  const filtered = products.value.filter((item) => {
    const { oldPrice } = getProductPricing(item);
    return item.discount || oldPrice !== null;
  });
  const itemsToShow = filtered.length > 0 ? filtered : products.value.slice(0, 4);

  return itemsToShow.slice(0, 4).map((item) => {
    const { price, oldPrice, badge } = getProductPricing(item);
    const imgUrl = item.thumbnail || item.images?.[0]?.image_url || "https://placehold.co/200x200/png?text=Discount+Item";
    return {
      id: item.id,
      uuid: item.uuid,
      slug: item.slug,
      title: item.title,
      category: item.category?.name || "SPECIAL DEAL",
      price,
      oldPrice,
      badge: badge || "Sale",
      endsAt: item.discount?.ends_at || null,
      discountObj: item.discount || null,
      stock: item.stock !== undefined ? item.stock : null,
      stockWarning: item.stock_warning !== undefined ? item.stock_warning : 10,
      thumbnail: imgUrl,
      image: imgUrl,
      images: item.images || []
    };
  });
});

const activeDiscountEndDate = computed(() => {
  const dates = discountProducts.value
    .map((i) => i.endsAt)
    .filter((d) => d && new Date(d).getTime() > Date.now())
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return dates.length > 0 ? dates[0] : "2026-12-31T23:59:59";
});

const activeMaxPercent = computed(() => {
  let max = 0;
  discountProducts.value.forEach((item) => {
    if (item.discountObj && item.discountObj.type === "percent") {
      const val = Number(item.discountObj.value);
      if (val > max) max = val;
    }
  });
  return max > 0 ? max : 50;
});

const activeCampaignTitle = computed(() => {
  const itemWithName = discountProducts.value.find(
    (item) => item.discountObj && item.discountObj.name
  );
  return itemWithName
    ? `${itemWithName.discountObj.name} — Just for You`
    : "Exclusive Offers Just for You";
});

const handleAddToCart = (product) => {
  console.log("Added to cart from discount section:", product.title);
};
</script>

<style scoped>
.py-6 {
  padding-top: 6rem !important;
  padding-bottom: 6rem !important;
}

.discount-product {
  background-color: var(--color-surface) !important;
}
</style>
