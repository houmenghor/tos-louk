<template>
  <div class="row g-3">
    <!-- Best Seller Skeleton -->
    <div class="col-md-5">
      <div class="card glass-card h-100 border-0 shadow-sm p-3 d-flex flex-column justify-content-between placeholder-glow" style="min-height: 250px;">
        <div class="placeholder rounded-3 w-75 mx-auto bg-secondary opacity-25 mt-4 mb-2" style="height: 140px;"></div>
        <div class="card-body px-1 pb-0 mt-auto">
          <span class="placeholder col-10 rounded-2 py-2 bg-secondary opacity-25 mb-2 d-block"></span>
          <span class="placeholder col-5 rounded-2 py-2 bg-secondary opacity-25 d-block"></span>
        </div>
      </div>
    </div>

    <!-- Trending Skeleton -->
    <div class="col-md-7">
      <div class="card glass-card h-100 border-0 shadow-sm p-3 d-flex flex-column justify-content-between placeholder-glow" style="min-height: 250px;">
        <div class="placeholder rounded-3 w-75 mx-auto bg-secondary opacity-25 mt-4 mb-2" style="height: 140px;"></div>
        <div class="card-body px-1 pb-0 mt-auto">
          <span class="placeholder col-9 rounded-2 py-2 bg-secondary opacity-25 mb-2 d-block"></span>
          <span class="placeholder col-4 rounded-2 py-2 bg-secondary opacity-25 d-block"></span>
        </div>
      </div>
    </div>

    <!-- Just Launched Skeleton -->
    <div class="col-12">
      <div class="card glass-card border-0 shadow-sm p-3 placeholder-glow">
        <div class="row g-0 align-items-center mt-4">
          <div class="col-sm-4 text-center">
            <div class="placeholder rounded-3 w-75 mx-auto bg-secondary opacity-25" style="height: 120px;"></div>
          </div>
          <div class="col-sm-8">
            <div class="card-body py-0 pe-1">
              <span class="placeholder col-6 rounded-2 py-2 bg-secondary opacity-25 mb-2 d-block"></span>
              <span class="placeholder col-11 rounded-2 py-1 bg-secondary opacity-25 mb-1 d-block"></span>
              <span class="placeholder col-8 rounded-2 py-1 bg-secondary opacity-25 mb-3 d-block"></span>
              <span class="placeholder col-4 rounded-2 py-2 bg-secondary opacity-25 d-block"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  border-radius: 12px;
}
</style>
