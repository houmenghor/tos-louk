export default defineEventHandler(async (event) => {
  const uuid = event.context.params.uuid;
  const response = await $apiFetch(event, `/me/orders/${uuid}`, {
    method: "GET",
  });
  return response;
});
