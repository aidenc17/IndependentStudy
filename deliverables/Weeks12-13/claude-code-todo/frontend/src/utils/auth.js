const BASE_URL = '/api';

async function safeJson(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await safeJson(res);
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
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch todos');
  return data;
}

export async function createTodo(token, title, description) {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ title, description }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to create todo');
  return data;
}

export async function updateTodo(token, id, updates) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update todo');
  return data;
}

export async function deleteTodo(token, id) {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to delete todo');
  return data;
}

// Password reset
export async function forgotPassword(email) {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function resetPassword(token, password) {
  const res = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Reset failed');
  return data;
}

// Admin API helpers
export async function fetchAdminStats(token) {
  const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getAuthHeaders(token) });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
  return data;
}

export async function fetchAdminUsers(token) {
  const res = await fetch(`${BASE_URL}/admin/users`, { headers: getAuthHeaders(token) });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
  return data;
}

export async function toggleAdminUser(token, userId) {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/toggle-admin`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to update user');
  return data;
}

export async function deleteAdminUser(token, userId) {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data.message || 'Failed to delete user');
  return data;
}
