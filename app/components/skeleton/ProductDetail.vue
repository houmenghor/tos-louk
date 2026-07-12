<template>
  <div class="glass-card-clean rounded-5 p-4 p-md-5 mb-5 shadow-sm">
    <div class="row g-5">
      <!-- Left Column Skeleton -->
      <div class="col-lg-6">
        <div class="placeholder-glow">
          <div class="placeholder rounded-4 w-100 bg-secondary opacity-25" style="aspect-ratio: 1/1;"></div>
        </div>
        <div class="d-flex gap-3 mt-3 placeholder-glow">
          <div class="placeholder rounded-3 bg-secondary opacity-25" style="width: 80px; height: 80px;"></div>
          <div class="placeholder rounded-3 bg-secondary opacity-25" style="width: 80px; height: 80px;"></div>
          <div class="placeholder rounded-3 bg-secondary opacity-25" style="width: 80px; height: 80px;"></div>
        </div>
      </div>
      <!-- Right Column Skeleton -->
      <div class="col-lg-6 d-flex flex-column justify-content-center">
        <div class="placeholder-glow mb-3">
          <span class="placeholder col-3 rounded-2 py-2 bg-secondary opacity-25"></span>
        </div>
        <div class="placeholder-glow mb-4">
          <span class="placeholder col-9 rounded-3 py-3 display-5 bg-secondary opacity-25"></span>
        </div>
        <div class="placeholder-glow mb-4">
          <span class="placeholder col-4 rounded-3 py-2 display-6 bg-secondary opacity-25"></span>
        </div>
        <div class="placeholder-glow mb-5">
          <span class="placeholder col-12 rounded-2 py-1 mb-2 bg-secondary opacity-25 d-block"></span>
          <span class="placeholder col-10 rounded-2 py-1 mb-2 bg-secondary opacity-25 d-block"></span>
          <span class="placeholder col-8 rounded-2 py-1 bg-secondary opacity-25 d-block"></span>
        </div>
        <div class="placeholder-glow mt-auto">
          <span class="placeholder col-12 rounded-4 py-3 bg-secondary opacity-25"></span>
        </div>
      </div>
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
