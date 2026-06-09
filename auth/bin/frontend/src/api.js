const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await response.text();
  const body = text ? parseBody(text) : null;

  return {
    ok: response.ok,
    status: response.status,
    body,
  };
}

function parseBody(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function healthCheck() {
  return request('/api/auth/health', {
    method: 'GET',
  });
}

export function registerUser(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getProtectedProfile(token) {
  return request('/api/demo/profile', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function getRoleArea(role, token) {
  return request(`/api/demo/${role.toLowerCase()}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
