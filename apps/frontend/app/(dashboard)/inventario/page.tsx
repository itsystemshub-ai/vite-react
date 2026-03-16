'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Package, AlertTriangle, Search, Plus } from 'lucide-react';

export default function InventarioPage() {
  const [search, setSearch] = useState('');
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => api.get('/inventory/products', { params: { search: search || undefined, limit: 50 } }).then(r => r.data),
  });
  const { data: lowStock = [] } = useQuery({ queryKey: ['low-stock'], queryFn: () => api.get('/inventory/products/low-stock').then(r => r.data) });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Inventario</h2>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Nuevo Producto</button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Stock bajo en {lowStock.length} producto(s)</p>
            <p className="text-sm text-yellow-600">{lowStock.slice(0, 3).map((p: any) => p.name).join(', ')}{lowStock.length > 3 ? '...' : ''}</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="p-4 border-b">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="input pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Código','Nombre','Categoría','Precio','Costo','Stock','Mín.','Estado'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              ) : products.map((p: any) => {
                const totalStock = p.stockItems?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;
                const isLow = totalStock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.code}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
                    <td className="px-4 py-3">Bs. {fmt(p.price)}</td>
                    <td className="px-4 py-3">Bs. {fmt(p.cost)}</td>
                    <td className="px-4 py-3 font-semibold">{totalStock} {p.unit}</td>
                    <td className="px-4 py-3 text-gray-500">{p.minStock}</td>
                    <td className="px-4 py-3">
                      <span className={isLow ? 'badge-red' : 'badge-green'}>{isLow ? 'Stock Bajo' : 'OK'}</span>
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
