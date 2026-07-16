<template>
  <div
    class="base-avatar-wrapper position-relative d-inline-block"
    :style="wrapperStyle"
  >
    <!-- Render Image or fallback default image -->
    <img
      v-if="!showInitialsFallback"
      :src="resolvedSrc"
      :class="['rounded-circle object-fit-cover w-100 h-100', borderClass]"
      :alt="alt"
      referrerpolicy="no-referrer"
      @error="handleError"
    />

    <!-- Fallback: Initials if requested -->
    <div
      v-else
      :class="[
        'rounded-circle avatar-fallback-circle d-flex align-items-center justify-content-center w-100 h-100 shadow-sm',
        borderClass
      ]"
    >
      <span
        class="fw-bold uppercase-text text-truncate px-1"
        :style="{ fontSize: initialsFontSize }"
      >
        {{ initials }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  src: {
    type: [String, null],
    default: null,
  },
  alt: {
    type: String,
    default: "Avatar",
  },
  name: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 44,
  },
  borderClass: {
    type: String,
    default: "border border-2 border-surface shadow-sm",
  },
  icon: {
    type: String,
    default: "bi bi-person-fill",
  },
  hideInitials: {
    type: Boolean,
    default: false,
  },
});

const defaultAvatar = "/images/default_profile.webp";
const imageError = ref(false);

watch(
  () => props.src,
  () => {
    imageError.value = false;
  },
);

const showInitialsFallback = computed(() => {
  return (imageError.value || !props.src) && initials.value && !props.hideInitials;
});

const resolvedSrc = computed(() => {
  if (imageError.value || !props.src) return defaultAvatar;
  if (props.src.startsWith("http") || props.src.startsWith("/")) return props.src;
  const config = useRuntimeConfig();
  const base = config.public?.apiBase?.replace("/api/v1", "") || "";
  return `${base}/storage/${props.src}`;
});

const wrapperStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  minWidth: `${props.size}px`,
  minHeight: `${props.size}px`,
}));

const initials = computed(() => {
  if (!props.name || typeof props.name !== "string") return null;
  const parts = props.name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return null;
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const initialsFontSize = computed(() => {
  return `${Math.max(10, Math.round(props.size * 0.38))}px`;
});

const handleError = (event) => {
  imageError.value = true;
  if (event?.target && event.target.src !== defaultAvatar) {
    event.target.src = defaultAvatar;
  }
};
</script>

<style scoped>
.base-avatar-wrapper {
  user-select: none;
}
</style>
