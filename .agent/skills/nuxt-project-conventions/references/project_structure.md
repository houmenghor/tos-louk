# Project Structure & Architecture

This project follows a standard Nuxt 3 directory structure with some specific architectural decisions for organization. You MUST adhere to this structure when creating new files.

## Root Directories

- `app/`: Contains the main frontend Vue application logic. All UI, state, and routing logic lives here.
- `server/`: Contains backend API routes and server-side utilities (Nitro).
- `public/`: Static assets that should be served directly (e.g., images, favicons).

## The `app/` Directory Breakdown

- **`assets/`**: Uncompiled assets like global CSS (`main.css`), fonts, or raw images.
- **`components/`**: Vue components.
  - *Rule*: Components MUST be grouped logically by feature into subdirectories (e.g., `base/`, `checkout/`, `common/`, `product/`).
  - *Rule*: Shared foundational UI elements MUST go into `base/` (e.g., `base-button.vue`).
- **`composables/`**: Vue composables (auto-imported). Used for shared UI state or behavior (e.g., `useAppToast.js`).
- **`layouts/`**: Nuxt layouts for page wrappers (e.g., `default.vue`, `user.vue`, `admin.vue`).
- **`locales/`**: Internationalization (i18n) translation files (e.g., `en.json`, `kh.json`).
- **`middleware/`**: Nuxt route middleware for navigation guards.
- **`pages/`**: File-based routing. Group pages into folders for nested routes.
- **`plugins/`**: Nuxt plugins to extend the Vue app. Use `.client.js` or `.server.js` suffixes if they should only run in a specific environment.
- **`stores/`**: Pinia state management stores (e.g., `authStore.js`, `cartStore.js`).
- **`utils/`**: Shared utility functions and helpers (e.g., `apiError.js`, `formatters.js`).

## General Placement Rules

- **State Management**: If the data needs to persist across multiple pages and components, put it in `stores/`.
- **Reusable UI Logic**: If the logic hooks into Vue lifecycle or uses Reactivity but doesn't render HTML, put it in `composables/`.
- **Pure JavaScript Logic**: If the function is a pure utility (e.g., date formatting, error parsing) without Vue Reactivity, put it in `utils/`.
- **Server API**: If you need to hit a database, perform server-only operations, or handle secure tokens, put the logic in `server/api/`.
