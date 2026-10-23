import { Coffee, ShoppingBag, Lock, LogOut, ShieldCheck } from 'lucide-react'
import { useApiHealth } from '../hooks/useApiHealth'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ConnectionStatus from './ConnectionStatus'

const TABS = [
  { id: 'menu', label: 'Menú & Pedidos', requiresAuth: false },
  { id: 'inventory', label: 'Inventario en Vivo', requiresAuth: true },
]

function CartButton({ onClick, totalItems, className = '', children }) {
  return (
    <button
      type="button"
      id="cart-button-trigger"
      onClick={onClick}
      aria-label={`Abrir carrito, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`}
      className={className}
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        {totalItems > 0 && (
          <span
            key={totalItems}
            className="absolute -top-2 -right-2 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-amber-500 px-1 text-[11px] font-black text-stone-950 ring-2 ring-stone-900"
          >
            {totalItems}
          </span>
        )}
      </div>
      {children}
    </button>
  )
}

export default function Navbar({ activeTab, onTabChange, onOpenCart }) {
  const apiStatus = useApiHealth()
  const { totalItems } = useCart()
  const { isAuthenticated, logout } = useAuth()
  const toast = useToast()

  const handleLogout = () => {
    logout()
    toast.info('Sesión administrativa cerrada')
    if (activeTab === 'inventory') {
      onTabChange('menu')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-900/95 text-stone-100 shadow-md backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Marca / Logotipo */}
          <button
            type="button"
            onClick={() => onTabChange('menu')}
            className="group flex items-center gap-3 text-left transition"
            aria-label="Café Aurora, volver al menú"
          >
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-stone-950 shadow-md shadow-amber-900/30 transition-transform duration-300 group-hover:scale-105">
              <Coffee className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
              <span className="absolute -top-1.5 left-3 h-2 w-0.5 animate-steam rounded-full bg-white/80" />
              <span className="absolute -top-2 left-5 h-2.5 w-0.5 animate-steam rounded-full bg-white/80 [animation-delay:0.7s]" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Café Aurora
              </span>
              <span className="hidden text-[10px] font-semibold tracking-[0.22em] text-stone-400 uppercase sm:block">
                Tostado Artesanal · Costa Rica
              </span>
            </span>
          </button>

          {/* Navegación central (Escritorio) */}
          <nav aria-label="Secciones principales" className="hidden md:block">
            <ul className="flex items-center gap-1.5 rounded-full border border-stone-800 bg-stone-950/60 p-1.5 backdrop-blur-sm">
              {TABS.map((tab) => {
                const active = activeTab === tab.id
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      id={`tab-${tab.id}`}
                      onClick={() => onTabChange(tab.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`relative inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/40'
                          : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.requiresAuth && !isAuthenticated && (
                        <Lock className="h-3.5 w-3.5 text-stone-400" aria-label="Requiere autenticación" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Acciones de la derecha: Estado Admin / API & Carrito */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Badge de Modo Administrador & Botón Cerrar Sesión */}
            {isAuthenticated && (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Modo Administrador</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar sesión de personal"
                  aria-label="Cerrar sesión administrativa"
                  className="inline-flex items-center gap-1 rounded-full border border-stone-700 bg-stone-800/80 px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-300 active:scale-95"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            )}

            <ConnectionStatus status={apiStatus} />

            <CartButton
              onClick={onOpenCart}
              totalItems={totalItems}
              className="inline-flex items-center gap-2.5 rounded-full border border-stone-700/80 bg-stone-800/80 px-4 py-2.5 text-sm font-semibold text-stone-100 shadow-sm transition hover:border-amber-500/50 hover:bg-stone-800 hover:text-white active:scale-95"
            >
              <span className="hidden font-medium sm:inline">Mi Pedido</span>
              {totalItems > 0 && (
                <span className="hidden rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300 sm:inline">
                  {totalItems}
                </span>
              )}
            </CartButton>
          </div>
        </div>

        {/* Navegación móvil */}
        <nav aria-label="Secciones móvil" className="border-t border-stone-800/80 bg-stone-950/40 md:hidden">
          <ul className="mx-auto flex max-w-7xl">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <li key={tab.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex items-center justify-center gap-1.5 w-full border-b-2 py-2.5 text-center text-xs font-bold transition ${
                      active
                        ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                        : 'border-transparent text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.requiresAuth && !isAuthenticated && (
                      <Lock className="h-3 w-3 text-stone-400" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      {/* Botón flotante móvil de pedido cuando hay productos añadidos */}
      {totalItems > 0 && (
        <CartButton
          onClick={onOpenCart}
          totalItems={totalItems}
          className="fixed left-5 bottom-5 z-40 flex h-14 w-14 animate-rise items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-stone-950 shadow-2xl shadow-amber-900/50 transition hover:scale-105 active:scale-95 sm:hidden ring-2 ring-stone-900/20"
        />
      )}
    </>
  )
}
