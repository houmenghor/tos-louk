export function getApiError(error, customMessages = {}) {
  // Support passing a simple string as default message for backwards compatibility
  const overrides =
    typeof customMessages === "string"
      ? { default: customMessages }
      : customMessages;

  // 1. Check validation errors (e.g. error.data.data.details, error.data.details, or error.data.errors)
  const details =
    error?.data?.data?.details || error?.data?.details || error?.data?.errors;

  if (details && typeof details === "object") {
    const firstErrorField = Object.values(details)[0];

    if (Array.isArray(firstErrorField) && firstErrorField[0]) {
      return firstErrorField[0];
    } else if (typeof firstErrorField === "string") {
      return firstErrorField;
    }
  }

  // 2. Check HTTP status codes across all possible Nuxt/Laravel error wrappers
  const status =
    error?.data?.statusCode ||
    error?.statusCode ||
    error?.status ||
    error?.response?.status;

  // Check if the developer passed a custom override for this specific status code
  if (status && overrides[status]) {
    return overrides[status];
  }

  if (status === 401) {
    return "Invalid email or password. Please check your credentials and try again.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action or your account requires verification.";
  }

  if (status === 404) {
    return "The requested resource or account could not be found.";
  }

  if (status === 422) {
    return "The provided information is invalid. Please check your input and try again.";
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment before trying again.";
  }

  if (status >= 500) {
    return "Server error. Our team has been notified. Please try again later.";
  }

  // 3. Only fallback to backend message if it's not a standard HTTP error status handled above
  if (error?.data?.data?.message) {
    return error.data.data.message;
  }

  if (error?.data?.message) {
    return error.data.message;
  }

  if (error?.message && !error.message.includes("FetchError")) {
    return error.message;
  }

  return overrides.default || "Something went wrong. Please try again.";
}
