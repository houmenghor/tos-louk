export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const response = await $apiFetch(event, '/auth/reset-password', {
        method: 'POST',
        body
    });

    return response;
});