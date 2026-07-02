<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div class="glass-card mx-auto text-center">
            <form @submit.prevent="handleResetPassword" autocomplete="off">

                <div class="illustration-container mb-3">
                    <i class="bi bi-mailbox2 text-primary-brand display-2"></i>
                </div>

                <h2 class="form-title">Reset password</h2>
                <p class="form-subtitle">Please enter your new security credentials below.</p>

                <BaseInputPassword label="New password" placeholder="••••••••••••" id="newPassword"
                    v-model="formData.password" class="mb-3 text-start" />

                <BaseInputPassword label="Re-enter password" placeholder="••••••••••••" id="confirmPassword"
                    v-model="formData.confirmPassword" class="mb-4 text-start" />

                <BaseButton type="submit" class="w-100 mb-2 btn-submit-glass">
                    Reset Password
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
    layout: 'auth'
});

const formData = ref({
    password: '',
    confirmPassword: ''
});

const handleResetPassword = () => {
    console.log('Updating password...', formData.value);
};
</script>

<style scoped>
.glass-card {
    max-width: 440px;
    width: 100%;
    padding: 3rem 2.5rem;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: var(--glass-shadow);
}

.illustration-container {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
}

.illustration-container img {
    max-height: 100%;
    object-fit: contain;
}

.form-title {
    font-family: var(--font-main);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 6px;
}

.form-subtitle {
    font-size: 13px;
    color: var(--color-text-secondary);
    margin-bottom: 2rem;
}

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
</style>