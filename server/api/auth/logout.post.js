export default defineEventHandler(async (event) => {
    const response = await $apiFetch(event, '/auth/logout', {
        method: 'POST'
    });

    // Clear the authentication cookies
    deleteCookie(event, 'at', { path: '/', sameSite: 'lax' });
    deleteCookie(event, 'rft', { path: '/', sameSite: 'lax' });

    return response;
});
