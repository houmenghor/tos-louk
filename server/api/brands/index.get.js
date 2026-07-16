import { $apiFetch } from "../../utils/apiFetch";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const response = await $apiFetch(event, '/brands', { query });
    return response;
});
