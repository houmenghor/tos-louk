export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, 'uuid');
    return await $apiFetch(event, `/categories/${uuid}`);
});
