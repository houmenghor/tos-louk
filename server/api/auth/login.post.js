export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await $apiFetch(event, "/auth/login", {
    method: "POST",
    body: body,
  });

  const accessToken = response.data?.access_token;
  const refreshToken = response.data?.refresh_token;
  const expiresIn = response.data?.expires_in;

  if (accessToken) {
    setCookie(event, "at", accessToken, {
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
  }

  if (refreshToken) {
    setCookie(event, "rft", refreshToken, {
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
});
