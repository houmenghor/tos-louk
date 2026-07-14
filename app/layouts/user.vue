<template>
  <div class="app-layout min-vh-100 d-flex flex-column">
    <AppHeader />

    <main class="flex-grow-1">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppHeader from "~/components/layout/app-header.vue";
</script>

<style scoped>
.app-layout {
  background-color: var(--color-bg);
  color: var(--color-text);
}
</style>
