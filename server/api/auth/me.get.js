export default defineEventHandler(async (event) => {
  return await $apiFetch(event, "/me", {
    method: "GET",
  });
});
