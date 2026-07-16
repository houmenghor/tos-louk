<template>
  <section class="newsletter-subscribe py-6">
    <div class="container">
      <div
        class="newsletter-card p-5 rounded-4 position-relative overflow-hidden"
      >
        <!-- Background Glow Effect -->
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
              {{ $t('newsletter.title') }}
            </h2>
            <p class="newsletter-subtitle mb-0">
              {{ $t('newsletter.subtitle') }}
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
                <h3 class="fw-bold mb-1 success-title fs-5">
                  {{ $t('newsletter.success') }}
                </h3>
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
                      :placeholder="$t('newsletter.placeholder')"
                      required
                    />
                  </div>
                  <button class="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2 rounded-2 shadow-sm fw-semibold text-nowrap">
                    {{ $t('newsletter.subscribe') }} <i class="bi bi-arrow-right"></i>
                  </button>
                </form>

                <div
                  class="d-flex align-items-center gap-3 mt-3 px-2 text-muted-custom small"
                >
                  <span class="d-flex align-items-center gap-1">
                    <i class="bi bi-shield-check text-primary"></i> {{ $t('newsletter.noSpam') }}
                  </span>
                  <span class="d-inline-block text-border-sep">•</span>
                  <span class="d-flex align-items-center gap-1">
                    <i class="bi bi-patch-check text-primary"></i> {{ $t('newsletter.unsubscribeAnytime') }}
                  </span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const emailInput = ref("");
const isSubscribed = ref(false);

const handleSubscribe = () => {
  if (emailInput.value) {
    isSubscribed.value = true;
    emailInput.value = "";
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

.newsletter-subscribe {
  background-color: var(--color-primary-hover);
  border-top: 1px solid var(--color-border);
}

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

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
