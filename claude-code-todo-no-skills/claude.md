# Product Requirements Document (PRD)

## Before you begin: 

* Make sure that you output everying to a logging file. Record tokens used, issues occured, time it took to complete, everything you can think to record, record it and keep a running log from each time you start. dont delete anything at all.
Do not use any skills. only use Sonnet 4.6. go into plan mode when necisarry
## 1. Product Overview

**Product Name:** Full-Stack Todo Application
**Type:** Web Application (Frontend + Backend)
**Core Purpose:**
Provide users with a simple, secure, and responsive platform to register, log in, and manage personal todo lists.

This application enables authenticated users to create, view, update, and delete tasks while maintaining session persistence across page reloads.

---

## 2. Goals & Objectives

### Primary Goals

* Implement a full-stack CRUD application
* Provide secure user authentication (login/register)
* Maintain persistent sessions using tokens
* Deliver a clean, responsive UI

### Secondary Goals

* Modular, scalable architecture
* Easy extensibility (e.g., add deadlines, tags later)
* Clean separation between frontend and backend

---

## 3. Target Users

* Students managing assignments
* Developers learning full-stack development
* General users needing lightweight task tracking

---

## 4. Current Frontend Architecture

### Tech Stack

* React (Vite)
* Functional components + hooks
* Local state + optional context (`AuthContext.jsx`)

### Key Features (from `App.jsx`)

* Page navigation via state (`currentPage`)
* Authentication state management:

  * `token`
  * `user`
  * `isLoggedIn`
* Local storage persistence
* Conditional routing (protected Todos page)

### Pages

* **Home** – Landing page, shows user info if logged in
* **Todos** – Protected page (requires login)
* **About** – Static info page
* **Login** – Authenticates user
* **Register** – Creates new account

### Components

* **Navbar**

  * Navigation
  * Login/logout state awareness

### Utilities

* `auth.js` → handles API/auth logic (assumed)

---

## 5. Backend Requirements

### Tech Stack (Recommended)

* Node.js + Express
* MongoDB (or PostgreSQL alternative)
* JWT Authentication
* bcrypt for password hashing

---

## 6. Functional Requirements

### 6.1 Authentication

#### Register

* User provides:

  * username
  * email
  * password
* Password must be hashed before storage
* Return success or error

#### Login

* Validate credentials
* Return:

  * JWT token
  * user object

#### Logout

* Handled client-side (clear token)

#### Session Persistence

* Token stored in localStorage
* App restores session on reload

---

### 6.2 Todo Management (CRUD)

#### Create Todo

* Authenticated users can create tasks
* Fields:

  * title (required)
  * description (optional)
  * completed (default: false)

#### Read Todos

* Fetch all todos for authenticated user

#### Update Todo

* Toggle completion
* Edit content

#### Delete Todo

* Remove task permanently

---

## 7. API Design

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`

### Todo Routes (Protected)

* `GET /api/todos`
* `POST /api/todos`
* `PUT /api/todos/:id`
* `DELETE /api/todos/:id`

### Middleware

* JWT verification for protected routes

---

## 8. Data Models

### User

```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "hashed string",
  "createdAt": "date"
}
```

### Todo

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "createdAt": "date"
}
```

---

## 9. Non-Functional Requirements

### Performance

* Fast page loads via Vite
* Efficient API responses (<200ms ideal)

### Security

* Password hashing (bcrypt)
* JWT authentication
* Protected routes
* Input validation

### Scalability

* Modular backend structure
* Separation of concerns (routes, controllers, models)

### Reliability

* Graceful error handling
* Fallback UI for failed API calls

---

## 10. UX/UI Requirements

### Navigation

* Navbar always visible
* Dynamic options:

  * Logged out: Home, About, Login, Register
  * Logged in: Home, Todos, Logout

### Todos Page

* List view of tasks
* Checkbox for completion
* Buttons for edit/delete

### Feedback

* Loading states
* Error messages (login failure, etc.)

---

## 11. Known Issues / Improvements

### Current Issues in `App.jsx`

* `useEffect` runs on every render (missing dependency array)

  * Should be:

  ```js
  useEffect(() => { ... }, []);
  ```

### Suggested Improvements

* Replace manual routing with React Router
* Move auth logic fully into `AuthContext`
* Add form validation
* Add loading indicators

---

## 12. Future Enhancements

* Due dates & reminders
* Task categories/tags
* Drag-and-drop reordering
* Dark mode
* Mobile optimization
* Real-time updates (WebSockets)
* OAuth login (Google, GitHub)

---

## 13. Success Metrics

* User can register and log in successfully
* Todos persist across sessions
* API response success rate > 99%
* Page load time < 1 second
* No unauthorized access to protected routes
---
## 15. Summary

This project is a full-stack todo application with authentication at its core. The frontend is already structured with React and local state management, and the backend will provide secure APIs for authentication and task management.

The system emphasizes simplicity, scalability, and clean separation between client and server while remaining flexible for future expansion.

