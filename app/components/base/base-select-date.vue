<template>
  <div class="mb-3 position-relative" ref="containerRef">
    <!-- Input Label -->
    <label v-if="label" class="form-label">
      {{ label }} <span v-if="required" class="text-danger">*</span>
    </label>

    <!-- Input field trigger -->
    <div class="position-relative trigger-wrapper" @click="toggleCalendar">
      <input
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder || 'Select date'"
        :class="[
          'form-control custom-date-input',
          { 'is-invalid': error, active: isOpen },
        ]"
        :disabled="disabled"
      />
      <i class="bi bi-calendar3 calendar-icon" :class="{ active: isOpen }"></i>
    </div>

    <!-- Error validation message -->
    <div v-if="error" class="invalid-feedback d-block mt-1">{{ error }}</div>

    <!-- Floating Calendar Dropdown Panel -->
    <transition name="slide-fade">
      <div
        v-if="isOpen && !disabled"
        class="calendar-dropdown rounded-4 border p-3 shadow-lg"
      >
        <!-- Header: Nav controls, Month & Year select inputs -->
        <div
          class="d-flex align-items-center justify-content-between gap-2 mb-3"
        >
          <button
            type="button"
            class="btn btn-nav d-flex align-items-center justify-content-center rounded-circle"
            @click="prevMonth"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <div
            class="d-flex align-items-center gap-1.5 flex-grow-1 justify-content-center"
          >
            <!-- Quick Month Selector -->
            <select
              v-model="viewMonth"
              class="form-select select-header"
              @change="onMonthYearSelect"
            >
              <option
                v-for="(m, index) in monthsList"
                :key="index"
                :value="index"
              >
                {{ m }}
              </option>
            </select>

            <!-- Quick Year Selector -->
            <select
              v-model="viewYear"
              class="form-select select-header"
              @change="onMonthYearSelect"
            >
              <option v-for="year in yearsList" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="btn btn-nav d-flex align-items-center justify-content-center rounded-circle"
            @click="nextMonth"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <!-- Days of Week Header Grid -->
        <div class="weekdays-grid text-center mb-1">
          <span
            v-for="dayName in weekDaysList"
            :key="dayName"
            class="weekday-item fw-semibold"
          >
            {{ dayName }}
          </span>
        </div>

        <!-- Days Grid -->
        <div class="days-grid text-center">
          <button
            v-for="(day, index) in gridDays"
            :key="index"
            type="button"
            class="day-btn btn d-flex align-items-center justify-content-center rounded-circle"
            :class="{
              'other-month text-muted': !day.isCurrentMonth,
              'selected-day': day.isSelected,
              'today-day': day.isToday,
            }"
            @click="selectDate(day)"
          >
            {{ day.day }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  minYear: {
    type: Number,
    default: 1940,
  },
  maxYear: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const { locale } = useI18n();

const isOpen = ref(false);
const containerRef = ref(null);

// Date Tracking States (View focus)
const viewYear = ref(new Date().getFullYear());
const viewMonth = ref(new Date().getMonth()); // 0-indexed

// Selected State parsed from modelValue
const selectedYear = ref(null);
const selectedMonth = ref(null); // 1-indexed
const selectedDay = ref(null);

const monthsList = computed(() => {
  if (locale.value === "kh") {
    return [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];
  }
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
});

const weekDaysList = computed(() => {
  if (locale.value === "kh") {
    return ["អា", "ច", "អ", "ព", "ព្រ", "សុ", "ស"];
  }
  return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
});

const yearsList = computed(() => {
  const years = [];
  for (let y = props.maxYear; y >= props.minYear; y--) {
    years.push(y);
  }
  return years;
});

// Display Format inside text field
const displayValue = computed(() => {
  if (!props.modelValue) return "";
  const date = new Date(props.modelValue);
  if (isNaN(date.getTime())) return props.modelValue;
  return date.toLocaleDateString(locale.value === "kh" ? "km-KH" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

// Parse standard ISO date string
const parseIncomingDate = (dateStr) => {
  if (!dateStr) {
    selectedYear.value = null;
    selectedMonth.value = null;
    selectedDay.value = null;
    return;
  }
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    selectedYear.value = parseInt(parts[0]);
    selectedMonth.value = parseInt(parts[1]);
    selectedDay.value = parseInt(parts[2]);

    // Update active view to matched year/month values
    viewYear.value = selectedYear.value;
    viewMonth.value = selectedMonth.value - 1;
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    parseIncomingDate(newVal);
  },
  { immediate: true },
);

// Toggle dropdown calendar visibility
const toggleCalendar = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    // Sync view focus back to selected date (or current date if empty)
    if (selectedYear.value !== null) {
      viewYear.value = selectedYear.value;
      viewMonth.value = selectedMonth.value - 1;
    } else {
      const now = new Date();
      viewYear.value = now.getFullYear();
      viewMonth.value = now.getMonth();
    }
  }
};

// Next & Previous month controls
const prevMonth = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value -= 1;
  } else {
    viewMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value += 1;
  } else {
    viewMonth.value += 1;
  }
};

const onMonthYearSelect = () => {
  // Triggers recalculating view grid days automatically
};

// Grid Days Construction
const gridDays = computed(() => {
  const days = [];
  const year = viewYear.value;
  const month = viewMonth.value;

  const today = new Date();

  // First day of current viewMonth
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Days in current and previous months
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 1. Fill previous month tail days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayVal = daysInPrevMonth - i;
    const prevMonthVal = month === 0 ? 12 : month;
    const prevYearVal = month === 0 ? year - 1 : year;
    days.push({
      day: dayVal,
      month: prevMonthVal,
      year: prevYearVal,
      isCurrentMonth: false,
      isSelected: checkIsSelected(dayVal, prevMonthVal, prevYearVal),
      isToday: checkIsToday(dayVal, prevMonthVal, prevYearVal, today),
    });
  }

  // 2. Fill current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const currentMonthVal = month + 1;
    days.push({
      day: i,
      month: currentMonthVal,
      year: year,
      isCurrentMonth: true,
      isSelected: checkIsSelected(i, currentMonthVal, year),
      isToday: checkIsToday(i, currentMonthVal, year, today),
    });
  }

  // 3. Fill next month head days to pad grid layout to 42 slots
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const nextMonthVal = month === 11 ? 1 : month + 2;
    const nextYearVal = month === 11 ? year + 1 : year;
    days.push({
      day: i,
      month: nextMonthVal,
      year: nextYearVal,
      isCurrentMonth: false,
      isSelected: checkIsSelected(i, nextMonthVal, nextYearVal),
      isToday: checkIsToday(i, nextMonthVal, nextYearVal, today),
    });
  }

  return days;
});

const checkIsSelected = (d, m, y) => {
  return (
    selectedDay.value === d &&
    selectedMonth.value === m &&
    selectedYear.value === y
  );
};

const checkIsToday = (d, m, y, todayObj) => {
  return (
    todayObj.getDate() === d &&
    todayObj.getMonth() + 1 === m &&
    todayObj.getFullYear() === y
  );
};

// Date selection handler
const selectDate = (dayItem) => {
  selectedDay.value = dayItem.day;
  selectedMonth.value = dayItem.month;
  selectedYear.value = dayItem.year;

  // Format YYYY-MM-DD
  const formattedMonth =
    selectedMonth.value < 10
      ? `0${selectedMonth.value}`
      : `${selectedMonth.value}`;
  const formattedDay =
    selectedDay.value < 10 ? `0${selectedDay.value}` : `${selectedDay.value}`;
  const dateStr = `${selectedYear.value}-${formattedMonth}-${formattedDay}`;

  emit("update:modelValue", dateStr);
  emit("blur"); // trigger vee-validate checks
  isOpen.value = false; // close calendar
};

// Close calendar on outside clicks
const handleOutsideClick = (e) => {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    if (isOpen.value) {
      isOpen.value = false;
      emit("blur");
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
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

/* Trigger Input styling */
.trigger-wrapper {
  cursor: pointer;
}

.custom-date-input {
  border-radius: 8px;
  padding: 10px 40px 10px 12px;
  font-size: 12px;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.custom-date-input:focus,
.custom-date-input.active {
  outline: none;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.custom-date-input:disabled {
  background-color: var(--color-bg-secondary);
  opacity: 0.6;
  cursor: not-allowed;
}

.calendar-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
  pointer-events: none;
}

.calendar-icon.active {
  color: var(--color-primary);
}

/* --------------------------------------------------------------------------
   Floating Calendar Dropdown panel
-------------------------------------------------------------------------- */
.calendar-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1050;
  width: 290px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border) !important;
  margin-top: 6px;
  user-select: none;
}

/* Navigation items */
.btn-nav {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  transition: all 0.2s ease;
}

.btn-nav:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

/* Select inputs inside header */
.select-header {
  border: none;
  background-color: transparent;
  color: var(--color-text);
  font-weight: 700;
  font-size: 13px;
  padding: 4px 24px 4px 6px;
  width: auto;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.select-header:hover {
  background-color: var(--color-bg-secondary);
}

.select-header:focus {
  outline: none;
  box-shadow: none;
  background-color: var(--color-bg-secondary);
}

/* Weekdays grid */
.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 4px;
}

.weekday-item {
  font-size: 10px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

/* Days Grid cells */
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 4px;
}

.day-btn {
  width: 32px;
  height: 32px;
  font-size: 11px;
  font-weight: 500;
  padding: 0;
  border: none;
  color: var(--color-text);
  background: transparent;
  transition: all 0.15s ease;
}

.day-btn:hover:not(.selected-day) {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.other-month {
  opacity: 0.35;
}

.selected-day {
  background-color: var(--color-primary) !important;
  color: #fff !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 220, 130, 0.3);
}

.today-day {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-weight: 700;
}

/* Invalid error validation states */
.custom-date-input.is-invalid {
  border-color: var(--color-danger);
}

.custom-date-input.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.invalid-feedback {
  font-size: 12px;
  color: var(--color-danger);
}

/* Slide-Fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
