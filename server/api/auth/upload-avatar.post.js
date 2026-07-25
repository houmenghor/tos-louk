import { readFormData } from "h3";

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  formData.append('_method', 'PATCH');

  return await $apiFetch(event, "/me", {
    method: "POST",
    body: formData,
  });
});
