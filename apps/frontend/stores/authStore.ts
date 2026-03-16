import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        set({ user: res.data.user, token: res.data.token });
      },
      logout: () => {
        set({ user: null, token: null });
        window.location.href = '/login';
      },
    }),
    { name: 'auth-storage' },
  ),
);
