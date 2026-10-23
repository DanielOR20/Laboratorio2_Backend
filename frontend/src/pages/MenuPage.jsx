import { useMemo, useState } from 'react'
import { SearchX, Sparkles, Coffee, ShieldCheck, Flame } from 'lucide-react'
import { getProductos } from '../api/cafeteriaApi'
import MenuFilters from '../components/MenuFilters'
import ProductCard from '../components/ProductCard'
import RecipeModal from '../components/RecipeModal'
import ErrorState from '../components/ui/ErrorState'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useAsync } from '../hooks/useAsync'
import { HERO_BACKGROUND_IMAGE } from '../utils/productDetails'

const ALL = 'Todas'

const normalize = (text = '') =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="aspect-[16/10] bg-stone-200" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-1/2 rounded-md bg-stone-200" />
          <div className="h-6 w-16 rounded-lg bg-stone-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded-md bg-stone-100" />
          <div className="h-3.5 w-4/5 rounded-md bg-stone-100" />
        </div>
        <div className="grid grid-cols-5 gap-2 pt-2">
          <div className="col-span-2 h-9 rounded-xl bg-stone-100" />
          <div className="col-span-3 h-9 rounded-xl bg-stone-200" />
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const { data: productos, error, loading, reload } = useAsync(getProductos)
  const { addItem, getQuantity } = useCart()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [recipeProduct, setRecipeProduct] = useState(null)

  const list = useMemo(() => productos ?? [], [productos])

  const categories = useMemo(() => [ALL, ...new Set(list.map((p) => p.categoria))], [list])

  const counts = useMemo(() => {
    const result = { [ALL]: list.length }
    list.forEach((p) => {
      result[p.categoria] = (result[p.categoria] ?? 0) + 1
    })
    return result
  }, [list])

  const filtered = useMemo(() => {
    const term = normalize(search)
    return list.filter((p) => {
      const matchesCategory = activeCategory === ALL || p.categoria === activeCategory
      const matchesSearch =
        term === '' || normalize(p.nombre).includes(term) || normalize(p.categoria).includes(term)
      return matchesCategory && matchesSearch
    })
  }, [list, search, activeCategory])

  const handleAdd = (producto) => {
    addItem(producto)
    toast.success(`${producto.nombre} añadido al pedido`, 2200)
  }

  const clearFilters = () => {
    setSearch('')
    setActiveCategory(ALL)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Moderno con Fotografía Ambiental */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-stone-800/60 bg-stone-950 text-white shadow-2xl">
        {/* Imagen de fondo con gradiente inmersivo */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BACKGROUND_IMAGE}
            alt="Ambiente de Café Aurora"
            className="h-full w-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-900/60" />
          <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 max-w-3xl px-6 py-12 sm:px-12 sm:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Tostado Artesanal · Cosecha Especial</span>
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Cada taza,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
              recién preparada para ti.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-stone-300 font-normal">
            Café de especialidad de origen costarricense, repostería recién horneada y brunch gourmet. 
            Consulta la receta exacta de insumos y disfruta tu pedido con inventario en tiempo real.
          </p>

          {/* Badges de atributos de valor */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-300">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/15">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Granos 100% de Altura</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/15">
              <Coffee className="h-3.5 w-3.5 text-amber-400" />
              <span>{list.length > 0 ? `${list.length} Especialidades` : 'Catálogo Activo'}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Stock en Tiempo Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* Buscador Flotante y Filtros de Categoría */}
      <MenuFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        counts={counts}
      />

      {/* Estado de Carga (Skeletons) */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 8 }, (_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Estado de Error */}
      {!loading && error && (
        <ErrorState error={error} onRetry={reload} title="No pudimos cargar el catálogo de Café Aurora" />
      )}

      {/* Sin Resultados */}
      {!loading && !error && filtered.length === 0 && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-xs">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-800">
            <SearchX className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-bold text-stone-900">No encontramos resultados</h2>
          <p className="text-sm text-stone-600">
            No hay productos que coincidan con &ldquo;{search}&rdquo; en la categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-amber-800"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Catálogo de Productos */}
      {!loading && !error && filtered.length > 0 && (
        <section
          aria-label="Catálogo de productos"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              quantityInCart={getQuantity(producto.id)}
              onViewRecipe={setRecipeProduct}
              onAdd={handleAdd}
            />
          ))}
        </section>
      )}

      {/* Modal de Receta e Insumos */}
      {recipeProduct && (
        <RecipeModal
          producto={recipeProduct}
          onClose={() => setRecipeProduct(null)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
