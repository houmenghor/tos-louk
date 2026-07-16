<template>
  <div
    class="placeholder-glow d-inline-flex align-items-center justify-content-center"
    :style="{ width: `${parsedSize}px`, height: `${parsedSize}px` }"
  >
    <span
      class="placeholder rounded-circle bg-secondary opacity-50"
      :style="{ width: `${parsedSize}px`, height: `${parsedSize}px` }"
    ></span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: [Number, String],
    default: 32,
  },
});

const parsedSize = computed(() => Number(props.size) || 32);
</script>
