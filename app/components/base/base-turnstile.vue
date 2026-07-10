<template>
  <div class="turnstile-wrapper mb-3">
    <NuxtTurnstile
      :key="turnstileTheme"
      ref="turnstileRef"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :options="{ theme: turnstileTheme, size: 'flexible' }"
      class="turnstile-container"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);

const turnstileRef = ref(null);
const colorMode = useColorMode();
const turnstileTheme = computed(() =>
  colorMode.value === "dark" ? "dark" : "light",
);

const reset = () => {
  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
};

defineExpose({ reset });
</script>

<style scoped>
.turnstile-wrapper {
  width: 100%;
  min-height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.turnstile-container {
  width: 100%;
  min-height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(iframe) {
  border: none !important;
  outline: none !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  max-width: 100% !important;
  width: 100% !important;
}
</style>
