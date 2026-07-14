export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await $apiFetch(event, "/auth/otp/resend", {
    method: "POST",
    body,
  });

  return response;
});
