<template>
  <section class="product-carousel pb-5">
    <div class="container position-relative px-0 px-md-4">
      <button class="custom-arrow prev-btn shadow" @click="scrollPrev">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button class="custom-arrow next-btn shadow" @click="scrollNext">
        <i class="bi bi-chevron-right"></i>
      </button>

      <div class="scroll-track px-3 px-md-0" ref="carouselTrack" @mousedown="startDrag" @mouseleave="stopDrag"
        @mouseup="stopDrag" @mousemove="onDrag" @scroll="handleScroll">
        <div v-for="product in productsList" :key="product.id" class="product-slide">
          <div
            class="card glass-card h-100 border-0 shadow-sm p-3 pointer-events-none d-flex flex-column justify-content-between">
            <span v-if="product.badge" class="badge custom-badge position-absolute top-0 start-0 m-3 z-1">
              {{ product.badge }}
            </span>
            <div class="image-wrapper d-flex align-items-center justify-content-center mt-4 mb-3">
              <NuxtImg :src="product?.thumbnail || product?.image" class="w-100 h-100 object-fit-contain"
                :alt="product.title" draggable="false" />
            </div>
            <div class="card-body p-0 mt-auto d-flex flex-column justify-content-end">
              <h6 class="card-title fw-semibold mb-1 text-truncate">{{ product.title }}</h6>
              <p class="subtitle-text small mb-2 lh-sm text-truncate-2">{{ product.desc }}</p>
              <p class="price-text fw-bold mb-0">
                ${{ product.price }}
                <del v-if="product.oldPrice" class="subtitle-text fw-normal small ms-1">${{ product.oldPrice }}</del>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-pagination d-flex justify-content-center align-items-center mt-4">
        <button v-for="(dot, index) in totalDots" :key="`dot-${index}`" class="pagination-dot"
          :class="{ active: activeIndex === index }" @click="scrollToPage(index)"
          :aria-label="`Go to slide ${index + 1}`"></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "~/stores/productStore";
import { useCarouselScroll } from "~/composables/useCarouselScroll";
import { getProductPricing } from "~/utils/helpers";

const productStore = useProductStore();
const { products } = storeToRefs(productStore);

const productsList = computed(() => {
  return products.value.map((item) => {
    const { price, oldPrice, badge } = getProductPricing(item);
    const imgUrl = item.thumbnail || item.images?.[0]?.image_url || "https://placehold.co/200x200/png?text=No+Image";
    return {
      id: item.id,
      uuid: item.uuid,
      slug: item.slug,
      title: item.title,
      desc: item.description || "Premium quality product.",
      price,
      oldPrice,
      badge: badge || (item.discount ? `${item.discount.value}% OFF` : ""),
      thumbnail: imgUrl,
      image: imgUrl,
      images: item.images || []
    };
  });
});

const {
  carouselTrack,
  activeIndex,
  totalDots,
  startDrag,
  stopDrag,
  onDrag,
  handleScroll,
  scrollToPage,
  scrollNext,
  scrollPrev
} = useCarouselScroll();
</script>

<style scoped>
.product-carousel {
  background-color: var(--color-bg);
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

.subtitle-text {
  color: var(--color-text-secondary);
}

.price-text {
  color: var(--color-primary);
}

.image-wrapper {
  height: 170px;
  width: 100%;
  overflow: hidden;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6em;
  max-height: 2.6em;
  line-height: 1.3em;
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

/* Scrollable Track */
.scroll-track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding-bottom: 2rem;
  padding-top: 1rem;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-track::-webkit-scrollbar {
  display: none;
}

.scroll-track.active-drag {
  scroll-behavior: auto;
  scroll-snap-type: none;
  cursor: grabbing;
}

.scroll-track.active-drag .glass-card {
  cursor: grabbing;
}

.pointer-events-none img {
  pointer-events: none;
  user-select: none;
}

.product-slide {
  flex: 0 0 80%;
  min-width: 0;
  scroll-snap-align: center;
}

@media (max-width: 575px) {
  .scroll-track {
    padding-left: 10%;
    padding-right: 10%;
    gap: 1rem;
  }
}

@media (min-width: 576px) {
  .product-slide {
    flex: 0 0 calc(50% - 1.25rem);
    scroll-snap-align: start;
  }
}

@media (min-width: 992px) {
  .product-slide {
    flex: 0 0 calc(33.333% - 1.25rem);
  }
}

@media (min-width: 1200px) {
  .product-slide {
    flex: 0 0 calc(25% - 1.25rem);
  }
}

/* Carousel Nav Arrows */
.custom-arrow {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  background-color: var(--color-surface);
  border-radius: 50%;
  opacity: 1;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  z-index: 10;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .custom-arrow {
    display: none;
  }
}

.custom-arrow:hover {
  background-color: var(--glass-hover-bg);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.prev-btn {
  left: -15px;
}

.next-btn {
  right: -15px;
}

/* Pagination Dots */
.carousel-pagination {
  gap: 8px;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #cbd5e1;
  border: none;
  padding: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dark .pagination-dot {
  background-color: var(--color-border);
}

.pagination-dot.active {
  width: 32px;
  border-radius: 12px;
  background-color: var(--color-primary);
}

.pagination-dot:hover:not(.active) {
  background-color: #94a3b8;
}

.price-text {
  color: var(--color-primary);
}
</style>
