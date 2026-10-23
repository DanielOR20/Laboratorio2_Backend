import { Coffee, CupSoda, Croissant, Sparkles, UtensilsCrossed, Package } from 'lucide-react'

const normalize = (text = '') =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function getCategoryTheme(categoria = '') {
  const key = normalize(categoria)

  if (key.includes('brunch') || key.includes('salado') || key.includes('sandw') || key.includes('tostad')) {
    return {
      Icon: UtensilsCrossed,
      chip: 'bg-stone-100 text-stone-800 ring-1 ring-stone-200/80',
      pillActive: 'bg-stone-900 text-white',
      badge: 'bg-amber-100/90 text-amber-900',
      gradient: 'from-amber-100/80 via-stone-100 to-amber-50',
      iconColor: 'text-stone-800',
    }
  }

  if (key.includes('reposter') || key.includes('postre') || key.includes('panad') || key.includes('dulce')) {
    return {
      Icon: Croissant,
      chip: 'bg-amber-100/90 text-amber-900 ring-1 ring-amber-300/60',
      pillActive: 'bg-amber-800 text-white',
      badge: 'bg-amber-100/90 text-amber-900',
      gradient: 'from-amber-100 via-amber-200/60 to-orange-100',
      iconColor: 'text-amber-900',
    }
  }

  if (key.includes('fria') || key.includes('frio') || key.includes('frapp') || key.includes('iced') || key.includes('brew')) {
    return {
      Icon: CupSoda,
      chip: 'bg-sky-100/90 text-sky-900 ring-1 ring-sky-300/60',
      pillActive: 'bg-sky-900 text-white',
      badge: 'bg-sky-100 text-sky-800',
      gradient: 'from-sky-100 via-cyan-100/70 to-blue-50',
      iconColor: 'text-sky-800',
    }
  }

  if (key.includes('te') || key.includes('infusion') || key.includes('especial') || key.includes('matcha')) {
    return {
      Icon: Sparkles,
      chip: 'bg-emerald-100/90 text-emerald-900 ring-1 ring-emerald-300/60',
      pillActive: 'bg-emerald-900 text-white',
      badge: 'bg-emerald-100 text-emerald-800',
      gradient: 'from-emerald-100 via-teal-100/70 to-green-50',
      iconColor: 'text-emerald-800',
    }
  }

  if (key.includes('bebida') || key.includes('cafe') || key.includes('caliente') || key.includes('espresso')) {
    return {
      Icon: Coffee,
      chip: 'bg-amber-50 text-amber-950 ring-1 ring-amber-300/60',
      pillActive: 'bg-amber-900 text-white',
      badge: 'bg-amber-100/90 text-amber-900',
      gradient: 'from-stone-200 via-amber-100 to-stone-100',
      iconColor: 'text-amber-950',
    }
  }

  return {
    Icon: Package,
    chip: 'bg-stone-100 text-stone-800 ring-1 ring-stone-200',
    pillActive: 'bg-stone-900 text-white',
    badge: 'bg-stone-100 text-stone-800',
    gradient: 'from-stone-100 to-stone-200',
    iconColor: 'text-stone-700',
  }
}
