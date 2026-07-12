<template>
  <div class="theme-wrapper">
    <section class="hero-banner py-6 mt-0">
      <div class="container">
        <div class="row align-items-center gy-5">
          <div class="col-lg-5">
            <span class="badge custom-badge mb-3 px-3 py-2 rounded-pill">
              CURATED COLLECTION
            </span>

            <h1 class="display-5 fw-bold mb-3 title-text leading-tight">
              Discover What <br class="d-none d-lg-block" />
              Defines Modern Living
            </h1>

            <p class="subtitle-text mb-4 pe-lg-4">
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae. Donec velit neque, auctor sit amet aliquam
              vel.
            </p>

            <div class="d-flex flex-wrap gap-3 mb-4">
              <button class="btn btn-primary-custom px-4 py-2 shadow-sm">
                Browse Items
              </button>
              <button
                class="btn btn-outline-custom px-4 py-2 shadow-sm d-flex align-items-center gap-2"
              >
                See All Categories <i class="bi bi-arrow-right"></i>
              </button>
            </div>

            <div class="d-flex flex-wrap gap-4 small subtitle-text mt-3">
              <span class="d-flex align-items-center gap-2">
                <i class="bi bi-box-seam text-primary-icon"></i> Free Shipping
              </span>
              <span class="d-flex align-items-center gap-2">
                <i class="bi bi-shield-check text-primary-icon"></i> Verified
                Quality
              </span>
              <span class="d-flex align-items-center gap-2">
                <i class="bi bi-arrow-return-left text-primary-icon"></i> Easy
                Returns
              </span>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="row g-3">
              <div class="col-md-5">
                <NuxtLink
                  :to="`/product/${heroBestSeller.uuid}`"
                  class="card glass-card h-100 border-0 shadow-sm p-3 position-relative text-decoration-none text-main"
                >
                  <span
                    class="badge custom-badge position-absolute top-0 start-0 m-3"
                    >Best Seller</span
                  >
                  <NuxtImg
                    :src="heroBestSeller.image"
                    class="card-img-top w-75 mx-auto mt-4 mb-2 object-fit-contain"
                    style="height: 140px;"
                    :alt="heroBestSeller.title"
                    draggable="false"
                  />
                  <div class="card-body px-1 pb-0 mt-auto">
                    <h6 class="card-title text-truncate mb-1">
                      {{ heroBestSeller.title }}
                    </h6>
                    <p class="price-text fw-bold mb-0">
                      ${{ heroBestSeller.price }}
                      <del v-if="heroBestSeller.oldPrice" class="subtitle-text fw-normal small ms-1">${{ heroBestSeller.oldPrice }}</del>
                    </p>
                  </div>
                </NuxtLink>
              </div>

              <div class="col-md-7">
                <NuxtLink
                  :to="`/product/${heroTrending.uuid}`"
                  class="card glass-card h-100 border-0 shadow-sm p-3 position-relative text-decoration-none text-main"
                >
                  <span
                    class="badge custom-badge position-absolute top-0 start-0 m-3"
                    >Trending Now</span
                  >
                  <NuxtImg
                    :src="heroTrending.image"
                    class="card-img-top w-75 mx-auto mt-4 mb-2 object-fit-contain"
                    style="height: 140px;"
                    :alt="heroTrending.title"
                    draggable="false"
                  />
                  <div class="card-body px-1 pb-0 mt-auto">
                    <h6 class="card-title text-truncate mb-1">{{ heroTrending.title }}</h6>
                    <p class="price-text fw-bold mb-0">
                      ${{ heroTrending.price }}
                      <del v-if="heroTrending.oldPrice" class="subtitle-text fw-normal small ms-1">${{ heroTrending.oldPrice }}</del>
                    </p>
                  </div>
                </NuxtLink>
              </div>

              <div class="col-12">
                <NuxtLink
                  :to="`/product/${heroJustLaunched.uuid}`"
                  class="card glass-card border-0 shadow-sm p-3 position-relative text-decoration-none text-main"
                >
                  <span
                    class="badge custom-badge position-absolute top-0 start-0 m-3 z-1"
                    >Just Launched</span
                  >
                  <div class="row g-0 align-items-center mt-4">
                    <div class="col-sm-4 text-center">
                      <NuxtImg
                        :src="heroJustLaunched.image"
                        class="img-fluid rounded-start w-75 object-fit-contain"
                        style="max-height: 140px;"
                        :alt="heroJustLaunched.title"
                        draggable="false"
                      />
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
                          <del v-if="heroJustLaunched.oldPrice" class="subtitle-text fw-normal small ms-1"
                            >${{ heroJustLaunched.oldPrice }}</del
                          >
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

    <section class="product-carousel pb-5">
      <div class="container position-relative px-0 px-md-4">
        <button class="custom-arrow prev-btn shadow" @click="scrollPrev">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="custom-arrow next-btn shadow" @click="scrollNext">
          <i class="bi bi-chevron-right"></i>
        </button>

        <div
          class="scroll-track px-3 px-md-0"
          ref="carouselTrack"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @mouseup="stopDrag"
          @mousemove="onDrag"
          @scroll="handleScroll"
        >
          <div
            v-for="product in productsList"
            :key="product.id"
            class="product-slide"
          >
            <div
              class="card glass-card h-100 border-0 shadow-sm p-3 pointer-events-none"
            >
              <span
                v-if="product.badge"
                class="badge custom-badge position-absolute top-0 start-0 m-3 z-1"
              >
                {{ product.badge }}
              </span>
              <NuxtImg
                :src="product.image"
                class="card-img-top w-75 mx-auto mt-4 mb-3 object-fit-contain"
                :alt="product.title"
                draggable="false"
              />
              <div class="card-body p-0 mt-auto">
                <h6 class="card-title fw-semibold mb-1">{{ product.title }}</h6>
                <p class="subtitle-text small mb-2 lh-sm">{{ product.desc }}</p>
                <p class="price-text fw-bold mb-0">
                  ${{ product.price }}
                  <del
                    v-if="product.oldPrice"
                    class="subtitle-text fw-normal small ms-1"
                    >${{ product.oldPrice }}</del
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="carousel-pagination d-flex justify-content-center align-items-center mt-4"
        >
          <button
            v-for="(dot, index) in totalDots"
            :key="`dot-${index}`"
            class="pagination-dot"
            :class="{ active: activeIndex === index }"
            @click="scrollToPage(index)"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <section class="category-tabs py-6">
      <div class="container">
        <div
          class="tab-header d-flex justify-content-center align-items-center mb-5 gap-3"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleSelectTab(tab.id)"
            class="tab-pill"
            :class="{ active: activeTab === tab.id }"
          >
            {{ tab.label }}
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <div :key="activeTab" class="row g-4">
            <div
              v-if="currentCategoryData.length === 0 && !loadingCategoryTab"
              class="col-12 text-center py-5"
            >
              <i class="bi bi-box fs-1 text-muted mb-3 d-block"></i>
              <p class="text-muted fw-medium">No products found in this category yet.</p>
            </div>
            <div
              v-else
              v-for="item in currentCategoryData"
              :key="item.id"
              class="col-12 col-md-4 col-lg-3"
            >
              <!-- Call the new component here -->
              <CategoryProductCard
                :product="item"
                @add-to-cart="handleAddToCart"
              />
            </div>
          </div>
        </transition>

        <div class="text-center mt-5">
          <button class="btn btn-primary-custom rounded-pill px-5 py-2">
            View All Products →
          </button>
        </div>
      </div>
    </section>

    <section id="best-seller" class="best-seller py-6">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">Best Sellers</h2>
          <p class="subtitle-text">Curated selections for your lifestyle</p>
        </div>

        <div class="row g-4">
          <div
            v-for="item in bestSellersList"
            :key="item.id"
            class="col-lg-3 col-md-4"
          >
            <CardBestSeller :product="item" />
          </div>
        </div>
      </div>
    </section>

    <section id="discount" class="discount-product py-6">
      <div class="container">
        <DiscountBanner
          :target-date="activeDiscountEndDate"
          :max-percent="activeMaxPercent"
          :title="activeCampaignTitle"
        />

        <div class="row g-4">
          <div
            v-for="item in discountProducts"
            :key="item.id"
            class="col-lg-3 col-md-4"
          >
            <DiscountCardProduct
              :product="item"
              @add-to-cart="handleAddToCart"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="newsletter-subscribe py-6">
      <div class="container">
        <div
          class="newsletter-card p-5 rounded-4 position-relative overflow-hidden"
        >
          <!-- Background Glow Effect (adds premium feel) -->
          <div class="glow-bubble-1"></div>
          <div class="glow-bubble-2"></div>

          <div
            class="row align-items-center justify-content-between position-relative z-1 gy-4"
          >
            <div class="col-lg-6">
              <span
                class="badge rounded-pill bg-primary-light text-primary mb-3 px-3 py-2 fw-semibold text-uppercase letter-spacing-1"
              >
                <i class="bi bi-envelope-paper-fill me-2"></i>Newsletter
              </span>
              <h2 class="fw-extrabold mb-2 newsletter-title">
                Stay in the Loop
              </h2>
              <p class="newsletter-subtitle mb-0">
                Subscribe to receive early access to weekly deals, curated
                collections, and exclusive product drops.
              </p>
            </div>

            <div class="col-lg-5">
              <transition name="fade" mode="out-in">
                <div
                  v-if="isSubscribed"
                  class="text-center p-4 bg-primary-light rounded-3 border border-success-subtle success-card"
                >
                  <i
                    class="bi bi-patch-check-fill text-primary fs-1 d-block mb-2"
                  ></i>
                  <h5 class="fw-bold mb-1 success-title">
                    Subscription Successful!
                  </h5>
                  <p class="text-muted-custom small mb-0">
                    Welcome to our exclusive inner circle.
                  </p>
                </div>
                <div v-else>
                  <form
                    @submit.prevent="handleSubscribe"
                    class="subscribe-form d-flex gap-2 p-2 rounded-3 bg-input-wrapper border"
                  >
                    <div class="input-icon-group flex-grow-1 position-relative">
                      <i
                        class="bi bi-envelope position-absolute start-0 top-50 translate-middle-y ms-3 envelope-icon"
                      ></i>
                      <input
                        v-model="emailInput"
                        type="email"
                        class="form-control border-0 bg-transparent py-2 ps-5 subscribe-input"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <button
                      class="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2 rounded-2 shadow-sm fw-semibold"
                    >
                      Subscribe <i class="bi bi-arrow-right"></i>
                    </button>
                  </form>

                  <!-- Trust badges -->
                  <div
                    class="d-flex align-items-center gap-3 mt-3 px-2 text-muted-custom small"
                  >
                    <span class="d-flex align-items-center gap-1">
                      <i class="bi bi-shield-check text-primary"></i> No Spam
                    </span>
                    <span class="d-inline-block text-border-sep">•</span>
                    <span class="d-flex align-items-center gap-1">
                      <i class="bi bi-patch-check text-primary"></i> Unsubscribe
                      anytime
                    </span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import CardBestSeller from "~/components/common/CardBestSeller.vue";
import CategoryProductCard from "~/components/common/CategoryProductCard.vue";
import DiscountBanner from "~/components/common/DiscountBanner.vue";
import DiscountCardProduct from "~/components/common/DiscountCardProduct.vue";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const {products} = storeToRefs(productStore);

onMounted(async () => {
  await productStore.getAllProducts({
    per_page: 30,
    column: 'created_at',
    sort: 'desc',
    status: 1
  });

  await nextTick();
  calculateDots();
});

const productsList = computed(() => {
  return products.value.map((item) => ({
    id: item.id,
    uuid: item.uuid,
    title: item.title,
    desc: item.description || "Premium quality product.",
    price: item.sell_price,
    oldPrice: item.unit_price > item.sell_price ? item.unit_price : null,
    badge: item.discount ? `${item.discount.value}% OFF` : "",
    image: item.thumbnail || "https://placehold.co/200x200/png?text=No+Image"
  }));
});

const bestSellersList = computed(() => {
  // Strictly filter by collection === 'best_seller'
  const filtered = products.value.filter(
    (item) => item.collection === "best_seller"
  );
  // Fallback to slice if no products have 'best_seller' collection assigned yet in DB
  const itemsToShow = filtered.length > 0 ? filtered : products.value;

  return itemsToShow.slice(0, 8).map((item) => ({
    id: item.id,
    uuid: item.uuid,
    title: item.title,
    category: item.category?.name || "PREMIUM COLLECTION",
    price: item.sell_price,
    badge: item.discount ? `${item.discount.value}% OFF` : "Best Seller",
    image: item.thumbnail || "https://placehold.co/200x200/png?text=Item"
  }));
}); 

const heroBestSeller = computed(() => {
  const item = products.value.find(p => p.collection === 'best_seller') || products.value[0] || {};
  return {
    id: item.id || 1,
    uuid: item.uuid || '',
    title: item.title || 'Precision Audio Hub',
    price: item.sell_price || 219,
    oldPrice: item.unit_price > item.sell_price ? item.unit_price : 299,
    image: item.thumbnail || 'https://placehold.co/200x200/png?text=Best+Seller'
  };
});

const heroTrending = computed(() => {
  const item = products.value.find(p => p.collection === 'popular') || products.value[1] || products.value[0] || {};
  return {
    id: item.id || 2,
    uuid: item.uuid || '',
    title: item.title || 'Smart Wearable Pro',
    price: item.sell_price || 159,
    oldPrice: item.unit_price > item.sell_price ? item.unit_price : 229,
    image: item.thumbnail || 'https://placehold.co/300x150/png?text=Trending'
  };
});

const heroJustLaunched = computed(() => {
  const item = products.value.find(p => p.collection === 'new_arrival') || products.value[2] || products.value[0] || {};
  return {
    id: item.id || 3,
    uuid: item.uuid || '',
    title: item.title || 'Essential Daily Companion',
    desc: item.description || 'Proin eget tortor risus. Vivamus magna justo, lacinia eget consectetur sed.',
    price: item.sell_price || 99,
    oldPrice: item.unit_price > item.sell_price ? item.unit_price : 149,
    image: item.thumbnail || 'https://placehold.co/150x200/png?text=New+Arrival'
  };
});

// --- Mouse Drag & Scroll Logic ---
const carouselTrack = ref(null);
const isDown = ref(false);
const startX = ref(0);
const scrollLeftPos = ref(0);

const startDrag = (e) => {
  isDown.value = true;
  carouselTrack.value.classList.add("active-drag");
  startX.value = e.pageX - carouselTrack.value.offsetLeft;
  scrollLeftPos.value = carouselTrack.value.scrollLeft;
};

const stopDrag = () => {
  isDown.value = false;
  carouselTrack.value.classList.remove("active-drag");
};

const onDrag = (e) => {
  if (!isDown.value) return;
  e.preventDefault();
  const x = e.pageX - carouselTrack.value.offsetLeft;
  const walk = (x - startX.value) * 1.5;
  carouselTrack.value.scrollLeft = scrollLeftPos.value - walk;
};

// --- Custom Pagination Logic ---
const activeIndex = ref(0);
const totalDots = ref(0);

// Calculate how many "pages" exist based on the screen width
const calculateDots = () => {
  if (carouselTrack.value) {
    const track = carouselTrack.value;
    // Total dots = total scrollable width / width of the visible container
    totalDots.value = Math.ceil(track.scrollWidth / track.clientWidth);
  }
};

// Update active dot as the user scrolls or drags
const handleScroll = () => {
  if (carouselTrack.value) {
    const track = carouselTrack.value;
    activeIndex.value = Math.round(track.scrollLeft / track.clientWidth);
  }
};

// Click a dot to jump to that page
const scrollToPage = (index) => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollTo({
      left: index * carouselTrack.value.clientWidth,
      behavior: "smooth",
    });
  }
};

// Button Scroll Logic (Scrolls exactly one container width to align with dots)
const scrollNext = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({
      left: carouselTrack.value.clientWidth,
      behavior: "smooth",
    });
  }
};

const scrollPrev = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({
      left: -carouselTrack.value.clientWidth,
      behavior: "smooth",
    });
  }
};

// Recalculate dots when component loads and on window resize
onMounted(() => {
  nextTick(() => {
    calculateDots();
  });
  window.addEventListener("resize", calculateDots);
});

onUnmounted(() => {
  window.removeEventListener("resize", calculateDots);
});

const { data: fetchedParentCategories } = await useAsyncData("home-category-tabs", () =>
  categoryStore.getCategories({ per_page: 50, parent_id: "null" })
);

const tabs = computed(() => {
  const list = [{ id: "all", label: "All" }];
  if (fetchedParentCategories.value?.data && Array.isArray(fetchedParentCategories.value.data)) {
    fetchedParentCategories.value.data.forEach((cat) => {
      list.push({ id: cat.id, label: cat.name });
    });
  }
  return list;
});

const activeTab = ref("all");
const categoryFilteredProducts = ref([]);
const loadingCategoryTab = ref(false);

const handleSelectTab = async (tabId) => {
  activeTab.value = tabId;
  loadingCategoryTab.value = true;
  categoryFilteredProducts.value = [];
  try {
    const params = { per_page: 12, status: 1, column: 'created_at', sort: 'desc' };
    if (tabId !== "all") {
      params.category_id = tabId;
    }
    const res = await productStore.getFilteredProducts(params);
    if (res?.data) {
      categoryFilteredProducts.value = res.data;
    }
  } catch (err) {
    console.error("Failed to filter products by category:", err);
  } finally {
    loadingCategoryTab.value = false;
  }
};

const currentCategoryData = computed(() => {
  const rawItems = categoryFilteredProducts.value.length > 0
    ? categoryFilteredProducts.value
    : (activeTab.value === "all" ? products.value.slice(0, 12) : []);

  return rawItems.map((item) => ({
    id: item.id,
    uuid: item.uuid,
    title: item.title,
    category: item.category?.name || "SPECIAL DEAL",
    price: item.sell_price,
    oldPrice: item.unit_price > item.sell_price ? item.unit_price : null,
    image: (item.images && item.images.length > 0)
      ? item.images[0].image_url
      : (item.thumbnail || 'https://placehold.co/600x600/png?text=No+Image'),
    badge: item.discount ? `-${item.discount.value}%` : (item.collection === 'best_seller' ? 'Best Seller' : ''),
    stock: item.stock
  }));
});


const handleAddToCart = (product) => {
  console.log("Added to cart:", product.title);
};

const discountProducts = computed(() => {
  // Filter products where there's a discount or oldPrice > price
  const filtered = products.value.filter(
    (item) => item.discount || item.unit_price > item.sell_price
  );
  const itemsToShow = filtered.length > 0 ? filtered : products.value.slice(0, 4);

  return itemsToShow.slice(0, 4).map((item) => ({
    id: item.id,
    uuid: item.uuid,
    title: item.title,
    category: item.category?.name || "SPECIAL DEAL",
    price: item.sell_price,
    oldPrice: item.unit_price > item.sell_price ? item.unit_price : null,
    badge: item.discount ? `-${item.discount.value}%` : "Sale",
    endsAt: item.discount?.ends_at || null,
    discountObj: item.discount || null,
    stock: item.stock !== undefined ? item.stock : null,
    stockWarning: item.stock_warning !== undefined ? item.stock_warning : 10,
    image: item.thumbnail || "https://placehold.co/200x200/png?text=Discount+Item"
  }));
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

// Telegram Subscription State & Handlers
const telegramInput = ref('');
const isSubscribed = ref(false);

const handleSubscribe = () => {
    if (telegramInput.value) {
        isSubscribed.value = true;
        telegramInput.value = '';
        setTimeout(() => {
            isSubscribed.value = false;
        }, 5000);
    }
};
</script>

<style scoped>
.py-6 {
  padding-top: 6rem !important;
  padding-bottom: 6rem !important;
}

.theme-wrapper {
  background-color: var(--color-bg);
  color: var(--color-text);
  overflow-x: hidden;
}

/* Typography Helpers */
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

/* Scrollable Track */
.scroll-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 2rem;
  padding-top: 1rem;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  /* Snaps gracefully on mobile */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-track::-webkit-scrollbar {
  display: none;
}

.scroll-track.active-drag {
  scroll-behavior: auto;
  scroll-snap-type: none;
  /* Disable snapping while dragging */
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
  flex: 0 0 calc(85% - 1.5rem);
  min-width: 0;
  scroll-snap-align: start;
  /* Ensures it stops exactly on a card */
}

@media (min-width: 576px) {
  .product-slide {
    flex: 0 0 calc(50% - 1.5rem);
  }
}

@media (min-width: 992px) {
  .product-slide {
    flex: 0 0 calc(33.333% - 1.5rem);
  }
}

@media (min-width: 1200px) {
  .product-slide {
    flex: 0 0 calc(25% - 1.5rem);
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

/* =========================================
   PAGINATION DOTS (Matched to User Image) 
========================================= */
.carousel-pagination {
  gap: 8px;
  /* Space between dots */
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #cbd5e1;
  /* Light gray for inactive, fits both light/dark */
  border: none;
  padding: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Dark mode subtle adjustment for inactive dots */
.dark .pagination-dot {
  background-color: var(--color-border);
}

/* Active Pill Shape */
.pagination-dot.active {
  width: 32px;
  /* Elongated pill width */
  border-radius: 12px;
  background-color: var(--color-primary);
  /* Teal active color */
}

.pagination-dot:hover:not(.active) {
  background-color: #94a3b8;
}

/* =========================================
   TAB NAVIGATION STYLES
========================================= */
.category-tabs {
  background-color: var(--color-surface);
  padding: 3rem 0;
}

.tab-header {
  border-bottom: 1px solid var(--color-border);
  gap: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0 0.5rem 1rem 0.5rem;
  margin-bottom: -1px;
  /* Pulls the border down to overlap the container's bottom border */
  font-family: var(--font-main);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--color-text);
}

.tab-btn.active {
  color: var(--color-text);
  /* Uses your primary teal color for the active tab underline, 
     or change to var(--color-text) if you prefer a dark/neutral line */
  border-bottom: 2px solid var(--color-primary);
}

.tab-pill {
  padding: 8px 24px;
  border-radius: 50px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all 0.3s;
}

.tab-pill.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

/* Card & Overlay Design */
.image-container {
  height: 300px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glass-card:hover .overlay {
  opacity: 1;
}

/* Button & Text helpers using your Global Variables */
.btn-primary-custom {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
}

.price-text {
  color: var(--color-primary);
}

.text-warning {
  color: var(--color-warning) !important;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure the star icon is visible if you're using Bootstrap Icons */
.text-warning {
  color: #ffc107 !important;
}

/* Card layout adjustments */
.best-seller .card-img-top {
  mix-blend-mode: multiply;
  /* Helps clean up white backgrounds of product images */
}

.best-seller .glass-card {
  transition: transform 0.3s ease;
}

.best-seller .glass-card:hover {
  transform: translateY(-5px);
}

/* Explicit Section Backgrounds for Alternating Visual Rhythm */
.hero-banner,
.product-carousel {
  background-color: var(--color-bg);
}

.category-tabs {
  background-color: var(--color-surface);
}

.best-seller {
  background-color: var(--color-bg);
}

.discount-product {
  background-color: var(--color-surface) !important;
}

.newsletter-subscribe {
  background-color: var(--color-primary-hover);
  border-top: 1px solid var(--color-border);
}

/* =========================================
   MODERN NEWSLETTER STYLES
========================================= */
.newsletter-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.dark .newsletter-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: rgba(255, 255, 255, 0.06);
}

.glow-bubble-1 {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 220, 130, 0.12) 0%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
}

.glow-bubble-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 220, 130, 0.08) 0%,
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.bg-primary-light {
  background-color: rgba(0, 220, 130, 0.1);
  color: var(--color-primary) !important;
}

.newsletter-title {
  font-size: 2.25rem;
  letter-spacing: -0.5px;
  color: var(--color-text);
}

.dark .newsletter-title {
  background: linear-gradient(to right, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.newsletter-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
}

.dark .newsletter-subtitle {
  color: #94a3b8;
}

.bg-input-wrapper {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border) !important;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.bg-input-wrapper:focus-within {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.15);
}

.dark .bg-input-wrapper {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12) !important;
}

.subscribe-input {
  color: var(--color-text);
}

.dark .subscribe-input {
  color: #ffffff;
}

.envelope-icon {
  color: var(--color-text-secondary);
}

.dark .envelope-icon {
  color: #64748b;
}

.success-title {
  color: var(--color-text);
}

.dark .success-title {
  color: #ffffff;
}

.subscribe-form input::placeholder {
  color: #64748b;
}

.subscribe-form input:focus {
  box-shadow: none !important;
  outline: none !important;
}

.text-muted-custom {
  color: #64748b;
}

.text-border-sep {
  color: rgba(255, 255, 255, 0.1);
}

.dark .text-border-sep {
  color: rgba(255, 255, 255, 0.1);
}

.fw-extrabold {
  font-weight: 800;
}
</style>
