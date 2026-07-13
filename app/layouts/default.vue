<template>
  <div class="app-layout min-vh-100 d-flex flex-column">
    <!-- 1. Render your updated responsive Bootstrap header -->
    <AppHeader />

    <!-- 2. Main content wrapper with a top padding to prevent content overlap -->
    <main class="flex-grow-1">
      <slot />
    </main>

    <!-- 3. Optional: Your footer component -->
    <AppFooter />

    <!-- Scroll to Top floating navigation button -->
    <transition name="fade">
      <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="scroll-top-btn d-flex align-items-center justify-content-center shadow"
        :class="{ launching: isLaunching }"
        aria-label="Scroll to top"
      >
        <i class="bi bi-arrow-up"></i>
      </button>
    </transition>

    <!-- Add to Cart Offcanvas Sidebar -->
    <CartOffcanvas />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AppHeader from "~/components/layout/app-header.vue";
import AppFooter from "~/components/layout/app-footer.vue";
import CartOffcanvas from "~/components/common/cart-offcanvas.vue";

const showScrollTop = ref(false);
const isLaunching = ref(false);

const checkScroll = () => {
  // Only update scroll position if we are not actively launching
  if (!isLaunching.value) {
    if (window.scrollY > 300) {
      showScrollTop.value = true;
    } else {
      showScrollTop.value = false;
    }
  }
};

const scrollToTop = () => {
  isLaunching.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Reset launch state and hide button after animation finishes
  setTimeout(() => {
    isLaunching.value = false;
    showScrollTop.value = false;
  }, 800);
};

onMounted(() => {
  window.addEventListener("scroll", checkScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll);
});
</script>

<style scoped>
.app-layout {
  /* Ensures layout background matches your theme variables across the app */
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* Scroll to Top floating button */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background-color: var(--color-primary);
  color: #ffffff;
  border: none;
  z-index: 1040;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scroll-top-btn i {
  font-size: 1.25rem;
  font-weight: 800;
  transition: transform 0.3s ease;
}

.scroll-top-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 220, 130, 0.35) !important;
}

.scroll-top-btn:hover i {
  transform: translateY(-2px);
}

/* Active click state: squish click feedback */
.scroll-top-btn:active {
  transform: translateY(-2px) scale(0.92);
}

/* Rocket Launch flight animation */
.scroll-top-btn.launching {
  transform: translateY(-100vh) scale(0.9) rotate(360deg);
  opacity: 0;
  transition:
    transform 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6),
    opacity 0.5s ease;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
