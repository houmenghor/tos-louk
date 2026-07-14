// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: [
    "nuxt-auth-utils",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/turnstile",
    "@nuxtjs/color-mode",
  ],
  colorMode: {
    classSuffix: "", // so it applies 'dark' instead of 'dark-mode'
    preference: "system",
    fallback: "light",
    storageKey: "theme", // Match existing localStorage key used previously
  },

  i18n: {
    strategy: "no_prefix",
    defaultLocale: "kh",
    restructureDir: "app",
    langDir: "locales",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "kh", name: "ភាសាខ្មែរ", file: "kh.json" },
    ],
  },

  app: {
    head: {
      title: "Tos Louk",
      meta: [
        {
          name: "google-site-verification",
          content: "h2ieDS0d2baDGZsxzTWp65yyDUpudTRTfb7B_fHWkJ0",
        },
        {
          name: "facebook-domain-verification",
          content: "n75xtsojt79wbf1rp4snnujv1i8vv3",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "40x40",
          href: "/tos-louk.webp?v=1",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-icons/font/bootstrap-icons.css",
    "@/assets/css/main.css",
  ],

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api/v1",
      turnstile: {
        siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || "",
      },
    },
  },
});
