// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
  // 1. Remove @nuxt/ui completely
  modules: ['nuxt-auth-utils', '@nuxtjs/i18n'],

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'kh',
    restructureDir: 'app',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'kh', name: 'ភាសាខ្មែរ', file: 'kh.json' }
    ]
  },

  app: {
    head: {
      title: 'Tos Louk',  
      link: [
        { rel: 'icon', type: 'image/png', sizes: '40x40', href: '/image.png' }
      ],
      // 2. Inject Bootstrap's JavaScript bundle for dynamic components like Offcanvas
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
          type: 'text/javascript'
        }
      ]
    }
  },

  // 3. Register Bootstrap core CSS files and Icon packages globally
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '@/assets/css/main.css'
  ]
})