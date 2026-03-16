import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1',
  withCredentials: true,
});

// Attach token from localStorage
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
      } catch {}
    }
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);
