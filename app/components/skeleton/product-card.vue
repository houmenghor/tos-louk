<template>
  <div class="glass-card-clean rounded-4 p-3 shadow-sm h-100 d-flex flex-column">
    <div class="placeholder-glow mb-3">
      <div class="placeholder rounded-4 w-100 bg-secondary opacity-25" style="aspect-ratio: 1/1;"></div>
    </div>
    <div class="placeholder-glow mb-2">
      <span class="placeholder col-4 rounded-2 py-1 bg-secondary opacity-25"></span>
    </div>
    <div class="placeholder-glow mb-3">
      <span class="placeholder col-10 rounded-2 py-2 bg-secondary opacity-25 d-block mb-1"></span>
      <span class="placeholder col-6 rounded-2 py-2 bg-secondary opacity-25 d-block"></span>
    </div>
    <div class="mt-auto d-flex justify-content-between align-items-center placeholder-glow pt-2 border-top border-secondary-subtle">
      <span class="placeholder col-4 rounded-2 py-2 bg-secondary opacity-25"></span>
      <span class="placeholder col-3 rounded-pill py-2 bg-secondary opacity-25"></span>
    </div>
  </div>
</template>

<style scoped>
.glass-card-clean {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.dark .glass-card-clean {
  background: color-mix(in srgb, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, #ffffff 10%, transparent);
}
</style>
