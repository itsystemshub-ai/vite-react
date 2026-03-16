'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Plus } from 'lucide-react';

export default function RRHHPage() {
  const { data: employees = [], isLoading } = useQuery({ queryKey: ['employees'], queryFn: () => api.get('/payroll/employees').then(r => r.data) });
  const { data: payrolls = [] } = useQuery({ queryKey: ['payrolls'], queryFn: () => api.get('/payroll/payrolls').then(r => r.data) });
  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">RRHH / Nómina</h2>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Nuevo Empleado</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold">Empleados ({employees.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Cédula','Nombre','Cargo','Dpto.','Salario','Estado'].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Cargando...</td></tr>
                  : employees.map((e: any) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs text-gray-500">{e.cedula}</td>
                    <td className="px-4 py-2 font-medium">{e.firstName} {e.lastName}</td>
                    <td className="px-4 py-2 text-gray-600">{e.position}</td>
                    <td className="px-4 py-2 text-gray-500">{e.department?.name ?? '—'}</td>
                    <td className="px-4 py-2">Bs. {fmt(e.salary)}</td>
                    <td className="px-4 py-2"><span className={e.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="p-4 border-b"><h3 className="font-semibold">Nóminas Procesadas</h3></div>
          <div className="divide-y">
            {payrolls.slice(0, 8).map((p: any) => (
              <div key={p.id} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{p.period}</p>
                  <p className="text-xs text-gray-400">{new Date(p.paymentDate).toLocaleDateString('es-VE')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">Bs. {fmt(p.total)}</p>
                  <span className={p.status === 'PROCESSED' ? 'badge-green' : 'badge-yellow'}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
