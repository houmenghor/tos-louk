export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, 'uuid');
    return await $apiFetch(event, `/products/${uuid}`, {
        method: 'GET',
    });
});
