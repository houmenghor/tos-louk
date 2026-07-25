<template>
  <div class="settings-card p-4 rounded-4">
    <h5 class="fw-bold text-main mb-4 text-sm">{{ t('dashboard.appearance', 'Appearance Settings') }}</h5>

    <!-- Row 1: Theme Mode Switcher -->
    <div class="d-flex align-items-center justify-content-between py-3 border-bottom border-custom-glass flex-wrap gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="icon-circle bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-moon-stars text-secondary-custom"></i>
        </div>
        <div>
          <h6 class="fw-bold text-main mb-0 text-xs">Theme Mode</h6>
          <p class="text-secondary-custom text-[11px] mb-0">Switch between light and dark mode themes.</p>
        </div>
      </div>
      
      <!-- Small Pill Toggle -->
      <div class="d-flex bg-secondary-light p-1 rounded-pill gap-1 border border-custom-glass">
        <BaseButton 
          @click="setTheme('light')" 
          :variants="colorMode.preference === 'light' ? 'primary' : 'secondary'"
          size="sm"
          class="pill-btn font-weight-bold"
        >
          Light
        </BaseButton>
        <BaseButton 
          @click="setTheme('dark')" 
          :variants="colorMode.preference === 'dark' ? 'primary' : 'secondary'"
          size="sm"
          class="pill-btn font-weight-bold"
        >
          Dark
        </BaseButton>
      </div>
    </div>

    <!-- Row 2: Language Switcher -->
    <div class="d-flex align-items-center justify-content-between py-3 flex-wrap gap-3">
      <div class="d-flex align-items-center gap-3">
        <div class="icon-circle bg-secondary-light rounded-circle d-flex align-items-center justify-content-center">
          <i class="bi bi-translate text-secondary-custom"></i>
        </div>
        <div>
          <h6 class="fw-bold text-main mb-0 text-xs">Language</h6>
          <p class="text-secondary-custom text-[11px] mb-0">Select your preferred system language.</p>
        </div>
      </div>
      
      <!-- Small Pill Toggle -->
      <div class="d-flex bg-secondary-light p-1 rounded-pill gap-1 border border-custom-glass">
        <BaseButton 
          @click="changeLanguage('kh')" 
          :variants="locale === 'kh' ? 'primary' : 'secondary'"
          size="sm"
          class="pill-btn font-weight-bold"
        >
          ភាសាខ្មែរ
        </BaseButton>
        <BaseButton 
          @click="changeLanguage('en')" 
          :variants="locale === 'en' ? 'primary' : 'secondary'"
          size="sm"
          class="pill-btn font-weight-bold"
        >
          English
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "~/components/base/base-button.vue";

const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();

const setTheme = (theme) => {
  colorMode.preference = theme;
};

const changeLanguage = (lang) => {
  setLocale(lang);
};
</script>

<style scoped>
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.icon-circle {
  width: 40px;
  height: 40px;
}

.bg-secondary-light {
  background-color: var(--color-bg-secondary);
}

.border-custom-glass {
  border-color: var(--color-border) !important;
}

.text-secondary-custom {
  color: var(--color-text-secondary) !important;
}

.pill-btn {
  padding: 4px 16px !important;
  font-size: 11px !important;
  height: auto !important;
}

.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
</style>
