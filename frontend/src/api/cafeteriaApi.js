import apiClient from './client'

/*
 * El backend (pg) devuelve columnas NUMERIC como strings ("1500.00").
 * Los normalizamos aquí para que el resto de la UI trabaje solo con números.
 */
const toNumber = (value) => (value === null || value === undefined ? 0 : Number(value))

const normalizeProducto = (p) => ({
  id: p.id,
  nombre: p.nombre,
  categoria: p.categoria,
  precio: toNumber(p.precio),
  activo: p.activo,
})

const normalizeInsumo = (i) => ({
  id: i.id,
  nombre: i.nombre,
  unidad: i.unidad,
  stock: toNumber(i.stock),
  stockMinimo: toNumber(i.stock_minimo),
})

const normalizeReceta = (r) => ({
  recetaId: r.receta_id,
  insumoId: r.insumo_id,
  insumoNombre: r.insumo_nombre,
  unidad: r.unidad,
  cantidadRequerida: toNumber(r.cantidad_requerida),
  stockActual: toNumber(r.stock_actual),
})

const normalizePedido = (p) => ({
  id: p.id,
  fecha: p.fecha,
  metodoPago: p.metodo_pago,
  estado: p.estado,
  subtotal: toNumber(p.subtotal),
  impuesto: toNumber(p.impuesto),
  total: toNumber(p.total),
  items: (p.items ?? []).map((item) => ({
    productoId: item.producto_id,
    nombre: item.nombre,
    cantidad: item.cantidad,
    precioUnitario: toNumber(item.precio_unitario),
    subtotalItem: toNumber(item.subtotal_item),
  })),
})

/** GET /productos */
export const getProductos = async () => {
  const { data } = await apiClient.get('/productos')
  return data.map(normalizeProducto)
}

/** GET /productos/:id  → producto con su receta de insumos */
export const getProductoById = async (id) => {
  const { data } = await apiClient.get(`/productos/${id}`)
  return {
    ...normalizeProducto(data),
    receta: (data.receta ?? []).map(normalizeReceta),
  }
}

/** GET /insumos */
export const getInsumos = async () => {
  const { data } = await apiClient.get('/insumos')
  return data.map(normalizeInsumo)
}

/**
 * POST /pedidos
 * @param {{ metodoPago: 'efectivo'|'tarjeta'|'sinpe_movil', items: {productoId:number, cantidad:number}[] }} payload
 */
export const crearPedido = async ({ metodoPago, items }) => {
  const { data } = await apiClient.post('/pedidos', {
    metodo_pago: metodoPago,
    items: items.map(({ productoId, cantidad }) => ({
      producto_id: productoId,
      cantidad,
    })),
  })
  return normalizePedido(data)
}

/** GET /health → true si la API y la base de datos responden */
export const checkHealth = async () => {
  try {
    const { data } = await apiClient.get('/health', { timeout: 4000 })
    return Boolean(data?.ok)
  } catch {
    return false
  }
}
