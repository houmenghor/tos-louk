import { ref, computed } from "vue";

export const useOtpInput = (length = 6, initialCountdown = 600) => {
  // Fill the array with empty strings based on the length
  const otpDigits = ref(Array(length).fill(""));
  const countdown = ref(initialCountdown);
  let timerInterval = null;

  // Ensure all fields are filled
  const isOtpComplete = computed(() => {
    return otpDigits.value.every((digit) => digit !== "");
  });

  // Format seconds into mm:ss
  const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  const startTimer = () => {
    countdown.value = initialCountdown;
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
  };

  // Auto-focus next input
  const handleInput = (event, index) => {
    const value = event.target.value;
    // Allow uppercase letters and numbers
    otpDigits.value[index] = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (otpDigits.value[index] && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Jump back on Backspace
  const handleBackspace = (event, index) => {
    if (!otpDigits.value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle pasting strings
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData("text") || "";

    // Clean string: uppercase letters and numbers only
    const cleanData = pastedData.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Spread up to X characters across the inputs
    for (let i = 0; i < Math.min(cleanData.length, length); i++) {
      otpDigits.value[i] = cleanData[i];
    }

    // Auto-focus the next empty input or the last input
    const nextIndex = Math.min(cleanData.length, length - 1);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  return {
    otpDigits,
    countdown,
    formattedCountdown,
    isOtpComplete,
    handleInput,
    handleBackspace,
    handlePaste,
    startTimer,
    stopTimer,
  };
};
