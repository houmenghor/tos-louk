export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, 'uuid');
    const response = await $apiFetch(event, `/products/${uuid}`, {
        method: 'GET',
    });
    return response;
});
