'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, FileText, CheckCircle, XCircle, Search, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'badge-yellow',
  CONFIRMED: 'badge-blue',
  INVOICED: 'badge-green',
  CANCELLED: 'badge-gray',
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Borrador',
  CONFIRMED: 'Confirmado',
  INVOICED: 'Facturado',
  CANCELLED: 'Cancelado',
};

export default function VentasPage() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: () => api.get('/sales').then(r => r.data),
  });
  const { mutate: invoice } = useMutation({
    mutationFn: (id: string) => api.patch(`/sales/${id}/invoice`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });
  const { mutate: cancel } = useMutation({
    mutationFn: (id: string) => api.patch(`/sales/${id}/cancel`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }),
  });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);
  const filtered = sales.filter((s: any) =>
    s.customer?.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    s.invoiceNumber?.includes(search),
  );

  const totalFacturado = sales.filter((s: any) => s.status === 'INVOICED').reduce((a: number, s: any) => a + (s.total ?? 0), 0);
  const totalBorradores = sales.filter((s: any) => s.status === 'DRAFT').length;

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div />
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> Nueva Venta
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="p-2.5 bg-violet-100 rounded-xl">
            <ShoppingCart className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Facturado</p>
            <p className="text-lg font-bold text-slate-800">Bs. {fmt(totalFacturado)}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-2.5 bg-amber-100 rounded-xl">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Borradores</p>
            <p className="text-lg font-bold text-slate-800">{totalBorradores}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Registros</p>
            <p className="text-lg font-bold text-slate-800">{sales.length}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente o factura..."
              className="input pl-9 py-2"
            />
          </div>
          <p className="text-xs text-slate-400">{filtered.length} registros</p>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {['Factura', 'Fecha', 'Cliente', 'Subtotal', 'IVA', 'Total', 'Estado', 'Acciones'].map(h => (
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : filtered.map((s: any) => (
                <tr key={s.id}>
                  <td className="font-mono text-xs text-slate-400">{s.invoiceNumber ?? '—'}</td>
                  <td className="text-slate-500">{new Date(s.createdAt).toLocaleDateString('es-VE')}</td>
                  <td className="font-medium text-slate-800">{s.customer?.businessName}</td>
                  <td>Bs. {fmt(s.subtotal)}</td>
                  <td>Bs. {fmt(s.tax)}</td>
                  <td className="font-semibold text-slate-800">Bs. {fmt(s.total)}</td>
                  <td><span className={STATUS_BADGE[s.status]}>{STATUS_LABEL[s.status]}</span></td>
                  <td>
                    <div className="flex gap-1">
                      {s.status === 'DRAFT' && (
                        <>
                          <button
                            onClick={() => invoice(s.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Facturar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => cancel(s.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancelar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <a
                        href={`/ventas/${s.id}`}
                        className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
