<template>
  <div
    class="container min-vh-100 d-flex align-items-center justify-content-center py-5"
  >
    <div class="glass-card text-center animate-fade-in">
      <!-- Premium Glass Icon Badge & Spinner -->
      <div class="loader-wrapper mb-4 position-relative">
        <div class="custom-spinner"></div>
        <div
          class="facebook-icon-holder d-flex align-items-center justify-content-center"
        >
          <i class="bi bi-facebook text-primary-brand fs-4"></i>
        </div>
      </div>

      <h3 class="form-title mb-2">Facebook Authentication</h3>
      <p class="form-subtitle">Completing login, please hold on a moment...</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/authStore";
import { useAppToast } from "~/composables/ui/useAppToast";
import { getApiError } from "~/utils/apiError";

definePageMeta({ layout: "auth" });

const route = useRoute();
const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();

onMounted(async () => {
  const token = route.query.token;
  const errorQuery = route.query.error || route.query.message;

  if (errorQuery) {
    showError("Facebook Auth Error: " + decodeURIComponent(errorQuery));
    await navigateTo("/auth/login");
    return;
  }

  if (token) {
    const oauthCookie = useCookie("at", {
      maxAge: 7 * 24 * 60 * 60, // 7 days specifically for OAuth
      path: "/",
      sameSite: "lax"
    });
    oauthCookie.value = token;
    authStore.access_token = token;
    try {
      await authStore.fetchProfile(true);
      
      const cartStore = useCartStore();
      const wishlistStore = useWishlistStore();
      await Promise.all([
        cartStore.syncCartWithDb(),
        wishlistStore.syncWishlistWithDb(),
      ]);

      showSuccess("Facebook login successful. Welcome back!");
      await navigateTo("/", { replace: true });
    } catch (error) {
      showError("Login failed: " + getApiError(error, "Could not fetch profile."));
      await navigateTo("/auth/login");
    }
  } else {
    showError("Facebook Auth Error: No token received.");
    await navigateTo("/auth/login");
  }
});
</script>

<style scoped>
/* Glassmorphic Shell Panel */
.glass-card {
  max-width: 440px;
  width: 100%;
  padding: 3.5rem 2rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.glass-card:hover {
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
}

/* Typography styles matching other auth pages */
.form-title {
  font-family: var(--font-main);
  font-weight: 700;
  color: var(--color-text);
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 0;
}

/* Facebook theme color */
.text-primary-brand {
  color: #1877f2;
}

/* Premium Spinner */
.loader-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.custom-spinner {
  width: 100%;
  height: 100%;
  border: 3px solid var(--color-border);
  border-top: 3px solid #1877f2;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;
}

.facebook-icon-holder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: var(--color-surface);
  border-radius: 50%;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes spin {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
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
