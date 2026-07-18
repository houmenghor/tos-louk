<template>
  <div class="error-page container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
    <!-- Premium Glassmorphic Card -->
    <div class="glass-card text-center animate-fade-in mx-auto">
      
      <!-- Icon Wrapper -->
      <div class="icon-wrapper mb-4 mx-auto">
        <div class="custom-spinner"></div>
        <div class="icon-holder d-flex align-items-center justify-content-center bg-surface">
          <i v-if="error.statusCode === 404" class="bi bi-compass text-primary-brand fs-1"></i>
          <i v-else class="bi bi-exclamation-triangle text-danger fs-1"></i>
        </div>
      </div>

      <!-- Error Content -->
      <h1 class="error-title display-1 fw-bold text-main mb-2">
        {{ error.statusCode }}
      </h1>
      
      <h3 class="form-title mb-3">
        {{ titleText }}
      </h3>
      
      <p class="form-subtitle mb-5 text-muted-custom">
        {{ descriptionText }}
      </p>

      <!-- Action Button -->
      <button @click="handleError" class="btn btn-primary-custom w-100 py-3 fw-bold rounded-4 shadow-sm d-flex align-items-center justify-content-center gap-2">
        <i class="bi bi-house-door"></i> {{ buttonText }}
      </button>

      <!-- Development Info (Only in Dev Mode) -->
      <div v-if="isDev" class="mt-5 p-3 text-start bg-dark text-danger rounded-3 overflow-hidden shadow-sm" style="font-size: 12px; font-family: monospace;">
        <p class="mb-1 text-white fw-bold">Developer Error Trace:</p>
        <p class="mb-0 text-wrap text-break">{{ error.message }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
});

const isDev = import.meta.env.DEV;
const nuxtApp = useNuxtApp();

// Safe translation getter (in case i18n hasn't loaded properly during a fatal crash)
const safeTranslate = (key, fallbackEn, fallbackKh) => {
  try {
    if (nuxtApp && nuxtApp.$i18n) {
      // Check if current locale is kh
      const locale = nuxtApp.$i18n.locale?.value || nuxtApp.$i18n.locale;
      if (locale === 'kh') {
        return fallbackKh;
      }
      return fallbackEn;
    }
  } catch (e) {
    // Ignore error
  }
  return fallbackEn;
};

const titleText = computed(() => {
  if (props.error.statusCode === 404) {
    return safeTranslate('error.pageNotFound', 'Page Not Found', 'រកមិនឃើញទំព័រនេះទេ');
  }
  return safeTranslate('error.serverError', 'Server Error', 'មានបញ្ហាបច្ចេកទេស');
});

const descriptionText = computed(() => {
  if (props.error.statusCode === 404) {
    return safeTranslate('error.pageNotFoundDesc', "The page you are looking for doesn't exist or has been moved.", "ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានប្ដូរទីតាំង។");
  }
  return safeTranslate('error.serverErrorDesc', "Oops! Something went wrong on our servers. Our team has been notified.", "សូមអភ័យទោស! មានបញ្ហាលើម៉ាស៊ីនមេរបស់យើង។ ក្រុមការងាររបស់យើងកំពុងដោះស្រាយវា។");
});

const buttonText = computed(() => {
  return safeTranslate('error.goHome', 'Go Back to Homepage', 'ត្រឡប់ទៅកាន់ទំព័រដើម');
});

const handleError = () => {
  clearError({ redirect: '/' });
};
</script>

<style scoped>
.error-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main);
}

/* Glassmorphic Shell Panel */
.glass-card {
  max-width: 500px;
  width: 100%;
  padding: 3.5rem 2.5rem;
  background: var(--glass-bg, rgba(255,255,255,0.8));
  backdrop-filter: var(--glass-blur, blur(10px));
  -webkit-backdrop-filter: var(--glass-blur, blur(10px));
  border: 1px solid var(--glass-border, rgba(0,0,0,0.1));
  border-radius: 20px;
  box-shadow: var(--glass-shadow, 0 8px 32px rgba(0,0,0,0.1));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
}

.error-title {
  color: var(--color-primary);
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-family: var(--font-main);
  font-weight: 700;
  color: var(--color-text);
}

.form-subtitle {
  font-size: 15px;
  line-height: 1.6;
}

.text-primary-brand {
  color: var(--color-primary);
}

/* Premium Icon Setup */
.icon-wrapper {
  width: 90px;
  height: 90px;
  position: relative;
}

.custom-spinner {
  width: 100%;
  height: 100%;
  border: 3px solid var(--color-border, #eaeaea);
  border-top: 3px solid var(--color-primary, #0d6efd);
  border-radius: 50%;
  animation: spin 3s linear infinite;
  opacity: 0.5;
}

.icon-holder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid var(--color-border, #eaeaea);
  box-shadow: var(--shadow-sm);
  background-color: var(--color-surface, #fff);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
