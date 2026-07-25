export default defineEventHandler(async (event) => {
  const response = await $apiFetch(event, "/me/wishlists/clear", {
    method: "DELETE",
  });
  return response;
});
