import { useState } from 'react'
import AIAssistantChat from './components/AIAssistantChat'
import CartDrawer from './components/CartDrawer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import InventoryPage from './pages/InventoryPage'
import MenuPage from './pages/MenuPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('menu')
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-amber-950">
            <Navbar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenCart={() => setCartOpen(true)}
            />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
              {activeTab === 'menu' ? (
                <MenuPage />
              ) : (
                <ProtectedRoute onCancel={() => setActiveTab('menu')}>
                  <InventoryPage />
                </ProtectedRoute>
              )}
            </main>

            <footer className="border-t border-stone-200/80 bg-white/70 py-8 text-center text-xs sm:text-sm text-stone-500 backdrop-blur-xs">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-1">
                <p>
                  <span className="font-display font-bold text-stone-900">Café Aurora</span> · Tostado Artesanal de Especialidad
                </p>
                <p className="text-stone-400 text-xs">
                  Precios expresados en Colones costarricenses (₡) · IVA 13 % incluido en el total
                </p>
              </div>
            </footer>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <AIAssistantChat />
          </div>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
