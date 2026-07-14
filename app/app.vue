<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const requestUrl = useRequestURL();

useHead({
  titleTemplate: computed(() => `%s | ${t('seo.siteName')}`)
});

useSeoMeta({
  description: () => t('seo.defaultProductDesc'),
  ogDescription: () => t('seo.defaultProductDesc'),
  ogImage: () => `${requestUrl.origin}/tos-louk.webp`,
  ogUrl: () => requestUrl.href,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterImage: () => `${requestUrl.origin}/tos-louk.webp`
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
