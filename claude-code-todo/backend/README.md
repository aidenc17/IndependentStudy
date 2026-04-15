# Todo App — Backend

Express + MongoDB REST API for the Todo application.

## Tech Stack

- **Node.js** + **Express** — HTTP server and routing
- **MongoDB** + **Mongoose** — database and ODM
- **JWT** — stateless authentication
- **bcryptjs** — password hashing

## Project Structure

```
backend/
├── middleware/
│   └── auth.js          # JWT verification middleware
├── models/
│   ├── User.js          # User schema
│   └── Todo.js          # Todo schema
├── routes/
│   ├── auth.js          # POST /api/auth/register, /api/auth/login
│   └── todos.js         # CRUD /api/todos (protected)
├── .env.example         # Environment variable template
├── package.json
└── server.js            # Entry point
```

## Setup & Run

### 1. Prerequisites

- Node.js v18+
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo_app
JWT_SECRET=change_this_to_a_long_random_string
```

> **Important:** Change `JWT_SECRET` to a long, random string before deploying.

### 4. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Auth

| Method | Endpoint                | Body                              | Description     |
|--------|-------------------------|-----------------------------------|-----------------|
| POST   | `/api/auth/register`    | `{ username, email, password }`   | Register a user |
| POST   | `/api/auth/login`       | `{ email, password }`             | Login a user    |

### Todos (requires `Authorization: Bearer <token>` header)

| Method | Endpoint            | Body                                      | Description           |
|--------|---------------------|-------------------------------------------|-----------------------|
| GET    | `/api/todos`        | —                                         | Get all user todos    |
| POST   | `/api/todos`        | `{ title, description? }`                 | Create a new todo     |
| PUT    | `/api/todos/:id`    | `{ title?, description?, completed? }`    | Update a todo         |
| DELETE | `/api/todos/:id`    | —                                         | Delete a todo         |

### Health Check

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| GET    | `/api/health`  | Server status check  |
