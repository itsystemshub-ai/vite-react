'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, Truck, Calculator,
  Users, TrendingUp, Briefcase, Wrench, Building2, Landmark,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  DollarSign, Factory, FolderOpen, Bell,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { clsx } from 'clsx';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  { href: '/compras', icon: Truck, label: 'Compras' },
  { href: '/inventario', icon: Package, label: 'Inventario' },
  { href: '/contabilidad', icon: Calculator, label: 'Contabilidad' },
  { href: '/rrhh', icon: Users, label: 'RRHH / Nómina' },
  { href: '/crm', icon: TrendingUp, label: 'CRM' },
  { href: '/tesoreria', icon: Landmark, label: 'Tesorería' },
  { href: '/activos', icon: Building2, label: 'Activos Fijos' },
  { href: '/produccion', icon: Factory, label: 'Producción' },
  { href: '/proyectos', icon: Briefcase, label: 'Proyectos' },
  { href: '/reportes', icon: BarChart3, label: 'Reportes' },
  { href: '/moneda', icon: DollarSign, label: 'Moneda / BCV' },
  { href: '/documentos', icon: FolderOpen, label: 'Documentos' },
  { href: '/configuracion', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className={clsx(
      'flex flex-col bg-gray-900 text-white transition-all duration-300 h-screen sticky top-0',
      collapsed ? 'w-16' : 'w-64',
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <span className="font-bold text-sm">ERP Venezuela</span>
          </div>
        )}
        {collapsed && <Building2 className="w-6 h-6 text-indigo-400 mx-auto" />}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-gray-700 ml-auto">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-gray-700 p-3">
        {!collapsed && (
          <div className="mb-2 px-1">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.role}</p>
          </div>
        )}
        <button onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}
