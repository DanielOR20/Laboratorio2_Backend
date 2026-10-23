import { Banknote, CreditCard, Smartphone, Check } from 'lucide-react'
import { PAYMENT_METHODS } from '../utils/format'

const ICONS = {
  efectivo: Banknote,
  tarjeta: CreditCard,
  sinpe_movil: Smartphone,
}

export default function PaymentSelector({ value, onChange, disabled }) {
  return (
    <fieldset disabled={disabled} className="space-y-2">
      <legend className="mb-2 text-xs font-bold tracking-wider text-stone-700 uppercase">
        Método de Pago
      </legend>
      <div className="grid grid-cols-3 gap-2.5">
        {PAYMENT_METHODS.map((method) => {
          const Icon = ICONS[method.id]
          const selected = value === method.id
          return (
            <label
              key={method.id}
              className={`relative flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-3 text-center transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-600 ${
                selected
                  ? 'border-amber-700 bg-amber-50/70 text-stone-900 shadow-sm ring-1 ring-amber-700/30'
                  : 'border-stone-200/90 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="metodo_pago"
                value={method.id}
                checked={selected}
                onChange={() => onChange(method.id)}
                className="sr-only"
              />

              {/* Checkmark indicator */}
              {selected && (
                <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-amber-700 text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              )}

              <Icon
                className={`h-6 w-6 my-1 transition-colors ${
                  selected ? 'text-amber-800 stroke-[2.2]' : 'text-stone-400'
                }`}
                aria-hidden="true"
              />

              <div className="mt-1">
                <span className="block text-xs font-bold leading-tight">{method.label}</span>
                <span className="hidden text-[10px] leading-tight text-stone-500 sm:block mt-0.5">
                  {method.hint}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
