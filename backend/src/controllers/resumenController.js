import { query } from '../db.js';

export const getResumen = async (req, res, next) => {
  try {
    // 1. Total vendido y conteo de órdenes
    const ventasRes = await query(`
      SELECT 
        COALESCE(SUM(total), 0) AS total_ventas,
        COUNT(id) AS cantidad_pedidos
      FROM pedidos 
      WHERE estado = 'completado'
    `);

    // 2. Ventas agrupadas por método de pago
    const porMetodoRes = await query(`
      SELECT metodo_pago, SUM(total) AS total
      FROM pedidos
      WHERE estado = 'completado'
      GROUP BY metodo_pago
    `);

    // 3. Los 5 productos más vendidos
    const topProductosRes = await query(`
      SELECT p.nombre, SUM(pi.cantidad) AS total_vendido
      FROM pedido_items pi
      JOIN productos p ON pi.producto_id = p.id
      JOIN pedidos ped ON pi.pedido_id = ped.id
      WHERE ped.estado = 'completado'
      GROUP BY p.nombre
      ORDER BY total_vendido DESC
      LIMIT 5
    `);

    // 4. Insumos con alerta de stock crítico
    const stockCriticoRes = await query(`
      SELECT id, nombre, stock, stock_minimo, unidad
      FROM insumos
      WHERE stock <= stock_minimo
    `);

    res.status(200).json({
      metricas_generales: ventasRes.rows[0],
      ventas_por_metodo: porMetodoRes.rows,
      top_productos: topProductosRes.rows,
      alertas_stock: stockCriticoRes.rows
    });
  } catch (error) {
    next(error);
  }
};