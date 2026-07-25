export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await $apiFetch(event, "/me", {
    method: "PATCH",
    body,
  });
});
