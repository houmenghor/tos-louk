export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  const response = await $apiFetch(event, `/carts/${uuid}`, {
    method: "DELETE",
  });
  return response;
});
