<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div class="row w-100 align-items-center">
            <!-- Form Column -->
            <div class="col-12 col-md-6">
                <div class="glass-card mx-auto">
                    <form @submit.prevent="handleLogin" autocomplete="off">
                        <h2 class="form-title">Welcome Back</h2>
                        <p class="form-subtitle">Welcome back! Please enter your details to login.</p>

                        <BaseInput label="Email" placeholder="Enter your email" id="email" type="email"
                            v-model="formData.email" class="mb-3" />

                        <BaseInputPassword label="Password" placeholder="Enter your password" id="password"
                            v-model="formData.password" class="mb-3" />

                        <div class="d-flex justify-content-end align-items-center mb-4">
                            <NuxtLink to="/auth/forgot-password"
                                class="text-forgetpass glass-link-primary small fw-medium">
                                Forgot Password?
                            </NuxtLink>
                        </div>

                        <BaseButton type="submit" class="w-100 mb-3 btn-submit-glass">Log In</BaseButton>

                        <!-- Divider Line -->
                        <div class="divider-container mb-2">
                            <span class="divider-text">or</span>
                        </div>

                        <!-- Google OAuth Button -->
                        <button type="button" @click="handleGoogleLogin"
                            class="btn w-100 mb-4 btn-google-glass d-flex align-items-center justify-content-center gap-2">
                            <i class="bi bi-google"></i>
                            <span>Sign in with Google</span>
                        </button>

                        <p class="text-center text-secondary-custom mb-0">
                            Don't have an account yet?
                            <NuxtLink to="/auth/register" class="glass-link-primary fw-bold ms-1">Sign up for free
                            </NuxtLink>
                        </p>
                    </form>
                </div>
            </div>

            <!-- Banner Column -->
            <div class="col-12 col-md-6 d-none d-md-block">
                <div class="image-banner text-center animate-fade-in">
                   <NuxtImg :src="banner" alt="Authentication Banner" class="img-fluid auth-banner-img" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import banner from '/images/auth/banner.png';

definePageMeta({
    layout: 'auth'
});

const formData = ref({
    email: '',
    password: '',
    rememberMe: false
});

const handleLogin = () => {
    console.log('Submitting standard login data:', formData.value);
};

// Added Google integration handler placeholder
const handleGoogleLogin = () => {
    console.log('Initiating Google OAuth flow...');
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

/* Typography elements connected directly to global variables */
.form-title {
    font-family: var(--font-main);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 4px;
}

.form-subtitle {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
}

.text-secondary-custom {
    color: var(--color-text-secondary);
    font-size: 13px;
}

/* Links & Interactive Items */
.glass-link-primary {
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.2s ease;
}

.glass-link-primary:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
}

.text-forgetpass {
    font-size: 13px;
}

/* Button override to inject glass behavior/colors */
.btn-submit-glass {
    background-color: var(--color-primary) !important;
    color: #111827 !important;
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

/* Custom Glassmorphic Google OAuth Button Layout */
.btn-google-glass {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    padding: 8px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
    transition: all 0.2s ease;
}

.btn-google-glass:hover {
    background: var(--glass-hover-bg);
    color: var(--color-primary);
    border-color: var(--color-primary);
}

/* Text and Line Divider Element styling */
.divider-container {
    display: flex;
    align-items: center;
    text-align: center;
}

.divider-container::before,
.divider-container::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--color-border);
    opacity: 0.6;
}

.divider-text {
    padding: 0 12px;
    font-size: 13px;
    color: var(--color-text-secondary);
}

/* Subtle banner styling */
.auth-banner-img {
    max-height: 480px;
    object-fit: contain;
    filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.05));
}

.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>