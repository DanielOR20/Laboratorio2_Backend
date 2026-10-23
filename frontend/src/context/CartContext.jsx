import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { calculateTotals } from '../utils/format'

const MAX_QTY_PER_ITEM = 99

const CART_ACTIONS = {
  ADD: 'cart/add',
  INCREMENT: 'cart/increment',
  DECREMENT: 'cart/decrement',
  REMOVE: 'cart/remove',
  CLEAR: 'cart/clear',
}

const initialCartState = { items: [] }

/**
 * Reducer puro y determinista: mismas acciones ⇒ mismo estado.
 * Cada ítem: { producto: {id, nombre, categoria, precio}, cantidad }
 */
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const { producto } = action.payload
      const exists = state.items.some((item) => item.producto.id === producto.id)
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.producto.id === producto.id
              ? { ...item, cantidad: Math.min(item.cantidad + 1, MAX_QTY_PER_ITEM) }
              : item,
          ),
        }
      }
      return { items: [...state.items, { producto, cantidad: 1 }] }
    }

    case CART_ACTIONS.INCREMENT:
      return {
        items: state.items.map((item) =>
          item.producto.id === action.payload.productoId
            ? { ...item, cantidad: Math.min(item.cantidad + 1, MAX_QTY_PER_ITEM) }
            : item,
        ),
      }

    case CART_ACTIONS.DECREMENT:
      return {
        items: state.items
          .map((item) =>
            item.producto.id === action.payload.productoId
              ? { ...item, cantidad: item.cantidad - 1 }
              : item,
          )
          .filter((item) => item.cantidad > 0),
      }

    case CART_ACTIONS.REMOVE:
      return {
        items: state.items.filter((item) => item.producto.id !== action.payload.productoId),
      }

    case CART_ACTIONS.CLEAR:
      return initialCartState

    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  const addItem = useCallback(
    (producto) => dispatch({ type: CART_ACTIONS.ADD, payload: { producto } }),
    [],
  )
  const incrementItem = useCallback(
    (productoId) => dispatch({ type: CART_ACTIONS.INCREMENT, payload: { productoId } }),
    [],
  )
  const decrementItem = useCallback(
    (productoId) => dispatch({ type: CART_ACTIONS.DECREMENT, payload: { productoId } }),
    [],
  )
  const removeItem = useCallback(
    (productoId) => dispatch({ type: CART_ACTIONS.REMOVE, payload: { productoId } }),
    [],
  )
  const clearCart = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), [])

  const value = useMemo(() => {
    const totalItems = state.items.reduce((sum, item) => sum + item.cantidad, 0)
    const rawSubtotal = state.items.reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad,
      0,
    )
    const { subtotal, impuesto, total } = calculateTotals(rawSubtotal)

    const getQuantity = (productoId) =>
      state.items.find((item) => item.producto.id === productoId)?.cantidad ?? 0

    return {
      items: state.items,
      totalItems,
      subtotal,
      impuesto,
      total,
      isEmpty: state.items.length === 0,
      getQuantity,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    }
  }, [state.items, addItem, incrementItem, decrementItem, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return context
}
