export const $apiFetch = async (event, requestPath, options = {}) => {

    // 1. get api base from runtime config (nuxt.config.ts)
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;

    const accessToken = getCookie(event, 'at');

    // 2. set default headers
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

        // inject access token if it exists
        ...(accessToken && {'Authorization': `Bearer ${accessToken}`})
    }

    try {
        return await $fetch(`${apiBase}${requestPath}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        })
    } catch (error) {

        if (error.response?.status === 401) {
            console.log("Token expired! Time to refresh...");
        }

        const responseData = error.response?._data;
        throw createError({
            statusCode: error.response?.status,
            message: responseData?.message,
            data: responseData?.details
        })
    }

}