<template>
    <div class="container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div class="glass-card mx-auto text-center">
            <form @submit.prevent="handleVerifyOTP" autocomplete="off">

                <!-- Premium Glass Icon Badge -->
                <div class="icon-badge-wrapper mb-4 mx-auto">
                    <div class="icon-badge">
                        <i class="bi bi-shield-check text-primary-brand"></i>
                    </div>
                </div>

                <h2 class="form-title">Two-Step Verification</h2>
                <p class="form-subtitle">
                    We've sent a 6-digit verification code to your email. Please enter it below to verify your identity.
                </p>

                <!-- Updated OTP Inputs Group: Render 6 slots dynamically -->
                <div class="d-flex justify-content-center gap-2 mb-4">
                    <input v-for="(digit, index) in 6" :key="index" :id="'otp-' + index" type="text" maxlength="1"
                        class="form-control otp-input text-center fw-bold" v-model="otpDigits[index]"
                        @input="handleInput($event, index)" @keydown.delete="handleBackspace($event, index)"
                        placeholder="-" inputmode="numeric" pattern="[0-9]*" required />
                </div>

                <BaseButton type="submit" class="w-100 mb-4 btn-submit-glass" :disabled="!isOtpComplete">
                    Verify Code
                </BaseButton>

                <!-- Countdown & Resend Option -->
                <p class="text-secondary-custom mb-0">
                    Didn't receive the code?
                    <button type="button" @click="handleResend" class="btn btn-link p-0 glass-link-primary fw-bold ms-1"
                        :disabled="countdown > 0">
                        {{ countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code' }}
                    </button>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

definePageMeta({
    layout: 'auth'
});

// Array updated to hold exactly 6 inputs
const otpDigits = ref(['', '', '', '', '', '']);
const countdown = ref(30);
let timerInterval = null;

// Ensure all 6 fields are filled before enabling submit button
const isOtpComplete = computed(() => {
    return otpDigits.value.every(digit => digit !== '');
});

// Auto-focus next input array item dynamically up to index 5
const handleInput = (event, index) => {
    const value = event.target.value;
    // Strip non-numeric inputs
    otpDigits.value[index] = value.replace(/[^0-9]/g, '');

    if (otpDigits.value[index] && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
    }
};

// Jump back gracefully on Backspace key trigger
const handleBackspace = (event, index) => {
    if (!otpDigits.value[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
    }
};

const startTimer = () => {
    countdown.value = 30;
    timerInterval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000);
};

const handleVerifyOTP = () => {
    const fullCode = otpDigits.value.join('');
    console.log('Verifying security token payload:', fullCode);
};

const handleResend = () => {
    console.log('Requesting new security code token generation...');
    startTimer();
};

onMounted(() => {
    startTimer();
    // Autofocus first input slot safely
    document.getElementById('otp-0')?.focus();
});

onBeforeUnmount(() => {
    clearInterval(timerInterval);
});
</script>

<style scoped>
/* Glassmorphic Shell Panel */
.glass-card {
    max-width: 460px;
    width: 100%;
    padding: 3rem 2rem;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: var(--glass-shadow);
}

/* Icon Design Enhancements */
.icon-badge-wrapper {
    width: 72px;
    height: 72px;
    background: var(--color-primary-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-badge i {
    font-size: 2rem;
}

.form-title {
    font-family: var(--font-main);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 8px;
}

.form-subtitle {
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--color-text-secondary);
    margin-bottom: 2.2rem;
}

/* Custom OTP Character Slots - width adjusted slightly to comfortably fit 6 in a row */
.otp-input {
    width: 52px;
    height: 56px;
    font-size: 22px;
    border-radius: 10px;
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    transition: border-color 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}

.otp-input:focus {
    outline: none;
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
}

.otp-input::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.3;
}

/* Primary Glass Buttons */
.btn-submit-glass {
    background-color: var(--color-primary) !important;
    color: #111827 !important;
    font-weight: 600;
    border: none;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.btn-submit-glass:hover:not(:disabled) {
    background-color: var(--color-primary-hover) !important;
    transform: translateY(-1px);
}

.btn-submit-glass:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.text-secondary-custom {
    color: var(--color-text-secondary);
    font-size: 13.5px;
}

.glass-link-primary {
    color: var(--color-primary);
    text-decoration: none;
    font-size: 13.5px;
    transition: color 0.2s ease;
    border: none;
    background: none;
}

.glass-link-primary:hover:not(:disabled) {
    color: var(--color-primary-hover);
    text-decoration: underline;
}

.glass-link-primary:disabled {
    color: var(--color-text-secondary);
    opacity: 0.6;
    cursor: default;
}

.text-primary-brand {
    color: var(--color-primary);
}
</style>