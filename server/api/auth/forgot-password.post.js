export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await $apiFetch(event, "/auth/forgot-password", {
    method: "POST",
    body: body,
  });

  return response;
});
