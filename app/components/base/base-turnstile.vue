<template>
  <div class="d-flex justify-content-center align-items-center mb-4">
    <NuxtTurnstile 
      :key="turnstileTheme"
      ref="turnstileRef" 
      :model-value="modelValue" 
      @update:modelValue="$emit('update:modelValue', $event)"
      :options="{ theme: turnstileTheme }" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: "",
  }
});

defineEmits(["update:modelValue"]);

const turnstileRef = ref(null);
const turnstileTheme = ref("light");
let observer = null;

const updateTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
        turnstileTheme.value = 'dark';
    } else {
        turnstileTheme.value = 'light';
    }
};

onMounted(() => {
    updateTheme();
    observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});

const reset = () => {
    if (turnstileRef.value) {
        turnstileRef.value.reset();
    }
};

defineExpose({ reset });
</script>