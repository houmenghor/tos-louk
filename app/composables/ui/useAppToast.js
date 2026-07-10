export const useAppToast = () => {
  const showSuccess = (message) => {
    if (import.meta.client) {
      const { $toast } = useNuxtApp();
      $toast.success(message);
    }
  };

  const showError = (message) => {
    if (import.meta.client) {
      const { $toast } = useNuxtApp();
      $toast.error(message);
    }
  };

  const showWarning = (message) => {
    if (import.meta.client) {
      const { $toast } = useNuxtApp();
      $toast.warning(message);
    }
  };

  const showInfo = (message) => {
    if (import.meta.client) {
      const { $toast } = useNuxtApp();
      $toast.info(message);
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
