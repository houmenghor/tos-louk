export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const response = await $apiFetch(event, "/me/orders", {
    method: "GET",
    query: query,
  });
  return response;
});
