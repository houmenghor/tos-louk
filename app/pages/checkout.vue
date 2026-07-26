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

      <!-- Loading Existing Order State -->
      <div v-if="isFetchingExistingOrder" class="checkout-header p-5 rounded-4 border text-center my-5">
        <div class="py-5">
          <div class="spinner-border text-primary-custom mb-3" role="status"></div>
          <p class="text-secondary-custom mb-0">Retrieving order payment details...</p>
        </div>
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="cartStore.items.length === 0 && !orderSubmitted"
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
              <h3 class="mb-2 fw-semibold text-main">
                {{ $t('checkout.qrScanned') }}</h3>
              <p class="text-secondary-custom fs-5">{{ $t('checkout.confirmPaymentApp') }}</p>
            </div>

            <!-- KHQR Ticket Design (Hidden when Scanned) -->
            <div v-else class="khqr-ticket shadow-md mb-3 position-relative overflow-hidden"
              style="width: 280px; border-radius: 16px; background-color: #ffffff !important; border: 1px solid #e2e8f0; color: #0f172a !important;">
              <!-- Red Header -->
              <div class="khqr-header text-white text-center py-3 position-relative" style="background-color: #e11d48 !important;">
                <h4 class="fw-bold mb-0 tracking-wide d-flex align-items-center justify-content-center text-white">
                  KH<span style="font-weight: 300;">QR</span>
                </h4>
                <!-- Cut out corner effect -->
                <div class="position-absolute bottom-0 end-0"
                  style="width: 24px; height: 24px; background-color: #ffffff !important; clip-path: polygon(100% 0, 0% 100%, 100% 100%);"></div>
              </div>

              <!-- Account & Amount Info -->
              <div class="px-4 py-3 text-start" style="background-color: #ffffff !important;">
                <p class="text-uppercase mb-1 fw-semibold small" style="letter-spacing: 0.5px; color: #475569 !important;">
                  {{ settingStore.settings?.general?.store_name || 'TOS LOUK' }}
                </p>
                <div class="d-flex align-items-baseline gap-1">
                  <h3 class="fw-bold mb-0" style="color: #0f172a !important;">{{ checkoutResponse.payment.amount }}</h3>
                  <span class="fw-semibold small" style="color: #64748b !important;">USD</span>
                </div>
              </div>

              <!-- Dashed Separator -->
              <div class="px-3" style="background-color: #ffffff !important;">
                <hr class="m-0" style="border-top: 2px dashed #cbd5e1 !important; border-bottom: none; opacity: 1;">
              </div>

              <!-- QR Code Area -->
              <div class="p-4 position-relative d-flex justify-content-center" style="background-color: #ffffff !important;">
                <qrcode-vue :value="checkoutResponse.qr_token" :size="200" level="H" render-as="svg" background="#ffffff" foreground="#000000" />

                <!-- Center Logo Overlay -->
                <div
                  class="position-absolute top-50 start-50 translate-middle text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style="width: 40px; height: 40px; background-color: #0f172a !important; border: 3.5px solid #ffffff !important;">
                  <span class="fw-bold fs-5" style="margin-top: -2px; color: #ffffff !important;">$</span>
                </div>

                <!-- Expired / Failed Overlay -->
                <div v-if="timeRemaining <= 0 || realtimeStatus === 'failed'"
                  class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                  style="background-color: rgba(255, 255, 255, 0.95) !important;">
                  <i class="bi bi-x-circle text-danger fs-1 mb-2"></i>
                  <span class="fw-bold text-danger">{{ realtimeStatus === 'failed' ? $t('checkout.paymentFailed') : $t('checkout.qrExpired')
                    }}</span>
                </div>
              </div>
            </div>

            <!-- Helper text (Hidden when Scanned) -->
            <p v-if="realtimeStatus !== 'scanned'" class="text-secondary-custom mb-3 text-center small"
              style="max-width: 250px; line-height: 1.4;">
              {{ $t('checkout.scanHelper') }}
            </p>

            <!-- Timer (Hidden when Scanned) -->
            <div v-if="realtimeStatus !== 'scanned'"
              class="text-danger fw-semibold d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-clock-history"></i>
              <span>{{ $t('checkout.expiresIn') }}: {{ countdownText }}</span>
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
            <NuxtLink to="/user"
              class="btn btn-primary-custom rounded-pill px-4 py-3 fw-semibold transition-all d-flex align-items-center gap-2">
              <i class="bi bi-box-seam"></i> {{ $t('checkout.viewOrders') }}
            </NuxtLink>
            <NuxtLink to="/" class="btn btn-outline-custom rounded-pill px-4 py-3 fw-semibold transition-all">
              {{ $t('cart.continueShopping') }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Main Checkout Wizard -->
      <template v-else>
        <!-- Premium Stepper UI -->
      <div class="checkout-stepper mb-5 mx-auto" style="max-width: 500px; padding-bottom: 2.5rem;">
        <div class="d-flex align-items-center">
          
          <!-- Step 1 -->
          <div class="position-relative d-flex justify-content-center">
            <div class="step-circle rounded-circle d-flex align-items-center justify-content-center transition-stepper fw-bold fs-5"
                 :class="currentStep >= 1 ? 'active-step' : 'inactive-step'"
                 style="width: 44px; height: 44px; z-index: 2;">
              <i v-if="currentStep > 1" class="bi bi-check-lg fs-4 fade-in"></i>
              <span v-else class="fade-in">1</span>
            </div>
            <div class="position-absolute mt-2 pt-1 text-xs fw-bold text-center transition-stepper text-nowrap" 
                 style="top: 100%;"
                 :class="currentStep >= 1 ? 'text-main' : 'text-secondary-custom'">
              {{ $t('checkout.stepShipping') }}
            </div>
          </div>

          <!-- Line 1 to 2 -->
          <div class="flex-grow-1 transition-stepper mx-2" 
               :style="{
                 height: '3px',
                 background: currentStep >= 2 ? 'linear-gradient(90deg, var(--color-primary), #00dc82)' : 'var(--color-border)',
                 boxShadow: currentStep >= 2 ? '0 0 8px rgba(3, 185, 113, 0.4)' : 'none',
                 borderRadius: '3px'
               }">
          </div>

          <!-- Step 2 -->
          <div class="position-relative d-flex justify-content-center">
            <div class="step-circle rounded-circle d-flex align-items-center justify-content-center transition-stepper fw-bold fs-5"
                 :class="currentStep >= 2 ? 'active-step' : 'inactive-step'"
                 style="width: 44px; height: 44px; z-index: 2;">
              <i v-if="currentStep > 2" class="bi bi-check-lg fs-4 fade-in"></i>
              <span v-else class="fade-in">2</span>
            </div>
            <div class="position-absolute mt-2 pt-1 text-xs fw-bold text-center transition-stepper text-nowrap" 
                 style="top: 100%;"
                 :class="currentStep >= 2 ? 'text-main' : 'text-secondary-custom'">
              {{ $t('checkout.stepPayment') }}
            </div>
          </div>

          <!-- Line 2 to 3 -->
          <div class="flex-grow-1 transition-stepper mx-2" 
               :style="{
                 height: '3px',
                 background: currentStep >= 3 ? 'linear-gradient(90deg, var(--color-primary), #00dc82)' : 'var(--color-border)',
                 boxShadow: currentStep >= 3 ? '0 0 8px rgba(3, 185, 113, 0.4)' : 'none',
                 borderRadius: '3px'
               }">
          </div>

          <!-- Step 3 -->
          <div class="position-relative d-flex justify-content-center">
            <div class="step-circle rounded-circle d-flex align-items-center justify-content-center transition-stepper fw-bold fs-5"
                 :class="currentStep === 3 ? 'active-step' : 'inactive-step'"
                 style="width: 44px; height: 44px; z-index: 2;">
              <span class="fade-in">3</span>
            </div>
            <div class="position-absolute mt-2 pt-1 text-xs fw-bold text-center transition-stepper text-nowrap" 
                 style="top: 100%;"
                 :class="currentStep === 3 ? 'text-main' : 'text-secondary-custom'">
              {{ $t('checkout.stepSummary') }}
            </div>
          </div>

        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">
          <div v-if="currentStep === 1" key="step1" class="w-100">
            <CheckoutShippingForm
              :form="values"
              :errors="errors"
              :submit-count="localSubmitCount"
              :meta="meta"
              @updateField="setFieldValue"
              @next="validateAndNextStep(1)"
            />
          </div>

          <div v-else-if="currentStep === 2" key="step2" class="w-100">
            <CheckoutPaymentMethods 
              :payment-method="values.payment_method" 
              @update:paymentMethod="(val) => { setFieldValue('payment_method', val); }" 
              @back="currentStep = 1"
              @next="currentStep = 3"
            />
          </div>

          <div v-else-if="currentStep === 3" key="step3" class="w-100">
            <CheckoutOrderSummary 
              :delivery-fee="currentDeliveryFee" 
              :loading="loading" 
              @back="currentStep = 2"
              @submit="submitOrder" 
            />
          </div>
        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
import { useCartStore } from "~/stores/cartStore";
import { useAuthStore } from "~/stores/authStore";
import { useSettingStore } from "~/stores/settingStore";
import { getApiError } from '~/utils/apiError';
import { useAppToast } from "~/composables/ui/useAppToast";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { getCheckoutSchema } from "~/composables/forms/checkout";
import CheckoutShippingForm from "~/components/checkout/shipping-form.vue";
import CheckoutPaymentMethods from "~/components/checkout/payment-methods.vue";
import CheckoutOrderSummary from "~/components/checkout/order-summary.vue";
import QrcodeVue from 'qrcode.vue';

const { t } = useI18n();
const { showSuccess, showError, showWarning } = useAppToast();
const cartStore = useCartStore();
const authStore = useAuthStore();
const settingStore = useSettingStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const orderSubmitted = ref(false);
const isFetchingExistingOrder = ref(false);
const isGettingLocation = ref(false);
const locationPinned = ref(false);

const checkoutResponse = ref(null);
const timeRemaining = ref(300);
const realtimeStatus = ref('pending');
let timerInterval = null;
let pollInterval = null;

const currentStep = ref(1);
const localSubmitCount = ref(0);

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

      showSuccess("Payment received successfully!");
      stopPolling();
    })
    .listen('.payment.expired', (e) => {
      if (timerInterval) clearInterval(timerInterval);
      timeRemaining.value = 0; // Triggers the existing Expired Overlay UI
      showError("Payment QR code has expired.");
      stopPolling();
    })
    .listen('.payment.failed', (e) => {
      if (timerInterval) clearInterval(timerInterval);
      realtimeStatus.value = 'failed';
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
const { handleSubmit, errors, values, setFieldValue, resetForm, submitCount, meta, validate } = useForm({
  validationSchema: toTypedSchema(getCheckoutSchema(t)),
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

const validateAndNextStep = async (step) => {
  localSubmitCount.value++;
  const { valid, errors: formErrors } = await validate();
  
  if (step === 1) {
    const step1Fields = ['customer_name', 'customer_email', 'customer_phone', 'shipping_province', 'shipping_street', 'delivery_method'];
    const hasStep1Errors = step1Fields.some(field => formErrors[field]);
    if (!hasStep1Errors) {
      currentStep.value = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showWarning("Please fill in all required shipping fields correctly.");
    }
  }
};

const getCurrentLocation = (silent = true) => {
  if (!import.meta.client || !navigator.geolocation) {
    if (!silent) {
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
        showSuccess("Real GPS location detected!");
      }
    },
    (error) => {
      isGettingLocation.value = false;
      if (!silent) {
        showWarning("Location denied. Please enable GPS in your browser settings to continue.");
      }
      console.error("Geolocation error:", error);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

const checkExistingOrder = async () => {
  const uuid = route.query.uuid;
  const orderNo = route.query.order_no;

  if (!uuid && !orderNo) return;

  isFetchingExistingOrder.value = true;
  try {
    let orderData = null;
    if (uuid) {
      const res = await $fetch(`/api/orders/${uuid}`).catch(() => null);
      orderData = res?.data;
    }
    
    if (!orderData && orderNo) {
      const res = await $fetch(`/api/orders`, { query: { search: orderNo } }).catch(() => null);
      if (res?.data && Array.isArray(res.data)) {
        orderData = res.data.find(o => o.order_no === orderNo || o.uuid === orderNo);
      }
    }

    if (orderData) {
      const payment = orderData.latest_payment || orderData.latestPayment || orderData.payment || (orderData.payments && orderData.payments[0]);
      
      let qrToken = payment?.qr_token || orderData.qr_token || "";
      const checkoutUrl = payment?.checkout_url || orderData.checkout_url || "";
      const paymentMethod = payment?.method || (orderData.delivery_method === 'cod' ? 'cod' : 'khqr');

      // Fallback for orders created before provider_response was saved in DB
      if (!qrToken && paymentMethod === 'khqr') {
        const storeName = settingStore.settings?.general?.store_name || "TOS LOUK";
        const amountStr = Number(orderData.grand_total).toFixed(2);
        const bakongAcc = settingStore.settings?.payment?.bakong_account || "toslouk@abaa";
        const cleanOrderNo = (orderData.order_no || "ORDER").replace(/[^a-zA-Z0-9]/g, "");
        
        qrToken = `00020101021230${(bakongAcc.length + 18).toString().padStart(2, '0')}0016${bakongAcc}5204822053038405404${amountStr.length.toString().padStart(2, '0')}${amountStr}5802KH59${storeName.length.toString().padStart(2, '0')}${storeName}6003PNH62${(cleanOrderNo.length + 4).toString().padStart(2, '0')}01${cleanOrderNo.length.toString().padStart(2, '0')}${cleanOrderNo}6304A1B2`;
      }

      checkoutResponse.value = {
        order: orderData,
        payment: {
          uuid: payment?.uuid || orderData.uuid,
          amount: payment?.amount || orderData.grand_total,
          method: paymentMethod,
          status: payment?.status || orderData.payment_status,
          expires_at: payment?.expires_at || orderData.expires_at
        },
        qr_token: qrToken,
        checkout_url: checkoutUrl
      };

      orderSubmitted.value = true;

      if (orderData.payment_status === 'paid' || orderData.payment_status === 'completed' || orderData.status === 'completed') {
        checkoutResponse.value.payment.method = 'paid';
      } else if (paymentMethod === 'khqr') {
        startCountdown();
      }
    }
  } catch (err) {
    console.error("Failed to load existing order payment:", err);
  } finally {
    isFetchingExistingOrder.value = false;
  }
};

onMounted(async () => {
  if (!authStore.access_token) {
    router.push("/auth/login");
    return;
  }
  cartStore.initCart();
  await authStore.fetchProfile();
  if (authStore.userProfile) {
    const name = authStore.userProfile.name || authStore.userProfile.full_name;
    if (name) setFieldValue("customer_name", name);

    const email = authStore.userProfile.email;
    if (email) setFieldValue("customer_email", email);

    const phone = authStore.userProfile.phone || authStore.userProfile.phone_number;
    if (phone) setFieldValue("customer_phone", phone);
  }

  // Check if we are reopening an existing unpaid order (via Pay Now button)
  await checkExistingOrder();

  // Automatically trigger location detection on checkout load completely silently
  if (import.meta.client && !orderSubmitted.value) {
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

  if (loading.value) return;

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

      showSuccess("Your order has been placed successfully!");

      if (checkoutResponse.value?.payment?.method === 'khqr') {
        startCountdown();
      }
    } else {
      showError("Failed to submit your order. Please verify your connection or try again.");
    }
  } catch (err) {
    showError(getApiError(err, "Failed to submit your order."));
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

.bg-theme-main {
  background-color: var(--color-bg);
}

.bg-surface {
  background-color: var(--color-surface);
}

.border-custom {
  border-color: var(--color-border) !important;
}

/* Premium Stepper Styles */
.transition-stepper {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.active-step {
  background: linear-gradient(135deg, var(--color-primary), #00dc82);
  color: #fff;
  box-shadow: 0 8px 20px rgba(3, 185, 113, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3);
  border: 2px solid transparent;
  transform: scale(1.15);
  z-index: 5;
}

.inactive-step {
  background: var(--color-surface);
  color: var(--color-text-muted, #888);
  border: 2px solid var(--color-border);
  box-shadow: none;
}

.fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>
