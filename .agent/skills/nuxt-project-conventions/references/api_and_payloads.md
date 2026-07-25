# API, Data Fetching & Payloads

## 1. API & Data Fetching
- **Server APIs**: Write API endpoints inside `server/api`.
- **Data Fetching Hooks**: Use `onMounted`, `useAsyncData`, or `useLazyAsyncData` precisely at their correct lifecycle timings. Always prioritize performance and security.
- **Skeleton Loaders**: When using `useLazyAsyncData`, ALWAYS implement a skeleton loading state to ensure smooth, non-blocking UI transitions and prevent the UI from freezing.

## 2. Validation & Payloads
- **Zod Schemas**: Write validation schemas using `zod` and place them inside the `composables/` directory so they can be easily reused across the application.
- **Server-Side Payload Validation**: ALL incoming API request payloads must be strictly validated on the server using `zod` before any backend operations occur. Never trust client-side input.