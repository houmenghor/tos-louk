# UI Conventions & State Management

## 1. State Management & Error Handling
- **No Try/Catch in Stores**: Do NOT use `try...catch` blocks inside Pinia stores. The project's custom `apiFetch` handles errors globally.
- **Component-Level Try/Catch**: Only use `try...catch` directly inside UI components when necessary.
- **Global API Errors**: Utilize the global `apiError` object and reuse it appropriately when handling errors in UI components.
- **Global State Initialization**: Critical user state (such as cart or wishlist) MUST be initialized globally in the main application entry component to prevent data loss across layout transitions or OAuth redirects.

## 2. UI, Styling & Code Quality
- **Bootstrap 5 & Icons**: The project relies on Bootstrap 5 for layout, grid, and utility classes, and Bootstrap Icons for iconography. Avoid introducing other CSS frameworks (like Tailwind).
- **Project Styles & CSS Variables**:
    - All global styles and Light/Dark mode variables are located in `app/assets/css/main.css`.
    - **Primary Color**: `#03b971` (use `--color-primary`).
    - **Typography**: Uses `Poppins` and `KantumruyPro` (`--font-main`).
    - **Glassmorphism**: Use the predefined `--glass-*` CSS variables for glassmorphism UI effects.
    - **No Hardcoded Colors**: Always use global CSS variables (e.g., `--color-primary`, `--color-bg`, `--color-text`, `--color-border`) instead of hardcoded hex/rgb values to maintain cross-theme compatibility.
- **Dark/Light Mode**: When designing new UIs (especially homepages or landing pages), you MUST ensure that both Dark Mode and Light Mode are fully supported by strictly utilizing the established CSS variables.
- **Clean Code**: Write clean code without unnecessary boilerplate. Ensure no `console.log()` statements, debug commands, or commented-out code are left in the final code. 
- **Reusability**: Avoid raw, hardcoded values. Always architect your code to be modular, reusable, and easy to maintain in the future.

## 3. Naming Conventions

- **Component Files (UI, Pages, Layouts)**: All UI component, page, and layout files MUST use `kebab-case` or strictly lowercase naming (e.g., `order-summary.vue`, `default.vue`, `admin.vue`). Never use `PascalCase` or `camelCase`.
- **Stores**: All store files MUST use `camelCase` and end with the `Store` suffix (e.g., `authStore.js`, `cartStore.js`, `productStore.js`).
- **Composables**: Use `camelCase`. Shared behavior or UI hooks MUST be prefixed with `use` (e.g., `useAppToast.js`, `useCarouselScroll.js`). General domain logic files can omit the prefix (e.g., `auth.js`, `checkout.js`).
- **Plugins & Middleware**: Use dot-notation to explicitly define the execution context for these files (e.g., `toast.client.js`, `auth.global.js`).
- **Utilities**: All files in the `utils/` directory MUST use `camelCase` (e.g., `apiError.js`, `formatters.js`).
- **Directories**: Keep all directory names strictly lowercase and grouped logically by feature (e.g., `checkout`, `common`, `product`).

## Strict Component Rules (MANDATORY)
- **Use Base Components**: You are FORBIDDEN from using raw `<input>`, `<button>`, or `<img>` tags for UI elements.
- **Component Mapping**: 
    - Always replace `<input>` with `<BaseInput />` (e.g., text, email, password fields).
    - Always replace `<button>` with `<BaseButton />`.
    - Always replace `<img>` with `<BaseImage />` (or your specific image component for optimization).
- **Architecture Enforcement**: If a base component is missing a prop for your specific use case, do not abandon it. Extend the component or propose the addition, but never default to raw HTML tags.

## File Modularization & Length (MANDATORY)
- **Max File Length**: Files MUST NOT exceed 200 lines. If a file grows larger, you are strictly required to split it into logical sub-components (e.g., `ProfileForm.vue`, `AvatarUploader.vue`, `AddressForm.vue`).
- **Separation of Concerns**: Keep components small, focused, and single-purpose. Complex pages must be composed of smaller, imported components.