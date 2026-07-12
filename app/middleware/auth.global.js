export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // 1. Pages ONLY for guest users (logged-in users will be redirected to their dashboard /user)
  const authOnlyRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-otp",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/google/callback",
    "/auth/facebook/callback",
  ];

  // 2. Public pages open to EVERYONE (guest and logged-in users can browse freely)
  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/categories",
    "/discount",
    "/wishlist",
    "/order",
    "/privacy-policy",
    "/terms"
  ];

  // CASE A: User IS logged in, but tries to access guest-only auth pages (like login/register)
  if (authOnlyRoutes.includes(to.path) && auth.access_token) {
    return navigateTo("/user"); // Redirect to user dashboard
  }

  // CASE C: User IS logged in, and tries to access guest wishlist page (/wishlist)
  if (to.path === "/wishlist" && auth.access_token) {
    return navigateTo("/user/wishlist"); // Redirect to authenticated wishlist page
  }

  // CASE B: User IS NOT logged in, and tries to access a protected page (like /profile or /user)
  const isPublicPage = publicRoutes.includes(to.path);
  const isAuthPage = authOnlyRoutes.includes(to.path);
  const isProtectedRoute = !isPublicPage && !isAuthPage;

  if (isProtectedRoute) {
    // If guest user, redirect to login
    if (!auth.access_token && !auth.refresh_token) {
      return navigateTo("/auth/login");
    }

    // Attempt token refresh if token expired but refresh token exists
    if (!auth.access_token && auth.refresh_token) {
      try {
        await auth.refreshToken();
      } catch (e) {
        auth.refresh_token = null;
        return navigateTo("/auth/login");
      }
    }

    // Retrieve profile details
    if (!auth.userProfile) {
      try {
        await auth.fetchProfile();
      } catch (e) {
        if (e.response?.status === 401 && auth.refresh_token) {
          try {
            await auth.refreshToken();
            await auth.fetchProfile();
            return;
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        }

        auth.access_token = null;
        auth.refresh_token = null;
        return navigateTo("/auth/login");
      }
    }
  }
});
