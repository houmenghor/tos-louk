<template>
  <div class="checkout-page min-vh-100 py-5">
    <div class="container py-3">
      <!-- Top Breadcrumb & Page Header -->
      <div
        class="checkout-header p-4 rounded-4 border mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div class="d-flex align-items-center gap-3">
          <div class="header-icon-box rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style="width: 54px; height: 54px;">
            <i class="bi bi-shield-check fs-3 text-primary-custom"></i>
          </div>
          <div>
            <h1 class="fw-bold text-main fs-3 mb-1 d-flex align-items-center gap-2">
              {{ $t('checkout.title') }}
            </h1>
            <p class="text-secondary-custom small mb-0">{{ $t('checkout.subtitle') }}</p>
          </div>
        </div>
        <NuxtLink to="/"
          class="btn btn-outline-custom rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-medium transition-all">
          <i class="bi bi-arrow-left"></i> {{ $t('cart.continueShopping') }}
        </NuxtLink>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartStore.items.length === 0 && !orderSubmitted"
        class="checkout-header p-5 rounded-4 border text-center my-5">
        <div class="py-5">
          <div class="mx-auto mb-4 rounded-circle bg-icon-empty d-flex align-items-center justify-content-center"
            style="width: 90px; height: 90px;">
            <i class="bi bi-bag-x display-4 text-secondary-custom"></i>
          </div>
          <h3 class="fw-bold text-main mb-2">{{ $t('cart.empty') }}</h3>
          <p class="text-secondary-custom mb-4 mx-auto" style="max-width: 420px;">
            {{ $t('checkout.emptyCart') }}
          </p>
          <NuxtLink to="/" class="btn btn-primary-custom rounded-pill px-5 py-3 fw-semibold transition-all">
            <i class="bi bi-shop me-2"></i> {{ $t('cart.startShopping') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Order Submitted Success State -->
      <div v-else-if="orderSubmitted" class="checkout-header p-5 rounded-4 border text-center my-5 animate-fade-in">
        <div class="py-5">
          <div v-if="checkoutResponse?.payment?.method === 'khqr'" class="mb-4 d-flex flex-column align-items-center">

            <!-- Scanned State Full Screen Replacement -->
            <div v-if="realtimeStatus === 'scanned'" class="py-4 text-center animate-fade-in">
              <div
                class="mx-auto mb-4 border border-4 border-success rounded-circle d-flex align-items-center justify-content-center"
                style="width: 56px; height: 56px;">
                <i class="bi bi-check-lg text-success fs-2" style="margin-top: 2px;"></i>
              </div>
              <h3 class="mb-2 fw-semibold"
                style="color: #003366; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                QR scanned</h3>
              <p class="text-secondary" style="font-size: 1.1rem; color: #5a6b8c;">Confirm the payment in your banking
                app.</p>
            </div>

            <!-- KHQR Ticket Design (Hidden when Scanned) -->
            <div v-else class="khqr-ticket bg-white shadow-sm mb-3 position-relative overflow-hidden"
              style="width: 280px; border-radius: 16px; border: 1px solid #f3f4f6;">
              <!-- Red Header -->
              <div class="khqr-header text-white text-center py-3 position-relative" style="background-color: #e51d20;">
                <h4 class="fw-bold mb-0 tracking-wide d-flex align-items-center justify-content-center"
                  style="font-family: 'Arial', sans-serif;">
                  KH<span style="font-weight: 300;">QR</span>
                </h4>
                <!-- Cut out corner effect -->
                <div class="position-absolute bottom-0 end-0 bg-white"
                  style="width: 24px; height: 24px; clip-path: polygon(100% 0, 0% 100%, 100% 100%);"></div>
              </div>

              <!-- Account & Amount Info -->
              <div class="px-4 py-3 text-start">
                <p class="text-uppercase mb-1"
                  style="color: #2b3a55; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.5px;">
                  {{ settingStore.general?.store_name || 'TOS LOUK' }}
                </p>
                <div class="d-flex align-items-baseline gap-1">
                  <h3 class="fw-bold mb-0 text-dark">{{ checkoutResponse.payment.amount }}</h3>
                  <span class="text-muted fw-semibold" style="font-size: 0.75rem;">USD</span>
                </div>
              </div>

              <!-- Dashed Separator -->
              <div class="px-3">
                <hr class="m-0" style="border-top: 2px dashed #d1d5db; border-bottom: none; opacity: 1;">
              </div>

              <!-- QR Code Area -->
              <div class="p-4 position-relative d-flex justify-content-center">
                <qrcode-vue :value="checkoutResponse.qr_token" :size="200" level="H" render-as="svg" />

                <!-- Center Logo Overlay -->
                <div
                  class="position-absolute top-50 start-50 translate-middle bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style="width: 40px; height: 40px; border: 3.5px solid white;">
                  <span class="fw-bold" style="font-size: 1.1rem; margin-top: -2px;">$</span>
                </div>

                <!-- Expired / Failed Overlay -->
                <div v-if="timeRemaining <= 0 || realtimeStatus === 'failed'"
                  class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-90 d-flex flex-column align-items-center justify-content-center">
                  <i class="bi bi-x-circle text-danger fs-1 mb-2"></i>
                  <span class="fw-bold text-danger">{{ realtimeStatus === 'failed' ? 'Payment Failed' : 'QR Expired'
                    }}</span>
                </div>
              </div>
            </div>

            <!-- Helper text (Hidden when Scanned) -->
            <p v-if="realtimeStatus !== 'scanned'" class="text-secondary-custom mb-3 text-center"
              style="max-width: 250px; font-size: 0.9rem; line-height: 1.4;">
              Scan with mobile banking app that supports KHQR
            </p>

            <!-- Timer (Hidden when Scanned) -->
            <div v-if="realtimeStatus !== 'scanned'"
              class="text-danger fw-semibold d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-clock-history"></i>
              <span>Expires in: {{ countdownText }}</span>
            </div>
          </div>

          <div v-else>
            <div
              class="success-icon-wrapper mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle text-white shadow-sm"
              style="width: 90px; height: 90px;">
              <i class="bi bi-check-lg display-3"></i>
            </div>
            <h2 class="fw-bold text-main mb-2">{{ $t('checkout.successTitle') }}</h2>
            <p class="text-secondary-custom mb-4 mx-auto" style="max-width: 520px;">
              {{ $t('checkout.successDesc') }}
            </p>
          </div>
          <div class="d-flex justify-content-center gap-3 flex-wrap pt-2">
            <NuxtLink to="/user/profile"
              class="btn btn-primary-custom rounded-pill px-4 py-3 fw-semibold transition-all d-flex align-items-center gap-2">
              <i class="bi bi-box-seam"></i> {{ $t('checkout.viewOrders') }}
            </NuxtLink>
            <NuxtLink to="/" class="btn btn-outline-custom rounded-pill px-4 py-3 fw-semibold transition-all">
              {{ $t('cart.continueShopping') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Main Checkout Modular Grid -->
      <div v-else class="row g-4">
        <!-- Left Column: Shipping & Payment Details -->
        <div class="col-lg-7 col-xl-8">
          <CheckoutShippingForm
            :form="values"
            :errors="errors"
            :submit-count="submitCount"
            :meta="meta"
            @updateField="setFieldValue"
          />

          <CheckoutPaymentMethods :payment-method="values.payment_method" @update:paymentMethod="(val) => {
            setFieldValue('payment_method', val);
          }" />
        </div>

        <!-- Right Column: Order Summary (Sticky Card) -->
        <div class="col-lg-5 col-xl-4">
          <CheckoutOrderSummary :delivery-fee="currentDeliveryFee" :loading="loading" @submit="submitOrder" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
import { useCartStore } from "~/stores/cartStore";
import { useAuthStore } from "~/stores/authStore";
import { useSettingStore } from "~/stores/settingStore";
import { useAppToast } from "~/composables/ui/useAppToast";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { checkoutSchema } from "~/composables/forms/checkout";
import CheckoutShippingForm from "~/components/checkout/shipping-form.vue";
import CheckoutPaymentMethods from "~/components/checkout/payment-methods.vue";
import CheckoutOrderSummary from "~/components/checkout/order-summary.vue";
import QrcodeVue from 'qrcode.vue';

const cartStore = useCartStore();
const authStore = useAuthStore();
const settingStore = useSettingStore();
const router = useRouter();

const loading = ref(false);
const orderSubmitted = ref(false);
const isGettingLocation = ref(false);
const locationPinned = ref(false);

const checkoutResponse = ref(null);
const timeRemaining = ref(300);
const realtimeStatus = ref('pending');
let timerInterval = null;
let pollInterval = null;

const countdownText = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const startCountdown = () => {
  timeRemaining.value = 300; // 5 minutes
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timerInterval);
      stopPolling();
    }
  }, 1000);
  startPolling();
};

const nuxtApp = useNuxtApp();
let echoChannel = null;

const startPolling = () => {
  if (!nuxtApp.$echo) return;
  if (!checkoutResponse.value?.order?.uuid) return;

  const uuid = checkoutResponse.value.order.uuid;

  echoChannel = nuxtApp.$echo.channel(`orders.${uuid}`)
    .listen('.payment.scanned', (e) => {
      realtimeStatus.value = 'scanned';
    })
    .listen('.payment.success', (e) => {
      if (timerInterval) clearInterval(timerInterval);

      // Update checkoutResponse to trigger the v-else success block
      checkoutResponse.value.payment.method = 'paid';

      const { showSuccess } = useAppToast();
      showSuccess("Payment received successfully!");
      stopPolling();
    })
    .listen('.payment.expired', (e) => {
      if (timerInterval) clearInterval(timerInterval);
      timeRemaining.value = 0; // Triggers the existing Expired Overlay UI
      const { showError } = useAppToast();
      showError("Payment QR code has expired.");
      stopPolling();
    })
    .listen('.payment.failed', (e) => {
      if (timerInterval) clearInterval(timerInterval);
      realtimeStatus.value = 'failed';
      const { showError } = useAppToast();
      showError("Payment failed or rejected.");
      stopPolling();
    });
};

const stopPolling = () => {
  if (echoChannel && checkoutResponse.value?.order?.uuid) {
    nuxtApp.$echo.leaveChannel(`orders.${checkoutResponse.value.order.uuid}`);
    echoChannel = null;
  }
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  stopPolling();
});

// Setup VeeValidate form management
const { handleSubmit, errors, values, setFieldValue, resetForm, submitCount, meta } = useForm({
  validationSchema: toTypedSchema(checkoutSchema),
  initialValues: {
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_province: "Phnom Penh",
    shipping_street: "",
    shipping_latitude: null,
    shipping_longitude: null,
    delivery_method: "j_and_t",
    notes: "",
    payment_method: "bakong",
  },
});

const getCurrentLocation = (silent = true) => {
  if (!import.meta.client || !navigator.geolocation) {
    if (!silent) {
      const { showError } = useAppToast();
      showError("Geolocation is not supported by your browser.");
    }
    return;
  }
  isGettingLocation.value = true;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      setFieldValue("shipping_latitude", position.coords.latitude);
      setFieldValue("shipping_longitude", position.coords.longitude);
      locationPinned.value = true;
      isGettingLocation.value = false;

      const res = await $fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      ).catch(() => null);

      if (res && res.display_name) {
        if (!values.shipping_street) {
          setFieldValue("shipping_street", res.display_name);
        }
        const addrText = JSON.stringify(res.address || {}).toLowerCase();
        if (addrText.includes("phnom penh") || addrText.includes("ភ្នំពេញ")) {
          setFieldValue("shipping_province", "Phnom Penh");
        } else if (res.address && (res.address.state || res.address.province || res.address.city)) {
          // If detected outside Phnom Penh, check if state matches a known province
          const detectedProv = res.address.state || res.address.province || res.address.city;
          if (detectedProv && !values.shipping_province.includes(detectedProv)) {
            // Keep their exact province or fallback provincial check
          }
        }
      }

      if (!silent) {
        const { showSuccess } = useAppToast();
        showSuccess("Real GPS location detected!");
      }
    },
    (error) => {
      isGettingLocation.value = false;
      if (!silent) {
        const { showWarning } = useAppToast();
        showWarning("Please allow location access to pin your exact delivery coordinates.");
      }
      console.error("Geolocation error:", error);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

onMounted(async () => {
  if (!authStore.access_token) {
    router.push("/auth/login");
    return;
  }
  await authStore.fetchProfile();
  if (authStore.userProfile) {
    const name = authStore.userProfile.name || authStore.userProfile.full_name;
    if (name) setFieldValue("customer_name", name);

    const email = authStore.userProfile.email;
    if (email) setFieldValue("customer_email", email);

    const phone = authStore.userProfile.phone || authStore.userProfile.phone_number;
    if (phone) setFieldValue("customer_phone", phone);
  }
  // Automatically trigger location detection on checkout load completely silently
  if (import.meta.client) {
    getCurrentLocation(true);
  }
});

const currentDeliveryFee = computed(() => {
  if (cartStore.isFreeShipping) return 0;
  const phnomPenhFee = settingStore.settings?.shipping?.delivery_fee_phnom_penh !== undefined ? Number(settingStore.settings.shipping.delivery_fee_phnom_penh) : 1.50;
  const provincialFee = settingStore.settings?.shipping?.delivery_fee_provincial !== undefined ? Number(settingStore.settings.shipping.delivery_fee_provincial) : 2.00;

  // If user selected Phnom Penh but real GPS bounding box indicates outside Phnom Penh, charge provincial fee
  if (values.shipping_province === "Phnom Penh") {
    const lat = Number(values.shipping_latitude);
    const lon = Number(values.shipping_longitude);
    if (lat && lon && (lat < 11.42 || lat > 11.68 || lon < 104.80 || lon > 104.98)) {
      return provincialFee;
    }
    return phnomPenhFee;
  }
  return provincialFee;
});

const submitOrder = handleSubmit(async () => {
  if (cartStore.items.length === 0) return;

  if (!values.shipping_latitude || !values.shipping_longitude) {
    const { showWarning } = useAppToast();
    showWarning("Please allow location access to pin your exact GPS coordinates before placing your order.");
    getCurrentLocation(false);
    return;
  }

  loading.value = true;
  try {
    // Explicitly guarantee any guest items are synced to the DB before checkout
    await cartStore.syncCartWithDb();

    const payload = {
      payment_method: values.payment_method === "bakong" ? "khqr" : "cod",
      customer_name: values.customer_name,
      customer_email: values.customer_email,
      customer_phone: values.customer_phone,
      delivery_method: values.delivery_method,
      currency: "USD",
      country: "Cambodia",
      province: values.shipping_province,
      street: values.shipping_street,
      latitude: values.shipping_latitude,
      longitude: values.shipping_longitude,
      order_type: "web"
    };

    const response = await cartStore.checkoutOrder(payload);

    if (response) {
      checkoutResponse.value = response.data || response;
      orderSubmitted.value = true;
      cartStore.clearCart();

      const { showSuccess } = useAppToast();
      showSuccess("Your order has been placed successfully!");

      if (checkoutResponse.value?.payment?.method === 'khqr') {
        startCountdown();
      }
    } else {
      const { showError } = useAppToast();
      showError("Failed to submit your order. Please verify your connection or try again.");
    }
  } catch (err) {
    const { showError } = useAppToast();
    showError(err?.data?.message || err?.message || "Failed to submit your order.");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.checkout-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.checkout-header {
  background-color: var(--color-surface);
  border-color: var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.header-icon-box {
  background-color: var(--color-primary-light);
}

.text-main {
  color: var(--color-text);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.text-primary-custom {
  color: var(--color-primary);
}

.bg-icon-empty {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.success-icon-wrapper {
  background-color: var(--color-primary);
}

.btn-primary-custom {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px rgba(3, 185, 113, 0.25);
}

.btn-primary-custom:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: 0 6px 20px rgba(3, 185, 113, 0.4);
  transform: translateY(-2px);
}

.btn-outline-custom {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline-custom:hover {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-text-secondary);
  color: var(--color-text);
}
</style>
