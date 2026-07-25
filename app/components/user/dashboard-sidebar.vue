<template>
  <div class="col-lg-4">
    <!-- User Profile Card -->
    <div class="settings-card p-4 rounded-4 mb-4 d-flex align-items-center gap-3">
      <BaseAvatar
        :src="authStore.userProfile?.profile_image || authStore.userProfile?.userProfile?.profile_image"
        :name="authStore.userProfile?.full_name || 'Member'"
        :size="56"
        border-class="border border-2 border-surface shadow-sm"
      />
      <div class="overflow-hidden">
        <h5 class="fw-bold text-main mb-1 text-sm text-truncate">
          {{ authStore.userProfile?.full_name || t('dashboard.member') }}
        </h5>
        <p class="text-secondary-custom text-xs mb-0 text-truncate">
          {{ authStore.userProfile?.email || '' }}
        </p>
      </div>
    </div>

    <!-- Settings & Navigation List -->
    <div class="settings-card rounded-4 overflow-hidden mb-4 mb-lg-0">
      <div @click="emit('update:activeTab', 'overview')" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-custom-glass" :class="{ 'bg-secondary-light': activeTab === 'overview' }">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
            <i class="bi bi-grid text-secondary-custom" :class="{ 'text-primary-brand': activeTab === 'overview' }"></i>
          </div>
          <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'overview' }">Overview</span>
        </div>
        <i class="bi bi-chevron-right text-muted-custom"></i>
      </div>

      <div @click="emit('update:activeTab', 'orders')" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-custom-glass" :class="{ 'bg-secondary-light': activeTab === 'orders' }">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
            <i class="bi bi-bag-check text-secondary-custom" :class="{ 'text-primary-brand': activeTab === 'orders' }"></i>
          </div>
          <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'orders' }">Order History</span>
        </div>
        <i class="bi bi-chevron-right text-muted-custom"></i>
      </div>

      <div @click="emit('update:activeTab', 'personal')" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-custom-glass" :class="{ 'bg-secondary-light': activeTab === 'personal' }">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
            <i class="bi bi-person text-secondary-custom" :class="{ 'text-primary-brand': activeTab === 'personal' }"></i>
          </div>
          <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'personal' }">Personal Info</span>
        </div>
        <i class="bi bi-chevron-right text-muted-custom"></i>
      </div>

      <div @click="emit('update:activeTab', 'security')" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer border-bottom border-custom-glass" :class="{ 'bg-secondary-light': activeTab === 'security' }">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
            <i class="bi bi-shield-lock text-secondary-custom" :class="{ 'text-primary-brand': activeTab === 'security' }"></i>
          </div>
          <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'security' }">Security & Password</span>
        </div>
        <i class="bi bi-chevron-right text-muted-custom"></i>
      </div>

      <div @click="emit('update:activeTab', 'appearance')" class="nav-list-item p-3 d-flex align-items-center justify-content-between cursor-pointer" :class="{ 'bg-secondary-light': activeTab === 'appearance' }">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-box bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
            <i class="bi bi-palette text-secondary-custom" :class="{ 'text-primary-brand': activeTab === 'appearance' }"></i>
          </div>
          <span class="fw-semibold text-main text-sm" :class="{ 'text-primary-brand': activeTab === 'appearance' }">Appearance</span>
        </div>
        <i class="bi bi-chevron-right text-muted-custom"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseAvatar from "~/components/base/base-avatar.vue";
import { useAuthStore } from "~/stores/authStore";

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:activeTab"]);

const authStore = useAuthStore();
const { t } = useI18n();
</script>

<style scoped>
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.nav-list-item {
  background-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  color: var(--color-text);
}

.nav-list-item:hover {
  background-color: var(--color-bg-secondary);
}

.icon-box {
  width: 36px;
  height: 36px;
}

.bg-secondary-light {
  background-color: var(--color-bg-secondary);
}

.text-primary-brand {
  color: var(--color-primary) !important;
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-secondary-custom { color: var(--color-text-secondary) !important; }
.text-muted-custom { color: var(--color-text-secondary); opacity: 0.8; }
</style>
