# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Bearer Token, Access Token, & Refresh token.
  1. User submits email/password
  2. POST to /api/auth/login
  3. Server validates and returns a response
  4. No token is being stored - the code just navigates to "todos" on success

  A basic bearer token looks like this:
  - Server issues a single token (JWT) on login
  - Client stores it (localStorage/cookie)
  - Client sends it in the Authorization: Bearer <token> header on each request
  - Token expires after some time (e.g., 1 hour)
  - When it expires, user must login again


  Access Token + Refresh Token Approach
  1. User logs in -> server returns both tokens
  2. Client stores access token in memory, refresh token in http Only cookie
  3. API requests use access token
  4. When access token expires (401 response):
    - Client calls refresh endpoint with refresh token
    - Server issues new access token
    - Client retries the original request
  5. When refresh token expires  this makes the user login again


  - Better security (short-lived access tokens limit exposure)
  - Better UX (user stays logged in longer without re-entering credentials)
  - Access tokens can be revoked separately from refresh tokens
