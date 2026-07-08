<template>
  <div class="w-full font-sans user-select-none glass-wrapper">

    <!-- Top Bar Segment -->
    <div class="glass-top-bar py-2 px-3 sm:px-4">
      <div class="container-xl d-flex justify-content-between align-items-center">
        <div class="fw-medium tracking-wide text-white small">
          {{ t('navbar.deliveryNotice') }} 🎉
        </div>

        <div class="d-flex align-items-center gap-3 small">
          <button @click="toggleTheme"
            class="btn btn-link btn-sm p-0 border-0 text-white opacity-70 hover-white d-flex align-items-center"
            aria-label="Toggle Theme">
            <i :class="isDark ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill'"></i>
          </button>

          <span class="text-white-muted">|</span>

          <div class="d-flex align-items-center gap-1">
            <button @click="setLocale('kh')"
              :class="[locale === 'kh' ? 'text-accent fw-bold' : 'text-light opacity-75 hover-white']"
              class="btn btn-link btn-sm p-0 text-decoration-none border-0">
              Khmer
            </button>
            <span class="text-white-muted px-1">/</span>
            <button @click="setLocale('en')"
              :class="[locale === 'en' ? 'text-accent fw-bold' : 'text-light opacity-75 hover-white']"
              class="btn btn-link btn-sm p-0 text-decoration-none border-0">
              English
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation Header Area -->
    <header class="glass-header sticky-top" :class="{ 'scrolled-header': isScrolled }">
      <div class="container-xl h-100 d-flex align-items-center justify-content-between">

        <!-- Logo Container -->
        <NuxtLink to="/" class="d-flex align-items-center gap-2 text-decoration-none group-logo">
          <span class="brand-text text-main">
            Tos<span class="text-primary-brand font-black">Louk</span><span class="brand-dot">.</span>
          </span>
        </NuxtLink>

        <!-- Desktop Navigation Only (Hidden on mobile) -->
        <nav class="d-none d-lg-flex align-items-center gap-4 small fw-semibold">
          <NuxtLink to="/" class="nav-custom-link text-decoration-none">{{ t('navbar.home') }}</NuxtLink>
          <NuxtLink to="/categories" class="nav-custom-link text-decoration-none">{{ t('navbar.categories') }}
          </NuxtLink>
          <NuxtLink to="/discount" class="nav-custom-link text-decoration-none">{{ t('navbar.discount') }}</NuxtLink>
          <NuxtLink to="/about" class="nav-custom-link text-decoration-none">{{ t('navbar.about') }}</NuxtLink>
          <NuxtLink to="/contact" class="nav-custom-link text-decoration-none">{{ t('navbar.contact') }}</NuxtLink>
        </nav>

        <!-- Actions Interface Menu -->
        <div class="d-flex align-items-center gap-2 gap-sm-3">

          <NuxtLink to="/wishlist" class="btn btn-link glass-icon-btn p-1 position-relative" aria-label="Wishlist">
            <i class="bi bi-heart fw-bold"></i>
            <span v-if="wishlistStore.wishlistCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white cart-badge shadow-sm">
              {{ wishlistStore.wishlistCount }}
            </span>
          </NuxtLink>

          <button @click="cartStore.toggleCart(true)" class="btn btn-link glass-icon-btn p-1 position-relative" aria-label="Shopping Cart">
            <i class="bi bi-bag fs-5 fw-bold"></i>
            <span v-if="cartStore.cartCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary-brand text-white cart-badge shadow-sm">
              {{ cartStore.cartCount }}
            </span>
          </button>

          <div class="dropdown">
            <button class="btn btn-link glass-icon-btn p-1 dropdown-toggle no-arrow" type="button" id="profileDropdown"
              data-bs-toggle="dropdown" aria-expanded="false" aria-label="User Account">
              <template v-if="auth.isAuthenticated && auth.userProfile">
                <img
                  :src="profileImageSrc"
                  class="rounded-circle object-fit-cover" width="32" height="32" alt="Profile"
                  referrerpolicy="no-referrer"
                  @error="handleImageError" />
              </template>

              <template v-else>
                <i class="bi bi-person fs-5 fw-bold"></i>
              </template>
            </button>

            <ul class="dropdown-menu dropdown-menu-end glass-dropdown shadow border-0 mt-3 animate slideIn"
              aria-labelledby="profileDropdown">

              <!-- Authenticated User Menu -->
              <template v-if="auth.isAuthenticated && auth.userProfile">
                <li class="px-3 py-2 border-bottom border-custom-glass mb-1">
                  <div class="fw-bold text-main">{{ auth.userProfile.full_name }}</div>
                  <div class="small" style="color: var(--color-text-secondary); font-size: 0.75rem;">{{ auth.userProfile.email }}</div>
                </li>
                <li>
                  <NuxtLink to="/profile" class="dropdown-item py-2 fw-medium">
                    <i class="bi bi-person-circle me-2 text-primary-brand"></i> My Profile
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/orders" class="dropdown-item py-2 fw-medium">
                    <i class="bi bi-bag-check me-2 text-primary-brand"></i> My Orders
                  </NuxtLink>
                </li>
                <li>
                  <hr class="dropdown-divider border-custom-glass my-1">
                </li>
                <li>
                  <button @click="handleLogout" class="dropdown-item py-2 fw-medium text-danger">
                    <i class="bi bi-box-arrow-right me-2"></i> {{ t('navbar.logout', 'Logout') }}
                  </button>
                </li>
              </template>

              <!-- Guest Menu -->
              <template v-else>
                <li>
                  <NuxtLink to="/auth/login" class="dropdown-item py-2 fw-medium">
                    <i class="bi bi-box-arrow-in-right me-2 text-primary-brand"></i> {{ t('navbar.login') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/auth/register" class="dropdown-item py-2 fw-medium">
                    <i class="bi bi-person-plus me-2 text-primary-brand"></i> {{ t('navbar.signUp') }}
                  </NuxtLink>
                </li>
              </template>
            </ul>
          </div>

          <!-- Offcanvas Mobile Menu Toggle Button -->
          <button class="btn btn-link glass-icon-btn p-1 d-lg-none" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#mobileNavbar" aria-controls="mobileNavbar" aria-label="Toggle Navigation Options">
            <i class="bi bi-list fs-4 fw-bold"></i>
          </button>

        </div>
      </div>
    </header>

    <!-- Responsive Glassmorphic Mobile Offcanvas Sidebar Container -->
    <!-- FIXED: Added ref="offcanvasRef" to target programmatic closure -->
    <div ref="offcanvasRef" class="offcanvas offcanvas-start mobile-glass-offcanvas d-lg-none" tabindex="-1"
      id="mobileNavbar" aria-labelledby="mobileNavbarLabel">
      <div class="offcanvas-header border-bottom border-custom-glass">
        <h5 class="offcanvas-title brand-text text-main" id="mobileNavbarLabel">
          Tos<span class="text-primary-brand font-black">Louk</span><span class="brand-dot">.</span>
        </h5>
        <button type="button" class="btn-close btn-close-custom" data-bs-dismiss="offcanvas"
          aria-label="Close"></button>
      </div>
      <div class="offcanvas-body py-4">
        <nav class="d-flex flex-column gap-3 small fw-semibold">
          <!-- FIXED: Replaced data-bs-dismiss with programmatic click handlers -->
          <NuxtLink to="/" class="nav-custom-link mobile-nav-link text-decoration-none" @click="closeMobileMenu">{{
            t('navbar.home') }}</NuxtLink>
          <NuxtLink to="/categories" class="nav-custom-link mobile-nav-link text-decoration-none"
            @click="closeMobileMenu">
            {{ t('navbar.categories') }}</NuxtLink>
          <NuxtLink to="/discount" class="nav-custom-link mobile-nav-link text-decoration-none"
            @click="closeMobileMenu">{{
              t('navbar.discount') }}</NuxtLink>
          <NuxtLink to="/about" class="nav-custom-link mobile-nav-link text-decoration-none" @click="closeMobileMenu">{{
            t('navbar.about') }}</NuxtLink>
          <NuxtLink to="/contact" class="nav-custom-link mobile-nav-link text-decoration-none" @click="closeMobileMenu">
            {{
              t('navbar.contact') }}</NuxtLink>
        </nav>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'

const { t, locale, setLocale } = useI18n()
const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const offcanvasRef = ref(null)
const isScrolled = ref(false)
const imageError = ref(false)

const profileImageSrc = computed(() => {
  if (imageError.value) {
    return '/image.png'
  }
  const img = auth.userProfile?.userProfile?.profile_image || auth.userProfile?.profile_image
  return img || '/image.png'
})

const handleImageError = () => {
  imageError.value = true
}

watch(() => auth.userProfile, () => {
  imageError.value = false
}, { deep: true })

const handleLogout = async () => {
  await auth.logout()
}

const handleScroll = () => {
  if (window.scrollY > 55) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

// FIXED: Programmatically clean up Bootstrap's backdrop state during rapid Nuxt routing
const closeMobileMenu = () => {
  if (process.client && offcanvasRef.value) {
    // Look up active structural instance assigned by bootstrap layout engine
    const bootstrap = window.bootstrap || globalThis.bootstrap
    if (bootstrap) {
      const instance = bootstrap.Offcanvas.getInstance(offcanvasRef.value)
      instance?.hide()
    }
  }
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  wishlistStore.initWishlist()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Base Theme Wrappers */
.glass-wrapper {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: var(--color-bg-secondary);
  transition: all 0.3s ease;
}

.glass-top-bar {
  background: var(--glass-top-fix);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
}

.glass-header {
  position: sticky;
  top: 0;
  height: 60px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  z-index: 1030;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-header.scrolled-header {
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.dark .glass-header.scrolled-header {
  background: rgba(30, 41, 59, 0.9) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Dropdowns & Items */
.glass-dropdown {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  backdrop-filter: var(--glass-blur) !important;
  -webkit-backdrop-filter: var(--glass-blur) !important;
  border-radius: 12px;
}

.dropdown-item {
  color: var(--color-text) !important;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0 4px;
  width: calc(100% - 8px);
}

.dropdown-item:hover {
  background: var(--glass-hover-bg) !important;
  color: var(--color-primary) !important;
}

/* Color and Branding Helpers */
.text-main {
  color: var(--color-text);
}

.text-primary-brand {
  color: var(--color-primary);
}

.bg-primary-brand {
  background-color: var(--color-primary) !important;
}

.text-accent {
  color: var(--color-warning) !important;
}

.text-white-muted {
  color: rgba(255, 255, 255, 0.4);
}

.brand-text {
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.brand-dot {
  color: var(--color-warning);
  font-size: 1.8rem;
}

/* Icon Buttons */
.glass-icon-btn {
  color: var(--color-text-secondary) !important;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.glass-icon-btn:hover {
  background: var(--glass-hover-bg);
  color: var(--color-primary) !important;
}

.glass-icon-btn:active {
  transform: scale(0.85) !important;
  background-color: var(--color-primary-light) !important;
  color: var(--color-primary) !important;
}

.cart-badge {
  font-size: 0.65rem;
  padding: 0.25em 0.5em;
  margin-top: 2px;
  margin-left: -2px;
  font-weight: 700;
  border: 1.5px solid var(--color-surface);
}

/* Links Configuration */
.nav-custom-link {
  color: var(--color-text-secondary);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-custom-link:hover {
  color: var(--color-primary) !important;
  background: var(--glass-hover-bg);
}

.router-link-active.nav-custom-link {
  color: var(--color-primary) !important;
  background: var(--glass-hover-bg);
  font-weight: 700;
}

.hover-white:hover {
  color: #ffffff !important;
  opacity: 1 !important;
}

.opacity-70 {
  opacity: 0.7;
}

.no-arrow::after {
  display: none !important;
}

/* ========================================================
   ULTRA-SMOOTH GPU-ACCELERATED MOBILE OFFCANVAS STYLING
======================================================== */
.mobile-glass-offcanvas {
  /* FIXED: Adjusted Light-mode color contrast fallback opacity to look crisp over active views */
  background: rgba(245, 245, 245, 0.85) !important;
  backdrop-filter: var(--glass-blur) !important;
  -webkit-backdrop-filter: var(--glass-blur) !important;
  border-right: 1px solid var(--glass-border) !important;
  width: 290px;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
  will-change: transform;
}

/* FIXED: Dark mode toggle overrides back to deep glass styling seamlessly */
.dark .mobile-glass-offcanvas {
  background: var(--glass-bg) !important;
}

/* Smooth sequential fading for individual menu links inside the panel */
.mobile-nav-link {
  transform: translateX(-15px);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, background 0.2s ease;
}

/* Trigger sliding effects directly mapped to Bootstrap active status toggles */
.mobile-glass-offcanvas.show .mobile-nav-link {
  transform: translateX(0);
  opacity: 1;
}

/* Stagger item lookups */
.mobile-glass-offcanvas.show .mobile-nav-link:nth-child(1) {
  transition-delay: 0.05s;
}

.mobile-glass-offcanvas.show .mobile-nav-link:nth-child(2) {
  transition-delay: 0.10s;
}

.mobile-glass-offcanvas.show .mobile-nav-link:nth-child(3) {
  transition-delay: 0.15s;
}

.mobile-glass-offcanvas.show .mobile-nav-link:nth-child(4) {
  transition-delay: 0.20s;
}

.mobile-glass-offcanvas.show .mobile-nav-link:nth-child(5) {
  transition-delay: 0.25s;
}

.border-custom-glass {
  border-color: var(--glass-border) !important;
}

/* Close icon decoration */
.btn-close-custom {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%236b7280'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
  opacity: 0.8;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.dark .btn-close-custom {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23f8fafc'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
}

.btn-close-custom:hover {
  transform: rotate(90deg);
}
</style>