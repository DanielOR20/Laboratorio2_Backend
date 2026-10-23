import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const TOAST_STYLES = {
  success: { icon: CircleCheck, classes: 'border-emerald-200 bg-emerald-50 text-emerald-900', iconColor: 'text-emerald-600' },
  error: { icon: CircleAlert, classes: 'border-red-200 bg-red-50 text-red-900', iconColor: 'text-red-600' },
  info: { icon: Info, classes: 'border-espresso-200 bg-white text-espresso-900', iconColor: 'text-amber-deep' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (type, message, duration = 3500) => {
      const id = nextId.current++
      setToasts((current) => [...current.slice(-3), { id, type, message }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (message, duration) => push('success', message, duration),
      error: (message, duration) => push('error', message, duration ?? 5500),
      info: (message, duration) => push('info', message, duration),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-20 right-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6"
      >
        {toasts.map((toast) => {
          const { icon: Icon, classes, iconColor } = TOAST_STYLES[toast.type]
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex animate-toast-in items-start gap-3 rounded-2xl border px-4 py-3 shadow-card-hover ${classes}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
                className="rounded-full p-0.5 opacity-60 transition hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>')
  }
  return context
}
