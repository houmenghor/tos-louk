export default defineEventHandler(async (event) => {
  const response = await $apiFetch(event, "/me/carts", {
    method: "GET",
  });
  return response;
});
