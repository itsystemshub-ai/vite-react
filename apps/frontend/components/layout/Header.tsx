'use client';
import { Bell, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export function Header({ title }: { title?: string }) {
  const { user } = useAuthStore();
  const { data: count } = useQuery({
    queryKey: ['notif-count'],
    queryFn: () => api.get('/notifications/count').then(r => r.data),
    refetchInterval: 30000,
    enabled: !!user,
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-gray-800">{title ?? 'ERP Venezuela'}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input placeholder="Buscar..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
        </div>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
      </div>
    </header>
  );
}
