import pool from '../db.js';

export const createOrderWithTransaction = async ({ metodo_pago, items }) => {
  const client = await pool.connect();

  try {
    // 1. Iniciar transacción SQL
    await client.query('BEGIN');

    let subtotal = 0;
    const itemsDetalle = [];

    // 2. Procesar cada producto solicitado
    for (const item of items) {
      const { producto_id, cantidad } = item;

      // Obtener producto y precio actual
      const prodRes = await client.query(
        'SELECT id, nombre, precio, activo FROM productos WHERE id = $1',
        [producto_id]
      );

      if (prodRes.rows.length === 0 || !prodRes.rows[0].activo) {
        throw {
          status: 404,
          message: `El producto con ID ${producto_id} no existe o no está activo`
        };
      }

      const producto = prodRes.rows[0];
      const precioUnitario = parseFloat(producto.precio);
      subtotal += precioUnitario * cantidad;

      // Consultar la receta del producto y el stock actual de cada insumo
      const recetaRes = await client.query(
        `SELECT r.insumo_id, r.cantidad AS cantidad_receta, i.nombre AS insumo_nombre, i.stock
         FROM recetas r
         JOIN insumos i ON r.insumo_id = i.id
         WHERE r.producto_id = $1`,
        [producto_id]
      );

      if (recetaRes.rows.length === 0) {
        throw {
          status: 400,
          message: `El producto '${producto.nombre}' no tiene una receta configurada con insumos`
        };
      }

      // Validar inventario de cada ingrediente
      for (const ingrediente of recetaRes.rows) {
        const cantidadNecesaria = parseFloat(ingrediente.cantidad_receta) * cantidad;
        const stockDisponible = parseFloat(ingrediente.stock);

        if (stockDisponible < cantidadNecesaria) {
          // Error 409 Conflict: regla de negocio violada por falta de stock
          throw {
            status: 409,
            message: `Stock insuficiente del insumo '${ingrediente.insumo_nombre}'. Requerido: ${cantidadNecesaria}, disponible: ${stockDisponible}`
          };
        }

        // Descontar inventario dentro de la misma transacción
        await client.query(
          'UPDATE insumos SET stock = stock - $1 WHERE id = $2',
          [cantidadNecesaria, ingrediente.insumo_id]
        );
      }

      itemsDetalle.push({
        producto_id,
        nombre: producto.nombre,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal_item: precioUnitario * cantidad
      });
    }

    // 3. Cálculos de venta (13% de impuesto según requerimiento)
    const impuesto = parseFloat((subtotal * 0.13).toFixed(2));
    const total = parseFloat((subtotal + impuesto).toFixed(2));

    // 4. Insertar cabecera en pedidos
    const pedidoRes = await client.query(
      `INSERT INTO pedidos (metodo_pago, subtotal, impuesto, total, estado)
       VALUES ($1, $2, $3, $4, 'completado')
       RETURNING *`,
      [metodo_pago, subtotal, impuesto, total]
    );
    const pedidoCreado = pedidoRes.rows[0];

    // 5. Insertar líneas en pedido_items
    for (const item of itemsDetalle) {
      await client.query(
        `INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoCreado.id, item.producto_id, item.cantidad, item.precio_unitario]
      );
    }

    // 6. Confirmar la transacción
    await client.query('COMMIT');

    pedidoCreado.items = itemsDetalle;
    return pedidoCreado;
  } catch (error) {
    // Si cualquier paso falla, se revierten todos los descuentos e inserciones
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Liberar la conexión de vuelta al pool
    client.release();
  }
};

export const findAllOrders = async () => {
  const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha DESC');
  return result.rows;
};

export const findOrderById = async (id) => {
  const orderRes = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
  if (orderRes.rows.length === 0) return null;
  const order = orderRes.rows[0];

  const itemsRes = await pool.query(
    `SELECT pi.id, pi.producto_id, p.nombre AS producto_nombre, pi.cantidad, pi.precio_unitario
     FROM pedido_items pi
     JOIN productos p ON pi.producto_id = p.id
     WHERE pi.pedido_id = $1`,
    [id]
  );
  order.items = itemsRes.rows;
  return order;
};