<template>
  <div class="profile-page py-5 min-vh-100 bg-body-custom">
    <div class="container max-w-container">
      <!-- Page Title & Header -->
      <div class="d-flex align-items-center mb-5 gap-3">
        <NuxtLink to="/user"
          class="btn border border-custom bg-surface rounded-circle p-2 d-flex align-items-center justify-content-center text-main hover-bg-secondary transition-all"
          style="width: 42px; height: 42px">
          <i class="bi bi-arrow-left fs-5"></i>
        </NuxtLink>
        <div>
          <h1 class="h3 fw-extrabold text-main mb-1">Account Settings</h1>
          <p class="text-secondary-custom text-sm mb-0">
            Manage your personal information and account security.
          </p>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Navigation -->
        <div class="col-lg-3">
          <div class="settings-card p-3 rounded-4 border d-flex flex-column gap-2">
            <button @click="activeTab = 'personal'"
              class="settings-nav-link d-flex align-items-center gap-3 px-3 py-2.5 text-start transition-all w-100 rounded-3"
              :class="{ active: activeTab === 'personal' }">
              <i class="bi bi-person fs-5"></i>
              <span class="fw-semibold text-sm">Personal Info</span>
            </button>

            <button @click="activeTab = 'security'"
              class="settings-nav-link d-flex align-items-center gap-3 px-3 py-2.5 text-start transition-all w-100 rounded-3"
              :class="{ active: activeTab === 'security' }">
              <i class="bi bi-shield-lock fs-5"></i>
              <span class="fw-semibold text-sm">Security & Password</span>
            </button>
          </div>
        </div>

        <!-- Main Content Panel -->
        <div class="col-lg-9">
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeTab === 'personal'" key="personal" class="d-flex flex-column gap-4">
              <ProfileAvatarUploader />
              <ProfileDetailsForm />
            </div>

            <div v-else-if="activeTab === 'security'" key="security">
              <ProfileSecurityTab />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useWishlistStore } from "~/stores/wishlistStore";
import { useCartStore } from "~/stores/cartStore";

import ProfileAvatarUploader from "~/components/profile/profile-avatar-uploader.vue";
import ProfileDetailsForm from "~/components/profile/profile-details-form.vue";
import ProfileSecurityTab from "~/components/profile/profile-security-tab.vue";

definePageMeta({
  layout: "default",
});

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

const activeTab = ref('personal');

// Initialize the stores when the page loads
onMounted(() => {
  if (process.client) {
    wishlistStore.initWishlist();
    cartStore.initCart();
  }
});
</script>

<style scoped>
.profile-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main);
}

.bg-body-custom {
  background-color: var(--color-bg);
}

.bg-surface {
  background-color: var(--color-surface);
}

.max-w-container {
  max-width: 900px;
}

.text-main {
  color: var(--color-text);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.border-custom-glass {
  border-color: var(--color-border) !important;
  opacity: 0.5;
}

.border-custom {
  border-color: var(--color-border) !important;
}

.hover-bg-secondary:hover {
  background-color: var(--color-bg-secondary) !important;
}

.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.settings-nav-link {
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.settings-nav-link:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

.settings-nav-link.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
