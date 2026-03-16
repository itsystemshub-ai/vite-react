'use client';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ventas': 'Ventas',
  '/compras': 'Compras',
  '/inventario': 'Inventario',
  '/contabilidad': 'Contabilidad',
  '/rrhh': 'RRHH / Nómina',
  '/crm': 'CRM',
  '/tesoreria': 'Tesorería',
  '/activos': 'Activos Fijos',
  '/produccion': 'Producción',
  '/proyectos': 'Proyectos',
  '/reportes': 'Reportes',
  '/moneda': 'Moneda / BCV',
  '/configuracion': 'Configuración',
};

export function Header() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'ERP Venezuela';

  const { data: count = 0 } = useQuery({
    queryKey: ['notif-count'],
    queryFn: () => api.get('/notifications/count').then(r => r.data),
    refetchInterval: 30000,
    enabled: !!user,
  });

  return (
    <header className="bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400 leading-none mt-0.5">
          {new Date().toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 w-44 bg-slate-50 placeholder:text-slate-400"
          />
        </div>

        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell className="w-4 h-4" />
          {count > 0 && (
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-100 ml-1">
          <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user?.role}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
