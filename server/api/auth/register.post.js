export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await $apiFetch(event, "/auth/register", {
    method: "POST",
    body,
  });
});
