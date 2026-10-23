import { useEffect, useRef } from 'react'
import { Search, X, LayoutGrid } from 'lucide-react'
import { getCategoryTheme } from '../utils/categoryTheme'

export default function MenuFilters({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  counts,
}) {
  const inputRef = useRef(null)

  // Atajo de teclado: presionar '/' o 'Ctrl+K' / 'Cmd+K' enfoca el buscador
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section aria-label="Búsqueda y filtros" className="space-y-4">
      {/* Buscador flotante */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
          <Search className="h-5 w-5" aria-hidden="true" />
        </div>

        <input
          ref={inputRef}
          id="menu-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar espresso, capuchino, cold brew, croissant, tostada…"
          aria-label="Buscar productos del menú"
          className="w-full rounded-2xl border border-stone-200/90 bg-white py-3.5 pr-24 pl-12 text-sm sm:text-base text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-600/10 focus:outline-none"
        />

        {/* Atajo visual o botón limpiar */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
          {search ? (
            <button
              type="button"
              onClick={() => {
                onSearchChange('')
                inputRef.current?.focus()
              }}
              aria-label="Limpiar búsqueda"
              className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-stone-500 shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Filtros por Categoría */}
      <div
        role="tablist"
        aria-label="Filtrar por categoría"
        className="scrollbar-thin flex gap-2 overflow-x-auto pb-1 pt-0.5"
      >
        {categories.map((category) => {
          const active = activeCategory === category
          const isAll = category === 'Todas'
          const { Icon } = isAll ? { Icon: LayoutGrid } : getCategoryTheme(category)

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(category)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-stone-900 text-white shadow-md shadow-stone-950/20 ring-1 ring-stone-900'
                  : 'bg-white text-stone-700 border border-stone-200/90 hover:border-amber-700/40 hover:bg-stone-50 hover:text-stone-900 shadow-2xs'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-stone-500'}`}
                aria-hidden="true"
              />
              <span>{category}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  active
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {counts[category] ?? 0}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
