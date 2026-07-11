<template>
  <div class="about-page position-relative overflow-hidden pb-5">
    <!-- Animated Background Blobs for Glassmorphism effect -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
    <div class="bg-blob blob-4"></div>

    <!-- Hero Section -->
    <section class="hero-section position-relative z-1 d-flex align-items-center justify-content-center text-center">
      <div class="container py-5 mt-4">
        <div class="glass-hero-badge mx-auto mb-4 px-4 py-2 rounded-pill fw-semibold text-uppercase tracking-wider">
          Who We Are
        </div>
        <h1 class="display-3 fw-extrabold text-main mb-4 hero-title">
          Crafting the Future of <span class="text-primary-gradient">E-Commerce</span>
        </h1>
        <p class="lead subtitle-text mx-auto hero-subtitle" style="max-width: 700px;">
          We believe in empowering individuals and businesses with premium, innovative solutions that inspire. Discover the story behind our passion.
        </p>
      </div>
    </section>

    <div class="container position-relative z-1">
      <!-- Our Story & Stats Section -->
      <section class="story-section my-5 py-5">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="position-relative">
              <div class="story-image-wrapper rounded-4 overflow-hidden shadow-lg position-relative glass-panel p-2">
                <img src="https://placehold.co/800x600/1e293b/ffffff?text=Our+Workspace" alt="Our Workspace" class="img-fluid w-100 rounded-3 object-fit-cover" style="min-height: 400px;">
                <div class="glass-overlay p-4 position-absolute bottom-0 start-0 w-100 m-2 rounded-bottom-3" style="width: calc(100% - 1rem) !important;">
                  <h4 class="text-white fw-bold mb-1">Our Journey</h4>
                  <p class="text-white-50 mb-0 small">Started in a garage, now changing the world.</p>
                </div>
              </div>
              <!-- Floating stat card -->
              <div class="floating-stat-card glass-panel p-3 rounded-4 shadow-lg position-absolute">
                <div class="d-flex align-items-center gap-3">
                  <div class="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                    <i class="bi bi-rocket-takeoff-fill fs-5"></i>
                  </div>
                  <div>
                    <h3 class="fw-bold text-main mb-0">5+</h3>
                    <p class="text-muted-custom small mb-0">Years of Innovation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="glass-panel p-4 p-md-5 rounded-4">
              <h2 class="fw-bold text-main mb-4">Driven by <span class="text-primary">Passion</span>, Fueled by <span class="text-primary">Purpose</span>.</h2>
              <p class="subtitle-text mb-4">
                Since our inception, our mission has been simple: to provide unparalleled quality and design in everything we create. We started as a small team of dreamers, and over the years, we've grown into a global family committed to excellence.
              </p>
              <p class="subtitle-text mb-4">
                Every product we offer is carefully curated to meet the highest standards of aesthetics and functionality. We don't just sell items; we craft experiences that leave a lasting impression.
              </p>
              
              <div class="row g-4 mt-2">
                <div class="col-sm-6">
                  <div class="stat-box p-4 rounded-4 glass-panel text-center">
                    <h2 class="display-5 fw-bold text-primary mb-1">10K+</h2>
                    <p class="text-muted-custom fw-medium mb-0">Happy Customers</p>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="stat-box p-4 rounded-4 glass-panel text-center">
                    <h2 class="display-5 fw-bold text-primary mb-1">99%</h2>
                    <p class="text-muted-custom fw-medium mb-0">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Values Section -->
      <section class="values-section my-5 py-5">
        <div class="text-center mb-5">
          <span class="text-primary fw-semibold text-uppercase tracking-wider glass-badge px-3 py-1 rounded-pill">Why Choose Us</span>
          <h2 class="fw-bold text-main mt-4">Our Core Values</h2>
        </div>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-3" v-for="(value, index) in coreValues" :key="index">
            <div class="value-card p-4 rounded-4 glass-panel h-100 text-center position-relative overflow-hidden">
              <div class="value-icon-wrapper mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center">
                <i :class="['bi', value.icon, 'fs-3']"></i>
              </div>
              <h5 class="fw-bold text-main mb-3">{{ value.title }}</h5>
              <p class="text-muted-custom small mb-0">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Meet The Team Section -->
      <section class="team-section my-5 py-5">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-main">Meet Our Leaders</h2>
          <p class="subtitle-text mx-auto mt-2" style="max-width: 600px;">
            The visionary minds dedicated to bringing you the best experience possible.
          </p>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-md-6 col-lg-4" v-for="member in team" :key="member.id">
            <div class="team-card rounded-4 p-3 glass-panel position-relative group">
              <div class="team-img-wrapper position-relative overflow-hidden rounded-3">
                <img :src="member.image" :alt="member.name" class="w-100 object-fit-cover team-img" style="height: 350px;">
                <div class="team-socials position-absolute w-100 d-flex justify-content-center gap-3 pb-4">
                  <a href="#" class="social-btn glass-btn rounded-circle d-flex align-items-center justify-content-center"><i class="bi bi-twitter-x"></i></a>
                  <a href="#" class="social-btn glass-btn rounded-circle d-flex align-items-center justify-content-center"><i class="bi bi-linkedin"></i></a>
                  <a href="#" class="social-btn glass-btn rounded-circle d-flex align-items-center justify-content-center"><i class="bi bi-envelope-fill"></i></a>
                </div>
              </div>
              <div class="p-3 text-center mt-2">
                <h5 class="fw-bold text-main mb-1">{{ member.name }}</h5>
                <p class="text-primary small fw-medium mb-0">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section my-5">
        <div class="cta-container rounded-5 p-5 text-center position-relative overflow-hidden glass-panel-strong">
          <div class="position-relative z-1 py-4">
            <h2 class="display-5 fw-bold text-main mb-3">Ready to Join Our Journey?</h2>
            <p class="lead subtitle-text mx-auto mb-5" style="max-width: 600px;">
              Experience the difference today. Browse our exclusive collections and discover your next favorite item.
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <NuxtLink to="/categories" class="btn btn-primary btn-lg px-5 rounded-pill fw-bold cta-btn shadow">
                Shop Now
              </NuxtLink>
              <NuxtLink to="/contact" class="btn glass-btn-outline btn-lg px-5 rounded-pill fw-bold cta-btn">
                Contact Us
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});

const coreValues = [
  {
    icon: 'bi-gem',
    title: 'Premium Quality',
    description: 'We never compromise. Every detail is meticulously crafted to ensure the highest standards.'
  },
  {
    icon: 'bi-lightbulb-fill',
    title: 'Constant Innovation',
    description: 'Staying ahead of the curve by embracing new technologies and modern design principles.'
  },
  {
    icon: 'bi-heart-fill',
    title: 'Customer First',
    description: 'Your satisfaction is our ultimate goal. We build relationships, not just transactions.'
  },
  {
    icon: 'bi-leaf-fill',
    title: 'Sustainability',
    description: 'Committed to eco-friendly practices that protect our planet for future generations.'
  }
];

const team = [
  {
    id: 1,
    name: 'Eleanor Vance',
    role: 'Founder & CEO',
    image: 'https://placehold.co/400x500/1e293b/ffffff?text=CEO'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Head of Design',
    image: 'https://placehold.co/400x500/1e293b/ffffff?text=Designer'
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'Chief Operations Officer',
    image: 'https://placehold.co/400x500/1e293b/ffffff?text=COO'
  }
];
</script>

<style scoped>
.about-page {
  background-color: var(--color-bg);
  min-height: 100vh;
  position: relative;
}

.text-main {
  color: var(--color-text);
}

.subtitle-text {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.text-muted-custom {
  color: var(--color-text-secondary);
}

.tracking-wider {
  letter-spacing: 0.05em;
}

/* Background animated blobs for Glassmorphism */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
  opacity: 0.4;
  animation: float-blob 20s infinite alternate;
}

.blob-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: rgba(0, 220, 130, 0.4);
  animation-delay: 0s;
}

.blob-2 {
  top: 20%;
  right: -10%;
  width: 40vw;
  height: 40vw;
  background: rgba(59, 130, 246, 0.4);
  animation-delay: -5s;
}

.blob-3 {
  bottom: -10%;
  left: 10%;
  width: 45vw;
  height: 45vw;
  background: rgba(139, 92, 246, 0.3);
  animation-delay: -10s;
}

.blob-4 {
  bottom: 20%;
  right: 20%;
  width: 30vw;
  height: 30vw;
  background: rgba(236, 72, 153, 0.3);
  animation-delay: -15s;
}

.dark .bg-blob {
  opacity: 0.25;
}

@keyframes float-blob {
  0% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

/* Glassmorphism Core Classes */
.glass-panel {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.dark .glass-panel {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.glass-panel-strong {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.dark .glass-panel-strong {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.glass-hero-badge {
  background: rgba(0, 220, 130, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 220, 130, 0.3);
  color: var(--color-primary);
  display: inline-block;
}

.glass-badge {
  background: rgba(0, 220, 130, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 220, 130, 0.2);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  color: #1a1a24;
}

.dark .glass-btn {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.glass-btn-outline {
  background: transparent;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-text);
  color: var(--color-text);
}

.glass-btn-outline:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

/* Hero Section */
.hero-section {
  min-height: 50vh;
}

.text-primary-gradient {
  background: linear-gradient(90deg, var(--color-primary) 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.fw-extrabold {
  font-weight: 800;
}

/* Story Section */
.glass-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.floating-stat-card {
  bottom: -30px;
  right: -30px;
  min-width: 200px;
  animation: float 4s ease-in-out infinite;
  z-index: 2;
}

@media (max-width: 991px) {
  .floating-stat-card {
    right: 20px;
    bottom: -20px;
  }
}

.icon-box {
  width: 48px;
  height: 48px;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.stat-box {
  transition: transform 0.3s ease;
}
.stat-box:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 220, 130, 0.4) !important;
}

/* Values Section */
.value-card {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: default;
}
.value-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 220, 130, 0.4);
}
.dark .value-card:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(0, 220, 130, 0.4);
}

.value-icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(0, 220, 130, 0.1);
  color: var(--color-primary);
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}
.value-card:hover .value-icon-wrapper {
  background-color: var(--color-primary);
  color: #fff;
  transform: scale(1.1) rotate(5deg);
}

/* Team Section */
.team-card {
  transition: all 0.3s ease;
}
.team-card:hover {
  transform: translateY(-10px);
}

.team-img {
  filter: grayscale(100%);
  transition: all 0.5s ease;
}
.team-card:hover .team-img {
  filter: grayscale(0%);
  transform: scale(1.05);
}

.team-socials {
  bottom: -60px;
  transition: all 0.4s ease;
}
.team-card:hover .team-socials {
  bottom: 0;
}
.social-btn {
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
}
.social-btn:hover {
  background-color: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: translateY(-3px);
}

/* CTA Section */
.cta-btn {
  transition: all 0.3s ease;
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
</style>
