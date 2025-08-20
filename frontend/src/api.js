const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const api = async (path, { method='GET', body, token, isForm=false } = {}) => {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};
