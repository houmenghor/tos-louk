export default defineEventHandler(async (event) => {
  const response = await $apiFetch(event, "/me/wishlists", {
    method: "GET",
  });
  return response;
});
