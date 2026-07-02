<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }} *</label>
    <input 
      autocomplete="off" 
      :id="id" 
      :type="type" 
      :value="modelValue" 
      :placeholder="placeholder"
      :class="['form-control', { 'is-invalid': error }]" 
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)" 
      @blur="$emit('blur')" 
    />
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
  disabled: { type: Boolean, default: false }
});

defineEmits(["update:modelValue", "blur"]);
</script>

<style scoped>
.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
  display: inline-block;
}

.form-control {
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.form-control:focus {
  outline: none;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-control:disabled {
  background-color: var(--color-bg-secondary);
  opacity: 0.6;
  cursor: not-allowed;
}

/* Invalid / Error States */
.form-control.is-invalid {
  border-color: var(--color-danger);
  background-image: none;
  padding-right: 12px;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.invalid-feedback {
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 4px;
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