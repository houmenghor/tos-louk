export default defineEventHandler(async (event) => {
    return await $apiFetch(event, '/settings', {
        method: 'GET'
    });
});
