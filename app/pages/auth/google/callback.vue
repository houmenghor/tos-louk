<template>
  <div class="min-vh-100 d-flex flex-column align-items-center justify-content-center">
    <div class="spinner-border text-primary mb-3" role="status"></div>
    <h5 class="text-secondary">Completing Google Login...</h5>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/authStore';
import { useAppToast } from '~/composables/ui/useAppToast';

definePageMeta({ layout: 'auth' });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { showSuccess, showError } = useAppToast();

onMounted(async () => {
  const token = route.query.token;

  if (token) {
    authStore.access_token = token;
    try {
      await authStore.fetchProfile(true);
      showSuccess("Welcome back!", "Google login successful.");
       await navigateTo('/', { replace: true });
    } catch (error) {
      showError("Login failed", "Could not fetch profile.");
      await navigateTo('/auth/login');
    }
  } else {
    showError("Google Auth Error", "No token received.");
    await navigateTo('/auth/login');
  }
});
</script>
