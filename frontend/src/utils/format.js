export const IVA_RATE = 0.13

export const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectivo', hint: 'Paga en caja' },
  { id: 'tarjeta', label: 'Tarjeta', hint: 'Débito o crédito' },
  { id: 'sinpe_movil', label: 'SINPE Móvil', hint: 'Transferencia al instante' },
]

export const paymentLabel = (id) => PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

/**
 * Formatea un monto en Colones: ₡1.500 (sin decimales si es entero)
 * o ₡1.500,25 cuando hay céntimos.
 */
export const formatCRC = (value) => {
  const amount = Number(value) || 0
  const hasCents = Math.abs(amount - Math.round(amount)) > 0.0001
  const [intPart, decPart] = amount.toFixed(hasCents ? 2 : 0).split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `₡${grouped}${decPart ? `,${decPart}` : ''}`
}

/** Mismo cálculo que el backend: IVA 13% redondeado a 2 decimales. */
export const calculateTotals = (subtotal) => {
  const impuesto = round2(subtotal * IVA_RATE)
  const total = round2(subtotal + impuesto)
  return { subtotal: round2(subtotal), impuesto, total }
}

export const formatDateTime = (isoString) => {
  if (!isoString) return ''
  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString))
}

/** Cantidad con hasta 2 decimales, sin ceros innecesarios: 964 · 12,5 */
export const formatQuantity = (value) =>
  new Intl.NumberFormat('es-CR', { maximumFractionDigits: 2 }).format(Number(value) || 0)
