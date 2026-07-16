export default defineEventHandler(async (event) => {
    const query = await getQuery(event);
    const response = await $apiFetch(event, '/products', {query});
    return response;
});