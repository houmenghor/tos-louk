<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingStore } from '~/stores/settingStore';
import { useAuthStore } from '~/stores/authStore';

const { t, locale } = useI18n();
const requestUrl = useRequestURL();
const settingStore = useSettingStore();
const authStore = useAuthStore();

await Promise.all([
  useAsyncData("global-settings", () => settingStore.getSettings()),
  useAsyncData("auth-profile", async () => {
    if ((authStore.access_token || authStore.refresh_token) && !authStore.userProfile) {
      try {
        if (!authStore.access_token && authStore.refresh_token) {
          await authStore.refreshToken();
        }
        if (authStore.access_token && !authStore.userProfile) {
          await authStore.fetchProfile();
        }
      } catch (e) {
        if (e.response?.status === 401 && authStore.refresh_token) {
          try {
            await authStore.refreshToken();
            await authStore.fetchProfile(true);
          } catch (err) {
            authStore.access_token = null;
            authStore.refresh_token = null;
            authStore.userProfile = null;
          }
        } else {
          authStore.access_token = null;
          authStore.refresh_token = null;
          authStore.userProfile = null;
        }
      }
    }
    return authStore.userProfile;
  })
]);

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value || 'km'),
  },
  titleTemplate: computed(() => `%s | ${t('seo.siteName')}`)
});

useSeoMeta({
  description: () => t('seo.defaultProductDesc'),
  ogDescription: () => t('seo.defaultProductDesc'),
  ogImage: () => `${requestUrl.origin}/tos-louk.webp`,
  ogUrl: () => requestUrl.href,
  ogType: 'website',
  twitterCard: 'summary',
  twitterImage: () => `${requestUrl.origin}/tos-louk.webp`
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
