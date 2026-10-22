import { query } from '../db.js';

export const getAllInsumos = async () => {
  const result = await query('SELECT * FROM insumos ORDER BY id ASC');
  return result.rows;
};

export const getInsumoById = async (id) => {
  const result = await query('SELECT * FROM insumos WHERE id = $1', [id]);
  return result.rows[0];
};

export const createInsumo = async ({ nombre, unidad, stock, stock_minimo }) => {
  const result = await query(
    'INSERT INTO insumos (nombre, unidad, stock, stock_minimo) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, unidad, stock, stock_minimo]
  );
  return result.rows[0];
};

export const updateInsumo = async (id, { nombre, unidad, stock, stock_minimo }) => {
  const result = await query(
    `UPDATE insumos 
     SET nombre = COALESCE($1, nombre),
         unidad = COALESCE($2, unidad),
         stock = COALESCE($3, stock),
         stock_minimo = COALESCE($4, stock_minimo)
     WHERE id = $5 RETURNING *`,
    [nombre, unidad, stock, stock_minimo, id]
  );
  return result.rows[0];
};

export const deleteInsumo = async (id) => {
  const result = await query('DELETE FROM insumos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};