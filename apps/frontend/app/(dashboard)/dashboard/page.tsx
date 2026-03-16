'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  ShoppingCart, Truck, Package, DollarSign,
  TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Activity, CreditCard,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { clsx } from 'clsx';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function StatCard({ title, value, icon: Icon, color, sub, trend }: any) {
  const positive = trend >= 0;
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={clsx('p-2.5 rounded-xl', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
          )}>
            {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{title}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 0 }).format(n ?? 0);
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{MONTHS[(label ?? 1) - 1]}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          Bs. {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(r => r.data),
  });
  const { data: salesChart } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: () => api.get('/reports/sales-by-month').then(r => r.data),
  });
  const { data: rate } = useQuery({
    queryKey: ['usd-rate'],
    queryFn: () => api.get('/currency/rate?from=USD&to=VES').then(r => r.data),
    refetchInterval: 300000,
  });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);
  const fmtShort = (n: number) => {
    if (!n) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <div className="space-y-6">
      {/* BCV Rate banner */}
      {rate && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Tasa BCV — USD/VES</p>
              <p className="text-xs text-white/60">Fuente: {rate.source ?? 'BCV'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{fmt(rate.rate)}</p>
            <p className="text-xs text-white/60">Bs. por USD</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Ventas Facturadas"
          value={`Bs. ${fmtShort(stats?.totalSales)}`}
          icon={ShoppingCart}
          color="bg-violet-500"
          sub={`${stats?.salesCount ?? 0} facturas este mes`}
          trend={12}
        />
        <StatCard
          title="Total Compras"
          value={`Bs. ${fmtShort(stats?.totalPurchases)}`}
          icon={Truck}
          color="bg-blue-500"
          sub={`${stats?.purchasesCount ?? 0} órdenes`}
          trend={-3}
        />
        <StatCard
          title="Stock Bajo"
          value={stats?.lowStockProducts ?? 0}
          icon={AlertTriangle}
          color="bg-amber-500"
          sub="Productos requieren reposición"
        />
        <StatCard
          title="Pagos Pendientes"
          value={stats?.pendingPayments ?? 0}
          icon={CreditCard}
          color="bg-rose-500"
          sub="Órdenes de pago"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales area chart */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Ventas por Mes</h3>
              <p className="text-xs text-slate-400">{new Date().getFullYear()}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
              <TrendingUp className="w-3 h-3" />
              +12% vs año anterior
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesChart ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={m => MONTHS[(m ?? 1) - 1]}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="card p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-800">Resumen Rápido</h3>
          <div className="space-y-3 flex-1">
            {[
              { label: 'Clientes activos', value: stats?.activeCustomers ?? '—', icon: Activity, color: 'text-violet-600 bg-violet-50' },
              { label: 'Productos en stock', value: stats?.totalProducts ?? '—', icon: Package, color: 'text-blue-600 bg-blue-50' },
              { label: 'Facturas este mes', value: stats?.salesCount ?? '—', icon: ShoppingCart, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Órdenes de compra', value: stats?.purchasesCount ?? '—', icon: Truck, color: 'text-amber-600 bg-amber-50' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
