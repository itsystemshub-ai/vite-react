'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import { DollarSign, RefreshCw, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonedaPage() {
  const qc = useQueryClient();
  const [manualRate, setManualRate] = useState('');
  const { data: rate } = useQuery({ queryKey: ['usd-rate'], queryFn: () => api.get('/currency/rate?from=USD&to=VES').then(r => r.data) });
  const { data: history = [] } = useQuery({ queryKey: ['usd-history'], queryFn: () => api.get('/currency/history?from=USD&to=VES&days=30').then(r => r.data) });
  const { mutate: sync, isPending: syncing } = useMutation({ mutationFn: () => api.post('/currency/sync'), onSuccess: () => qc.invalidateQueries({ queryKey: ['usd-rate'] }) });
  const { mutate: saveRate } = useMutation({ mutationFn: () => api.post('/currency/rate', { from: 'USD', to: 'VES', rate: parseFloat(manualRate) }), onSuccess: () => { qc.invalidateQueries({ queryKey: ['usd-rate', 'usd-history'] }); setManualRate(''); } });

  const fmt = (n: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2 }).format(n ?? 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Moneda / Tasas BCV</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">USD / VES</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{rate ? fmt(rate.rate) : '—'}</p>
          <p className="text-xs text-gray-400 mt-1">Fuente: {rate?.source ?? '—'} · {rate ? new Date(rate.date).toLocaleDateString('es-VE') : ''}</p>
          <button onClick={() => sync()} disabled={syncing} className="btn-secondary mt-3 text-xs">
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} /> Sincronizar BCV
          </button>
        </div>
        <div className="card p-5">
          <p className="font-semibold text-gray-700 mb-3">Registrar Tasa Manual</p>
          <input value={manualRate} onChange={e => setManualRate(e.target.value)} placeholder="Ej: 36.50" className="input mb-2" type="number" step="0.01" />
          <button onClick={() => saveRate()} disabled={!manualRate} className="btn-primary w-full justify-center text-sm">Guardar</button>
        </div>
      </div>
      {history.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold">Histórico USD/VES — 30 días</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' })} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [fmt(v), 'Tasa']} labelFormatter={d => new Date(d).toLocaleDateString('es-VE')} />
              <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
