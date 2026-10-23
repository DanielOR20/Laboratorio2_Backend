import { useCallback, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Clock, Package, RefreshCw, TriangleAlert, CircleCheck } from 'lucide-react'
import { getInsumos } from '../api/cafeteriaApi'
import StockBar from '../components/StockBar'
import ErrorState from '../components/ui/ErrorState'
import { useAsync } from '../hooks/useAsync'
import { formatQuantity } from '../utils/format'
import { STOCK_STYLES, getStockLevel } from '../utils/stock'

/*
 * Snapshot a nivel de módulo: sobrevive al cambio de pestaña, de modo que al volver
 * al inventario después de comprar se muestre cuánto disminuyó cada insumo.
 */
let lastSnapshot = null

const toSnapshot = (insumos) => Object.fromEntries(insumos.map((i) => [i.id, i.stock]))

const computeDeltas = (previous, insumos) => {
  if (!previous) return {}
  const deltas = {}
  insumos.forEach((i) => {
    if (previous[i.id] !== undefined && previous[i.id] !== i.stock) {
      deltas[i.id] = i.stock - previous[i.id]
    }
  })
  return deltas
}

const formatTime = (date) =>
  date
    ? new Intl.DateTimeFormat('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date)
    : '—'

function SummaryCard({ icon: Icon, label, value, tone }) {
  const tones = {
    neutral: 'bg-espresso-100 text-espresso-700',
    ok: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-800',
    critical: 'bg-red-100 text-red-700',
  }
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-espresso-100 bg-white p-4 shadow-card">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-3xl leading-none font-bold text-espresso-900">{value}</p>
        <p className="mt-1 text-xs font-semibold tracking-wide text-slate-warm-500 uppercase">{label}</p>
      </div>
    </div>
  )
}

function DeltaBadge({ delta, unidad }) {
  if (delta === undefined) return null
  const decreased = delta < 0
  const Icon = decreased ? ArrowDown : ArrowUp
  return (
    <span
      title="Variación desde la última actualización"
      className={`ml-2 inline-flex animate-pop items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
        decreased ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {formatQuantity(Math.abs(delta))} {unidad}
    </span>
  )
}

export default function InventoryPage() {
  const [deltas, setDeltas] = useState(() => ({}))

  const fetchInsumos = useCallback(async () => {
    const insumos = await getInsumos()
    setDeltas(computeDeltas(lastSnapshot, insumos))
    lastSnapshot = toSnapshot(insumos)
    return insumos
  }, [])

  const { data, error, loading, lastUpdated, reload } = useAsync(fetchInsumos)
  const insumos = useMemo(() => data ?? [], [data])

  const summary = useMemo(() => {
    const counts = { ok: 0, warning: 0, critical: 0 }
    insumos.forEach((i) => {
      counts[getStockLevel(i).key] += 1
    })
    return counts
  }, [insumos])

  const hasChanges = Object.keys(deltas).length > 0
  const firstLoad = loading && data === null

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
            Control de existencias
          </p>
          <h1 className="font-display text-3xl font-bold text-espresso-900 sm:text-4xl">Inventario en Vivo</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-warm-500">
            Audita cómo disminuyen los insumos tras las compras hechas en la web o por el agente de n8n.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs text-slate-warm-500 sm:inline-flex">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Actualizado: {formatTime(lastUpdated)}
          </span>
          <button
            type="button"
            id="refrescar-inventario"
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-espresso-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-espresso-900/20 transition hover:bg-amber-glow hover:text-espresso-950 active:scale-95 disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            {loading ? 'Actualizando…' : 'Refrescar'}
          </button>
        </div>
      </header>

      {error && !data && <ErrorState error={error} onRetry={reload} title="No pudimos cargar el inventario" />}

      {error && data && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          No se pudo actualizar: {error.message} (se muestran los últimos datos conocidos).
        </p>
      )}

      {(data || firstLoad) && (
        <>
          <section aria-label="Resumen de inventario" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard icon={Package} label="Insumos" value={insumos.length} tone="neutral" />
            <SummaryCard icon={CircleCheck} label="Óptimos" value={summary.ok} tone="ok" />
            <SummaryCard icon={TriangleAlert} label="Por reponer" value={summary.warning} tone="warning" />
            <SummaryCard icon={TriangleAlert} label="Críticos" value={summary.critical} tone="critical" />
          </section>

          {hasChanges && (
            <p
              role="status"
              className="animate-rise rounded-2xl border border-amber-glow/40 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
            >
              Se detectaron cambios de inventario desde la última actualización (marcados con ▲/▼).
            </p>
          )}

          <section
            aria-label="Tabla de inventario"
            className="overflow-hidden rounded-3xl border border-espresso-100 bg-white shadow-card"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-espresso-900 text-xs tracking-wider text-espresso-100 uppercase">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Insumo</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Stock actual</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Mínimo</th>
                    <th scope="col" className="w-64 px-5 py-3.5 font-semibold">Nivel</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso-100">
                  {firstLoad &&
                    Array.from({ length: 5 }, (_, index) => (
                      <tr key={index} className="animate-pulse">
                        {Array.from({ length: 5 }, (_, cell) => (
                          <td key={cell} className="px-5 py-4">
                            <div className="h-4 rounded bg-espresso-100" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {insumos.map((insumo) => {
                    const level = getStockLevel(insumo)
                    const styles = STOCK_STYLES[level.key]
                    return (
                      <tr key={insumo.id} className="transition hover:bg-cream/70">
                        <td className="px-5 py-4 font-semibold text-espresso-900">{insumo.nombre}</td>
                        <td className="px-5 py-4 whitespace-nowrap text-espresso-800 tabular-nums">
                          <span className="font-bold">{formatQuantity(insumo.stock)}</span>{' '}
                          <span className="text-slate-warm-500">{insumo.unidad}</span>
                          <DeltaBadge delta={deltas[insumo.id]} unidad={insumo.unidad} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-slate-warm-500 tabular-nums">
                          {formatQuantity(insumo.stockMinimo)} {insumo.unidad}
                        </td>
                        <td className="px-5 py-4">
                          <StockBar insumo={insumo} />
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${styles.badge}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                            {level.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-xs text-slate-warm-500">
            Escala de nivel: verde &gt; 50 % · amarillo 20–50 % · rojo &lt; 20 %. La capacidad de referencia es
            5 × el stock mínimo, por lo que el rojo equivale a estar por debajo del mínimo.
          </p>
        </>
      )}
    </div>
  )
}
