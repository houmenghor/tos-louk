export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-otp',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/google/callback',
    '/auth/facebook/callback'
  ];

  if (to.path === '/auth/login' && auth.access_token) {
    return navigateTo('/');
  }

  if (!publicRoutes.includes(to.path)) {
    if (!auth.access_token && !auth.refresh_token) {
      return navigateTo('/auth/login');
    }

    if (!auth.access_token && auth.refresh_token) {
      try {
        await auth.refreshToken();
      } catch (e) {
        auth.refresh_token = null;
        return navigateTo('/auth/login');
      }
    }

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
            console.error('Failed to refresh token:', refreshError);
          }
        }

        auth.access_token = null;
        auth.refresh_token = null;
        return navigateTo('/auth/login');
      }
    }
  }

   if (publicRoutes.includes(to.path) && auth.access_token) {
    return navigateTo('/');
  }
});