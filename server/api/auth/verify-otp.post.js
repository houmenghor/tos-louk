export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const response = await $apiFetch(event, '/auth/otp/verify', {
        method: 'POST',
        body
    });

    return response;
});