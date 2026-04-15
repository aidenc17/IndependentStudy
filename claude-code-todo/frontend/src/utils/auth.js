const BASE_URL = '/api';

export async function registerUser(username, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data; // { token, user }
}

export function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Todo API helpers
export async function fetchTodos(token) {
  const res = await fetch(`${BASE_URL}/todos`, {
    headers: getAuthHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch todos');
  return data;
}

export async function createTodo(token, title, description) {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ title, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create todo');
  return data;
}

export async function updateTodo(token, id, updates) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update todo');
  return data;
}

export async function deleteTodo(token, id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete todo');
  return data;
}
