<template>
  <div class="wishlist-page py-5 bg-body-custom min-vh-100">
    <div class="container max-w-container">
      
      <!-- Wishlist Hero Section -->
      <div class="wishlist-hero p-4 p-md-5 rounded-4 mb-5 text-center position-relative overflow-hidden border shadow-sm">
        <div class="glow-bubble-red-1"></div>
        <div class="glow-bubble-red-2"></div>
        <div class="position-relative z-1">
          <span class="badge rounded-pill bg-danger-light text-danger mb-3 px-3 py-2 fw-semibold text-uppercase tracking-wider text-xxs">
            Curated Favorites
          </span>
          <h1 class="display-5 fw-extrabold text-main mb-3">Your Wishlist</h1>
          <p class="lead subtitle-text mx-auto mb-0 text-sm" style="max-width: 600px;">
            Save your favorite design pieces, modern tech gadgets, and active essentials here. Add them directly to your cart at any time.
          </p>
        </div>
      </div>

      <!-- Guest Warning State -->
      <div class="text-center py-5 empty-state-wrapper rounded-4 border bg-surface-custom p-4 p-md-5 shadow-sm">
        <div class="empty-state-icon-container mb-4 position-relative">
          <div class="glow-halo-red"></div>
          <i class="bi bi-shield-lock display-1 text-muted position-relative z-1"></i>
        </div>
        <h3 class="fw-bold text-main mb-2">Sign In to Save Favorites</h3>
        <p class="subtitle-text mb-4 mx-auto text-xs" style="max-width: 420px;">
          Saving items to a wishlist is a member-only feature. Please login to your account to save your favorite items and access them from any device.
        </p>
        <NuxtLink 
          to="/auth/login" 
          class="btn btn-primary-custom px-4 py-2.5 rounded-pill fw-bold text-xs d-inline-flex align-items-center gap-2 transition-all shadow-sm"
        >
          <i class="bi bi-box-arrow-in-right"></i> Log In to Account
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore';

// Page Settings (Public Access)
definePageMeta({
  layout: 'default'
});

const authStore = useAuthStore();
</script>

<style scoped>
.wishlist-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  box-sizing: border-box;
  font-family: var(--font-main);
}

.max-w-container {
  max-width: 1040px;
}

.bg-body-custom {
  background-color: var(--color-bg);
}

.bg-surface-custom {
  background-color: var(--color-surface);
}

.text-main {
  color: var(--color-text);
}

.subtitle-text {
  color: var(--color-text-secondary);
}

/* Wishlist Hero Banner */
.wishlist-hero {
  background: var(--color-surface);
  border-color: var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

/* Red Glow Bubbles inside Hero */
.glow-bubble-red-1 {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
}

.glow-bubble-red-2 {
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.06) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

.glow-halo-red {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 75%);
  pointer-events: none;
}

/* App Buttons */
.btn-primary-custom {
  background-color: var(--color-primary) !important;
  color: #111827 !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 4px 14px var(--color-primary-light);
}

.btn-primary-custom:hover {
  background-color: var(--color-primary-hover) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 220, 130, 0.3);
}

.text-xxs {
  font-size: 10px;
}

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 14px;
}

.bg-danger-light {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-danger) !important;
}
</style>
