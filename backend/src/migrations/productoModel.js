import { query } from '../db.js';

export const findAll = async () => {
  const result = await query('SELECT * FROM productos WHERE activo = true ORDER BY id ASC');
  return result.rows;
};

export const findByIdWithReceta = async (id) => {
  // Consulta de producto con sus insumos relacionados requerida por la rúbrica
  const productResult = await query('SELECT * FROM productos WHERE id = $1', [id]);
  if (productResult.rows.length === 0) return null;

  const product = productResult.rows[0];

  const recetaResult = await query(
    `SELECT r.id, r.cantidad, i.id AS insumo_id, i.nombre AS insumo_nombre, i.unidad, i.stock
     FROM recetas r
     JOIN insumos i ON r.insumo_id = i.id
     WHERE r.producto_id = $1`,
    [id]
  );

  product.receta = recetaResult.rows;
  return product;
};

export const create = async ({ nombre, precio, categoria }) => {
  const result = await query(
    'INSERT INTO productos (nombre, precio, categoria) VALUES ($1, $2, $3) RETURNING *',
    [nombre, precio, categoria]
  );
  return result.rows[0];
};

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

export const remove = async (id) => {
  const result = await query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};