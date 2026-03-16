'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Building2, Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@erp.local');
  const [password, setPassword] = useState('Admin@ERP2024!');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message ?? 'Error al iniciar sesión';
      setError(Array.isArray(msg) ? msg.join(', ') : String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f0f1a] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">ERP Venezuela</p>
              <p className="text-white/40 text-xs">Sistema de Gestión Empresarial</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Gestión empresarial<br />
            <span className="text-violet-400">inteligente y eficiente</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Controla ventas, inventario, contabilidad, nómina y más desde una sola plataforma adaptada a la normativa venezolana.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {[
              { label: 'Módulos', value: '15+' },
              { label: 'Integración BCV', value: 'Tiempo real' },
              { label: 'Cumplimiento', value: 'SENIAT' },
              { label: 'Seguridad', value: 'AES-256' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-white font-bold text-lg">{item.value}</p>
                <p className="text-white/40 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/20 text-xs">© 2026 ERP Venezuela. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <p className="font-bold text-slate-800">ERP Venezuela</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Bienvenido de vuelta</h1>
            <p className="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="admin@erp.local"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            ERP Venezuela v1.0 — Plataforma segura con cifrado AES-256
          </p>
        </div>
      </div>
    </div>
  );
}
