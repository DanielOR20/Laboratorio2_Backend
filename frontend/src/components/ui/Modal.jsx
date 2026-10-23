import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal centrado y accesible con backdrop desenfocado (backdrop-blur-md).
 */
export default function Modal({ title, onClose, children, maxWidth = 'max-w-xl', hideClose = false }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop con desenfoque */}
      <div
        className="absolute inset-0 animate-fade-in bg-stone-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Tarjeta del modal */}
      <div
        className={`relative flex max-h-[92vh] w-full ${maxWidth} animate-rise flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl border border-stone-200/90`}
      >
        {!hideClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana modal"
            className="absolute top-4 right-4 z-20 rounded-full bg-stone-900/60 p-2 text-white shadow-md backdrop-blur-md transition hover:bg-stone-900 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
