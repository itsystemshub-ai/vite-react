'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, FileText, CheckCircle, XCircle, Search } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'badge-yellow', CONFIRMED: 'badge-blue', INVOICED: 'badge-green', CANCELLED: 'badge-red',
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Borrador', CONFIRMED: 'Confirmado', INVOICED: 'Facturado', CANCELLED: 'Cancelado',
};

export default function VentasPage() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { data: sales = [], isLoading } = useQuery({ queryKey: ['sales'], queryFn: () => api.get('/sales').then(r => r.data) });
  const { mutate: invoice } = useMutation({ mutationFn: (id: string) => api.patch(`/sales/${id}/invoice`), onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }) });
  const { mutate: cancel } = useMutation({ mutationFn: (id: string) => api.patch(`/sales/${id}/cancel`), onSuccess: () => qc.invalidateQueries({ queryKey: ['sales'] }) });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);
  const filtered = sales.filter((s: any) => s.customer?.businessName?.toLowerCase().includes(search.toLowerCase()) || s.invoiceNumber?.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Ventas</h2>
        <a href="/ventas/nueva" className="btn-primary">
          <Plus className="w-4 h-4" /> Nueva Venta
        </a>
      </div>

      <div className="card">
        <div className="p-4 border-b">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente o factura..." className="input pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Factura','Fecha','Cliente','Subtotal','IVA','Total','Estado','Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              ) : filtered.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.invoiceNumber ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(s.createdAt).toLocaleDateString('es-VE')}</td>
                  <td className="px-4 py-3 font-medium">{s.customer?.businessName}</td>
                  <td className="px-4 py-3">Bs. {fmt(s.subtotal)}</td>
                  <td className="px-4 py-3">Bs. {fmt(s.tax)}</td>
                  <td className="px-4 py-3 font-semibold">Bs. {fmt(s.total)}</td>
                  <td className="px-4 py-3"><span className={STATUS_BADGE[s.status]}>{STATUS_LABEL[s.status]}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {s.status === 'DRAFT' && (
                        <>
                          <button onClick={() => invoice(s.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Facturar"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => cancel(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Cancelar"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      <a href={`/ventas/${s.id}`} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" title="Ver detalle"><FileText className="w-4 h-4" /></a>
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
