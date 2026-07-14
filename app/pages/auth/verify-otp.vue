<template>
  <div
    class="container min-vh-100 d-flex align-items-center justify-content-center py-5"
  >
    <div class="glass-card mx-auto text-center">
      <form @submit.prevent="handleVerifyOTP" autocomplete="off">
        <!-- Premium Glass Icon Badge -->
        <div class="icon-badge-wrapper mb-4 mx-auto">
          <div class="icon-badge">
            <i class="bi bi-shield-check text-primary-brand"></i>
          </div>
        </div>

        <h2 class="form-title">Verify Your Email</h2>
        <p class="form-subtitle">
          We've sent a 6-digit verification code to your email. Please enter it
          below to verify your identity.
        </p>

        <!-- Updated OTP Inputs Group: Render 6 slots dynamically -->
        <div class="d-flex justify-content-center gap-2 mb-4">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :id="'otp-' + index"
            type="text"
            maxlength="1"
            class="form-control otp-input text-center fw-bold"
            v-model="otpDigits[index]"
            @input="handleInput($event, index)"
            @keydown.delete="handleBackspace($event, index)"
            @paste="handlePaste"
            placeholder="-"
            required
          />
        </div>

        <BaseButton
          type="submit"
          class="w-100 mb-4 btn-submit-glass"
          :isLoading="isSubmitting"
          :isDisable="!isOtpComplete || isSubmitting"
        >
          Verify Code
        </BaseButton>

        <div
          v-if="errorMessage || codeError"
          class="text-danger small mb-3 text-center"
        >
          {{ errorMessage || codeError }}
        </div>

        <!-- Countdown & Resend Option -->
        <p class="text-secondary-custom mb-0">
          Didn't receive the code?
          <button
            type="button"
            @click="handleResend"
            class="btn btn-link p-0 glass-link-primary fw-bold ms-1"
            :disabled="countdown > 0"
          >
            {{
              countdown > 0 ? `Resend in ${formattedCountdown}` : "Resend Code"
            }}
          </button>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { onMounted, onBeforeUnmount } from "vue";
import { verifyOtpSchema } from "~/composables/forms/auth";
import { useAppToast } from "~/composables/ui/useAppToast";
import { useOtpInput } from "~/composables/ui/useOtpInput";
import { getApiError } from "~/utils/apiError";

definePageMeta({
  layout: "auth",
});

const {
  otpDigits,
  countdown,
  formattedCountdown,
  isOtpComplete,
  handleInput,
  handleBackspace,
  handlePaste,
  startTimer,
  stopTimer,
} = useOtpInput(6, 600);

const authStore = useAuthStore();
const { showSuccess } = useAppToast();

const email = computed(() => authStore.otpEmail || authStore.registerEmail);
const purpose = computed(() => authStore.otpPurpose || "email_verify");
const errorMessage = ref("");

if (!email.value) {
  navigateTo("/auth/register");
}

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(verifyOtpSchema),
  initialValues: {
    code: "",
  },
});

const { value: code, errorMessage: codeError, validate } = useField("code");

watch(
  otpDigits,
  (newDigits) => {
    code.value = newDigits.join("");
    validate();
  },
  { deep: true },
);

const handleVerifyOTP = handleSubmit(async (values) => {
  errorMessage.value = "";

  try {
    const res = await authStore.verifyOtp({
      email: email.value,
      purpose: purpose.value,
      code: values.code,
    });

    showSuccess("OTP Verified Successfully");
    if (purpose.value === "reset_password") {
      authStore.resetToken = res?.data?.token;
      await navigateTo("/auth/reset-password");
    } else {
      await navigateTo("/auth/login");
    }
  } catch (error) {
    errorMessage.value = getApiError(error);
    otpDigits.value = Array(6).fill("");
    document.getElementById("otp-0")?.focus();
  }
});

watch(isOtpComplete, (complete) => {
  if (complete && !isSubmitting.value) {
    handleVerifyOTP();
  }
});

const handleResend = async () => {
  try {
    await authStore.resendOtp({
      email: email.value,
      purpose: purpose.value,
    });

    showSuccess("OTP Resend Successfully");
    startTimer();
  } catch (error) {
    errorMessage.value = getApiError(error);
    otpDigits.value = Array(6).fill("");
    document.getElementById("otp-0")?.focus();
  }
};

onMounted(() => {
  startTimer();
  document.getElementById("otp-0")?.focus();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped>
/* Glassmorphic Shell Panel */
.glass-card {
  max-width: 460px;
  width: 100%;
  padding: 3rem 2rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
}

/* Icon Design Enhancements */
.icon-badge-wrapper {
  width: 72px;
  height: 72px;
  background: var(--color-primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-badge i {
  font-size: 2rem;
}

.form-title {
  font-family: var(--font-main);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin-bottom: 2.2rem;
}

/* Custom OTP Character Slots - width adjusted slightly to comfortably fit 6 in a row */
.otp-input {
  width: 52px;
  height: 56px;
  font-size: 22px;
  border-radius: 10px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition:
    border-color 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}

.otp-input:focus {
  outline: none;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.otp-input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.3;
}

/* Primary Glass Buttons */
.btn-submit-glass {
  background-color: var(--color-primary) !important;
  color: #111827 !important;
  font-weight: 600;
  border: none;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-submit-glass:hover:not(:disabled) {
  background-color: var(--color-primary-hover) !important;
  transform: translateY(-1px);
}

.btn-submit-glass:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-secondary-custom {
  color: var(--color-text-secondary);
  font-size: 13.5px;
}

.glass-link-primary {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 13.5px;
  transition: color 0.2s ease;
  border: none;
  background: none;
}

.glass-link-primary:hover:not(:disabled) {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.glass-link-primary:disabled {
  color: var(--color-text-secondary);
  opacity: 0.6;
  cursor: default;
}

.text-primary-brand {
  color: var(--color-primary);
}
</style>
