import { query } from '../db.js';

// Listar todos los productos activos
export const findAll = async () => {
  const result = await query(
    'SELECT * FROM productos WHERE activo = true ORDER BY id ASC'
  );
  return result.rows;
};

// Obtener producto por ID incluyendo sus insumos asignados en la receta
export const findByIdWithReceta = async (id) => {
  const productResult = await query(
    'SELECT * FROM productos WHERE id = $1',
    [id]
  );
  if (productResult.rows.length === 0) return null;

  const producto = productResult.rows[0];

  const recetaResult = await query(
    `SELECT 
       r.id AS receta_id,
       r.cantidad AS cantidad_requerida,
       i.id AS insumo_id,
       i.nombre AS insumo_nombre,
       i.unidad,
       i.stock AS stock_actual
     FROM recetas r
     JOIN insumos i ON r.insumo_id = i.id
     WHERE r.producto_id = $1`,
    [id]
  );

  producto.receta = recetaResult.rows;
  return producto;
};

// Crear producto
export const create = async ({ nombre, precio, categoria }) => {
  const result = await query(
    'INSERT INTO productos (nombre, precio, categoria) VALUES ($1, $2, $3) RETURNING *',
    [nombre, precio, categoria]
  );
  return result.rows[0];
};

// Asociar o actualizar insumos en la receta de un producto
export const addInsumoToReceta = async (productoId, { insumo_id, cantidad }) => {
  const result = await query(
    `INSERT INTO recetas (producto_id, insumo_id, cantidad)
     VALUES ($1, $2, $3)
     ON CONFLICT (producto_id, insumo_id)
     DO UPDATE SET cantidad = EXCLUDED.cantidad
     RETURNING *`,
    [productoId, insumo_id, cantidad]
  );
  return result.rows[0];
};

// Actualizar producto
export const update = async (id, { nombre, precio, categoria, activo }) => {
  const result = await query(
    `UPDATE productos 
     SET nombre = COALESCE($1, nombre),
         precio = COALESCE($2, precio),
         categoria = COALESCE($3, categoria),
         activo = COALESCE($4, activo)
     WHERE id = $5 RETURNING *`,
    [nombre, precio, categoria, activo, id]
  );
  return result.rows[0];
};

// Desactivar producto (baja lógica recomendada) o eliminar
export const remove = async (id) => {
  const result = await query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};