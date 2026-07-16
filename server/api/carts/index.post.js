export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await $apiFetch(event, "/carts", {
    method: "POST",
    body: body,
  });
  return response;
});
