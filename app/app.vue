<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  titleTemplate: computed(() => `%s | ${t('seo.siteName')}`)
});

useSeoMeta({
  description: () => t('seo.defaultProductDesc'),
  ogDescription: () => t('seo.defaultProductDesc')
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
