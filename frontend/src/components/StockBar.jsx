import { STOCK_STYLES, getStockLevel } from '../utils/stock'

export default function StockBar({ insumo }) {
  const level = getStockLevel(insumo)
  const styles = STOCK_STYLES[level.key]
  const percent = Math.round(level.percent)

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Nivel de stock de ${insumo.nombre}: ${percent}%`}
        className="h-3 min-w-24 flex-1 overflow-hidden rounded-full bg-espresso-100"
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${styles.bar}`}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
      <span className="w-10 text-right text-sm font-bold text-espresso-800 tabular-nums">{percent}%</span>
    </div>
  )
}
