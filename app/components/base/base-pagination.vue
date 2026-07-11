<template>
  <div class="base-pagination-wrapper d-flex flex-column flex-md-row justify-content-between align-items-center py-3 border-top mt-4">
    <!-- Left Text -->
    <div class="pagination-info text-muted mb-3 mb-md-0">
      Page <span class="fw-bold text-dark">{{ currentPage }}</span> of <span class="fw-bold text-dark">{{ totalPages }}</span>
      <span v-if="totalResults !== null">
        &middot; Showing {{ totalResults }} results
      </span>
      <span v-else>
        &middot; Showing results
      </span>
    </div>

    <!-- Right Pagination Nav -->
    <nav aria-label="Page navigation">
      <ul class="pagination pagination-custom gap-2 m-0 align-items-center">
        <!-- Previous Button -->
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <button 
            class="page-link prev-next-btn d-flex align-items-center justify-content-center" 
            @click="changePage(currentPage - 1)"
            aria-label="Previous"
          >
            <i class="bi bi-arrow-left"></i>
          </button>
        </li>

        <!-- Page Numbers -->
        <li 
          v-for="(page, index) in visiblePages" 
          :key="index"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <button 
            v-if="page !== '...'"
            class="page-link num-btn d-flex align-items-center justify-content-center fw-semibold" 
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <span v-else class="page-link ellipsis bg-transparent border-0 text-muted d-flex align-items-end justify-content-center pb-2">
            ...
          </span>
        </li>

        <!-- Next Button -->
        <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
          <button 
            class="page-link prev-next-btn d-flex align-items-center justify-content-center" 
            @click="changePage(currentPage + 1)"
            aria-label="Next"
          >
            <i class="bi bi-arrow-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  },
  totalResults: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(["update:currentPage", "page-change"]);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("update:currentPage", page);
    emit("page-change", page);
  }
};

// Calculate which page numbers to show, including ellipses
const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const max = props.maxVisiblePages;

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  
  if (current <= 3) {
    // Near start
    for (let i = 1; i <= 4; i++) pages.push(i);
    pages.push("...");
    pages.push(total - 1);
    pages.push(total);
  } else if (current >= total - 2) {
    // Near end
    pages.push(1);
    pages.push(2);
    pages.push("...");
    for (let i = total - 3; i <= total; i++) pages.push(i);
  } else {
    // In the middle
    pages.push(1);
    pages.push("...");
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push("...");
    pages.push(total);
  }

  // Deduplicate and return (just to be safe)
  return [...new Set(pages)];
});
</script>

<style scoped>
.base-pagination-wrapper {
  width: 100%;
  border-color: #e5e7eb !important;
}

.pagination-info {
  font-size: 0.95rem;
  color: #6b7280 !important;
}

.pagination-info .text-dark {
  color: #374151 !important;
}

/* Base button styling */
.pagination-custom .page-link {
  width: 38px;
  height: 38px;
  border-radius: 8px !important;
  color: #4b5563;
  background-color: transparent;
  border: none;
  transition: all 0.2s ease;
  padding: 0;
}

/* Number Buttons */
.pagination-custom .num-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.pagination-custom .page-item.active .num-btn {
  background-color: var(--color-primary);
  color: #ffffff;
  box-shadow: none;
}

/* Prev/Next Buttons */
.pagination-custom .prev-next-btn {
  border: 1px solid #e5e7eb;
  color: #9ca3af;
  background-color: #ffffff;
}

.pagination-custom .prev-next-btn:hover {
  border-color: #d1d5db;
  color: #4b5563;
  background-color: #f9fafb;
}

.pagination-custom .page-item.disabled .prev-next-btn {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f9fafb;
}

/* Ellipsis */
.pagination-custom .ellipsis {
  width: 24px;
  cursor: default;
  color: #9ca3af !important;
}

/* Remove default focus shadows to match clean look */
.page-link:focus {
  box-shadow: none;
  outline: none;
}
</style>
