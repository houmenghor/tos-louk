<template>
  <div class="d-flex justify-content-center align-items-center mb-4">
    <NuxtTurnstile 
      ref="turnstileRef" 
      :model-value="modelValue" 
      @update:modelValue="$emit('update:modelValue', $event)"
      :options="{ theme: turnstileTheme }" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: "",
  }
});

defineEmits(["update:modelValue"]);

const turnstileRef = ref(null);
const turnstileTheme = ref("light");

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        turnstileTheme.value = 'dark';
    } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        turnstileTheme.value = 'dark';
    } else {
        turnstileTheme.value = 'light';
    }
});

const reset = () => {
    if (turnstileRef.value) {
        turnstileRef.value.reset();
    }
};

defineExpose({ reset });
</script>