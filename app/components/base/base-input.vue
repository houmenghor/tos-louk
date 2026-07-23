<template>
  <div class="mb-3 position-relative">
    <label v-if="label" :for="id" class="form-label text-xs fw-semibold text-uppercase tracking-wider mb-1.5">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    <div class="position-relative input-wrapper">
      <span v-if="leftIcon" :class="['position-absolute d-flex justify-content-center input-icon', type === 'textarea' ? 'align-items-start' : 'align-items-center']" :style="{ left: 0, top: 0, bottom: 0, minWidth: '44px', fontSize: '1.05rem', paddingTop: type === 'textarea' ? '0.65rem' : '0' }">
        <i :class="leftIcon"></i>
      </span>
      <textarea
        v-if="type === 'textarea'"
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :class="['form-control custom-base-input', { 'is-invalid': error }, { 'has-left-icon': leftIcon }]"
        :disabled="disabled"
        :rows="rows || 3"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @change="$emit('change', $event)"
      ></textarea>
      <input
        v-else
        autocomplete="off"
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="['form-control custom-base-input', { 'is-invalid': error }, { 'has-left-icon': leftIcon }]"
        :disabled="disabled"
        :accept="accept"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @change="$emit('change', $event)"
      />
    </div>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  id: String,
  type: { type: String, default: "text" },
  error: String,
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  leftIcon: { type: String, default: "" },
  rows: { type: [Number, String], default: 3 },
  accept: { type: String, default: "" }
});

defineEmits(["update:modelValue", "blur", "change"]);
</script>

<style scoped>
.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  display: inline-block;
}

.input-wrapper {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-bg-secondary);
  transition: all 0.2s ease;
  overflow: hidden;
}

.input-wrapper:focus-within {
  background-color: var(--color-surface);
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input-icon {
  color: var(--color-text-secondary);
  opacity: 0.7;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within .input-icon {
  color: var(--color-primary);
  opacity: 1;
}

.custom-base-input {
  background-color: transparent !important;
  border: none !important;
  color: var(--color-text);
  font-size: 0.88rem;
  padding: 0.65rem 0.9rem;
  box-shadow: none !important;
  width: 100%;
}

.custom-base-input:focus {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.custom-base-input.has-left-icon {
  padding-left: 44px;
}

.input-wrapper:has(.is-invalid) {
  border-color: var(--color-danger) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.input-wrapper:has(.is-invalid) .input-icon {
  color: var(--color-danger);
}

.invalid-feedback {
  font-size: 0.73rem;
  font-weight: 500;
  margin-top: 0.25rem;
  color: var(--color-danger);
  display: block;
}

/* Autofill Fixes matching system dark/light variables */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px var(--color-surface) inset !important;
  -webkit-text-fill-color: var(--color-text) !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
