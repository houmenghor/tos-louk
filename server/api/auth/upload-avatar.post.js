export default defineEventHandler(async (event) => {
    const body = await readRawBody(event, false);
    const headers = getHeaders(event);

    return await $apiFetch(event, '/me/avatar', {
        method: 'POST',
        headers: {
            'content-type': headers['content-type']
        },
        body
    });
});
