'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Package, AlertTriangle, Search, Plus, TrendingDown } from 'lucide-react';

export default function InventarioPage() {
  const [search, setSearch] = useState('');
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => api.get('/inventory/products', { params: { search: search || undefined, limit: 50 } }).then(r => r.data),
  });
  const { data: lowStock = [] } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => api.get('/inventory/products/low-stock').then(r => r.data),
  });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div />
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="p-2.5 bg-blue-100 rounded-xl">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Productos</p>
            <p className="text-lg font-bold text-slate-800">{products.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-100 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Stock Bajo</p>
            <p className="text-lg font-bold text-slate-800">{lowStock.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Método Valuación</p>
            <p className="text-lg font-bold text-slate-800">PEPS</p>
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              {lowStock.length} producto(s) con stock bajo
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {lowStock.slice(0, 4).map((p: any) => p.name).join(', ')}
              {lowStock.length > 4 ? ` y ${lowStock.length - 4} más...` : ''}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="input pl-9 py-2"
            />
          </div>
          <p className="text-xs text-slate-400">{products.length} productos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {['Código', 'Nombre', 'Categoría', 'Precio Venta', 'Costo', 'Stock', 'Mín.', 'Estado'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      Cargando...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No hay productos registrados
                  </td>
                </tr>
              ) : products.map((p: any) => {
                const totalStock = p.stockItems?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;
                const isLow = totalStock <= p.minStock;
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs text-slate-400">{p.code}</td>
                    <td className="font-medium text-slate-800">{p.name}</td>
                    <td className="text-slate-500">{p.category?.name ?? '—'}</td>
                    <td>Bs. {fmt(p.price)}</td>
                    <td className="text-slate-500">Bs. {fmt(p.cost)}</td>
                    <td className="font-semibold">{totalStock} <span className="text-xs text-slate-400 font-normal">{p.unit}</span></td>
                    <td className="text-slate-400">{p.minStock}</td>
                    <td>
                      <span className={isLow ? 'badge-red' : 'badge-green'}>
                        {isLow ? 'Stock Bajo' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
