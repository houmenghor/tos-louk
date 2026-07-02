<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div class="row w-100 align-items-center">

            <!-- Glassmorphic Form Column (Left aligned for visual consistency) -->
            <div class="col-12 col-md-6">
                <div class="glass-card mx-auto">
                    <form @submit.prevent="handleForgotPassword" autocomplete="off">
                        <h2 class="form-title">Forgot Password?</h2>
                        <p class="form-subtitle">
                            Enter your email that connected to your account.
                        </p>

                        <BaseInput label="Email Address" placeholder="Enter your email" id="forgotEmail" type="email"
                            v-model="email" class="mb-4" required />

                        <BaseButton type="submit" class="w-100 mb-4 btn-submit-glass">
                            Reset Password
                        </BaseButton>

                        <p class="text-center text-secondary-custom mb-0">
                            Remember your password?
                            <NuxtLink to="/auth/login" class="glass-link-primary fw-bold ms-1">Back to Login</NuxtLink>
                        </p>
                    </form>
                </div>
            </div>

            <div class="col-12 col-md-6 d-none d-md-block">
                <div class="image-banner text-center animate-fade-in">
                    <img :src="banner" alt="Forgot Password Banner" class="img-fluid auth-banner-img" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import banner from '@/assets/images/auth/forgotPass.png';

definePageMeta({
    layout: 'auth'
});

const email = ref('');

const handleForgotPassword = () => {
    console.log('Sending recovery email request to:', email.value);
    router.push('/auth/reset-password');
};
</script>

<style scoped>
/* Glassmorphic Container Card */
.glass-card {
    max-width: 460px;
    padding: 2.5rem;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    box-shadow: var(--glass-shadow);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
}

/* Typography connected directly to global design variables */
.form-title {
    font-family: var(--font-main);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 8px;
}

.form-subtitle {
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text-secondary);
    margin-bottom: 2.2rem;
}

.text-secondary-custom {
    color: var(--color-text-secondary);
    font-size: 13px;
}

/* Primary Glass Links */
.glass-link-primary {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.2s ease;
}

.glass-link-primary:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
}

/* Premium Button Overrides */
.btn-submit-glass {
    background-color: var(--color-primary) !important;
    color: #111827 !important;
    /* Fixed dark text over the bright mint neon token background */
    font-weight: 600;
    border: none;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.btn-submit-glass:hover {
    background-color: var(--color-primary-hover) !important;
    transform: translateY(-1px);
}

/* Graphical Asset Adjustments */
.auth-banner-img {
    max-height: 440px;
    object-fit: contain;
    filter: drop-shadow(0px 10px 25px rgba(0, 0, 0, 0.06));
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>