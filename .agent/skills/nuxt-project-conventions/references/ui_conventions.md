# UI Conventions & State Management

## 1. State Management & Error Handling
- **No Try/Catch in Stores**: Do NOT use `try...catch` blocks inside Pinia stores. The project's custom `apiFetch` handles errors globally.
- **Component-Level Try/Catch**: Only use `try...catch` directly inside UI components when necessary.
- **Global API Errors**: Utilize the global `apiError` object and reuse it appropriately when handling errors in UI components.
- **Global State Initialization**: Critical user state (such as cart or wishlist) MUST be initialized globally in the main application entry component to prevent data loss across layout transitions or OAuth redirects.

## 2. UI, Styling & Code Quality
- **Dark/Light Mode**: When designing new UIs (especially homepages or landing pages), you MUST ensure that both Dark Mode and Light Mode are fully supported and look great.
- **Global CSS Variables**: Use global CSS variables instead of hardcoded colors to maintain consistent branding and cross-theme compatibility.
- **Clean Code**: Write clean code without unnecessary boilerplate. Ensure no `console.log()` statements, debug commands, or commented-out code are left in the final code. 
- **Reusability**: Avoid raw, hardcoded values. Always architect your code to be modular, reusable, and easy to maintain in the future.

## 3. Naming Conventions

- **Component Files (UI, Pages, Layouts)**: All UI component, page, and layout files MUST use `kebab-case` or strictly lowercase naming (e.g., `order-summary.vue`, `default.vue`, `admin.vue`). Never use `PascalCase` or `camelCase`.
- **Stores**: All store files MUST use `camelCase` and end with the `Store` suffix (e.g., `authStore.js`, `cartStore.js`, `productStore.js`).
- **Composables**: Use `camelCase`. Shared behavior or UI hooks MUST be prefixed with `use` (e.g., `useAppToast.js`, `useCarouselScroll.js`). General domain logic files can omit the prefix (e.g., `auth.js`, `checkout.js`).
- **Plugins & Middleware**: Use dot-notation to explicitly define the execution context for these files (e.g., `toast.client.js`, `auth.global.js`).
- **Utilities**: All files in the `utils/` directory MUST use `camelCase` (e.g., `apiError.js`, `formatters.js`).
- **Directories**: Keep all directory names strictly lowercase and grouped logically by feature (e.g., `checkout`, `common`, `product`).