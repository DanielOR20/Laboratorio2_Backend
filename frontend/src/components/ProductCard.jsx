import { useState } from 'react'
import { BookOpen, Check, Plus, Sparkles } from 'lucide-react'
import { getCategoryTheme } from '../utils/categoryTheme'
import { formatCRC } from '../utils/format'
import { getProductDetails } from '../utils/productDetails'
import ProductImage from './ui/ProductImage'

export default function ProductCard({ producto, quantityInCart = 0, onViewRecipe, onAdd }) {
  const [justAdded, setJustAdded] = useState(false)
  const details = getProductDetails(producto)
  const { chip } = getCategoryTheme(producto.categoria)

  const handleAddClick = () => {
    onAdd(producto)
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
    }, 1200)
  }

  return (
    <article
      id={`producto-${producto.id}`}
      className="group relative flex animate-rise flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-700/30 hover:shadow-xl"
    >
      {/* Contenedor de Imagen 16:10 */}
      <div className="relative overflow-hidden bg-stone-100">
        <ProductImage
          src={details.image}
          alt={producto.nombre}
          aspectClassName="aspect-[16/10]"
          fallbackSrc="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=375&q=80"
        />

        {/* Gradiente sutil inferior sobre la foto */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-black/10" />

        {/* Badge de Categoría (Pill moderna) */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-xs ${chip}`}
          >
            {producto.categoria}
          </span>
        </div>

        {/* Badge de cantidad si ya está en el pedido */}
        {quantityInCart > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex animate-pop items-center gap-1 rounded-full bg-stone-900/90 px-2.5 py-1 text-xs font-bold text-amber-300 shadow-md backdrop-blur-md ring-1 ring-white/20">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {quantityInCart} en orden
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la Card */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Título y Precio */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-stone-900 leading-snug group-hover:text-amber-900 transition-colors">
              {producto.nombre}
            </h3>
            <p className="shrink-0 rounded-xl bg-amber-50 px-2.5 py-1 text-base font-extrabold text-amber-800 ring-1 ring-amber-200/80">
              {formatCRC(producto.precio)}
            </p>
          </div>

          {/* Descripción Sensorial Gastronómica */}
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-600 line-clamp-2">
            {details.description}
          </p>

          {/* Notas de Cata / Características (Pills sutiles) */}
          {details.tastingNotes && details.tastingNotes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {details.tastingNotes.slice(0, 2).map((note, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                >
                  <Sparkles className="h-2.5 w-2.5 text-amber-700/80" />
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="mt-5 grid grid-cols-5 gap-2 border-t border-stone-100 pt-4">
          {/* Botón Ver Receta */}
          <button
            type="button"
            onClick={() => onViewRecipe(producto)}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50/80 px-2.5 py-2.5 text-xs font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 active:scale-95"
            aria-label={`Ver receta de ${producto.nombre}`}
          >
            <BookOpen className="h-3.5 w-3.5 text-stone-500" aria-hidden="true" />
            Receta
          </button>

          {/* Botón Agregar con feedback interactivo */}
          <button
            type="button"
            onClick={handleAddClick}
            className={`col-span-3 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-700/30 ring-2 ring-emerald-500/50'
                : 'bg-stone-900 text-white hover:bg-amber-800 shadow-stone-950/10'
            }`}
            aria-label={`Añadir ${producto.nombre} al pedido`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4 animate-pop" aria-hidden="true" />
                <span>¡Añadido!</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
