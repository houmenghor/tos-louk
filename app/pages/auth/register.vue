<template>
  <div class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
    <div class="row w-100 align-items-center">
      <!-- Banner Column (Hidden on mobile) -->
      <div class="col-12 col-md-6 d-none d-md-block">
        <div class="image-banner text-center animate-fade-in">
          <NuxtImg :src="banner" alt="Authentication Banner" class="img-fluid auth-banner-img" />
        </div>
      </div>

      <!-- Glassmorphic Form Column -->
      <div class="col-12 col-md-6">
        <div class="glass-card mx-auto">
          <form @submit.prevent="handleRegister" autocomplete="off">
            <h2 class="form-title">Create an Account</h2>
            <p class="form-subtitle">Join us today! Please enter your details.</p>

            <BaseInput label="Full Name" placeholder="Enter your Full Name" id="full_name" v-model="full_name"
              :error="nameError" class="mb-2" />

            <BaseInput label="Email" placeholder="Enter your email" id="email" type="email" v-model="email"
              :error="emailError" class="mb-2" />

            <BaseInputPassword label="Password" placeholder="Enter your password" id="password" v-model="password"
              :error="passwordError" class="mb-2" />

            <BaseInputPassword label="Confirm Password" placeholder="Confirm your password" id="password_confirmation"
              v-model="password_confirmation" :error="confirmPasswordError" class="mb-3" />

            <BaseTurnstile ref="turnstileRef" v-model="turnstileToken" />

            <BaseButton statusType="submit" size="sm" :isLoading="isSubmitting"
              :isDisable="!turnstileToken || isSubmitting" class="w-100 mb-2 btn-submit-glass">Sign Up
            </BaseButton>

            <div v-if="errorMessage" class="text-danger small mb-3 text-center">
              {{ errorMessage }}
            </div>

            <!-- Divider Line -->
            <div class="divider-container mb-2">
              <span class="divider-text">or</span>
            </div>

            <!-- Google OAuth Sign Up Button -->
            <BaseButton statusType="button" class="w-100 mb-2 btn-google-glass" @click="handleGoogleRegister"
              :isDisable="!turnstileToken">
              <i class="bi bi-google"></i>
              <span>Sign up with Google</span>
            </BaseButton>

            <!-- Facebook OAuth Sign Up Button -->
            <BaseButton statusType="button" class="w-100 mb-4 btn-facebook-glass" @click="handleFacebookRegister"
              :isDisable="!turnstileToken">
              <i class="bi bi-facebook"></i>
              <span>Sign up with Facebook</span>
            </BaseButton>


            <p class="text-center text-secondary-custom mb-0">
              Already have an account?
              <NuxtLink to="/auth/login" class="glass-link-primary fw-bold ms-1">Login here</NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import banner from '/images/auth/banner.png';
import { registerSchema } from '~/composables/forms/auth';
import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAppToast } from '~/composables/ui/useAppToast';
import BaseTurnstile from '~/components/base/base-turnstile.vue';
import { getApiError } from '~/utils/apiError';

definePageMeta({
  layout: 'auth'
});

const settingStore = useSettingStore();
const authStore = useAuthStore();
const { showSuccess } = useAppToast();
const errorMessage = ref("");
const turnstileRef = ref(null);
const turnstileToken = ref("");

await settingStore.getSettings();

const isForcePassword = computed(() => {
  return settingStore.settings?.maintenance?.force_strong_passwords == 1;
});

const dynamicSchema = computed(() => {
  return toTypedSchema(registerSchema(isForcePassword.value));
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: dynamicSchema,
  initialValues: {
    full_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }
});

const { value: full_name, errorMessage: nameError } = useField("full_name");
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: password_confirmation, errorMessage: confirmPasswordError } = useField("password_confirmation");


const handleRegister = handleSubmit(async (value) => {
  if (!turnstileToken.value) {
    errorMessage.value = "Please complete the CAPTCHA challenge.";
    return;
  }
  errorMessage.value = "";

  try {
    await authStore.register({
      ...value,
      "cf-turnstile-response": turnstileToken.value
    });

    showSuccess("Registration successful! Please check your email.");
    await authStore.startOtpFlow(value.email, 'email_verify');

  } catch (error) {
    console.error("Error on registration:", error);
    errorMessage.value = getApiError(error, "Registration failed. Please try again.");

    turnstileToken.value = "";
    turnstileRef.value.reset();
  }
});

// Google OAuth registration handler
const config = useRuntimeConfig();
const handleGoogleRegister = () => {
  navigateTo(`${config.public.apiBase}/auth/google/redirect`, {
    external: true,
    replace: true
  });
};

const handleFacebookRegister = () => {
  navigateTo(`${config.public.apiBase}/auth/facebook/redirect`, {
    external: true,
    replace: true
  });
};
</script>

<style scoped>
/* Glassmorphic Container Card */
.glass-card {
  max-width: 460px;
  padding: 2.5rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
}

.form-title {
  font-family: var(--font-main);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.text-secondary-custom {
  color: var(--color-text-secondary);
  font-size: 13px;
}

/* Links & Interactive Items */
.glass-link-primary {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.glass-link-primary:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* Button override to inject glass behavior/colors */
.btn-submit-glass {
  background-color: var(--color-primary) !important;
  color: #111827 !important;
  font-weight: 600;
  border: none;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-submit-glass:hover {
  background-color: var(--color-primary-hover) !important;
  transform: translateY(-1px);
}

/* Custom Glassmorphic Google OAuth Button */
.btn-google-glass {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 8px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-google-glass:hover {
  background: var(--glass-hover-bg);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* Custom Glassmorphic Facebook OAuth Button */
.btn-facebook-glass {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 8px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-facebook-glass:hover {
  background: rgba(24, 119, 242, 0.1);
  color: #1877f2;
  border-color: #1877f2;
}

/* Text and Line Divider Element styling */
.divider-container {
  display: flex;
  align-items: center;
  text-align: center;
}

.divider-container::before,
.divider-container::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
  opacity: 0.6;
}

.divider-text {
  padding: 0 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* Subtle banner styling */
.auth-banner-img {
  max-height: 480px;
  object-fit: contain;
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.05));
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>