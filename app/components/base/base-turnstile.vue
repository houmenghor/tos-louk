<template>
  <div class="d-flex justify-content-center align-items-center mb-4">
    <NuxtTurnstile :key="turnstileTheme" ref="turnstileRef" :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)" :options="{ theme: turnstileTheme }" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: "",
  }
});

defineEmits(["update:modelValue"]);

const turnstileRef = ref(null);
const colorMode = useColorMode();
const turnstileTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'light');

const reset = () => {
  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
};

defineExpose({ reset });
</script>

<style scoped>
:deep(iframe) {
  border: none !important;
  outline: none !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
}
</style>