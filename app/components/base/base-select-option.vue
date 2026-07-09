<template>
  <div class="mb-3 position-relative" ref="containerRef">
    <!-- Field Label -->
    <label v-if="label" class="form-label">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>
    
    <!-- Select Trigger Input -->
    <div 
      class="position-relative trigger-wrapper"
      @click="toggleDropdown"
    >
      <div 
        :class="['form-control custom-select-trigger d-flex align-items-center justify-content-between', { 'is-invalid': error, 'active': isOpen, 'disabled': disabled }]"
        tabindex="0"
        @keydown.space.prevent="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.down.prevent="navigateOptions('down')"
        @keydown.up.prevent="navigateOptions('up')"
      >
        <span :class="{ 'placeholder-text': !selectedOption }">
          {{ selectedOption ? selectedOption.label : (placeholder || 'Select option') }}
        </span>
        <i class="bi bi-chevron-down arrow-icon" :class="{ 'open': isOpen }"></i>
      </div>
    </div>

    <!-- Validation Error Message -->
    <div v-if="error" class="invalid-feedback d-block mt-1">{{ error }}</div>

    <!-- Floating Options Dropdown Menu -->
    <transition name="slide-fade">
      <div v-if="isOpen && !disabled" class="options-dropdown rounded-4 border shadow-lg">
        <!-- Search filter box (Optional via searchable prop) -->
        <div v-if="searchable" class="p-2 border-bottom border-custom-glass">
          <div class="position-relative">
            <input 
              type="text" 
              ref="searchInputRef"
              v-model="searchQuery" 
              class="form-control search-input" 
              placeholder="Search..."
              @click.stop
              @keydown.down.prevent="navigateOptions('down')"
              @keydown.up.prevent="navigateOptions('up')"
              @keydown.enter.prevent="selectHighlighted"
            />
            <i class="bi bi-search search-icon"></i>
          </div>
        </div>

        <!-- Options Scrollable Container -->
        <ul class="options-list list-unstyled mb-0 py-1" ref="listRef">
          <li v-if="filteredOptions.length === 0" class="no-options-item text-center text-muted py-3 text-xs">
            No options found
          </li>
          <li 
            v-for="(option, index) in filteredOptions" 
            :key="option.value"
            class="option-item d-flex align-items-center justify-content-between px-3 py-2.5 cursor-pointer text-sm transition-all"
            :class="{ 
              'selected': modelValue === option.value,
              'highlighted': index === highlightedIndex
            }"
            @click.stop="selectOption(option)"
            @mouseenter="highlightedIndex = index"
          >
            <div class="d-flex align-items-center gap-2">
              <i v-if="option.icon" :class="[option.icon, 'option-icon']"></i>
              <span>{{ option.label }}</span>
            </div>
            <i v-if="modelValue === option.value" class="bi bi-check2 text-primary-custom fw-bold"></i>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    // Expects array of strings, or array of objects: { value: Any, label: String, icon?: String }
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur', 'change']);

const isOpen = ref(false);
const containerRef = ref(null);
const searchInputRef = ref(null);
const listRef = ref(null);
const searchQuery = ref('');
const highlightedIndex = ref(-1);

// Normalize standard options array (converting simple string array to object structure)
const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return {
        value: option.value !== undefined ? option.value : option.label,
        label: option.label || option.value,
        icon: option.icon || null
      };
    }
    return {
      value: option,
      label: option,
      icon: null
    };
  });
});

// Filtered options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return normalizedOptions.value;
  const query = searchQuery.value.toLowerCase().trim();
  return normalizedOptions.value.filter(opt => 
    opt.label.toLowerCase().includes(query)
  );
});

// Currently selected option object
const selectedOption = computed(() => {
  return normalizedOptions.value.find(opt => opt.value === props.modelValue) || null;
});

// Toggle dropdown panel list
const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    searchQuery.value = '';
    // Find index of currently selected option to highlight it
    highlightedIndex.value = filteredOptions.value.findIndex(opt => opt.value === props.modelValue);
    if (highlightedIndex.value === -1) highlightedIndex.value = 0;
    
    // Auto-focus search input if searchable
    if (props.searchable) {
      nextTick(() => {
        if (searchInputRef.value) {
          searchInputRef.value.focus();
        }
      });
    }
  } else {
    emit('blur');
  }
};

// Select option value
const selectOption = (option) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  emit('blur');
  isOpen.value = false;
};

// Keyboard list navigation helpers
const navigateOptions = (direction) => {
  if (!isOpen.value) {
    toggleDropdown();
    return;
  }
  
  const len = filteredOptions.value.length;
  if (len === 0) return;
  
  if (direction === 'down') {
    highlightedIndex.value = (highlightedIndex.value + 1) % len;
  } else {
    highlightedIndex.value = (highlightedIndex.value - 1 + len) % len;
  }

  // Scroll active option item into view viewport
  nextTick(() => {
    if (listRef.value) {
      const activeEl = listRef.value.children[highlightedIndex.value];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  });
};

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    selectOption(filteredOptions.value[highlightedIndex.value]);
  }
};

// Close dropdown on outside clicks
const handleOutsideClick = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    if (isOpen.value) {
      isOpen.value = false;
      emit('blur');
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.form-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  display: inline-block;
}

/* Trigger Button UI */
.trigger-wrapper {
  cursor: pointer;
}

.custom-select-trigger {
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  user-select: none;
  min-height: 38px;
}

.custom-select-trigger:focus, .custom-select-trigger.active {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.custom-select-trigger.disabled {
  background-color: var(--color-bg-secondary);
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.placeholder-text {
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.arrow-icon {
  color: var(--color-text-secondary);
  transition: transform 0.2s ease;
  font-size: 10px;
}

.arrow-icon.open {
  transform: rotate(180deg);
  color: var(--color-primary);
}

/* --------------------------------------------------------------------------
   Floating Options List Panel (Frosted modern context-menu style)
-------------------------------------------------------------------------- */
.options-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1050;
  width: 100%;
  background-color: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border) !important;
  box-shadow: var(--glass-shadow);
  margin-top: 4px;
  max-height: 280px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}

/* Search bar input */
.search-input {
  border-radius: 6px;
  padding: 6px 10px 6px 30px;
  font-size: 12px;
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: none;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 11px;
}

/* Scrollable Options List */
.options-list {
  overflow-y: auto;
  max-height: 220px;
  scrollbar-width: thin;
  padding: 4px; /* Stripe/Radix style inner margin */
}

.option-item {
  color: var(--color-text);
  border-radius: 6px; /* Rounded items instead of full-width blocks */
  margin: 1px 0;
  padding: 8px 12px;
}

.option-item:hover, .option-item.highlighted {
  background-color: var(--glass-hover-bg);
  color: var(--color-primary);
}

.option-item.selected {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.option-icon {
  font-size: 14px;
}

.border-custom-glass {
  border-color: var(--glass-border) !important;
}

/* Invalid / Error validation states */
.custom-select-trigger.is-invalid {
  border-color: var(--color-danger);
}

.custom-select-trigger.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.invalid-feedback {
  font-size: 12px;
  color: var(--color-danger);
}

.text-xs {
  font-size: 11px;
}

.text-sm {
  font-size: 13px;
}

/* Slide-Fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
