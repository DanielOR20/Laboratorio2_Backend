import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

import insumosRoutes from './routes/insumosRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoints registrados
app.use('/api/insumos', insumosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión exitosa a Supabase (PostgreSQL)');

    console.log('\n--- Rutas Registradas ---');
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const method = Object.keys(middleware.route.methods)[0].toUpperCase();
        console.log(`${method.padEnd(7)} http://localhost:${PORT}${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        const basePath = middleware.regexp.source
          .replace('\\/?(?=\\/|$)', '')
          .replace('^\\', '')
          .replace(/\\\//g, '/');

        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const method = Object.keys(handler.route.methods)[0].toUpperCase();
            const subPath = handler.route.path === '/' ? '' : handler.route.path;
            console.log(`${method.padEnd(7)} http://localhost:${PORT}${basePath}${subPath}`);
          }
        });
      }
    });
    console.log('-------------------------\n');
  } catch (err) {
    console.error('❌ Error al inicializar servidor:', err.message);
  }
});