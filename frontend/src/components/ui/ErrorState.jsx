import { RefreshCw, WifiOff } from 'lucide-react'

export default function ErrorState({ error, onRetry, title = 'No pudimos cargar la información' }) {
  const isNetwork = Boolean(error?.isNetworkError)

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-red-200 bg-white p-10 text-center shadow-card"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
        <WifiOff className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-espresso-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-warm-500">
          {error?.message ?? 'Ocurrió un error inesperado.'}
        </p>
        {isNetwork && (
          <p className="mt-2 text-xs text-slate-warm-500">
            Tip: inicia el backend con <code className="rounded bg-espresso-50 px-1.5 py-0.5">npm run dev</code>.
          </p>
        )}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-espresso-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-espresso-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  )
}
