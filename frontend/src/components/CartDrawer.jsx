import { useCallback, useEffect, useState } from 'react'
import {
  Coffee,
  Minus,
  Plus,
  ShoppingBag,
  TriangleAlert,
  X,
  CircleAlert,
  Trash2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { crearPedido } from '../api/cafeteriaApi'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatCRC } from '../utils/format'
import { getProductDetails } from '../utils/productDetails'
import OrderReceiptModal from './OrderReceiptModal'
import PaymentSelector from './PaymentSelector'
import Modal from './ui/Modal'
import Spinner from './ui/Spinner'
import ProductImage from './ui/ProductImage'

function CartLine({ item, disabled, onIncrement, onDecrement, onRemove }) {
  const { producto, cantidad } = item
  const details = getProductDetails(producto)

  return (
    <li className="flex animate-rise items-center gap-3.5 rounded-2xl border border-stone-200/90 bg-white p-3 shadow-xs transition hover:border-stone-300">
      {/* Miniatura Fotográfica Real */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        <ProductImage
          src={details.image}
          alt={producto.nombre}
          aspectClassName="h-full w-full"
          className="h-full w-full"
        />
      </div>

      {/* Detalles del Ítem */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-stone-900 text-sm">{producto.nombre}</p>
        <p className="text-xs text-stone-500 font-medium">{formatCRC(producto.precio)} c/u</p>

        {/* Controles Interactivos de Cantidad */}
        <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-0.5">
          <button
            type="button"
            onClick={() => onDecrement(producto.id)}
            disabled={disabled}
            aria-label={`Disminuir cantidad de ${producto.nombre}`}
            className="grid h-6 w-6 place-items-center rounded-full bg-white text-stone-700 shadow-2xs transition hover:bg-stone-900 hover:text-white disabled:opacity-40"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-7 text-center text-xs font-bold text-stone-900" aria-live="polite">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => onIncrement(producto.id)}
            disabled={disabled}
            aria-label={`Aumentar cantidad de ${producto.nombre}`}
            className="grid h-6 w-6 place-items-center rounded-full bg-white text-stone-700 shadow-2xs transition hover:bg-stone-900 hover:text-white disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Precio acumulado y eliminar */}
      <div className="flex flex-col items-end justify-between self-stretch py-0.5">
        <button
          type="button"
          onClick={() => onRemove(producto.id)}
          disabled={disabled}
          aria-label={`Quitar ${producto.nombre} del pedido`}
          className="rounded-full p-1 text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="font-extrabold text-stone-900 text-sm">
          {formatCRC(producto.precio * cantidad)}
        </p>
      </div>
    </li>
  )
}

/** Banner de alerta para errores en el drawer */
function OrderAlert({ error, onOpenModal }) {
  const isConflict = error.isConflict
  const Icon = isConflict ? TriangleAlert : CircleAlert

  return (
    <div
      role="alert"
      className={`animate-rise rounded-2xl border p-4 text-xs sm:text-sm leading-relaxed ${
        isConflict
          ? 'border-amber-300 bg-amber-50 text-amber-950'
          : 'border-red-200 bg-red-50 text-red-900'
      }`}
    >
      <div className="flex gap-3">
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${isConflict ? 'text-amber-800' : 'text-red-600'}`}
          aria-hidden="true"
        />
        <div className="space-y-1.5 flex-1">
          <p className="font-bold">
            {isConflict ? 'Stock insuficiente: Pedido no procesado' : 'No pudimos procesar tu orden'}
          </p>
          <p className="leading-snug">{error.message}</p>
          {isConflict && (
            <button
              type="button"
              onClick={onOpenModal}
              className="mt-1 inline-flex items-center gap-1 font-bold text-amber-900 underline underline-offset-2 hover:text-amber-700 text-xs"
            >
              Ver detalles de la reversión (ROLLBACK) →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** Modal explicativo detallado ante conflicto de inventario HTTP 409 */
function ConflictExplanationModal({ error, onClose }) {
  return (
    <Modal title="Conflicto de Inventario" onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-800 ring-8 ring-amber-50">
          <ShieldAlert className="h-8 w-8 stroke-[2.2]" aria-hidden="true" />
        </div>
        <h3 className="font-display text-2xl font-bold text-stone-900">
          Stock Insuficiente (409)
        </h3>
        <p className="mt-2 text-sm text-stone-600 leading-relaxed">
          {error.message}
        </p>

        <div className="mt-5 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-left text-xs leading-relaxed text-amber-950 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <span>🛡️ Transacción Revertida con Seguridad</span>
          </p>
          <p>
            Gracias a la integridad de base de datos PostgreSQL, la orden fue cancelada en un solo bloque <strong>(ROLLBACK)</strong>:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-amber-900/90">
            <li>No se descontó ningún insumo incompleto.</li>
            <li>No se realizó ningún cobro a tu método de pago.</li>
            <li>El inventario general permanece íntegro y sincronizado.</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-stone-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-800 active:scale-95"
        >
          Entendido, ajustar cantidades
        </button>
      </div>
    </Modal>
  )
}

export default function CartDrawer({ open, onClose }) {
  const {
    items,
    isEmpty,
    totalItems,
    subtotal,
    impuesto,
    total,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart()
  const toast = useToast()

  const [paymentMethod, setPaymentMethod] = useState('efectivo')
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const safeClose = useCallback(() => {
    if (!submitting) onClose()
  }, [submitting, onClose])

  // Escape + bloqueo de scroll mientras el drawer lateral está abierto
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') safeClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, safeClose])

  const withErrorReset = (fn) => (productoId) => {
    setOrderError(null)
    fn(productoId)
  }

  const handleClear = () => {
    setOrderError(null)
    clearCart()
  }

  const handleConfirm = async () => {
    if (isEmpty || submitting) return
    setSubmitting(true)
    setOrderError(null)

    try {
      const pedido = await crearPedido({
        metodoPago: paymentMethod,
        items: items.map(({ producto, cantidad }) => ({
          productoId: producto.id,
          cantidad,
        })),
      })
      clearCart()
      setReceipt(pedido)
      onClose()
      toast.success(`Pedido #${pedido.id} registrado con éxito`)
    } catch (error) {
      setOrderError(error)
      if (error.isConflict) {
        setShowConflictModal(true)
      } else if (error.isNetworkError) {
        toast.error(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Resumen de tu pedido"
        >
          {/* Backdrop desenfocado */}
          <div
            className="absolute inset-0 animate-fade-in bg-stone-950/65 backdrop-blur-sm transition-opacity"
            onClick={safeClose}
            aria-hidden="true"
          />

          <aside className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in-right flex-col bg-stone-50 shadow-2xl border-l border-stone-200">
            {/* Cabecera del Drawer */}
            <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-stone-950 shadow-sm">
                  <ShoppingBag className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold leading-tight">Tu Pedido</h2>
                  <p className="text-xs text-stone-300">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos seleccionados'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={safeClose}
                disabled={submitting}
                aria-label="Cerrar pedido"
                className="rounded-full p-2 text-stone-300 transition hover:bg-stone-800 hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido / Lista de productos */}
            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-amber-100/70 text-amber-800">
                  <Coffee className="h-10 w-10 stroke-[1.4]" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold text-stone-900">Tu carrito está vacío</h3>
                <p className="max-w-xs text-xs sm:text-sm text-stone-500">
                  Explora las bebidas calientes, cold brew, brunch y repostería artesanal para comenzar tu pedido.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-amber-800 active:scale-95"
                >
                  <span>Explorar Menú</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5">
                  {/* Lista de productos */}
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <CartLine
                        key={item.producto.id}
                        item={item}
                        disabled={submitting}
                        onIncrement={withErrorReset(incrementItem)}
                        onDecrement={withErrorReset(decrementItem)}
                        onRemove={withErrorReset(removeItem)}
                      />
                    ))}
                  </ul>

                  {/* Botón vaciar carrito */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleClear}
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-red-600 transition disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Vaciar pedido</span>
                    </button>
                  </div>

                  {/* Selector de Métodos de Pago */}
                  <PaymentSelector
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    disabled={submitting}
                  />

                  {/* Mensaje de Error en Pedido */}
                  {orderError && (
                    <OrderAlert
                      error={orderError}
                      onOpenModal={() => setShowConflictModal(true)}
                    />
                  )}
                </div>

                {/* Resumen Financiero y Botón de Confirmar */}
                <div className="space-y-4 border-t border-stone-200 bg-white px-5 pt-4 pb-5 shadow-lg">
                  <dl className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between text-stone-600">
                      <dt>Subtotal</dt>
                      <dd className="font-semibold text-stone-900">{formatCRC(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <dt>IVA (13%)</dt>
                      <dd className="font-semibold text-stone-900">{formatCRC(impuesto)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-stone-200 pt-3">
                      <dt className="font-bold text-stone-900 text-sm">Total a Pagar</dt>
                      <dd className="font-display text-2xl sm:text-3xl font-black text-amber-900">
                        {formatCRC(total)}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    id="confirmar-pedido"
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-5 py-4 text-sm sm:text-base font-extrabold text-stone-950 shadow-md shadow-amber-900/20 transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="h-5 w-5" label="Procesando pedido" />
                        <span>Procesando pedido…</span>
                      </>
                    ) : (
                      <>
                        <span>Confirmar Pedido · {formatCRC(total)}</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Modal de Explicación de Error 409 */}
      {showConflictModal && orderError && (
        <ConflictExplanationModal
          error={orderError}
          onClose={() => setShowConflictModal(false)}
        />
      )}

      {/* Modal de Comprobante tras Orden Exitosa */}
      {receipt && <OrderReceiptModal pedido={receipt} onClose={() => setReceipt(null)} />}
    </>
  )
}
