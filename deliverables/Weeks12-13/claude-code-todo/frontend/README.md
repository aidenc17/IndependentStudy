# Todo App — Frontend

React + Vite frontend for the Todo application.

## Tech Stack

- **React 18** — UI library
- **Vite** — build tool and dev server
- **Context API** — auth state management
- **Fetch API** — HTTP requests to the backend

## Project Structure

```
frontend/
├── index.html
├── vite.config.js         # Dev proxy: /api → localhost:5000
├── package.json
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Root component, page routing
    ├── index.css          # Global styles
    ├── context/
    │   └── AuthContext.jsx  # Auth state + localStorage persistence
    ├── utils/
    │   └── auth.js          # Fetch wrappers for API calls
    ├── components/
    │   └── Navbar.jsx       # Responsive navigation bar
    └── pages/
        ├── Home.jsx         # Landing page
        ├── Login.jsx        # Login form
        ├── Register.jsx     # Registration form
        ├── Todos.jsx        # Protected todo CRUD page
        └── About.jsx        # Static info page
```

## Setup & Run

### 1. Prerequisites

- Node.js v18+
- The backend server must be running on port 5000 (see `backend/README.md`)

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

The app will open at `http://localhost:3000`.

The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so no CORS issues during development.

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file host (Nginx, Vercel, Netlify, etc.).

> **Note for production:** The Vite proxy only works during development. For production builds, configure your web server or CDN to forward `/api` requests to the backend, or update `src/utils/auth.js` to use the full backend URL.

## Pages

| Route (state) | Auth required | Description                         |
|---------------|---------------|-------------------------------------|
| `home`        | No            | Landing page, links to login/signup |
| `about`       | No            | App info page                       |
| `login`       | No            | Login form                          |
| `register`    | No            | Registration form                   |
| `todos`       | Yes           | Full CRUD todo management           |

## Auth Flow

1. User registers via `/api/auth/register`
2. User logs in via `/api/auth/login` — receives a JWT + user object
3. Token + user stored in `localStorage`
4. `AuthContext` rehydrates state on page reload
5. All todo API calls send `Authorization: Bearer <token>` header
6. Logout clears localStorage and redirects to home
