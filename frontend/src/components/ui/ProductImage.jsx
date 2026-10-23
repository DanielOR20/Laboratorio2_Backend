import { useState } from 'react'
import { Coffee } from 'lucide-react'

/**
 * Componente de imagen fotográfica con:
 * - Skeleton animado mientras carga
 * - Transición suave de opacidad
 * - Manejo elegante de fallbacks en caso de fallo de red
 */
export default function ProductImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[16/10]',
  fallbackSrc,
}) {
  const [loaded, setLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const activeSrc = hasError && fallbackSrc ? fallbackSrc : src

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${aspectClassName} ${className}`}>
      {/* Skeleton Shimmer */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-stone-200 via-amber-100/40 to-stone-200" />
      )}

      {/* Fallback si ambas fallan */}
      {hasError && !fallbackSrc ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 to-stone-200 text-amber-900/60 p-4">
          <Coffee className="h-10 w-10 stroke-[1.25]" />
          <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-500">
            Café Aurora
          </span>
        </div>
      ) : (
        <img
          src={activeSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!hasError && fallbackSrc && fallbackSrc !== src) {
              setHasError(true)
            } else {
              setHasError(true)
              setLoaded(true)
            }
          }}
          className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 scale-102 blur-sm'
          }`}
        />
      )}
    </div>
  )
}
