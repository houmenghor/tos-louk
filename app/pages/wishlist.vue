<template>
  <div class="wishlist-guest-page min-vh-100 d-flex align-items-center justify-content-center">

    <!-- Ambient Background -->
    <div class="ambient-bg" aria-hidden="true">
      <div class="ambient-blob blob-1"></div>
      <div class="ambient-blob blob-2"></div>
    </div>

    <!-- Floating Hearts -->
    <div class="floating-hearts-container" aria-hidden="true">
      <i class="bi bi-heart-fill floating-heart heart-1"></i>
      <i class="bi bi-heart floating-heart heart-2"></i>
      <i class="bi bi-heart-fill floating-heart heart-3"></i>
      <i class="bi bi-heart floating-heart heart-4"></i>
      <i class="bi bi-heart-fill floating-heart heart-5"></i>
      <i class="bi bi-heart floating-heart heart-6"></i>
    </div>

    <!-- Hero Content -->
    <div class="hero-content text-center position-relative z-1 px-3">

      <!-- Animated Heart Icon -->
      <div class="hero-icon-wrapper mx-auto mb-4">
        <div class="icon-glow"></div>
        <div class="hero-icon-ring">
          <i class="bi bi-heart-fill hero-heart-icon"></i>
        </div>
      </div>

      <!-- Members Only Badge -->
      <div class="mb-3">
        <span class="guest-pill">
          <i class="bi bi-lock-fill me-1"></i> Members Only Feature
        </span>
      </div>

      <!-- Heading -->
      <h1 class="hero-title mb-3">Your Wishlist Awaits</h1>

      <!-- Subtitle -->
      <p class="hero-subtitle mx-auto mb-5">
        Save the products you love, build your dream collection, and add
        them to cart whenever you're ready. It only takes a moment to sign in.
      </p>

      <!-- CTA Buttons using BaseButton -->
      <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
        <BaseButton
          variants="danger"
          size="lg"
          @click="router.push('/auth/login')"
          id="wishlist-login-btn"
        >
          <i class="bi bi-box-arrow-in-right"></i>
          Log In to My Account
        </BaseButton>

        <BaseButton
          variants="outline-danger"
          size="lg"
          @click="router.push('/auth/register')"
          id="wishlist-register-btn"
        >
          <i class="bi bi-person-plus"></i>
          Create Free Account
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' });

const router = useRouter();
</script>

<style scoped>
/* ── Page Base ── */
.wishlist-guest-page {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-main, 'Inter', sans-serif);
  position: relative;
  overflow: hidden;
}

/* ── Ambient Glow ── */
.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.blob-1 {
  width: 500px; height: 500px;
  top: -150px; left: -150px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.1), transparent 70%);
  animation: drift 12s ease-in-out infinite alternate;
}
.blob-2 {
  width: 400px; height: 400px;
  bottom: -100px; right: -100px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 70%);
  animation: drift 16s ease-in-out infinite alternate-reverse;
}

/* ── Floating Hearts ── */
.floating-hearts-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.floating-heart {
  position: absolute;
  color: rgba(239, 68, 68, 0.13);
  animation: floatUp linear infinite;
}
.heart-1 { font-size: 24px; left: 8%;  animation-duration: 10s; animation-delay: 0s;  }
.heart-2 { font-size: 14px; left: 18%; animation-duration: 14s; animation-delay: 2s;  }
.heart-3 { font-size: 18px; left: 40%; animation-duration: 12s; animation-delay: 5s;  }
.heart-4 { font-size: 10px; left: 60%; animation-duration: 16s; animation-delay: 1s;  }
.heart-5 { font-size: 22px; left: 78%; animation-duration: 11s; animation-delay: 3s;  }
.heart-6 { font-size: 12px; left: 90%; animation-duration: 13s; animation-delay: 7s;  }

/* ── Hero Icon ── */
.hero-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.2), transparent 70%);
  animation: pulseGlow 2.5s ease-in-out infinite;
}
.hero-icon-ring {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
  border: 2px solid rgba(239, 68, 68, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}
.hero-heart-icon {
  font-size: 2.8rem;
  color: #ef4444;
  animation: heartbeat 1.8s ease-in-out infinite;
}

/* ── Badge ── */
.guest-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* ── Text ── */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: var(--color-text);
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.hero-subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  max-width: 480px;
  line-height: 1.7;
}

/* ── Animations ── */
@keyframes drift {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}
@keyframes floatUp {
  0%   { transform: translateY(110vh) rotate(-10deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.8; }
  100% { transform: translateY(-10vh) rotate(10deg); opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.1); }
}
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25%       { transform: scale(1.12); }
  75%       { transform: scale(1.08); }
}
</style>
