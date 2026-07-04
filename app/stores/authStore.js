export const useAuthStore = defineStore('auth', () => {

    const user = ref(null);
    const isAuthenticated = ref(false);

    const login = async (payload) => {
        const response = await $fetch('/api/auth/login', {
            method: 'POST',
            body: payload
        })

        user.value = response.user;
        isAuthenticated.value = true;
    }

    return {
        user,
        isAuthenticated,
        login
    }

})