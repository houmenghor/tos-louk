export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  const response = await $apiFetch(event, `/me/wishlists/${uuid}`, {
    method: "DELETE",
  });
  return response;
});
