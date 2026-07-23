export const useAuthStore = defineStore("auth", () => {
  const userProfile = ref(null);
  const access_token = useCookie("at", {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour for standard password login
  });
  const refresh_token = useCookie("rft", {
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  });
  const isAuthenticated = computed(() => !!userProfile.value);
  const registerEmail = ref("");
  const otpEmail = ref(null);
  const otpPurpose = ref("email_verify");
  const resetToken = ref(null);

  const startOtpFlow = async (email, purpose) => {
    otpEmail.value = email;
    otpPurpose.value = purpose;
    await navigateTo("/auth/verify-otp");
  };

  const refreshToken = async () => {
    const currentRft = refresh_token.value;

    if (!currentRft) {
      await logout();
      throw new Error("No refresh token available");
    }

    const headers = useRequestHeaders(["cookie"]);

    const response = await $fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: {
        refresh_token: currentRft,
      },
    });

    if (response.access_token) {
      access_token.value = response.access_token;
    }
    if (response.refresh_token) {
      refresh_token.value = response.refresh_token;
    }

    return response.access_token;
  };

  const login = async (payload) => {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: payload,
    });

    access_token.value = response.access_token;
    refresh_token.value = response.refresh_token;

    await fetchProfile(true);

    // Sync cart and wishlist with DB on login
    const cartStore = useCartStore();
    const wishlistStore = useWishlistStore();
    await Promise.all([
      cartStore.syncCartWithDb(),
      wishlistStore.syncWishlistWithDb(),
    ]);

    return response;
  };

  const fetchProfile = async (force = false) => {
    if (userProfile.value && !force) return userProfile.value;

    const headers = useRequestHeaders(["cookie"]);
    if (access_token.value) {
      headers.Authorization = `Bearer ${access_token.value}`;
    }

    const response = await $fetch("/api/auth/me", {
      headers,
    });

    userProfile.value = response.data || response;

    return userProfile.value;
  };

  const logout = async () => {
    const headers = useRequestHeaders(["cookie"]);
    if (access_token.value) {
      headers.Authorization = `Bearer ${access_token.value}`;
    }

    await $fetch("/api/auth/logout", {
      method: "POST",
      headers,
    });

    access_token.value = null;
    refresh_token.value = null;
    userProfile.value = null;

    useCartStore().clearCart();
    useWishlistStore().clearWishlist();

    await navigateTo("/");
  };

  const register = async (payload) => {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: payload,
    });

    registerEmail.value = payload.email;

    return response;
  };

  const verifyOtp = async (payload) => {
    const response = await $fetch("/api/auth/verify-otp", {
      method: "POST",
      body: payload,
    });

    return response;
  };

  const resendOtp = async (payload) => {
    const response = await $fetch("/api/auth/resend-otp", {
      method: "POST",
      body: payload,
    });

    return response;
  };

  const forgotPassword = async (payload) => {
    const response = await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: payload,
    });

    return response;
  };

  const resetPassword = async (payload) => {
    const response = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: payload,
    });

    return response;
  };

  const updateProfile = async (payload) => {
    const response = await $fetch("/api/auth/profile", {
      method: "PATCH",
      body: payload,
    });

    userProfile.value = response.data || response;
    return response;
  };

  const changePassword = async (payload) => {
    const response = await $fetch("/api/auth/change-password", {
      method: "POST",
      body: payload,
    });

    return response;
  };

  const changeEmail = async (payload) => {
    const response = await $fetch("/api/auth/change-email", {
      method: "PUT",
      body: payload,
    });
    
    // Refresh profile to get updated email if successful
    await fetchProfile(true);
    return response;
  };

  const updateAvatar = async (formData) => {
    const response = await $fetch("/api/auth/upload-avatar", {
      method: "POST",
      body: formData,
    });

    await fetchProfile(true);
    return response;
  };

  return {
    registerEmail,
    resetToken,
    otpEmail,
    otpPurpose,
    startOtpFlow,
    access_token,
    refresh_token,
    userProfile,
    isAuthenticated,
    login,
    fetchProfile,
    refreshToken,
    logout,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    changeEmail,
    updateAvatar,
  };
});
