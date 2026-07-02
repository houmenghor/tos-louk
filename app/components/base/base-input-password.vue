<template>
  <div class="mb-3">
    <div class="position-relative">
      <label v-if="label" :for="id" class="form-label">{{ label }} *</label>
      <input 
        autocomplete="off" 
        :id="id"  
        :value="modelValue" 
        :placeholder="placeholder"
        :class="['form-control', { 'is-invalid': error }]" 
        :disabled="disabled"
        :type="showPassword ? 'text' : 'password'"
        @input="$emit('update:modelValue', $event.target.value)" 
        @blur="$emit('blur')"
      />
      <div v-if="error" class="invalid-feedback">{{ error }}</div>
      <i 
        :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" 
        class="password-toggle-icon"
        @click="togglePass"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  id: String,
  error: String,
  disabled: { type: Boolean, default: false }
});

defineEmits(["update:modelValue", "blur"]);

const showPassword = ref(false);
const togglePass = () => {
  showPassword.value = !showPassword.value;
}
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
  padding: 10px 40px 10px 12px; 
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
  background-image: none; /* Removes Bootstrap's default error icon overlap */
  padding-right: 40px;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.invalid-feedback {
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 4px;
}

/* Icon Styles positioned inside the container */
.password-toggle-icon {
  position: absolute;
  right: 14px;
  bottom: 8px; /* Shifts up accurately relative to input layout */
  cursor: pointer;
  z-index: 10;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.password-toggle-icon:hover {
  color: var(--color-text);
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