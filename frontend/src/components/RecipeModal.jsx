import { useCallback } from 'react'
import { Plus, CheckCircle2, AlertTriangle, PackageCheck } from 'lucide-react'
import { getProductoById } from '../api/cafeteriaApi'
import { useAsync } from '../hooks/useAsync'
import { getCategoryTheme } from '../utils/categoryTheme'
import { formatCRC, formatQuantity } from '../utils/format'
import { getProductDetails } from '../utils/productDetails'
import ErrorState from './ui/ErrorState'
import Modal from './ui/Modal'
import Spinner from './ui/Spinner'
import ProductImage from './ui/ProductImage'

/** Cuántas unidades se pueden preparar con el stock actual de la receta */
const getPreparable = (receta) => {
  if (!receta || receta.length === 0) return 0
  return Math.floor(
    Math.min(
      ...receta.map((r) =>
        r.cantidadRequerida > 0 ? r.stockActual / r.cantidadRequerida : Infinity,
      ),
    ),
  )
}

export default function RecipeModal({ producto, onClose, onAdd }) {
  const fetchReceta = useCallback(() => getProductoById(producto.id), [producto.id])
  const { data, error, loading, reload } = useAsync(fetchReceta)
  const details = getProductDetails(producto)
  const { chip } = getCategoryTheme(producto.categoria)

  const receta = data?.receta ?? []
  const preparable = getPreparable(receta)

  return (
    <Modal title={`Receta de ${producto.nombre}`} onClose={onClose} maxWidth="max-w-xl">
      {/* Cabecera con Fotografía Real y Gradiente */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-900">
        <ProductImage
          src={details.image}
          alt={producto.nombre}
          aspectClassName="h-full w-full"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/30" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold backdrop-blur-md ${chip}`}>
              {producto.categoria}
            </span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {producto.nombre}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-300 line-clamp-1">
                {details.description}
              </p>
            </div>
            <p className="shrink-0 rounded-xl bg-amber-500/20 backdrop-blur-md px-3 py-1.5 text-lg font-black text-amber-300 ring-1 ring-amber-400/40">
              {formatCRC(producto.precio)}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido: Insumos de la Receta */}
      <div className="scrollbar-thin flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-stone-50/50">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-stone-600">
            <Spinner className="h-7 w-7 text-amber-700" />
            <span className="text-sm font-medium">Consultando receta e inventario en vivo…</span>
          </div>
        )}

        {!loading && error && (
          <ErrorState error={error} onRetry={reload} title="No pudimos cargar la receta del producto" />
        )}

        {!loading && !error && (
          <>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold tracking-wider text-stone-700 uppercase flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-amber-700" />
                  Insumos Requeridos por Unidad
                </h3>
                <span className="text-xs text-stone-500">
                  {receta.length} {receta.length === 1 ? 'insumo' : 'insumos'}
                </span>
              </div>

              {receta.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-stone-500 text-sm">
                  Este producto no tiene insumos registrados en su receta actualmente.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs divide-y divide-stone-100">
                  {receta.map((insumo) => {
                    const hasEnough = insumo.stockActual >= insumo.cantidadRequerida
                    const isLow = insumo.stockActual < insumo.cantidadRequerida * 3

                    return (
                      <div
                        key={insumo.recetaId}
                        className="flex items-center justify-between gap-4 p-3.5 sm:px-4 transition hover:bg-stone-50/80"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full shrink-0 ${
                                !hasEnough
                                  ? 'bg-red-500 ring-2 ring-red-200'
                                  : isLow
                                    ? 'bg-amber-500 ring-2 ring-amber-200'
                                    : 'bg-emerald-500 ring-2 ring-emerald-200'
                              }`}
                            />
                            <p className="truncate font-semibold text-stone-900 text-sm sm:text-base">
                              {insumo.insumoNombre}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-stone-500 pl-4">
                            Stock disponible: {formatQuantity(insumo.stockActual)} {insumo.unidad}
                          </p>
                        </div>

                        {/* Cantidad Requerida Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-800 ring-1 ring-stone-200">
                            {formatQuantity(insumo.cantidadRequerida)} {insumo.unidad}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Verificación Visual de Disponibilidad en Inventario */}
            {receta.length > 0 && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                  preparable > 0
                    ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
                    : 'border-red-200 bg-red-50/90 text-red-950'
                }`}
              >
                {preparable > 0 ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="h-5 w-5 shrink-0 text-red-700 mt-0.5" aria-hidden="true" />
                )}
                <div className="text-xs sm:text-sm leading-relaxed">
                  <p className="font-bold">
                    {preparable > 0
                      ? 'Insumos suficientes en bodega'
                      : 'Stock insuficiente para esta receta'}
                  </p>
                  <p className="mt-0.5 opacity-90">
                    {preparable > 0
                      ? `Con el inventario actual se pueden preparar hasta ${preparable} ${
                          preparable === 1 ? 'unidad' : 'unidades'
                        }.`
                      : 'Uno o más insumos no alcanzan la cantidad requerida para preparar el producto.'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer del Modal con Acción de Añadir */}
      <div className="border-t border-stone-200 bg-white px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => {
            onAdd(producto)
            onClose()
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm sm:text-base font-bold text-white shadow-md transition hover:bg-amber-800 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Añadir al Pedido · {formatCRC(producto.precio)}
        </button>
      </div>
    </Modal>
  )
}
