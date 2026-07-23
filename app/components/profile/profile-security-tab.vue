<template>
  <div class="d-flex flex-column gap-4">
    <!-- Change Email Section -->
    <div class="settings-card p-4 p-md-5 rounded-4 border">
      <div class="d-flex justify-content-between align-items-start mb-1">
         <h5 class="fw-bold text-main mb-1 text-sm">Email Address</h5>
         <span v-if="pendingEmail" class="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold shadow-sm">
           <i class="bi bi-clock me-1"></i> Pending Verification
         </span>
         <span v-else class="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill fw-semibold">
           <i class="bi bi-check-circle-fill me-1"></i> Verified
         </span>
      </div>

      <template v-if="!pendingEmail">
        <p class="text-secondary-custom text-xs mb-4">
          Update your email address. A verification code will be sent to the new email.
        </p>

        <form @submit.prevent="submitEmail">
        <div class="row g-3">
          <div class="col-md-8">
            <BaseInput
              id="newEmail"
              :label="$t('profile.newEmail', 'New Email Address')"
              v-model="emailForm.new_email"
              :error="emailErrors.new_email"
              placeholder="new@example.com"
            />
            <div v-if="pendingEmail" class="mt-2 text-xs text-muted-custom">
               <span class="fw-semibold text-warning">Note:</span> 
               You requested to change your email to <strong>{{ pendingEmail }}</strong>. 
               <a href="#" @click.prevent="verifyPendingEmail" class="text-primary fw-semibold ms-1">Verify Now</a>
            </div>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <BaseButton
              statusType="submit"
              variants="primary"
              size="md"
              class="w-100 rounded-3 fw-semibold text-xs py-2 mb-3"
              :isLoading="isUpdatingEmail"
            >
              Update Email
            </BaseButton>
          </div>
        </div>
      </form>
      </template>

      <!-- Inline OTP Verification Form -->
      <template v-else>
        <p class="text-secondary-custom text-xs mb-4">
          We sent a 6-digit verification code to <strong>{{ pendingEmail }}</strong>. Enter it below to verify.
        </p>
        <form @submit.prevent="handleVerifyInlineOTP">
           <div class="d-flex gap-2 mb-4">
             <input
                v-for="(digit, index) in 6"
                :key="index"
                :id="'inline-otp-' + index"
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
           
           <div class="d-flex justify-content-between align-items-center">
             <p class="text-secondary-custom mb-0 text-xs">
                Didn't receive the code?
                <button
                  type="button"
                  @click="handleInlineResend"
                  class="btn btn-link p-0 text-primary fw-bold ms-1"
                  :disabled="countdown > 0"
                >
                  {{ countdown > 0 ? `Resend in ${formattedCountdown}` : "Resend Code" }}
                </button>
             </p>
             <div class="d-flex gap-2">
               <BaseButton
                 type="button"
                 variants="outline-secondary"
                 size="sm"
                 class="px-3 rounded-3 fw-semibold text-xs py-2"
                 @click="cancelEmailChange"
               >
                 Cancel
               </BaseButton>
               <BaseButton
                 statusType="submit"
                 variants="primary"
                 size="sm"
                 class="px-4 rounded-3 fw-semibold text-xs py-2"
                 :isLoading="isVerifyingOtp"
                 :isDisable="!isOtpComplete || isVerifyingOtp"
               >
                 Verify
               </BaseButton>
             </div>
           </div>
        </form>
      </template>
    </div>

    <!-- Update Password Section -->
    <div class="settings-card p-4 p-md-5 rounded-4 border">
      <h5 class="fw-bold text-main mb-1 text-sm">Update Password</h5>
      <p class="text-secondary-custom text-xs mb-4">
        Ensure your account is using a long, random password to stay secure.
      </p>

    <form @submit.prevent="submitPassword">
      <div class="row g-3">
        <div class="col-12">
          <BaseInputPassword
            id="currentPassword"
            :label="$t('profile.currentPassword', 'Current Password')"
            v-model="passwordForm.current_password"
            :error="passwordErrors.current_password"
            placeholder="••••••••"
          />
        </div>
        <div class="col-md-6">
          <BaseInputPassword
            id="newPassword"
            :label="$t('profile.newPassword', 'New Password')"
            v-model="passwordForm.new_password"
            :error="passwordErrors.new_password"
            placeholder="••••••••"
          />
        </div>
        <div class="col-md-6">
          <BaseInputPassword
            id="confirmPassword"
            :label="$t('profile.confirmPassword', 'Confirm Password')"
            v-model="passwordForm.confirm_password"
            :error="passwordErrors.confirm_password"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <BaseButton
          statusType="submit"
          variants="primary"
          size="md"
          class="px-4 py-2 rounded-pill fw-semibold text-xs"
          :isLoading="isUpdatingPassword"
        >
          <i class="bi bi-shield-lock"></i>
          {{ $t("profile.updatePassword", "Update Password") }}
        </BaseButton>
      </div>
    </form>
  </div>
  </div>
</template>

<script setup>
import { z } from "zod";
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "~/stores/authStore";
import { useAppToast } from "~/composables/ui/useAppToast";
import { useOtpInput } from "~/composables/ui/useOtpInput";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { getChangePasswordSchema } from "~/composables/forms/auth";
import { getApiError } from "~/utils/apiError";
import BaseInput from "~/components/base/base-input.vue";
import BaseInputPassword from "~/components/base/base-input-password.vue";
import BaseButton from "~/components/base/base-button.vue";

const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();
const { locale, t } = useI18n();

const isUpdatingPassword = ref(false);

const passwordForm = reactive({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

// Email State
const isUpdatingEmail = ref(false);
const emailForm = reactive({ new_email: "" });
const pendingEmailCookie = useCookie("pending_new_email", { maxAge: 60 * 60 * 24 });
const pendingEmail = computed(() => pendingEmailCookie.value);

const emailSchema = z.object({
  new_email: z.string().email(t('validation.email_invalid', 'Invalid email format')).min(1, t('validation.required', 'This field is required')),
});

const { handleSubmit: handleEmailSubmit, errors: emailErrors, resetForm: resetEmailForm } = useForm({
  validationSchema: toTypedSchema(emailSchema),
  initialValues: emailForm,
});
const { value: newEmailVal } = useField("new_email");
watch(() => emailForm.new_email, (val) => { newEmailVal.value = val; });

const submitEmail = handleEmailSubmit(async () => {
  isUpdatingEmail.value = true;
  try {
    await authStore.changeEmail({ new_email: emailForm.new_email });
    pendingEmailCookie.value = emailForm.new_email;
    showSuccess("Verification code sent to your new email.");
    resetEmailForm();
    startTimer();
    setTimeout(() => { document.getElementById("inline-otp-0")?.focus(); }, 100);
  } catch (error) {
    showError(getApiError(error));
  } finally {
    isUpdatingEmail.value = false;
  }
});

const verifyPendingEmail = async () => {
  // Not used in UI anymore since it auto shows OTP form
};

const cancelEmailChange = () => {
  pendingEmailCookie.value = null;
  otpDigits.value = Array(6).fill("");
  stopTimer();
};

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
} = useOtpInput(6, 600, "inline-otp-");

const isVerifyingOtp = ref(false);

const handleVerifyInlineOTP = async () => {
  if (!isOtpComplete.value) return;
  
  isVerifyingOtp.value = true;
  try {
    await authStore.verifyOtp({
      email: pendingEmail.value,
      purpose: "change_email",
      code: otpDigits.value.join(""),
    });

    showSuccess("Email verified successfully! Please log in again.");
    pendingEmailCookie.value = null;
    
    // Ignore potential 401 errors from logout since the session is already invalid
    try {
      await authStore.logout();
    } catch (logoutError) {
      authStore.access_token = null;
      authStore.refresh_token = null;
      authStore.userProfile = null;
      useCartStore().clearCart();
      useWishlistStore().clearWishlist();
      await navigateTo("/auth/login");
    }
  } catch (error) {
    showError(getApiError(error));
    otpDigits.value = Array(6).fill("");
    document.getElementById("inline-otp-0")?.focus();
  } finally {
    isVerifyingOtp.value = false;
  }
};

watch(isOtpComplete, (complete) => {
  if (complete && !isVerifyingOtp.value) {
    handleVerifyInlineOTP();
  }
});

const handleInlineResend = async () => {
  try {
    await authStore.resendOtp({
      email: pendingEmail.value,
      purpose: "change_email",
    });

    showSuccess("OTP Resend Successfully");
    startTimer();
  } catch (error) {
    showError(getApiError(error));
    otpDigits.value = Array(6).fill("");
    document.getElementById("inline-otp-0")?.focus();
  }
};

// Start timer if pending email exists on mount
onMounted(() => {
  if (pendingEmail.value) {
    startTimer();
  }
});

onBeforeUnmount(() => {
  stopTimer();
});

// Clear pending email if it matches the current verified profile email
watch(() => authStore.userProfile?.email, (currentEmail) => {
  if (currentEmail && pendingEmailCookie.value === currentEmail) {
    pendingEmailCookie.value = null;
  }
}, { immediate: true });

const {
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  resetForm: resetPassForm,
} = useForm({
  validationSchema: computed(() => toTypedSchema(getChangePasswordSchema(t))),
  initialValues: passwordForm,
});

const { value: currentPassVal } = useField("current_password");
const { value: newPassVal } = useField("new_password");
const { value: confirmPassVal } = useField("confirm_password");

watch(() => passwordForm.current_password, (val) => { currentPassVal.value = val; });
watch(() => passwordForm.new_password, (val) => { newPassVal.value = val; });
watch(() => passwordForm.confirm_password, (val) => { confirmPassVal.value = val; });

const submitPassword = handlePasswordSubmit(async () => {
  isUpdatingPassword.value = true;
  try {
    const payload = {
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password,
      new_password_confirmation: passwordForm.confirm_password,
    };
    await authStore.changePassword(payload);
    showSuccess(
      locale.value === "kh"
        ? "ផ្លាស់ប្តូរលេខសម្ងាត់ជោគជ័យ!"
        : "Password updated successfully!",
    );

    passwordForm.current_password = "";
    passwordForm.new_password = "";
    passwordForm.confirm_password = "";
    resetPassForm();
  } catch (error) {
    showError(
      getApiError(
        error,
        locale.value === "kh"
          ? "ការផ្លាស់ប្តូរលេខសម្ងាត់បរាជ័យ!"
          : "Failed to update password. Please check your inputs.",
      ),
    );
  } finally {
    isUpdatingPassword.value = false;
  }
});
</script>

<style scoped>
.settings-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-sm);
}

.text-main {
  color: var(--color-text);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
}

.otp-input {
  width: 48px;
  height: 52px;
  font-size: 20px;
  border-radius: 8px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.otp-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.otp-input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.3;
}
</style>
