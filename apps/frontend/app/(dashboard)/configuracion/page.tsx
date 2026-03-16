'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState } from 'react';
import { Settings, Save, Database, GitBranch } from 'lucide-react';
import Link from 'next/link';

export default function ConfiguracionPage() {
  const qc = useQueryClient();
  const { data: configs = [] } = useQuery({ queryKey: ['configs'], queryFn: () => api.get('/config').then(r => r.data) });
  const [edits, setEdits] = useState<Record<string, string>>({});
  const { mutate: save, isPending } = useMutation({
    mutationFn: () => api.post('/config/bulk', { configs: Object.entries(edits).map(([key, value]) => ({ key, value })) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['configs'] }); setEdits({}); },
  });

  const groups = [...new Set(configs.map((c: any) => c.group))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Configuración del Sistema</h2>
        <div className="flex gap-2">
          <Link href="/configuracion/tablas" className="btn-secondary">
            <Database className="w-4 h-4" /> Gestor de Tablas
          </Link>
          <Link href="/configuracion/erd" className="btn-secondary">
            <GitBranch className="w-4 h-4" /> Diagrama ERD
          </Link>
        </div>
      </div>

      {groups.map(group => (
        <div key={group} className="card">
          <div className="p-4 border-b flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold capitalize">{group}</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {configs.filter((c: any) => c.group === group).map((c: any) => (
              <div key={c.key}>
                <label className="label">{c.key.replace(/_/g, ' ')}</label>
                <input
                  defaultValue={c.value}
                  onChange={e => setEdits(prev => ({ ...prev, [c.key]: e.target.value }))}
                  className="input"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(edits).length > 0 && (
        <div className="flex justify-end">
          <button onClick={() => save()} disabled={isPending} className="btn-primary">
            <Save className="w-4 h-4" /> {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      )}
    </div>
  );
}
