import { CircleCheck, Coffee, Receipt, Sparkles } from 'lucide-react'
import Modal from './ui/Modal'
import { formatCRC, formatDateTime, paymentLabel } from '../utils/format'

/** Comprobante visual del pedido confirmado (HTTP 201). */
export default function OrderReceiptModal({ pedido, onClose }) {
  return (
    <Modal title="Pedido confirmado" onClose={onClose} maxWidth="max-w-md" hideClose>
      <div className="scrollbar-thin overflow-y-auto">
        {/* Banner Superior Exitoso */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 px-6 pt-8 pb-10 text-center text-white">
          <div className="mx-auto mb-3 grid h-16 w-16 animate-pop place-items-center rounded-full bg-white/20 ring-8 ring-white/10 shadow-lg">
            <CircleCheck className="h-9 w-9 stroke-[2.2]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">¡Pedido Confirmado!</h2>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100 font-medium">
            Tu orden fue registrada y el inventario se actualizó en tiempo real.
          </p>
        </div>

        {/* Ticket Recibo */}
        <div className="relative -mt-5 px-5 pb-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-dashed border-stone-300 pb-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Receipt className="h-5 w-5 text-amber-800" aria-hidden="true" />
                <span className="font-display text-lg font-bold">Comprobante #{pedido.id}</span>
              </div>
              <Coffee className="h-5 w-5 text-stone-400" aria-hidden="true" />
            </div>

            <dl className="space-y-1.5 border-b border-dashed border-stone-300 py-3.5 text-xs sm:text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Fecha y Hora</dt>
                <dd className="font-medium text-stone-900">{formatDateTime(pedido.fecha)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Método de Pago</dt>
                <dd className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md">
                  {paymentLabel(pedido.metodoPago)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Estado de Orden</dt>
                <dd className="font-bold text-emerald-700 capitalize flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {pedido.estado}
                </dd>
              </div>
            </dl>

            {/* Lista de productos desglosados */}
            <ul className="space-y-2 border-b border-dashed border-stone-300 py-3.5 text-xs sm:text-sm">
              {pedido.items.map((item) => (
                <li key={item.productoId} className="flex justify-between items-center gap-3">
                  <span className="text-stone-800">
                    <span className="font-black text-amber-800">{item.cantidad}×</span> {item.nombre}
                  </span>
                  <span className="font-bold text-stone-900">{formatCRC(item.subtotalItem)}</span>
                </li>
              ))}
            </ul>

            {/* Resumen financiero */}
            <dl className="space-y-1.5 pt-3.5 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <dt>Subtotal</dt>
                <dd className="font-medium">{formatCRC(pedido.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-stone-600">
                <dt>IVA (13%)</dt>
                <dd className="font-medium">{formatCRC(pedido.impuesto)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-stone-200 pt-3">
                <dt className="font-bold text-stone-900">Total Pagado</dt>
                <dd className="font-display text-2xl font-black text-amber-900">
                  {formatCRC(pedido.total)}
                </dd>
              </div>
            </dl>
          </div>

          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="mt-5 w-full rounded-xl bg-stone-900 px-5 py-3.5 font-bold text-white shadow-md transition hover:bg-amber-800 active:scale-[0.98]"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </Modal>
  )
}
