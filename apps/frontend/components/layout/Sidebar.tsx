'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, Truck, Calculator,
  Users, TrendingUp, Briefcase, Building2, Landmark,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  DollarSign, Factory, Bell,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { clsx } from 'clsx';

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { href: '/ventas', icon: ShoppingCart, label: 'Ventas' },
      { href: '/compras', icon: Truck, label: 'Compras' },
      { href: '/inventario', icon: Package, label: 'Inventario' },
      { href: '/crm', icon: TrendingUp, label: 'CRM' },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { href: '/contabilidad', icon: Calculator, label: 'Contabilidad' },
      { href: '/tesoreria', icon: Landmark, label: 'Tesorería' },
      { href: '/moneda', icon: DollarSign, label: 'Moneda / BCV' },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { href: '/rrhh', icon: Users, label: 'RRHH / Nómina' },
      { href: '/activos', icon: Building2, label: 'Activos Fijos' },
      { href: '/produccion', icon: Factory, label: 'Producción' },
      { href: '/proyectos', icon: Briefcase, label: 'Proyectos' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/reportes', icon: BarChart3, label: 'Reportes' },
      { href: '/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className={clsx(
      'flex flex-col bg-[#0f0f1a] text-white transition-all duration-300 h-screen sticky top-0 flex-shrink-0',
      collapsed ? 'w-[68px]' : 'w-[240px]',
    )}>
      {/* Logo */}
      <div className={clsx(
        'flex items-center border-b border-white/5 h-16 px-4 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">ERP Venezuela</p>
              <p className="text-[10px] text-white/40 leading-tight">v1.0</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors ml-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} className="mx-auto mt-2 p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = isActive(href);
                return (
                  <Link key={href} href={href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150',
                      active
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                        : 'text-white/50 hover:bg-white/5 hover:text-white/90',
                      collapsed && 'justify-center px-2',
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className={clsx('flex-shrink-0', active ? 'w-4 h-4' : 'w-4 h-4')} />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/5 p-3 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 mb-2 px-1">
            <div className="w-7 h-7 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-2">
            <div className="w-7 h-7 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        )}
        <button onClick={logout}
          className={clsx(
            'flex items-center gap-2 w-full px-3 py-2 text-xs text-white/30 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors',
            collapsed && 'justify-center px-2',
          )}
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}
