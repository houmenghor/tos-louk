export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  const body = await readBody(event);
  const response = await $apiFetch(event, `/carts/${uuid}`, {
    method: "PATCH",
    body: body,
  });
  return response;
});
