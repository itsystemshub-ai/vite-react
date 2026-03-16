'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ShoppingCart, Truck, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ title, value, icon: Icon, color, sub }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/reports/dashboard').then(r => r.data) });
  const { data: salesChart } = useQuery({ queryKey: ['sales-chart'], queryFn: () => api.get('/reports/sales-by-month').then(r => r.data) });
  const { data: rate } = useQuery({ queryKey: ['usd-rate'], queryFn: () => api.get('/currency/rate?from=USD&to=VES').then(r => r.data) });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        {rate && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">USD/VES: {fmt(rate.rate)}</span>
            <span className="text-xs text-green-500">{rate.source}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ventas Facturadas" value={`Bs. ${fmt(stats?.totalSales)}`} icon={ShoppingCart} color="bg-indigo-500" sub={`${stats?.salesCount ?? 0} facturas`} />
        <StatCard title="Total Compras" value={`Bs. ${fmt(stats?.totalPurchases)}`} icon={Truck} color="bg-blue-500" sub={`${stats?.purchasesCount ?? 0} órdenes`} />
        <StatCard title="Productos Stock Bajo" value={stats?.lowStockProducts ?? 0} icon={AlertTriangle} color="bg-yellow-500" sub="Requieren reposición" />
        <StatCard title="Pagos Pendientes" value={stats?.pendingPayments ?? 0} icon={TrendingUp} color="bg-red-500" sub="Órdenes de pago" />
      </div>

      {salesChart && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Ventas por Mes — {new Date().getFullYear()}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tickFormatter={m => ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][m-1]} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`Bs. ${fmt(v)}`, 'Ventas']} />
              <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
