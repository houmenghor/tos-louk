<template>
    <button :type="statusType" :class="[
        'btn-base',
        `variant-${variants}`,
        `size-${size}`
    ]" :disabled="isDisable || isLoading" @click="handleClick">
        <span v-if="isLoading" class="content-wrapper">
            <span class="spinner-border spinner-base" role="status" aria-hidden="true"></span>
            <span class="loading-text">loading...</span>
        </span>

        <span v-else class="content-wrapper">
            <slot></slot>
        </span>
    </button>
</template>

<script setup>
const props = defineProps({
    variants: {
        type: String,
        default: "primary",
        validator: (value) => ['primary', 'secondary', 'danger', 'outline-primary', 'outline-danger'].includes(value)
    },
    size: {
        type: String,
        default: "md",
        validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    isLoading: { type: Boolean, default: false },
    isDisable: { type: Boolean, default: false },
    statusType: { type: String, default: "button" },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
    if (!props.isDisable && !props.isLoading) {
        emit("click", event);
    }
}
</script>

<style scoped>
/* =========================================
    CORE STRUCTURAL STYLES
   ========================================= */
.btn-base {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 500;
    border: 1px solid transparent;
    border-radius: 999px;
    /* Absolute pill shape */
    user-select: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    position: relative;
}

.content-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    color:#ffffff;
}

/* Accessibility Focus Ring */
.btn-base:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* Disabled/Loading States */
.btn-base:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

.spinner-base {
    width: 1.1rem;
    height: 1.1rem;
    border-width: 0.15em;
}

/* =========================================
    PADDING & SIZING SCALE
   ========================================= */
.size-sm {
    padding: 6px 14px;
    font-size: 12px;
}

.size-md {
    padding: 8px 18px;
    font-size: 14px;
}

.size-lg {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
}

/* =========================================
    VISUAL THEME VARIANTS (MAPPED TO GLOBAL CSS)
   ========================================= */

/* 1. Primary (Uses your brand green #00dc82) */
.variant-primary {
    background-color: var(--color-primary);
    color: whitesmoke;
    /* Dark text for optimal contrast over bright neon green */
    box-shadow: var(--shadow-sm);
}

.variant-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    transform: translateY(-0.5px);
    box-shadow: var(--shadow-md);
}

/* 2. Secondary Neutral */
.variant-secondary {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
    border-color: var(--color-border);
}

.variant-secondary:hover:not(:disabled) {
    background-color: var(--color-border);
}

.variant-secondary:active:not(:disabled) {
    transform: scale(0.98);
}

/* 3. Danger Action */
.variant-danger {
    background-color: var(--color-danger);
    color: #ffffff;
}

.variant-danger:hover:not(:disabled) {
    opacity: 0.9;
}

.variant-danger:active:not(:disabled) {
    transform: scale(0.98);
}

/* 4. Outline Primary */
.variant-outline-primary {
    background-color: transparent;
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.variant-outline-primary:hover:not(:disabled) {
    background-color: var(--color-primary-light);
}

/* 5. Outline Danger */
.variant-outline-danger {
    background-color: transparent;
    border-color: var(--color-danger);
    color: var(--color-danger);
}

.variant-outline-danger:hover:not(:disabled) {
    background-color: rgba(239, 68, 68, 0.1);
}
</style>