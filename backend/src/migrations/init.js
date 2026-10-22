import { query } from '../db.js';

export const runMigrations = async () => {
  console.log('🔄 Ejecutando migraciones en Supabase...');
  const migrationSQL = `
    CREATE TABLE IF NOT EXISTS insumos (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      unidad VARCHAR(20) NOT NULL,
      stock NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (stock >= 0),
      stock_minimo NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0)
    );

    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      precio NUMERIC(10,2) NOT NULL CHECK (precio > 0),
      categoria VARCHAR(50) NOT NULL,
      activo BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS recetas (
      id SERIAL PRIMARY KEY,
      producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
      insumo_id INT NOT NULL REFERENCES insumos(id) ON DELETE RESTRICT,
      cantidad NUMERIC(10,2) NOT NULL CHECK (cantidad > 0),
      CONSTRAINT uq_producto_insumo UNIQUE (producto_id, insumo_id)
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      metodo_pago VARCHAR(30) NOT NULL CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'sinpe_movil')),
      subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
      impuesto NUMERIC(10,2) NOT NULL CHECK (impuesto >= 0),
      total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
      estado VARCHAR(20) NOT NULL DEFAULT 'completado' CHECK (estado IN ('completado', 'anulado'))
    );

    CREATE TABLE IF NOT EXISTS pedido_items (
      id SERIAL PRIMARY KEY,
      pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
      producto_id INT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
      cantidad INT NOT NULL CHECK (cantidad > 0),
      precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario > 0)
    );
  `;

  await query(migrationSQL);
  console.log('✅ Migraciones aplicadas correctamente.');
};