import { useState } from 'react'
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ProtectedRoute({ children, onCancel }) {
  const { isAuthenticated, login } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Si ya está autenticado, renderiza directamente el componente protegido
  if (isAuthenticated) {
    return children
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const result = await login({ email, password })
      if (result.success) {
        toast.success('Sesión administrativa iniciada correctamente')
      } else {
        setError(result.error)
      }
    } catch {
      setError('Ocurrió un error inesperado al autenticar')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFillDemo = () => {
    setEmail('admin@cafeaurora.cr')
    setPassword('aurora2026')
    setError(null)
  }

  return (
    <div className="mx-auto my-6 max-w-lg animate-rise px-4">
      <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xl">
        {/* Cabecera / Escudo de Seguridad */}
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-amber-800 ring-8 ring-amber-50/70">
            <Lock className="h-8 w-8 stroke-[2]" aria-hidden="true" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 tracking-wide uppercase">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
            Solo Personal Autorizado
          </span>

          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-stone-900">
            Acceso al Monitor de Inventario
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
            Las métricas de existencias, recetas e insumos son de uso exclusivo para baristas y administradores.
          </p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs sm:text-sm font-medium text-red-800 animate-pop"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
            >
              Correo o Usuario
            </label>
            <input
              id="auth-email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cafeaurora.cr"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-600/10 focus:outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
            >
              PIN o Contraseña Administrativa
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 pr-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-600/10 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Botón rápido para demo / testing */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2"
            >
              <KeyRound className="h-3 w-3" />
              Autocompletar credenciales de demostración
            </button>
          </div>

          {/* Acciones */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-amber-800 active:scale-[0.98] disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>{submitting ? 'Verificando…' : 'Acceder al Monitor'}</span>
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Volver al Menú de Clientes</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
