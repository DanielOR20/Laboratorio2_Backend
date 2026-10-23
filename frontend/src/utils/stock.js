/*
 * La tabla `insumos` solo guarda `stock` y `stock_minimo` (no hay capacidad máxima).
 * Se define la capacidad de referencia como 5 × stock_minimo, de modo que el
 * umbral crítico del 20% coincide exactamente con el stock mínimo del negocio:
 *   - rojo     (< 20%)  → por debajo del stock mínimo
 *   - amarillo (20–50%) → cerca del mínimo, conviene reponer
 *   - verde    (> 50%)  → nivel saludable
 * Si el stock supera la capacidad de referencia, la barra se limita al 100%.
 */
export const CAPACITY_FACTOR = 5

export const getStockPercent = ({ stock, stockMinimo }) => {
  const capacity = Math.max(stockMinimo * CAPACITY_FACTOR, stock, 1)
  return Math.min(100, Math.max(0, (stock / capacity) * 100))
}

export const getStockLevel = (insumo) => {
  const percent = getStockPercent(insumo)
  if (percent > 50) return { key: 'ok', label: 'Óptimo', percent }
  if (percent >= 20) return { key: 'warning', label: 'Reponer pronto', percent }
  return { key: 'critical', label: 'Crítico', percent }
}

export const STOCK_STYLES = {
  ok: {
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  warning: {
    bar: 'bg-gradient-to-r from-amber-glow to-yellow-300',
    badge: 'bg-amber-50 text-amber-800 ring-amber-600/25',
    dot: 'bg-amber-glow',
  },
  critical: {
    bar: 'bg-gradient-to-r from-red-600 to-red-400',
    badge: 'bg-red-50 text-red-700 ring-red-600/20',
    dot: 'bg-red-500',
  },
}
