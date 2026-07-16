<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  targetDate: {
    type: [String, Date, Number],
    default: "2026-12-31T23:59:59",
  },
  maxPercent: {
    type: [Number, String],
    default: 50,
  },
  title: {
    type: String,
    default: "",
  },
});

// Initialized with original placeholder values to avoid Nuxt SSR hydration mismatches
const days = ref(186);
const hours = ref(8);
const minutes = ref(22);
const seconds = ref(14);

let timer = null;

const formatNumber = (num) => {
  return String(num).padStart(2, "0");
};

const updateCountdown = () => {
  const target = new Date(props.targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    if (timer) {
      clearInterval(timer);
    }
    return;
  }

  days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
  hours.value = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((difference % (1000 * 60)) / 1000);
};

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="discount-banner p-4 p-md-5 rounded-4 mb-5">
    <div class="row align-items-center g-4">
      <div class="col-lg-6 text-center text-lg-start">
        <span class="badge bg-warning text-dark mb-2">
          <i class="bi bi-lightning-fill"></i> {{ $t('discount.flashSale', { percent: maxPercent }) }}
        </span>
        <h3 class="fw-bold text-white mb-2 fs-2">{{ title || $t('discount.defaultTitle') }}</h3>
        <p class="text-white-50 small mb-0">
          {{ $t('discount.description') }}
        </p>
      </div>
      <div class="col-lg-6">
        <div class="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-end gap-3">
          <div class="text-center text-white">
            <small class="d-block text-white-50 mb-2">{{ $t('discount.endsIn') }}</small>
            <div class="d-flex gap-2 mt-1">
              <div class="time-box">
                {{ formatNumber(days) }}<small class="d-block mt-1">{{ $t('discount.days') }}</small>
              </div>
              <div class="time-box">
                {{ formatNumber(hours) }}<small class="d-block mt-1">{{ $t('discount.hours') }}</small>
              </div>
              <div class="time-box">
                {{ formatNumber(minutes)
                }}<small class="d-block mt-1">{{ $t('discount.minutes') }}</small>
              </div>
              <div class="time-box">
                {{ formatNumber(seconds)
                }}<small class="d-block mt-1">{{ $t('discount.seconds') }}</small>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column gap-2 w-100 w-sm-auto mt-3 mt-sm-0">
            <button class="btn btn-success px-4 py-2 text-nowrap w-100">{{ $t('discount.claimOffer') }} &rarr;</button>
            <button class="btn btn-outline-light px-4 py-2 text-nowrap w-100">{{ $t('discount.viewAllItems') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.discount-banner {
  background-color: #1e293b;
}

.time-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 6px;
  min-width: 50px;
}
</style>
