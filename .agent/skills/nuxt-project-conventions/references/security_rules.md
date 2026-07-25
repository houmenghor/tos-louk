# Security & Performance

## 1. Security Rules
- **Environment Variables**: Never expose private API keys to the client. Always store sensitive keys in `runtimeConfig` and only access them within `server/api` routes.
- **Input Sanitization**: All user inputs must be properly sanitized before rendering to prevent XSS attacks or injection vulnerabilities.
- **Data Minimization**: API responses must be strictly mapped and stripped of all sensitive or unnecessary database fields before being sent over the network. Only return the exact data required by the client.
- **Error Masking**: Server errors must return generic, user-friendly messages to the client. Never expose stack traces or raw database errors in the network payload.

## 2. Performance Expectations
- **Asset Optimization**: Load all images using optimized components (e.g., `<NuxtImg>`) to ensure WebP formatting and lazy loading out of the box.
- **Data Caching**: Implement appropriate server-side caching for database-heavy operations or API responses that exceed standard payload sizes.