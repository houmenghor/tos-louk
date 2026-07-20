<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingStore } from '~/stores/settingStore';
import { useAuthStore } from '~/stores/authStore';
import { useCartStore } from '~/stores/cartStore';
import { useWishlistStore } from '~/stores/wishlistStore';
import { onMounted } from 'vue';

const { t, locale } = useI18n();
const requestUrl = useRequestURL();
const settingStore = useSettingStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

onMounted(() => {
  cartStore.initCart();
  wishlistStore.initWishlist();
});

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

const defaultLogo = computed(() => settingStore.settings?.general?.store_logo || `${requestUrl.origin}/tos-louk.webp`);
const siteName = computed(() => settingStore.settings?.general?.store_name || t('seo.siteName'));

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value || 'km'),
  },
  titleTemplate: computed(() => `%s | ${siteName.value}`),
  link: () => [
    {
      rel: "icon",
      type: "image/png",
      href: defaultLogo.value
    }
  ]
});

useSeoMeta({
  description: () => t('seo.defaultProductDesc'),
  ogDescription: () => t('seo.defaultProductDesc'),
  ogImage: () => defaultLogo.value,
  ogUrl: () => requestUrl.href,
  ogType: 'website',
  twitterCard: 'summary',
  twitterImage: () => defaultLogo.value
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
