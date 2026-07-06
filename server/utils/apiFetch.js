import { getCookie, setCookie, deleteCookie, getHeader } from 'h3';

/**
 * Helper to extract token from Cookie or Auth Header
 */
const getAuthToken = (event) => {
    const authHeader = getHeader(event, 'authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return getCookie(event, 'at');
};

/**
 * Helper to wipe all authentication cookies
 */
const clearAuthCookies = (event) => {
    deleteCookie(event, 'at', { path: '/', sameSite: 'lax' });
    deleteCookie(event, 'rft', { path: '/', sameSite: 'lax' });
};

/**
 * Handles attempting to refresh an expired token
 */
const handleTokenRefresh = async (event, backendUrl, originalRequest, defaultHeaders, options) => {
    const refreshToken = getCookie(event, 'rft');

    if (!refreshToken) {
        clearAuthCookies(event);
        throw createError({ statusCode: 401, message: 'Unauthenticated.' });
    }

    try {
        const refreshResponse = await $fetch(`${backendUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: { refresh_token: refreshToken }
        });

        const newAccessToken = refreshResponse.data?.access_token;
        const newRefreshToken = refreshResponse.data?.refresh_token;

        setCookie(event, 'at', newAccessToken, {
            maxAge: 60 * 60, // 1 hour
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        if (newRefreshToken) {
            setCookie(event, 'rft', newRefreshToken, {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
        }

        return await $fetch(`${backendUrl}${originalRequest}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
                'Authorization': `Bearer ${newAccessToken}`
            }
        });

    } catch (refreshError) {
        clearAuthCookies(event);
        const responseData = refreshError.response?._data || {};
        throw createError({
            statusCode: refreshError.response?.status || 500,
            message: responseData?.message,
            data: responseData
        });
    }
};

/**
 * Main API Fetch Wrapper
 */
export const $apiFetch = async (event, request, options = {}) => {

    const config = useRuntimeConfig();
    const backendUrl = config.public.apiBase;
    const token = getAuthToken(event);

    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // Prevent overriding content type for form data uploads
    if (options.body?.constructor?.name === 'FormData') {
        delete defaultHeaders['Content-Type'];
    }

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        return await $fetch(`${backendUrl}${request}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });
    } catch (error) {
        const isUnauthorized = error.response?.status === 401;
        const isAuthRoute = request.includes('/auth/refresh') || request.includes('/auth/login');

        // Trigger refresh flow if token expired and it's not a login/refresh request
        if (isUnauthorized && !isAuthRoute) {
            return await handleTokenRefresh(event, backendUrl, request, defaultHeaders, options);
        }

        // Network connection error (Laravel backend offline)
        if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED') {
            throw createError({
                statusCode: 503,
                message: 'Backend service is currently unreachable.'
            });
        }

        const responseData = error.response?._data;
        throw createError({
            statusCode: error.response?.status,
            message: responseData?.message,
            data: responseData
        });
    }
};