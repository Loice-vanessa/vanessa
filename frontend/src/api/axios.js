import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAuthRequest = url.startsWith('/auth/');
  const token = localStorage.getItem('token');
  if (!isAuthRequest && token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
