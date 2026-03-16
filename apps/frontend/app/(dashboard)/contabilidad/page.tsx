'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Calculator, BookOpen } from 'lucide-react';

export default function ContabilidadPage() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['entries'], queryFn: () => api.get('/accounting/entries').then(r => r.data) });
  const { data: balance = [] } = useQuery({ queryKey: ['trial-balance'], queryFn: () => api.get(`/accounting/trial-balance?year=${year}&month=${month}`).then(r => r.data) });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Contabilidad</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold">Últimos Asientos</h3>
          </div>
          <div className="divide-y">
            {isLoading ? <p className="p-4 text-gray-400 text-sm">Cargando...</p> : entries.slice(0, 10).map((e: any) => (
              <div key={e.id} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.description}</p>
                    <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString('es-VE')} {e.reference ? `· ${e.reference}` : ''}</p>
                  </div>
                  <span className="text-xs text-gray-500">{e.items?.length} líneas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold">Balance de Comprobación — {month}/{year}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b">
                <tr>{['Código','Cuenta','Débitos','Créditos'].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {balance.map((a: any) => (
                  <tr key={a.code} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-mono text-gray-500">{a.code}</td>
                    <td className="px-3 py-2">{a.name}</td>
                    <td className="px-3 py-2 text-right">{fmt(a.debits)}</td>
                    <td className="px-3 py-2 text-right">{fmt(a.credits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
